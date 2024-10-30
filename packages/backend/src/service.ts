import assert from 'assert';
import debug from 'debug';
import { DeepPartial, FindOptionsWhere, IsNull, Not } from 'typeorm';
import { Octokit, RequestError } from 'octokit';

import { OAuthApp } from '@octokit/oauth-app';

import { Database } from './database';
import { ApplicationRecord, Deployment, DeploymentStatus, Environment } from './entity/Deployment';
import { Domain } from './entity/Domain';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { Permission, ProjectMember } from './entity/ProjectMember';
import { User } from './entity/User';
import { Registry } from './registry';
import { Deployer } from './entity/Deployer';
import { GitHubConfig, RegistryConfig } from './config';
import {
  AddProjectFromTemplateInput,
  AppDeploymentRecord,
  AppDeploymentRemovalRecord,
  AuctionParams,
  DeployerRecord,
  EnvironmentVariables,
  GitPushEventPayload,
} from './types';
import { Role } from './entity/UserOrganization';
import { getRepoDetails } from './utils';

const log = debug('snowball:service');

const GITHUB_UNIQUE_WEBHOOK_ERROR = 'Hook already exists on this repository';

// Define a constant for an hour in milliseconds
const HOUR = 1000 * 60 * 60;

interface Config {
  gitHubConfig: GitHubConfig;
  registryConfig: RegistryConfig;
}

export class Service {
  private db: Database;
  private oauthApp: OAuthApp;
  private laconicRegistry: Registry;
  private config: Config;

  private deployRecordCheckTimeout?: NodeJS.Timeout;
  private auctionStatusCheckTimeout?: NodeJS.Timeout;

  constructor(config: Config, db: Database, app: OAuthApp, registry: Registry) {
    this.db = db;
    this.oauthApp = app;
    this.laconicRegistry = registry;
    this.config = config;
    this.init();
  }

  /**
   * Initialize services
   */
  init(): void {
    // Start check for ApplicationDeploymentRecords asynchronously
    this.checkDeployRecordsAndUpdate();
    // Start check for ApplicationDeploymentRemovalRecords asynchronously
    this.checkDeploymentRemovalRecordsAndUpdate();
    // Start check for Deployment Auctions asynchronously
    this.checkAuctionStatus();
  }

  /**
   * Destroy services
   */
  destroy(): void {
    clearTimeout(this.deployRecordCheckTimeout);
    clearTimeout(this.auctionStatusCheckTimeout);
  }

  /**
   * Checks for ApplicationDeploymentRecord and update corresponding deployments
   * Continues check in loop after a delay of registryConfig.fetchDeploymentRecordDelay
   */
  async checkDeployRecordsAndUpdate(): Promise<void> {
    // Fetch deployments in building state
    const deployments = await this.db.getDeployments({
      where: {
        status: DeploymentStatus.Building,
      },
    });

    if (deployments.length) {
      log(
        `Found ${deployments.length} deployments in ${DeploymentStatus.Building} state`,
      );

      // Calculate a timestamp for one hour ago
      const anHourAgo = Date.now() - HOUR;

      // Filter out deployments started more than an hour ago and mark them as Error
      const oldDeploymentsToUpdate = deployments
        .filter((deployment) => Number(deployment.updatedAt) < anHourAgo)
        .map((deployment) => {
          return this.db.updateDeploymentById(deployment.id, {
            status: DeploymentStatus.Error,
            isCurrent: false,
          });
        });

      // If there are old deployments to update, log and perform the updates
      if (oldDeploymentsToUpdate.length > 0) {
        log(
          `Cleaning up ${oldDeploymentsToUpdate.length} deployments stuck in ${DeploymentStatus.Building} state for over an hour`,
        );
        await Promise.all(oldDeploymentsToUpdate);
      }

      // Fetch ApplicationDeploymentRecord for deployments
      const records = await this.laconicRegistry.getDeploymentRecords(deployments);
      log(`Found ${records.length} ApplicationDeploymentRecords`);

      // Update deployments for which ApplicationDeploymentRecords were returned
      if (records.length) {
        await this.updateDeploymentsWithRecordData(records);
      }
    }

    this.deployRecordCheckTimeout = setTimeout(() => {
      this.checkDeployRecordsAndUpdate();
    }, this.config.registryConfig.fetchDeploymentRecordDelay);
  }

  /**
   * Checks for ApplicationDeploymentRemovalRecord and remove corresponding deployments
   * Continues check in loop after a delay of registryConfig.fetchDeploymentRecordDelay
   */
  async checkDeploymentRemovalRecordsAndUpdate(): Promise<void> {
    // Fetch deployments in deleting state
    const deployments = await this.db.getDeployments({
      where: {
        status: DeploymentStatus.Deleting,
      },
    });

    if (deployments.length) {
      log(
        `Found ${deployments.length} deployments in ${DeploymentStatus.Deleting} state`,
      );

      // Fetch ApplicationDeploymentRemovalRecords for deployments
      const records =
        await this.laconicRegistry.getDeploymentRemovalRecords(deployments);
      log(`Found ${records.length} ApplicationDeploymentRemovalRecords`);

      // Update deployments for which ApplicationDeploymentRemovalRecords were returned
      if (records.length) {
        await this.deleteDeploymentsWithRecordData(records, deployments);
      }
    }

    this.deployRecordCheckTimeout = setTimeout(() => {
      this.checkDeploymentRemovalRecordsAndUpdate();
    }, this.config.registryConfig.fetchDeploymentRecordDelay);
  }

