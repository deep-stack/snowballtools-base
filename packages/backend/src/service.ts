import assert from 'assert';
import debug from 'debug';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { Octokit, RequestError } from 'octokit';
import fetch from 'node-fetch';

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
import { GitConfig, RegistryConfig, ServerConfig } from './config';
import { AppDeploymentRecord, GitPushEventPayload, GitType, PackageJSON } from './types';
import { Role } from './entity/UserOrganization';

const log = debug('snowball:service');

const GITHUB_UNIQUE_WEBHOOK_ERROR = 'Hook already exists on this repository';

const GITEA_ORIGIN = 'https://gitea.com';
const GITEA_ACCESS_TOKEN_ENDPOINT = `${GITEA_ORIGIN}/login/oauth/access_token`;

interface Config {
  gitHub: GitConfig
  gitea: GitConfig
  registry: RegistryConfig
  server: ServerConfig
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
    }, this.config.registry.fetchDeploymentRecordDelay);
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

  async loadOrCreateUser (ethAddress: string): Promise<User> {
    // Get user by ETH address
    let user = await this.db.getUser({
      where: {
        ethAddress
      }
    });

    if (!user) {
      const [org] = await this.db.getOrganizations({});
      assert(org, 'No organizations exists in database');

      // Create user with new address
      user = await this.db.addUser({
        email: `${ethAddress}@example.com`,
        name: ethAddress,
        isVerified: true,
        ethAddress
      });

      await this.db.addUserOrganization({
        member: user,
        organization: org,
        role: Role.Owner
      });
    }

    return user;
  }

  async getOctokit (userId: string): Promise<Octokit> {
    const user = await this.db.getUser({ where: { id: userId } });
    assert(
      user && user.gitHubToken,
      'User needs to be authenticated with GitHub token'
    );

    return new Octokit({ auth: user.gitHubToken });
  }

  async getOrganizationsByUserId (user: User): Promise<Organization[]> {
    const dbOrganizations = await this.db.getOrganizationsByUserId(user.id);
    return dbOrganizations;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);
    return dbProject;
  }

  async getProjectsInOrganization (user: User, organizationSlug: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsInOrganization(user.id, organizationSlug);
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

  async searchProjects (user: User, searchText: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySearchText(user.id, searchText);
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

  async removeProjectMember (user: User, projectMemberId: string): Promise<boolean> {
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

  async updateDeploymentToProd (user: User, deploymentId: string): Promise<Deployment> {
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

    const octokit = await this.getOctokit(user.id);

    const newDeployment = await this.createDeployment(user.id,
      octokit,
      {
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
    data: DeepPartial<Deployment>
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

    const repoUrl = (await octokit.rest.repos.get({
      owner,
      repo
    })).data.html_url;

    // TODO: Set environment variables for each deployment (environment variables can`t be set in application record)
    const { applicationRecordId, applicationRecordData } =
      await this.registry.createApplicationRecord({
        appName: repo,
        packageJSON,
        appType: data.project!.template!,
        commitHash: data.commitHash!,
        repoUrl
      });

    // Update previous deployment with prod branch domain
    // TODO: Fix unique constraint error for domain
    if (data.domain) {
      await this.db.updateDeployment({
        domainId: data.domain.id
      }, {
        domain: null
      });
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
        id: userId
      })
    });

    log(`Created deployment ${newDeployment.id} and published application record ${applicationRecordId}`);

    const environmentVariables = await this.db.getEnvironmentVariablesByProjectId(data.project.id!, { environment: Environment.Production });

    const environmentVariablesObj = environmentVariables.reduce((acc, env) => {
      acc[env.key] = env.value;

      return acc;
    }, {} as { [key: string]: string });

    const { applicationDeploymentRequestId, applicationDeploymentRequestData } = await this.registry.createApplicationDeploymentRequest(
      {
        deployment: newDeployment,
        appName: repo,
        repository: repoUrl,
        environmentVariables: environmentVariablesObj,
        dns: `${newDeployment.project.name}-${newDeployment.id}`
      });

    // To set project DNS
    if (data.environment === Environment.Production) {
      await this.registry.createApplicationDeploymentRequest(
        {
          deployment: newDeployment,
          appName: repo,
          repository: repoUrl,
          environmentVariables: environmentVariablesObj,
          dns: `${newDeployment.project.name}`
        });
    }

    await this.db.updateDeploymentById(newDeployment.id, { applicationDeploymentRequestId, applicationDeploymentRequestData });

    return newDeployment;
  }

  async addProject (user: User, organizationSlug: string, data: DeepPartial<Project>): Promise<Project | undefined> {
    const organization = await this.db.getOrganization({
      where: {
        slug: organizationSlug
      }
    });
    if (!organization) {
      throw new Error('Organization does not exist');
    }

    const project = await this.db.addProject(user, organization.id, data);

    const octokit = await this.getOctokit(user.id);
    const [owner, repo] = project.repository.split('/');

    const {
      data: [latestCommit]
    } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: project.prodBranch,
      per_page: 1
    });

    // Create deployment with prod branch and latest commit
    await this.createDeployment(user.id,
      octokit,
      {
        project,
        branch: project.prodBranch,
        environment: Environment.Production,
        domain: null,
        commitHash: latestCommit.sha,
        commitMessage: latestCommit.commit.message
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
          url: new URL('api/github/webhook', this.config.gitHub.webhookUrl).href,
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
    const { repository, ref, head_commit: headCommit, deleted } = data;

    if (deleted) {
      log(`Branch ${ref} deleted for project ${repository.full_name}`);
      return;
    }

    log(`Handling GitHub push event from repository: ${repository.full_name}, branch: ${ref}`);
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

  async redeployToProd (user: User, deploymentId: string): Promise<Deployment> {
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

    const octokit = await this.getOctokit(user.id);

    const newDeployment = await this.createDeployment(user.id,
      octokit,
      {
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

  async authenticateGitHub (code:string, user: User): Promise<{token: string}> {
    const { authentication: { token } } = await this.oauthApp.createToken({
      code
    });

    await this.db.updateUser(user, { gitHubToken: token });

    return { token };
  }

  async authenticateGit (type: GitType, code:string, user: User): Promise<{token: string}> {
    let token: string;

    switch (type) {
      case GitType.GitHub:
        ({ authentication: { token } } = await this.oauthApp.createToken({
          code
        }));

        await this.db.updateUser(user, { gitHubToken: token });
        break;

      case GitType.Gitea: {
        const response = await fetch(GITEA_ACCESS_TOKEN_ENDPOINT, {
          method: 'post',
          body: JSON.stringify({
            client_id: this.config.gitea.oAuth.clientId,
            client_secret: this.config.gitea.oAuth.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${this.config.server.appOriginUrl}/organization/projects/create`
          }),
          headers: { 'Content-Type': 'application/json' }
        });

        assert(response.ok, `HTTP Error Response: ${response.status} ${response.statusText}`);
        const data: any = await response.json();
        ({ access_token: token } = data);

        await this.db.updateUser(user, { giteaToken: token });
        break;
      }

      default: throw new Error(`Type ${type} not handled for Git authentication`);
    }

    assert(token, `Access token is not set for type ${type}`);
    return { token };
  }

  async unauthenticateGitHub (user: User, data: DeepPartial<User>): Promise<boolean> {
    return this.db.updateUser(user, data);
  }
}
