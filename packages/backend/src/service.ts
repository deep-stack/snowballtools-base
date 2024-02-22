import assert from 'assert';
import debug from 'debug';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
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
import { AppDeploymentRecord, GitPushEventPayload, PackageJSON } from './types';

const log = debug('snowball:service');

const GITHUB_UNIQUE_WEBHOOK_ERROR = 'Hook already exists on this repository';

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

  constructor (config: Config, db: Database, app: OAuthApp, registry: Registry) {
    this.db = db;
    this.oauthApp = app;
    this.registry = registry;
    this.config = config;
    this.init();
  }

  /**
   * Initialize services
   */
  init (): void {
    // Start check for ApplicationDeploymentRecords asynchronously
    this.checkDeployRecordsAndUpdate();
  }

  /**
   * Destroy services
   */
  destroy (): void {
    clearTimeout(this.deployRecordCheckTimeout);
  }

  /**
   * Checks for ApplicationDeploymentRecord and update corresponding deployments
   * Continues check in loop after a delay of DEPLOY_RECORD_CHECK_DELAY_MS
   */
  async checkDeployRecordsAndUpdate (): Promise<void> {
    // Fetch deployments in building state
    const deployments = await this.db.getDeployments({
      where: {
        status: DeploymentStatus.Building
        // TODO: Fetch and check records for recent deployments
      }
    });

    if (deployments.length) {
      log(
        `Found ${deployments.length} deployments in ${DeploymentStatus.Building} state`
      );

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
   * Update deployments with ApplicationDeploymentRecord data
   */
  async updateDeploymentsWithRecordData (
    records: AppDeploymentRecord[]
  ): Promise<void> {
    // Get deployments for ApplicationDeploymentRecords
    const deployments = await this.db.getDeployments({
      where: records.map((record) => ({
        applicationRecordId: record.attributes.application
      })),
      order: {
        createdAt: 'DESC'
      }
    });

    // Get project IDs of deployments that are in production environment
    const productionDeploymentProjectIds = deployments.reduce(
      (acc, deployment): Set<string> => {
        if (deployment.environment === Environment.Production) {
          acc.add(deployment.projectId);
        }

        return acc;
      },
      new Set<string>()
    );

    // Set old deployments isCurrent to false
    await this.db.updateDeploymentsByProjectIds(
      Array.from(productionDeploymentProjectIds),
      { isCurrent: false }
    );

    const recordToDeploymentsMap = deployments.reduce(
      (acc: { [key: string]: Deployment }, deployment) => {
        acc[deployment.applicationRecordId] = deployment;
        return acc;
      },
      {}
    );

    // Update deployment data for ApplicationDeploymentRecords
    const deploymentUpdatePromises = records.map(async (record) => {
      const deployment = recordToDeploymentsMap[record.attributes.application];

      await this.db.updateDeploymentById(deployment.id, {
        applicationDeploymentRecordId: record.id,
        applicationDeploymentRecordData: record.attributes,
        url: record.attributes.url,
        status: DeploymentStatus.Ready,
        isCurrent: deployment.environment === Environment.Production
      });

      log(
        `Updated deployment ${deployment.id} with URL ${record.attributes.url}`
      );
    });

    await Promise.all(deploymentUpdatePromises);
  }

  async getUser (userId: string): Promise<User | null> {
    return this.db.getUser({
      where: {
        id: userId
      }
    });
  }

  async getOctokit (userId: string): Promise<Octokit> {
    const user = await this.db.getUser({ where: { id: userId } });
    assert(
      user && user.gitHubToken,
      'User needs to be authenticated with GitHub token'
    );

    return new Octokit({ auth: user.gitHubToken });
  }

  async getOrganizationsByUserId (userId: string): Promise<Organization[]> {
    const dbOrganizations = await this.db.getOrganizationsByUserId(userId);
    return dbOrganizations;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);
    return dbProject;
  }

  async getProjectsInOrganization (
    userId: string,
    organizationSlug: string
  ): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsInOrganization(
      userId,
      organizationSlug
    );
    return dbProjects;
  }

  async getDeploymentsByProjectId (projectId: string): Promise<Deployment[]> {
    const dbDeployments = await this.db.getDeploymentsByProjectId(projectId);
    return dbDeployments;
  }

  async getEnvironmentVariablesByProjectId (
    projectId: string
  ): Promise<EnvironmentVariable[]> {
    const dbEnvironmentVariables =
      await this.db.getEnvironmentVariablesByProjectId(projectId);
    return dbEnvironmentVariables;
  }

  async getProjectMembersByProjectId (
    projectId: string
  ): Promise<ProjectMember[]> {
    const dbProjectMembers =
      await this.db.getProjectMembersByProjectId(projectId);
    return dbProjectMembers;
  }

  async searchProjects (userId: string, searchText: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySearchText(
      userId,
      searchText
    );
    return dbProjects;
  }

  async getDomainsByProjectId (
    projectId: string,
    filter?: FindOptionsWhere<Domain>
  ): Promise<Domain[]> {
    const dbDomains = await this.db.getDomainsByProjectId(projectId, filter);
    return dbDomains;
  }

  async updateProjectMember (
    projectMemberId: string,
    data: { permissions: Permission[] }
  ): Promise<boolean> {
    return this.db.updateProjectMemberById(projectMemberId, data);
  }

  async addProjectMember (
    projectId: string,
    data: {
      email: string;
      permissions: Permission[];
    }
  ): Promise<ProjectMember> {
    // TODO: Send invitation
    let user = await this.db.getUser({
      where: {
        email: data.email
      }
    });

    if (!user) {
      user = await this.db.addUser({
        email: data.email
      });
    }

    const newProjectMember = await this.db.addProjectMember({
      project: {
        id: projectId
      },
      permissions: data.permissions,
      isPending: true,
      member: {
        id: user.id
      }
    });

    return newProjectMember;
  }

  async removeProjectMember (
    userId: string,
    projectMemberId: string
  ): Promise<boolean> {
    const member = await this.db.getProjectMemberById(projectMemberId);

    if (String(member.member.id) === userId) {
      throw new Error('Invalid operation: cannot remove self');
    }

    const memberProject = member.project;
    assert(memberProject);

    if (String(userId) === String(memberProject.owner.id)) {
      return this.db.removeProjectMemberById(projectMemberId);
    } else {
      throw new Error('Invalid operation: not authorized');
    }
  }

  async addEnvironmentVariables (
    projectId: string,
    data: { environments: string[]; key: string; value: string }[]
  ): Promise<EnvironmentVariable[]> {
    const formattedEnvironmentVariables = data
      .map((environmentVariable) => {
        return environmentVariable.environments.map((environment) => {
          return {
            key: environmentVariable.key,
            value: environmentVariable.value,
            environment: environment as Environment,
            project: Object.assign(new Project(), {
              id: projectId
            })
          };
        });
      })
      .flat();

    const savedEnvironmentVariables = await this.db.addEnvironmentVariables(
      formattedEnvironmentVariables
    );
    return savedEnvironmentVariables;
  }

  async updateEnvironmentVariable (
    environmentVariableId: string,
    data: DeepPartial<EnvironmentVariable>
  ): Promise<boolean> {
    return this.db.updateEnvironmentVariable(environmentVariableId, data);
  }

  async removeEnvironmentVariable (
    environmentVariableId: string
  ): Promise<boolean> {
    return this.db.deleteEnvironmentVariable(environmentVariableId);
  }

  async updateDeploymentToProd (
    userId: string,
    deploymentId: string
  ): Promise<Deployment> {
    const oldDeployment = await this.db.getDeployment({
      where: { id: deploymentId },
      relations: {
        project: true
      }
    });

    if (!oldDeployment) {
      throw new Error('Deployment does not exist');
    }

    const prodBranchDomains = await this.db.getDomainsByProjectId(
      oldDeployment.project.id,
      { branch: oldDeployment.project.prodBranch }
    );

    const octokit = await this.getOctokit(userId);

    const newDeployment = await this.createDeployment(userId, octokit, {
      project: oldDeployment.project,
      branch: oldDeployment.branch,
      environment: Environment.Production,
      domain: prodBranchDomains[0],
      commitHash: oldDeployment.commitHash,
      commitMessage: oldDeployment.commitMessage
    });

    return newDeployment;
  }

  async createDeployment (
    userId: string,
    octokit: Octokit,
    data: DeepPartial<Deployment>,
    recordData: { repoUrl?: string } = {}
  ): Promise<Deployment> {
    assert(data.project?.repository, 'Project repository not found');
    log(
      `Creating deployment in project ${data.project.name} from branch ${data.branch}`
    );
    const [owner, repo] = data.project.repository.split('/');

    const { data: packageJSONData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
      ref: data.commitHash
    });

    if (!packageJSONData) {
      throw new Error('Package.json file not found');
    }

    assert(!Array.isArray(packageJSONData) && packageJSONData.type === 'file');
    const packageJSON: PackageJSON = JSON.parse(atob(packageJSONData.content));

    assert(packageJSON.name, "name field doesn't exist in package.json");

    if (!recordData.repoUrl) {
      const { data: repoDetails } = await octokit.rest.repos.get({
        owner,
        repo
      });
      recordData.repoUrl = repoDetails.html_url;
    }

    // TODO: Set environment variables for each deployment (environment variables can`t be set in application record)
    const { applicationRecordId, applicationRecordData } =
      await this.registry.createApplicationRecord({
        appName: repo,
        packageJSON,
        appType: data.project!.template!,
        commitHash: data.commitHash!,
        repoUrl: recordData.repoUrl
      });

    const environmentVariables =
      await this.db.getEnvironmentVariablesByProjectId(data.project.id!, {
        environment: Environment.Production
      });

    const environmentVariablesObj = environmentVariables.reduce(
      (acc, env) => {
        acc[env.key] = env.value;

        return acc;
      },
      {} as { [key: string]: string }
    );

    const { applicationDeploymentRequestId, applicationDeploymentRequestData } =
      await this.registry.createApplicationDeploymentRequest({
        appName: repo,
        packageJsonName: packageJSON.name,
        commitHash: data.commitHash!,
        repository: recordData.repoUrl,
        environmentVariables: environmentVariablesObj
      });

    // Update previous deployment with prod branch domain
    // TODO: Fix unique constraint error for domain
    await this.db.updateDeployment(
      {
        domainId: data.domain?.id
      },
      {
        domain: null
      }
    );

    const newDeployment = await this.db.addDeployment({
      project: data.project,
      branch: data.branch,
      commitHash: data.commitHash,
      commitMessage: data.commitMessage,
      environment: data.environment,
      status: DeploymentStatus.Building,
      applicationRecordId,
      applicationRecordData,
      applicationDeploymentRequestId,
      applicationDeploymentRequestData,
      domain: data.domain,
      createdBy: Object.assign(new User(), {
        id: userId
      })
    });

    log(
      `Created deployment ${newDeployment.id} and published application record ${applicationRecordId}`
    );
    return newDeployment;
  }

  async addProject (
    userId: string,
    organizationSlug: string,
    data: DeepPartial<Project>
  ): Promise<Project | undefined> {
    const organization = await this.db.getOrganization({
      where: {
        slug: organizationSlug
      }
    });
    if (!organization) {
      throw new Error('Organization does not exist');
    }

    const project = await this.db.addProject(userId, organization.id, data);

    const octokit = await this.getOctokit(userId);
    const [owner, repo] = project.repository.split('/');

    const {
      data: [latestCommit]
    } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: project.prodBranch,
      per_page: 1
    });

    const { data: repoDetails } = await octokit.rest.repos.get({ owner, repo });

    // Create deployment with prod branch and latest commit
    await this.createDeployment(
      userId,
      octokit,
      {
        project,
        branch: project.prodBranch,
        environment: Environment.Production,
        domain: null,
        commitHash: latestCommit.sha,
        commitMessage: latestCommit.commit.message
      },
      {
        repoUrl: repoDetails.html_url
      }
    );

    await this.createRepoHook(octokit, project);

    return project;
  }

  async createRepoHook (octokit: Octokit, project: Project): Promise<void> {
    try {
      const [owner, repo] = project.repository.split('/');
      await octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: new URL(
            'api/github/webhook',
            this.config.gitHubConfig.webhookUrl
          ).href,
          content_type: 'json'
        },
        events: ['push']
      });
    } catch (err) {
      // https://docs.github.com/en/rest/repos/webhooks?apiVersion=2022-11-28#create-a-repository-webhook--status-codes
      if (
        !(
          err instanceof RequestError &&
          err.status === 422 &&
          (err.response?.data as any).errors.some(
            (err: any) => err.message === GITHUB_UNIQUE_WEBHOOK_ERROR
          )
        )
      ) {
        throw err;
      }

      log(GITHUB_UNIQUE_WEBHOOK_ERROR);
    }
  }

  async handleGitHubPush (data: GitPushEventPayload): Promise<void> {
    const { repository, ref, head_commit: headCommit } = data;
    log(`Handling GitHub push event from repository: ${repository.full_name}`);
    const projects = await this.db.getProjects({
      where: { repository: repository.full_name }
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
        branch
      });

      // Create deployment with branch and latest commit in GitHub data
      await this.createDeployment(project.ownerId, octokit, {
        project,
        branch,
        environment:
          project.prodBranch === branch
            ? Environment.Production
            : Environment.Preview,
        domain,
        commitHash: headCommit.id,
        commitMessage: headCommit.message
      });
    }
  }

  async updateProject (
    projectId: string,
    data: DeepPartial<Project>
  ): Promise<boolean> {
    return this.db.updateProjectById(projectId, data);
  }

  async deleteProject (projectId: string): Promise<boolean> {
    // TODO: Remove GitHub repo hook
    return this.db.deleteProjectById(projectId);
  }

  async deleteDomain (domainId: string): Promise<boolean> {
    const domainsRedirectedFrom = await this.db.getDomains({
      where: {
        redirectToId: domainId
      }
    });

    if (domainsRedirectedFrom.length > 0) {
      throw new Error(
        'Cannot delete domain since it has redirects from other domains'
      );
    }

    return this.db.deleteDomainById(domainId);
  }

  async redeployToProd (
    userId: string,
    deploymentId: string
  ): Promise<Deployment> {
    const oldDeployment = await this.db.getDeployment({
      relations: {
        project: true,
        domain: true,
        createdBy: true
      },
      where: {
        id: deploymentId
      }
    });

    if (oldDeployment === null) {
      throw new Error('Deployment not found');
    }

    const octokit = await this.getOctokit(userId);

    const newDeployment = await this.createDeployment(userId, octokit, {
      project: oldDeployment.project,
      // TODO: Put isCurrent field in project
      branch: oldDeployment.branch,
      environment: Environment.Production,
      domain: oldDeployment.domain,
      commitHash: oldDeployment.commitHash,
      commitMessage: oldDeployment.commitMessage
    });

    return newDeployment;
  }

  async rollbackDeployment (
    projectId: string,
    deploymentId: string
  ): Promise<boolean> {
    // TODO: Implement transactions
    const oldCurrentDeployment = await this.db.getDeployment({
      relations: {
        domain: true
      },
      where: {
        project: {
          id: projectId
        },
        isCurrent: true
      }
    });

    if (!oldCurrentDeployment) {
      throw new Error('Current deployment doesnot exist');
    }

    const oldCurrentDeploymentUpdate = await this.db.updateDeploymentById(
      oldCurrentDeployment.id,
      { isCurrent: false, domain: null }
    );

    const newCurrentDeploymentUpdate = await this.db.updateDeploymentById(
      deploymentId,
      { isCurrent: true, domain: oldCurrentDeployment?.domain }
    );

    return newCurrentDeploymentUpdate && oldCurrentDeploymentUpdate;
  }

  async addDomain (
    projectId: string,
    data: { name: string }
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
      project: currentProject
    };

    const savedPrimaryDomain = await this.db.addDomain(primaryDomainDetails);

    const domainArr = data.name.split('www.');

    const redirectedDomainDetails = {
      name: domainArr.length > 1 ? domainArr[1] : `www.${domainArr[0]}`,
      branch: currentProject.prodBranch,
      project: currentProject,
      redirectTo: savedPrimaryDomain
    };

    const savedRedirectedDomain = await this.db.addDomain(
      redirectedDomainDetails
    );

    return {
      primaryDomain: savedPrimaryDomain,
      redirectedDomain: savedRedirectedDomain
    };
  }

  async updateDomain (
    domainId: string,
    data: DeepPartial<Domain>
  ): Promise<boolean> {
    const domain = await this.db.getDomain({
      where: {
        id: domainId
      }
    });

    if (domain === null) {
      throw new Error(`Error finding domain with id ${domainId}`);
    }

    const newDomain = {
      ...data
    };

    const domainsRedirectedFrom = await this.db.getDomains({
      where: {
        project: {
          id: domain.projectId
        },
        redirectToId: domain.id
      }
    });

    // If there are domains redirecting to current domain, only branch of current domain can be updated
    if (domainsRedirectedFrom.length > 0 && data.branch === domain.branch) {
      throw new Error('Remove all redirects to this domain before updating');
    }

    if (data.redirectToId) {
      const redirectedDomain = await this.db.getDomain({
        where: {
          id: data.redirectToId
        }
      });

      if (redirectedDomain === null) {
        throw new Error('Could not find Domain to redirect to');
      }

      if (redirectedDomain.redirectToId) {
        throw new Error(
          'Unable to redirect to the domain because it is already redirecting elsewhere. Redirects cannot be chained.'
        );
      }

      newDomain.redirectTo = redirectedDomain;
    }

    const updateResult = await this.db.updateDomainById(domainId, newDomain);

    return updateResult;
  }

  async authenticateGitHub (
    code: string,
    userId: string
  ): Promise<{ token: string }> {
    const {
      authentication: { token }
    } = await this.oauthApp.createToken({
      code
    });

    await this.db.updateUser(userId, { gitHubToken: token });

    return { token };
  }

  async unauthenticateGitHub (
    userId: string,
    data: DeepPartial<User>
  ): Promise<boolean> {
    return this.db.updateUser(userId, data);
  }
}