  /**
   * Update deployments with ApplicationDeploymentRecord data
   * Deployments that are completed but not updated in DB
   */
  async updateDeploymentsWithRecordData(
    records: AppDeploymentRecord[],
  ): Promise<void> {
    // Fetch the deployments to be updated using deployment requestId
    const deployments = await this.db.getDeployments({
      where: records.map((record) => ({
        applicationDeploymentRequestId: record.attributes.request,
      })),
      relations: {
        deployer: true,
        project: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const recordToDeploymentsMap = deployments.reduce(
      (acc: { [key: string]: Deployment }, deployment) => {
        acc[deployment.applicationDeploymentRequestId!] = deployment;
        return acc;
      },
      {},
    );

    // Update deployment data for ApplicationDeploymentRecords
    const deploymentUpdatePromises = records.map(async (record) => {
      const deployment = recordToDeploymentsMap[record.attributes.request];

      if (!deployment.project) {
        log(`Project ${deployment.projectId} not found`);
        return;
      } else {
        deployment.applicationDeploymentRecordId = record.id;
        deployment.applicationDeploymentRecordData = record.attributes;
        deployment.url = record.attributes.url;
        deployment.status = DeploymentStatus.Ready;
        deployment.isCurrent = deployment.environment === Environment.Production;

        await this.db.updateDeploymentById(deployment.id, deployment);

        // Release deployer funds on successful deployment
        if (!deployment.project.fundsReleased) {
          const fundsReleased = await this.releaseDeployerFundsByProjectId(deployment.projectId);

          // Return remaining amount to owner
          await this.returnUserFundsByProjectId(deployment.projectId, true);

          await this.db.updateProjectById(deployment.projectId, {
            fundsReleased,
          });
        }

        log(
          `Updated deployment ${deployment.id} with URL ${record.attributes.url}`,
        );
      }
    });

    await Promise.all(deploymentUpdatePromises);

    // Get deployments that are in production environment
    const prodDeployments = Object.values(recordToDeploymentsMap).filter(deployment => deployment.isCurrent);

    // Set the isCurrent state to false for the old deployments
    for (const deployment of prodDeployments) {
      const projectDeployments = await this.db.getDeploymentsByProjectId(deployment.projectId);
      const oldDeployments = projectDeployments
        .filter(projectDeployment => projectDeployment.deployer.deployerLrn === deployment.deployer.deployerLrn && projectDeployment.id !== deployment.id);
      for (const oldDeployment of oldDeployments) {
        await this.db.updateDeployment(
          { id: oldDeployment.id },
          { isCurrent: false }
        );
      }
    }

    await Promise.all(deploymentUpdatePromises);
  }

  /**
   * Delete deployments with ApplicationDeploymentRemovalRecord data
   */
  async deleteDeploymentsWithRecordData(
    records: AppDeploymentRemovalRecord[],
    deployments: Deployment[],
  ): Promise<void> {
    const removedApplicationDeploymentRecordIds = records.map(
      (record) => record.attributes.deployment,
    );

    // Get removed deployments for ApplicationDeploymentRecords
    const removedDeployments = deployments.filter((deployment) =>
      removedApplicationDeploymentRecordIds.includes(
        deployment.applicationDeploymentRecordId!,
      ),
    );

    const recordToDeploymentsMap = removedDeployments.reduce(
      (acc: { [key: string]: Deployment }, deployment) => {
        acc[deployment.applicationDeploymentRecordId!] = deployment;
        return acc;
      },
      {},
    );

    // Update deployment data for ApplicationDeploymentRecords and delete
    const deploymentUpdatePromises = records.map(async (record) => {
      const deployment = recordToDeploymentsMap[record.attributes.deployment];

      await this.db.updateDeploymentById(deployment.id, {
        applicationDeploymentRemovalRecordId: record.id,
        applicationDeploymentRemovalRecordData: record.attributes,
      });

      log(
        `Updated deployment ${deployment.id} with ApplicationDeploymentRemovalRecord ${record.id}`,
      );

      await this.db.deleteDeploymentById(deployment.id);
    });

    await Promise.all(deploymentUpdatePromises);
  }

  /**
   * Checks the status for all ongoing auctions
   * Calls the createDeploymentFromAuction method for deployments with completed auctions
   */
  async checkAuctionStatus(): Promise<void> {
    const projects = await this.db.allProjectsWithoutDeployments();

    const validAuctionIds = projects.map((project) => project.auctionId)
      .filter((id): id is string => Boolean(id));
    const completedAuctionIds = await this.laconicRegistry.getCompletedAuctionIds(validAuctionIds);

    const projectsToBedeployed = projects.filter((project) =>
      completedAuctionIds.includes(project.auctionId!)
    );

    for (const project of projectsToBedeployed) {
      const deployerRecords = await this.laconicRegistry.getAuctionWinningDeployerRecords(project!.auctionId!);

      if (!deployerRecords) {
        log(`No winning deployer for auction ${project!.auctionId}`);

        // Return all funds to the owner
        await this.returnUserFundsByProjectId(project.id, false)
      } else {
        const deployers = await this.saveDeployersByDeployerRecords(deployerRecords);
        for (const deployer of deployers) {
          log(`Creating deployment for deployer ${deployer.deployerLrn}`);
          await this.createDeploymentFromAuction(project, deployer);
          // Update project with deployer
          await this.updateProjectWithDeployer(project.id, deployer);
        }
      }
    }

    this.auctionStatusCheckTimeout = setTimeout(() => {
      this.checkAuctionStatus();
    }, this.config.registryConfig.checkAuctionStatusDelay);
  }

  async getUser(userId: string): Promise<User | null> {
    return this.db.getUser({
      where: {
        id: userId,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.db.getUser({
      where: {
        email,
      },
    });
  }

  async getUserBySubOrgId(subOrgId: string): Promise<User | null> {
    return await this.db.getUser({
      where: {
        subOrgId,
      },
    });
  }

  async getUserByEthAddress(ethAddress: string): Promise<User | null> {
    return await this.db.getUser({
      where: {
        ethAddress,
      },
    });
  }

  async createUser(params: {
    name?: string;
    email: string;
    subOrgId: string;
    ethAddress: string;
    turnkeyWalletId: string;
  }): Promise<User> {
    const [org] = await this.db.getOrganizations({});
    assert(org, 'No organizations exists in database');

    // Create user with new address
    const user = await this.db.addUser({
      email: params.email,
      name: params.name,
      subOrgId: params.subOrgId,
      ethAddress: params.ethAddress,
      isVerified: true,
      turnkeyWalletId: params.turnkeyWalletId,
    });

    await this.db.addUserOrganization({
      member: user,
      organization: org,
      role: Role.Owner,
    });

    return user;
  }

  async getOctokit(userId: string): Promise<Octokit> {
    const user = await this.db.getUser({ where: { id: userId } });
    assert(
      user && user.gitHubToken,
      'User needs to be authenticated with GitHub token',
    );

    return new Octokit({ auth: user.gitHubToken });
  }

  async getOrganizationsByUserId(user: User): Promise<Organization[]> {
    const dbOrganizations = await this.db.getOrganizationsByUserId(user.id);
    return dbOrganizations;
  }

  async getProjectById(user: User, projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);

    if (dbProject && dbProject.owner.id !== user.id) {
      return null;
    }

    return dbProject;
  }

  async getProjectsInOrganization(
    user: User,
    organizationSlug: string,
  ): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsInOrganization(
      user.id,
      organizationSlug,
    );
    return dbProjects;
  }

  async getDeploymentsByProjectId(projectId: string): Promise<Deployment[]> {
    const dbDeployments = await this.db.getDeploymentsByProjectId(projectId);
    return dbDeployments;
  }

  async getEnvironmentVariablesByProjectId(
    projectId: string,
  ): Promise<EnvironmentVariable[]> {
    const dbEnvironmentVariables =
      await this.db.getEnvironmentVariablesByProjectId(projectId);
    return dbEnvironmentVariables;
  }

  async getProjectMembersByProjectId(
    projectId: string,
  ): Promise<ProjectMember[]> {
    const dbProjectMembers =
      await this.db.getProjectMembersByProjectId(projectId);
    return dbProjectMembers;
  }

  async searchProjects(user: User, searchText: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySearchText(
      user.id,
      searchText,
    );
    return dbProjects;
  }

  async getDomainsByProjectId(
    projectId: string,
    filter?: FindOptionsWhere<Domain>,
  ): Promise<Domain[]> {
    const dbDomains = await this.db.getDomainsByProjectId(projectId, filter);
    return dbDomains;
  }

  async updateProjectMember(
    projectMemberId: string,
    data: { permissions: Permission[] },
  ): Promise<boolean> {
    return this.db.updateProjectMemberById(projectMemberId, data);
  }

  async addProjectMember(
    projectId: string,
    data: {
      email: string;
      permissions: Permission[];
    },
  ): Promise<ProjectMember> {
    // TODO: Send invitation
    let user = await this.db.getUser({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      user = await this.db.addUser({
        email: data.email,
      });
    }

    const newProjectMember = await this.db.addProjectMember({
      project: {
        id: projectId,
      },
      permissions: data.permissions,
      isPending: true,
      member: {
        id: user.id,
      },
    });

    return newProjectMember;
  }

  async removeProjectMember(
    user: User,
    projectMemberId: string,
  ): Promise<boolean> {
    const member = await this.db.getProjectMemberById(projectMemberId);

    if (String(member.member.id) === user.id) {
      throw new Error('Invalid operation: cannot remove self');
    }

    const memberProject = member.project;
    assert(memberProject);

    if (String(user.id) === String(memberProject.owner.id)) {
      return this.db.removeProjectMemberById(projectMemberId);
    } else {
      throw new Error('Invalid operation: not authorized');
    }
  }

  async addEnvironmentVariables(
    projectId: string,
    data: { environments: string[]; key: string; value: string }[],
  ): Promise<EnvironmentVariable[]> {
    const formattedEnvironmentVariables = data
      .map((environmentVariable) => {
        return environmentVariable.environments.map((environment) => {
          return {
            key: environmentVariable.key,
            value: environmentVariable.value,
            environment: environment as Environment,
            project: Object.assign(new Project(), {
              id: projectId,
            }),
          };
        });
      })
      .flat();

    const savedEnvironmentVariables = await this.db.addEnvironmentVariables(
      formattedEnvironmentVariables,
    );
    return savedEnvironmentVariables;
  }

  async updateEnvironmentVariable(
    environmentVariableId: string,
    data: DeepPartial<EnvironmentVariable>,
  ): Promise<boolean> {
    return this.db.updateEnvironmentVariable(environmentVariableId, data);
  }

  async removeEnvironmentVariable(
    environmentVariableId: string,
  ): Promise<boolean> {
    return this.db.deleteEnvironmentVariable(environmentVariableId);
  }

  async updateDeploymentToProd(
    user: User,
    deploymentId: string,
  ): Promise<Deployment> {
    const oldDeployment = await this.db.getDeployment({
      where: { id: deploymentId },
      relations: {
        project: true,
      },
    });

    if (!oldDeployment) {
      throw new Error('Deployment does not exist');
    }

    const prodBranchDomains = await this.db.getDomainsByProjectId(
      oldDeployment.project.id,
      { branch: oldDeployment.project.prodBranch },
    );

    const octokit = await this.getOctokit(user.id);

    const newDeployment = await this.createDeployment(user.id, octokit, {
      project: oldDeployment.project,
      branch: oldDeployment.branch,
      environment: Environment.Production,
      domain: prodBranchDomains[0],
      commitHash: oldDeployment.commitHash,
      commitMessage: oldDeployment.commitMessage,
      deployer: oldDeployment.deployer
    });

    return newDeployment;
  }

  async createDeployment(
    userId: string,
    octokit: Octokit,
    data: DeepPartial<Deployment>,
    deployerLrn?: string
  ): Promise<Deployment> {
    assert(data.project?.repository, 'Project repository not found');
    log(
      `Creating deployment in project ${data.project.name} from branch ${data.branch}`,
    );

    // TODO: Set environment variables for each deployment (environment variables can`t be set in application record)
    const { applicationRecordId, applicationRecordData } =
      await this.laconicRegistry.createApplicationRecord({
        octokit,
        repository: data.project.repository,
        appType: data.project!.template!,
        commitHash: data.commitHash!,
      });

    // Update previous deployment with prod branch domain
    // TODO: Fix unique constraint error for domain
    if (data.domain) {
      await this.db.updateDeployment(
        {
          domainId: data.domain.id,
        },
        {
          domain: null,
        },
      );
    }

    let deployer;
    if (deployerLrn) {
      deployer = await this.db.getDeployerByLRN(deployerLrn);
    } else {
      deployer = data.deployer;
    }

    const newDeployment = await this.createDeploymentFromData(userId, data, deployer!.deployerLrn!, applicationRecordId, applicationRecordData);

    const { repo, repoUrl } = await getRepoDetails(octokit, data.project.repository, data.commitHash);
    const environmentVariablesObj = await this.getEnvVariables(data.project!.id!);
    // To set project DNS
    if (data.environment === Environment.Production) {
      // On deleting deployment later, project DNS deployment is also deleted
      // So publish project DNS deployment first so that ApplicationDeploymentRecord for the same is available when deleting deployment later
      await this.laconicRegistry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}`,
        lrn: deployer!.deployerLrn!,
        payment: data.project.txHash,
        auctionId: data.project.auctionId
      });
    }

    const { applicationDeploymentRequestId, applicationDeploymentRequestData } =
      await this.laconicRegistry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        lrn: deployer!.deployerLrn!,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}-${newDeployment.id}`,
        payment: data.project.txHash,
        auctionId: data.project.auctionId
      });

    await this.db.updateDeploymentById(newDeployment.id, {
      applicationDeploymentRequestId,
      applicationDeploymentRequestData,
    });

    return newDeployment;
  }

  async createDeploymentFromAuction(
    project: DeepPartial<Project>,
    deployer: Deployer
  ): Promise<Deployment> {
    const octokit = await this.getOctokit(project.ownerId!);
    const [owner, repo] = project.repository!.split('/');

    const repoUrl = (
      await octokit.rest.repos.get({
        owner,
        repo,
      })
    ).data.html_url;

    const {
      data: [latestCommit],
    } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: project.prodBranch,
      per_page: 1,
    });

    const lrn = this.laconicRegistry.getLrn(repo);
    const [record] = await this.laconicRegistry.getRecordsByName(lrn);
    const applicationRecordId = record.id;
    const applicationRecordData = record.attributes;

    const deployerLrn = deployer!.deployerLrn

    // Create deployment with prod branch and latest commit
    const deploymentData = {
      project,
      branch: project.prodBranch,
      environment: Environment.Production,
      domain: null,
      commitHash: latestCommit.sha,
      commitMessage: latestCommit.commit.message,
    };

    const newDeployment = await this.createDeploymentFromData(project.ownerId!, deploymentData, deployerLrn, applicationRecordId, applicationRecordData);

    const environmentVariablesObj = await this.getEnvVariables(project!.id!);
    // To set project DNS
    if (deploymentData.environment === Environment.Production) {
      // On deleting deployment later, project DNS deployment is also deleted
      // So publish project DNS deployment first so that ApplicationDeploymentRecord for the same is available when deleting deployment later
      await this.laconicRegistry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}`,
        auctionId: project.auctionId!,
        lrn: deployerLrn,
      });
    }

    const { applicationDeploymentRequestId, applicationDeploymentRequestData } =
      // Create requests for all the deployers
      await this.laconicRegistry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        auctionId: project.auctionId!,
        lrn: deployerLrn,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}-${newDeployment.id}`,
      });

