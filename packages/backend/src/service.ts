import assert from 'assert';
import debug from 'debug';
import { DeepPartial, FindOptionsWhere, IsNull } from 'typeorm';
import { Octokit, RequestError } from 'octokit';

import { OAuthApp } from '@octokit/oauth-app';

import { Database } from './database';
import { Deployment, DeploymentStatus, Environment } from './entity/Deployment';
import { Domain } from './entity/Domain';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { Permission, ProjectMember } from './entity/ProjectMember';
import { User } from './entity/User';
import { Registry } from './registry';
import { GitHubConfig, RegistryConfig } from './config';
import {
  AddProjectFromTemplateInput,
  AppDeploymentRecord,
  AppDeploymentRemovalRecord,
  Auction,
  AuctionData,
  GitPushEventPayload,
  PackageJSON,
} from './types';
import { Role } from './entity/UserOrganization';

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
  private registry: Registry;
  private config: Config;

  private deployRecordCheckTimeout?: NodeJS.Timeout;

  constructor(config: Config, db: Database, app: OAuthApp, registry: Registry) {
    this.db = db;
    this.oauthApp = app;
    this.registry = registry;
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
      const records = await this.registry.getDeploymentRecords(deployments);
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
        await this.registry.getDeploymentRemovalRecords(deployments);
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
   */
  async updateDeploymentsWithRecordData(
    records: AppDeploymentRecord[],
  ): Promise<void> {
    // Deployments that are completed, not updated(are in building state and ApplicationDeploymentRecord is present)
    const deployments = await this.db.getDeployments({
      where: records.map((record) => ({
        applicationRecordId: record.attributes.application,
      })),
      order: {
        createdAt: 'DESC',
      },
    });

    // Get project IDs of deployments that are in production environment
    const productionDeploymentProjectIds = deployments.reduce(
      (acc, deployment): Set<string> => {
        if (deployment.environment === Environment.Production) {
          acc.add(deployment.projectId);
        }

        return acc;
      },
      new Set<string>(),
    );

    // Set old deployments isCurrent to false
    await this.db.updateDeploymentsByProjectIds(
      Array.from(productionDeploymentProjectIds),
      { isCurrent: false },
    );

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

      if(!deployment) {
        log('Deployment does not exist')
      }

      await this.db.updateDeploymentById(deployment.id, {
        applicationDeploymentRecordId: record.id,
        applicationDeploymentRecordData: record.attributes,
        url: record.attributes.url,
        status: DeploymentStatus.Ready,
        isCurrent: deployment.environment === Environment.Production,
      });

      log(
        `Updated deployment ${deployment.id} with URL ${record.attributes.url}`,
      );
    });

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
    const projects = await this.db.getProjects({
      where: {
        deployments: {
          applicationDeploymentRequestId: IsNull()
        }
      },
    });

    const auctionIds = projects.map((project) => project.auctionId);
    const completedAuctionIds = await this.registry.getCompletedAuctionIds(auctionIds);

    if (completedAuctionIds) {
      const projectsToBedeployed = projects.filter((project) =>
        completedAuctionIds.includes(project.auctionId!)
      );

      for (const project of projectsToBedeployed) {
        const deployerLrns = await this.registry.getAuctionWinners(project!.auctionId!);

        // Update project with deployer LRNs
        await this.db.updateProjectById(project.id!, {
          deployerLrn: deployerLrns
        })
        for (const deployer of deployerLrns) {
          await this.createDeploymentFromAuction(project, deployer);
        }
      }
    }

    this.deployRecordCheckTimeout = setTimeout(() => {
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
    name: string;
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

  async getProjectById(projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);
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
    }, oldDeployment.deployerLrn);

    return newDeployment;
  }

  async createDeployment(
    userId: string,
    octokit: Octokit,
    data: DeepPartial<Deployment>,
    lrn: string
  ): Promise<Deployment> {
    assert(data.project?.repository, 'Project repository not found');
    log(
      `Creating deployment in project ${data.project.name} from branch ${data.branch}`,
    );
    const [owner, repo] = data.project.repository.split('/');

    const { data: packageJSONData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
      ref: data.commitHash,
    });

    if (!packageJSONData) {
      throw new Error('Package.json file not found');
    }

    assert(!Array.isArray(packageJSONData) && packageJSONData.type === 'file');
    const packageJSON: PackageJSON = JSON.parse(atob(packageJSONData.content));

    assert(packageJSON.name, "name field doesn't exist in package.json");

    const repoUrl = (
      await octokit.rest.repos.get({
        owner,
        repo,
      })
    ).data.html_url;

    // TODO: Set environment variables for each deployment (environment variables can`t be set in application record)
    const { applicationRecordId, applicationRecordData } =
      await this.registry.createApplicationRecord({
        appName: repo,
        packageJSON,
        appType: data.project!.template!,
        commitHash: data.commitHash!,
        repoUrl,
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
      deployerLrn: lrn,
    });

    log(
      `Created deployment ${newDeployment.id} and published application record ${applicationRecordId}`,
    );

    const environmentVariables =
      await this.db.getEnvironmentVariablesByProjectId(data.project.id!, {
        environment: Environment.Production,
      });

    const environmentVariablesObj = environmentVariables.reduce(
      (acc, env) => {
        acc[env.key] = env.value;

        return acc;
      },
      {} as { [key: string]: string },
    );

    // To set project DNS
    if (data.environment === Environment.Production) {
      // On deleting deployment later, project DNS deployment is also deleted
      // So publish project DNS deployment first so that ApplicationDeploymentRecord for the same is available when deleting deployment later
      await this.registry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}`,
        lrn
      });
    }

    const { applicationDeploymentRequestId, applicationDeploymentRequestData } =
      await this.registry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        lrn,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}-${newDeployment.id}`,
      });

    await this.db.updateDeploymentById(newDeployment.id, {
      applicationDeploymentRequestId,
      applicationDeploymentRequestData,
    });

    // Save deployer lrn only if present
    if (lrn) {
      newDeployment.project.deployerLrn = [lrn];
    }

    return newDeployment;
  }

  async createDeploymentFromAuction(
    project: DeepPartial<Project>,
    deployer: string
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

    const lrn = this.registry.getLrn(repo);
    const [record] = await this.registry.getRecordsByName(lrn);
    const applicationRecordId = record.id;
    const applicationRecordData = record.attributes;

    // Create deployment with prod branch and latest commit
    const deploymentData = {
      project,
      branch: project.prodBranch,
      environment: Environment.Production,
      domain: null,
      commitHash: latestCommit.sha,
      commitMessage: latestCommit.commit.message,
    };

    const newDeployment = await this.db.addDeployment({
      project: project,
      branch: deploymentData.branch,
      commitHash: deploymentData.commitHash,
      commitMessage: deploymentData.commitMessage,
      environment: deploymentData.environment,
      status: DeploymentStatus.Building,
      applicationRecordId,
      applicationRecordData,
      domain: deploymentData.domain,
      createdBy: Object.assign(new User(), {
        id: project.ownerId!,
      }),
      deployerLrn: deployer,
    });

    log(
      `Created deployment ${newDeployment.id} and published application record ${applicationRecordId}`,
    );

    const environmentVariables =
      await this.db.getEnvironmentVariablesByProjectId(project!.id!, {
        environment: Environment.Production,
      });

    const environmentVariablesObj = environmentVariables.reduce(
      (acc, env) => {
        acc[env.key] = env.value;

        return acc;
      },
      {} as { [key: string]: string },
    );

    // To set project DNS
    if (deploymentData.environment === Environment.Production) {
      // On deleting deployment later, project DNS deployment is also deleted
      // So publish project DNS deployment first so that ApplicationDeploymentRecord for the same is available when deleting deployment later
      await this.registry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}`,
        auctionId: project.auctionId!,
        lrn: deployer,
      });
    }

    const { applicationDeploymentRequestId, applicationDeploymentRequestData } =
      // Create requests for all the deployers
      await this.registry.createApplicationDeploymentRequest({
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        auctionId: project.auctionId!,
        lrn: deployer,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}-${newDeployment.id}`,
      });

    await this.db.updateDeploymentById(newDeployment.id, {
      applicationDeploymentRequestId,
      applicationDeploymentRequestData,
    });

    return newDeployment;
  }

  async addProjectFromTemplate(
    user: User,
    organizationSlug: string,
    data: AddProjectFromTemplateInput,
    lrn?: string,
    auctionData?: AuctionData
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
      }, lrn, auctionData);

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
    auctionData?: AuctionData
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

    // Create deployment with prod branch and latest commit
    const deploymentData = {
      project,
      branch: project.prodBranch,
      environment: Environment.Production,
      domain: null,
      commitHash: latestCommit.sha,
      commitMessage: latestCommit.commit.message,
    };

    if (auctionData) {
      const { applicationDeploymentAuctionId } = await this.registry.createApplicationDeploymentAuction(repo, octokit, auctionData!, deploymentData);
      await this.updateProject(project.id, { auctionId: applicationDeploymentAuctionId })
    } else {
      await this.createDeployment(user.id, octokit, deploymentData, lrn!);
    }

    await this.createRepoHook(octokit, project);

    console.log('projectid is', project.id);

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

      const deployers = project.deployerLrn;
      if (!deployers) {
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
          },
          deployer
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
      newDeployment = await this.createDeploymentFromAuction(oldDeployment.project, oldDeployment.deployerLrn);
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
        },
        oldDeployment.deployerLrn
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
      },
    });

    if (deployment && deployment.applicationDeploymentRecordId) {
      // If deployment is current, remove deployment for project subdomain as well
      if (deployment.isCurrent) {
        const currentDeploymentURL = `https://${deployment.project.subDomain}`;

        const deploymentRecords =
          await this.registry.getDeploymentRecordsByFilter({
            application: deployment.applicationRecordId,
            url: currentDeploymentURL,
          });

        if (!deploymentRecords.length) {
          log(
            `No ApplicationDeploymentRecord found for URL ${currentDeploymentURL} and ApplicationDeploymentRecord id ${deployment.applicationDeploymentRecordId}`,
          );

          return false;
        }

        await this.registry.createApplicationDeploymentRemovalRequest({
          deploymentId: deploymentRecords[0].id,
        });
      }

      const result =
        await this.registry.createApplicationDeploymentRemovalRequest({
          deploymentId: deployment.applicationDeploymentRecordId,
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

  async getAuctionData(
    auctionId: string
  ): Promise<Auction> {
    const auctions = await this.registry.getAuctionData(auctionId);
    return auctions[0];
  }
}