    await this.db.updateDeploymentById(newDeployment.id, {
      applicationDeploymentRequestId,
      applicationDeploymentRequestData,
    });

    return newDeployment;
  }

  async createDeploymentFromData(
    userId: string,
    data: DeepPartial<Deployment>,
    deployerLrn: string,
    applicationRecordId: string,
    applicationRecordData: ApplicationRecord,
  ): Promise<Deployment> {
    const newDeployment = await this.db.addDeployment({
      project: data.project,
      branch: data.branch,
      commitHash: data.commitHash,
      commitMessage: data.commitMessage,
      environment: data.environment,
      status: DeploymentStatus.Building,
      applicationRecordId,
      applicationRecordData,
      domain: data.domain,
      createdBy: Object.assign(new User(), {
        id: userId,
      }),
      deployer: Object.assign(new Deployer(), {
        deployerLrn,
      }),
    });

    log(`Created deployment ${newDeployment.id}`);

    return newDeployment;
  }

  async updateProjectWithDeployer(
    projectId: string,
    deployer: Deployer
  ): Promise<Deployer> {
    const deploymentProject = await this.db.getProjects({
      where: { id: projectId },
      relations: ['deployers']
    });

    if (!deploymentProject[0].deployers) {
      deploymentProject[0].deployers = [];
    }

    deploymentProject[0].deployers.push(deployer);

    await this.db.saveProject(deploymentProject[0]);

    return deployer;
  }

  async addProjectFromTemplate(
    user: User,
    organizationSlug: string,
    data: AddProjectFromTemplateInput,
    lrn?: string,
    auctionParams?: AuctionParams,
    environmentVariables?: EnvironmentVariables[],
  ): Promise<Project | undefined> {
    try {
      const octokit = await this.getOctokit(user.id);

      const gitRepo = await octokit?.rest.repos.createUsingTemplate({
        template_owner: data.templateOwner,
        template_repo: data.templateRepo,
        owner: data.owner,
        name: data.name,
        include_all_branches: false,
        private: data.isPrivate,
      });

      if (!gitRepo) {
        throw new Error('Failed to create repository from template');
      }

      const createdTemplateRepo = await octokit.rest.repos.get({
        owner: data.owner,
        repo: data.name,
      });

      const prodBranch = createdTemplateRepo.data.default_branch ?? 'main';

      const project = await this.addProject(user, organizationSlug, {
        name: `${gitRepo.data.owner!.login}-${gitRepo.data.name}`,
        prodBranch,
        repository: gitRepo.data.full_name,
        // TODO: Set selected template
        template: 'webapp',
        paymentAddress: data.paymentAddress,
        txHash: data.txHash
      }, lrn, auctionParams, environmentVariables);

      if (!project || !project.id) {
        throw new Error('Failed to create project from template');
      }

      return project;
    } catch (error) {
      console.error('Error creating project from template:', error);
      throw error;
    }
  }

  async addProject(
    user: User,
    organizationSlug: string,
    data: DeepPartial<Project>,
    lrn?: string,
    auctionParams?: AuctionParams,
    environmentVariables?: EnvironmentVariables[],
  ): Promise<Project | undefined> {
    const organization = await this.db.getOrganization({
      where: {
        slug: organizationSlug,
      },
    });

    if (!organization) {
      throw new Error('Organization does not exist');
    }

    const project = await this.db.addProject(user, organization.id, data);

    if (environmentVariables) {
      await this.addEnvironmentVariables(project.id, environmentVariables);
    }

    const octokit = await this.getOctokit(user.id);
    const [owner, repo] = project.repository.split('/');

    const {
      data: [latestCommit],
    } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: project.prodBranch,
      per_page: 1,
    });

    if (auctionParams) {
      // Create deployment with prod branch and latest commit
      const deploymentData = {
        project,
        branch: project.prodBranch,
        environment: Environment.Production,
        domain: null,
        commitHash: latestCommit.sha,
        commitMessage: latestCommit.commit.message,
      };
      const { applicationDeploymentAuctionId } = await this.laconicRegistry.createApplicationDeploymentAuction(repo, octokit, auctionParams!, deploymentData);
      await this.updateProject(project.id, { auctionId: applicationDeploymentAuctionId });
    } else {
      const deployer = await this.db.getDeployerByLRN(lrn!);

      if (!deployer) {
        log('Invalid deployer LRN');
        return;
      }

      if (deployer.minimumPayment && project.txHash) {
        const amountToBePaid = deployer?.minimumPayment.replace(/\D/g, '').toString();

        const txResponse = await this.laconicRegistry.sendTokensToAccount(
          deployer?.paymentAddress!,
          amountToBePaid
        );

        const txHash = txResponse.transactionHash;
        if (txHash) {
          await this.updateProject(project.id, { txHash });
          project.txHash = txHash;
          log('Funds transferrend to deployer');
        }
      }

      const deploymentData = {
        project,
        branch: project.prodBranch,
        environment: Environment.Production,
        domain: null,
        commitHash: latestCommit.sha,
        commitMessage: latestCommit.commit.message,
        deployer
      };

      const newDeployment = await this.createDeployment(user.id, octokit, deploymentData);
      // Update project with deployer
      await this.updateProjectWithDeployer(newDeployment.projectId, newDeployment.deployer);
    }

    await this.createRepoHook(octokit, project);

    return project;
  }

  async createRepoHook(octokit: Octokit, project: Project): Promise<void> {
    try {
      const [owner, repo] = project.repository.split('/');
      await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: new URL(
            'api/github/webhook',
            this.config.gitHubConfig.webhookUrl,
          ).href,
          content_type: 'json',
        },
        events: ['push'],
      });
    } catch (err) {
      // https://docs.github.com/en/rest/repos/webhooks?apiVersion=2022-11-28#create-a-repository-webhook--status-codes
      if (
        !(
          err instanceof RequestError &&
          err.status === 422 &&
          (err.response?.data as any).errors.some(
            (err: any) => err.message === GITHUB_UNIQUE_WEBHOOK_ERROR,
          )
        )
      ) {
        throw err;
      }

      log(GITHUB_UNIQUE_WEBHOOK_ERROR);
    }
  }

  async handleGitHubPush(data: GitPushEventPayload): Promise<void> {
    const { repository, ref, head_commit: headCommit, deleted } = data;

    if (deleted) {
      log(`Branch ${ref} deleted for project ${repository.full_name}`);
      return;
    }

    log(
      `Handling GitHub push event from repository: ${repository.full_name}, branch: ${ref}`,
    );
    const projects = await this.db.getProjects({
      where: { repository: repository.full_name },
      relations: {
        deployers: true,
      }
    });

    if (!projects.length) {
      log(`No projects found for repository ${repository.full_name}`);
    }

    // The `ref` property contains the full reference, including the branch name
    // For example, "refs/heads/main" or "refs/heads/feature-branch"
    const branch = ref.split('/').pop();

    for await (const project of projects) {
      const octokit = await this.getOctokit(project.ownerId);
      const [domain] = await this.db.getDomainsByProjectId(project.id, {
        branch,
      });

      const deployers = project.deployers;
      if (!deployers) {
        log(`No deployer present for project ${project.id}`)
        return;
      }

      for (const deployer of deployers) {
        // Create deployment with branch and latest commit in GitHub data
        await this.createDeployment(project.ownerId, octokit,
          {
            project,
            branch,
            environment:
              project.prodBranch === branch
                ? Environment.Production
                : Environment.Preview,
            domain,
            commitHash: headCommit.id,
            commitMessage: headCommit.message,
            deployer: deployer
          },
        );
      }
    }
  }

  async updateProject(
    projectId: string,
    data: DeepPartial<Project>,
  ): Promise<boolean> {
    return this.db.updateProjectById(projectId, data);
  }

  async deleteProject(projectId: string): Promise<boolean> {
    // TODO: Remove GitHub repo hook
    return this.db.deleteProjectById(projectId);
  }

  async deleteDomain(domainId: string): Promise<boolean> {
    const domainsRedirectedFrom = await this.db.getDomains({
      where: {
        redirectToId: domainId,
      },
    });

    if (domainsRedirectedFrom.length > 0) {
      throw new Error(
        'Cannot delete domain since it has redirects from other domains',
      );
    }

    return this.db.deleteDomainById(domainId);
  }

  async redeployToProd(user: User, deploymentId: string): Promise<Deployment> {
    const oldDeployment = await this.db.getDeployment({
      relations: {
        project: true,
        domain: true,
        deployer: true,
        createdBy: true,
      },
      where: {
        id: deploymentId,
      },
    });

    if (oldDeployment === null) {
      throw new Error('Deployment not found');
    }

    const octokit = await this.getOctokit(user.id);

    let newDeployment: Deployment;

    if (oldDeployment.project.auctionId) {
      newDeployment = await this.createDeploymentFromAuction(oldDeployment.project, oldDeployment.deployer);
    } else {
      newDeployment = await this.createDeployment(user.id, octokit,
        {
          project: oldDeployment.project,
          // TODO: Put isCurrent field in project
          branch: oldDeployment.branch,
          environment: Environment.Production,
          domain: oldDeployment.domain,
          commitHash: oldDeployment.commitHash,
          commitMessage: oldDeployment.commitMessage,
          deployer: oldDeployment.deployer
        }
      );
    }

    return newDeployment;
  }

  async rollbackDeployment(
    projectId: string,
    deploymentId: string,
  ): Promise<boolean> {
    // TODO: Implement transactions
    const oldCurrentDeployment = await this.db.getDeployment({
      relations: {
        domain: true,
      },
      where: {
        project: {
          id: projectId,
        },
        isCurrent: true,
      },
    });

    if (!oldCurrentDeployment) {
      throw new Error('Current deployment doesnot exist');
    }

    const oldCurrentDeploymentUpdate = await this.db.updateDeploymentById(
      oldCurrentDeployment.id,
      { isCurrent: false, domain: null },
    );

    const newCurrentDeploymentUpdate = await this.db.updateDeploymentById(
      deploymentId,
      { isCurrent: true, domain: oldCurrentDeployment?.domain },
    );

    return newCurrentDeploymentUpdate && oldCurrentDeploymentUpdate;
  }

  async deleteDeployment(deploymentId: string): Promise<boolean> {
    const deployment = await this.db.getDeployment({
      where: {
        id: deploymentId,
      },
      relations: {
        project: true,
        deployer: true,
      },
    });

    if (deployment && deployment.applicationDeploymentRecordId) {
      // If deployment is current, remove deployment for project subdomain as well
      if (deployment.isCurrent) {
        const currentDeploymentURL = `https://${(deployment.project.name).toLowerCase()}.${deployment.deployer.baseDomain}`;

        // TODO: Store the latest DNS deployment record
        const deploymentRecords =
          await this.laconicRegistry.getDeploymentRecordsByFilter({
            application: deployment.applicationRecordId,
            url: currentDeploymentURL,
          });

        if (!deploymentRecords.length) {
          log(
            `No ApplicationDeploymentRecord found for URL ${currentDeploymentURL} and ApplicationDeploymentRecord id ${deployment.applicationDeploymentRecordId}`,
          );

          return false;
        }

        // Multiple records are fetched, take the latest record
        const latestRecord = deploymentRecords
          .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())[0];

        await this.laconicRegistry.createApplicationDeploymentRemovalRequest({
          deploymentId: latestRecord.id,
          deployerLrn: deployment.deployer.deployerLrn,
          auctionId: deployment.project.auctionId,
          payment: deployment.project.txHash
        });
      }

      const result =
        await this.laconicRegistry.createApplicationDeploymentRemovalRequest({
          deploymentId: deployment.applicationDeploymentRecordId,
          deployerLrn: deployment.deployer.deployerLrn,
          auctionId: deployment.project.auctionId,
          payment: deployment.project.txHash
        });

      await this.db.updateDeploymentById(deployment.id, {
        status: DeploymentStatus.Deleting,
        applicationDeploymentRemovalRequestId:
          result.applicationDeploymentRemovalRequestId,
        applicationDeploymentRemovalRequestData:
          result.applicationDeploymentRemovalRequestData,
      });

      return result !== undefined || result !== null;
    }

    return false;
  }

  async addDomain(
    projectId: string,
    data: { name: string },
  ): Promise<{
    primaryDomain: Domain;
    redirectedDomain: Domain;
  }> {
    const currentProject = await this.db.getProjectById(projectId);

    if (currentProject === null) {
      throw new Error(`Project with ${projectId} not found`);
    }

    const primaryDomainDetails = {
      ...data,
      branch: currentProject.prodBranch,
      project: currentProject,
    };

    const savedPrimaryDomain = await this.db.addDomain(primaryDomainDetails);

    const domainArr = data.name.split('www.');

    const redirectedDomainDetails = {
      name: domainArr.length > 1 ? domainArr[1] : `www.${domainArr[0]}`,
      branch: currentProject.prodBranch,
      project: currentProject,
      redirectTo: savedPrimaryDomain,
    };

    const savedRedirectedDomain = await this.db.addDomain(
      redirectedDomainDetails,
    );

    return {
      primaryDomain: savedPrimaryDomain,
      redirectedDomain: savedRedirectedDomain,
    };
  }

  async updateDomain(
    domainId: string,
    data: DeepPartial<Domain>,
  ): Promise<boolean> {
    const domain = await this.db.getDomain({
      where: {
        id: domainId,
      },
    });

    if (domain === null) {
      throw new Error(`Error finding domain with id ${domainId}`);
    }

    const newDomain = {
      ...data,
    };

    const domainsRedirectedFrom = await this.db.getDomains({
      where: {
        project: {
          id: domain.projectId,
        },
        redirectToId: domain.id,
      },
    });

    // If there are domains redirecting to current domain, only branch of current domain can be updated
    if (domainsRedirectedFrom.length > 0 && data.branch === domain.branch) {
      throw new Error('Remove all redirects to this domain before updating');
    }

    if (data.redirectToId) {
      const redirectedDomain = await this.db.getDomain({
        where: {
          id: data.redirectToId,
        },
      });

      if (redirectedDomain === null) {
        throw new Error('Could not find Domain to redirect to');
      }

      if (redirectedDomain.redirectToId) {
        throw new Error(
          'Unable to redirect to the domain because it is already redirecting elsewhere. Redirects cannot be chained.',
        );
      }

      newDomain.redirectTo = redirectedDomain;
    }

    const updateResult = await this.db.updateDomainById(domainId, newDomain);

    return updateResult;
  }

  async authenticateGitHub(
    code: string,
    user: User,
  ): Promise<{ token: string }> {
    const {
      authentication: { token },
    } = await this.oauthApp.createToken({
      code,
    });

    await this.db.updateUser(user, { gitHubToken: token });

    return { token };
  }

  async unauthenticateGitHub(
    user: User,
    data: DeepPartial<User>,
  ): Promise<boolean> {
    return this.db.updateUser(user, data);
  }

  async getEnvVariables(
    projectId: string,
  ): Promise<{ [key: string]: string }> {
    const environmentVariables = await this.db.getEnvironmentVariablesByProjectId(projectId, {
      environment: Environment.Production,
    });

    const environmentVariablesObj = environmentVariables.reduce(
      (acc, env) => {
        acc[env.key] = env.value;
        return acc;
      },
      {} as { [key: string]: string },
    );

    return environmentVariablesObj;
  }

  async getAuctionData(
    auctionId: string
  ): Promise<any> {
    const auctions = await this.laconicRegistry.getAuctionData(auctionId);
    return auctions[0];
  }

  async releaseDeployerFundsByProjectId(projectId: string): Promise<boolean> {
    const project = await this.db.getProjectById(projectId);

    if (!project || !project.auctionId) {
      log(`Project ${projectId} ${!project ? 'not found' : 'does not have an auction'}`);

      return false;
    }

    const auction = await this.laconicRegistry.releaseDeployerFunds(project.auctionId);

    if (auction.auction.fundsReleased) {
      log(`Funds released for auction ${project.auctionId}`);
      await this.db.updateProjectById(projectId, { fundsReleased: true });

      return true;
    }

    log(`Error releasing funds for auction ${project.auctionId}`);

    return false;
  }

  async returnUserFundsByProjectId(projectId: string, winningDeployersPresent: boolean) {
    const project = await this.db.getProjectById(projectId);

    if (!project || !project.auctionId) {
      log(`Project ${projectId} ${!project ? 'not found' : 'does not have an auction'}`);

      return false;
    }

    const auction = await this.getAuctionData(project.auctionId);
    const totalAuctionPrice = Number(auction.maxPrice.quantity) * auction.numProviders;

    let amountToBeReturned;
    if (winningDeployersPresent) {
      amountToBeReturned = totalAuctionPrice - auction.winnerAddresses.length * Number(auction.winnerPrice.quantity);
    } else {
      amountToBeReturned = totalAuctionPrice;
    }

    if (amountToBeReturned !== 0) {
      await this.laconicRegistry.sendTokensToAccount(
        project.paymentAddress,
        amountToBeReturned.toString()
      );
    }
  }

  async getDeployers(): Promise<Deployer[]> {
    const dbDeployers = await this.db.getDeployers();

    if (dbDeployers.length > 0) {
      // Call asynchronously to fetch the records from the registry and update the DB
      this.updateDeployersFromRegistry();
      return dbDeployers;
    } else {
      // Fetch from the registry and populate empty DB
      return await this.updateDeployersFromRegistry();
    }
  }

  async updateDeployersFromRegistry(): Promise<Deployer[]> {
    const deployerRecords = await this.laconicRegistry.getDeployerRecordsByFilter({});
    await this.saveDeployersByDeployerRecords(deployerRecords);

    return await this.db.getDeployers();
  }

  async saveDeployersByDeployerRecords(deployerRecords: DeployerRecord[]): Promise<Deployer[]> {
    const deployers: Deployer[] = [];

    for (const record of deployerRecords) {
      if (record.names && record.names.length > 0) {
        const deployerId = record.id;
        const deployerLrn = record.names[0];
        const deployerApiUrl = record.attributes.apiUrl;
        const minimumPayment = record.attributes.minimumPayment;
        const paymentAddress = record.attributes.paymentAddress;
        const baseDomain = deployerApiUrl.substring(deployerApiUrl.indexOf('.') + 1);

        const deployerData = {
          deployerLrn,
          deployerId,
          deployerApiUrl,
          baseDomain,
          minimumPayment,
          paymentAddress
        };

        // TODO: Update deployers table in a separate job
        const deployer = await this.db.addDeployer(deployerData);
        deployers.push(deployer);
      }
    }

    return deployers;
  }

  async getAddress(): Promise<any> {
    const account = await this.laconicRegistry.getAccount();

    return account.address;
  }

  async verifyTx(txHash: string, amountSent: string, senderAddress: string): Promise<boolean> {
    const txResponse = await this.laconicRegistry.getTxResponse(txHash);
    if (!txResponse) {
      log('Transaction response not found');
      return false;
    }

    const transfer = txResponse.events.find(e => e.type === 'transfer' && e.attributes.some(a => a.key === 'msg_index'));
    if (!transfer) {
      log('No transfer event found');
      return false;
    }

    const sender = transfer.attributes.find(a => a.key === 'sender')?.value;
    const recipient = transfer.attributes.find(a => a.key === 'recipient')?.value;
    const amount = transfer.attributes.find(a => a.key === 'amount')?.value;

    const recipientAddress = await this.getAddress();

    return amount === amountSent && sender === senderAddress && recipient === recipientAddress;
  }
}
