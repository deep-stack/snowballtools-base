import assert from 'assert';
import debug from 'debug';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

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

const log = debug('snowball:service');

export class Service {
  private db: Database;
  private app: OAuthApp;
  private registry: Registry;

  constructor (db: Database, app: OAuthApp, registry: Registry) {
    this.db = db;
    this.app = app;
    this.registry = registry;
  }

  async getUser (userId: string): Promise<User | null> {
    return this.db.getUser({
      where: {
        id: userId
      }
    });
  }

  async getOrganizationsByUserId (userId: string): Promise<Organization[]> {
    const dbOrganizations = await this.db.getOrganizationsByUserId(userId);
    return dbOrganizations;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);
    return dbProject;
  }

  async getProjectsInOrganization (userId:string, organizationSlug: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsInOrganization(userId, organizationSlug);
    return dbProjects;
  }

  async getDeployementsByProjectId (projectId: string): Promise<Deployment[]> {
    const dbDeployments = await this.db.getDeploymentsByProjectId(projectId);
    return dbDeployments;
  }

  async getEnvironmentVariablesByProjectId (projectId: string): Promise<EnvironmentVariable[]> {
    const dbEnvironmentVariables = await this.db.getEnvironmentVariablesByProjectId(projectId);
    return dbEnvironmentVariables;
  }

  async getProjectMembersByProjectId (projectId: string): Promise<ProjectMember[]> {
    const dbProjectMembers = await this.db.getProjectMembersByProjectId(projectId);
    return dbProjectMembers;
  }

  async searchProjects (userId: string, searchText: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySearchText(userId, searchText);
    return dbProjects;
  }

  async getDomainsByProjectId (projectId: string, filter?: FindOptionsWhere<Domain>): Promise<Domain[]> {
    const dbDomains = await this.db.getDomainsByProjectId(projectId, filter);
    return dbDomains;
  }

  async updateProjectMember (projectMemberId: string, data: {permissions: Permission[]}): Promise<boolean> {
    return this.db.updateProjectMemberById(projectMemberId, data);
  }

  async addProjectMember (projectId: string,
    data: {
      email: string,
      permissions: Permission[]
    }): Promise<ProjectMember> {
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

  async removeProjectMember (userId: string, projectMemberId: string): Promise<boolean> {
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

  async addEnvironmentVariables (projectId: string, data: { environments: string[], key: string, value: string}[]): Promise<EnvironmentVariable[]> {
    const formattedEnvironmentVariables = data.map((environmentVariable) => {
      return environmentVariable.environments.map((environment) => {
        return ({
          key: environmentVariable.key,
          value: environmentVariable.value,
          environment: environment as Environment,
          project: Object.assign(new Project(), {
            id: projectId
          })
        });
      });
    }).flat();

    const savedEnvironmentVariables = await this.db.addEnvironmentVariables(formattedEnvironmentVariables);
    return savedEnvironmentVariables;
  }

  async updateEnvironmentVariable (environmentVariableId: string, data : DeepPartial<EnvironmentVariable>): Promise<boolean> {
    return this.db.updateEnvironmentVariable(environmentVariableId, data);
  }

  async removeEnvironmentVariable (environmentVariableId: string): Promise<boolean> {
    return this.db.deleteEnvironmentVariable(environmentVariableId);
  }

  async updateDeploymentToProd (userId: string, deploymentId: string): Promise<Deployment> {
    const oldDeployment = await this.db.getDeployment({
      where: { id: deploymentId },
      relations: {
        project: true
      }
    });

    if (!oldDeployment) {
      throw new Error('Deployment does not exist');
    }

    const prodBranchDomains = await this.db.getDomainsByProjectId(oldDeployment.project.id, { branch: oldDeployment.project.prodBranch });

    // TODO: Fix unique constraint error for domain
    const deploymentWithProdBranchDomain = await this.db.getDeployment({
      where: {
        domain: {
          id: prodBranchDomains[0].id
        }
      }
    });

    if (deploymentWithProdBranchDomain) {
      await this.db.updateDeploymentById(deploymentWithProdBranchDomain.id, {
        domain: null,
        isCurrent: false
      });
    }

    const oldCurrentDeployment = await this.db.getDeployment({
      relations: {
        domain: true
      },
      where: {
        project: {
          id: oldDeployment.project.id
        },
        isCurrent: true
      }
    });

    if (oldCurrentDeployment) {
      await this.db.updateDeploymentById(oldCurrentDeployment.id, { isCurrent: false, domain: null });
    }

    const newDeployement = await this.createDeployment(userId,
      {
        project: oldDeployment.project,
        isCurrent: true,
        branch: oldDeployment.branch,
        environment: Environment.Production,
        domain: prodBranchDomains[0],
        commitHash: oldDeployment.commitHash
      });

    return newDeployement;
  }

  async createDeployment (userId: string, data: DeepPartial<Deployment>): Promise<Deployment> {
    const { registryRecordId, registryRecordData } = await this.registry.createApplicationRecord({
      recordName: data.project?.name ?? '',
      appType: data.project?.template ?? ''
    });

    const newDeployement = await this.db.addDeployement({
      project: data.project,
      branch: data.branch,
      commitHash: data.commitHash,
      environment: data.environment,
      isCurrent: data.isCurrent,
      status: DeploymentStatus.Building,
      registryRecordId,
      registryRecordData,
      domain: data.domain,
      createdBy: Object.assign(new User(), {
        id: userId
      })
    });

    log(`Application record ${registryRecordId} published for deployment ${newDeployement.id}`);
    return newDeployement;
  }

  async addProject (userId: string, organizationSlug: string, data: DeepPartial<Project>): Promise<Project | undefined> {
    const organization = await this.db.getOrganization({
      where: {
        slug: organizationSlug
      }
    });
    if (!organization) {
      throw new Error('Organization does not exist');
    }

    const project = await this.db.addProject(userId, organization.id, data);

    // TODO: Get repository details from github
    await this.createDeployment(userId,
      {
        project,
        isCurrent: true,
        branch: project.prodBranch,
        environment: Environment.Production,
        // TODO: Set latest commit hash
        commitHash: '',
        domain: null
      });

    const { registryRecordId, registryRecordData } = await this.registry.createApplicationDeploymentRequest({ appName: project.name });
    await this.db.updateProjectById(project.id, {
      registryRecordId,
      registryRecordData
    });

    return project;
  }

  async updateProject (projectId: string, data: DeepPartial<Project>): Promise<boolean> {
    return this.db.updateProjectById(projectId, data);
  }

  async deleteProject (projectId: string): Promise<boolean> {
    return this.db.deleteProjectById(projectId);
  }

  async deleteDomain (domainId: string): Promise<boolean> {
    const domainsRedirectedFrom = await this.db.getDomains({
      where: {
        redirectToId: domainId
      }
    });

    if (domainsRedirectedFrom.length > 0) {
      throw new Error('Cannot delete domain since it has redirects from other domains');
    }

    return this.db.deleteDomainById(domainId);
  }

  async redeployToProd (userId: string, deploymentId: string): Promise<Deployment> {
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

    await this.db.updateDeploymentById(deploymentId, { domain: null, isCurrent: false });

    const newDeployement = await this.createDeployment(userId,
      {
        project: oldDeployment.project,
        // TODO: Put isCurrent field in project
        branch: oldDeployment.branch,
        isCurrent: true,
        environment: Environment.Production,
        domain: oldDeployment.domain,
        commitHash: oldDeployment.commitHash
      });

    return newDeployement;
  }

  async rollbackDeployment (projectId: string, deploymentId: string): Promise<boolean> {
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
      throw new Error('Current deployement doesnot exist');
    }

    const oldCurrentDeploymentUpdate = await this.db.updateDeploymentById(oldCurrentDeployment.id, { isCurrent: false, domain: null });

    const newCurrentDeploymentUpdate = await this.db.updateDeploymentById(deploymentId, { isCurrent: true, domain: oldCurrentDeployment?.domain });

    return newCurrentDeploymentUpdate && oldCurrentDeploymentUpdate;
  }

  async addDomain (projectId: string, domainDetails: { name: string }): Promise<{
    primaryDomain: Domain,
    redirectedDomain: Domain
  }> {
    const currentProject = await this.db.getProjectById(projectId);

    if (currentProject === null) {
      throw new Error(`Project with ${projectId} not found`);
    }

    const primaryDomainDetails = {
      ...domainDetails,
      branch: currentProject.prodBranch,
      project: currentProject
    };

    const savedPrimaryDomain = await this.db.addDomain(primaryDomainDetails);

    const domainArr = domainDetails.name.split('www.');

    const redirectedDomainDetails = {
      name: domainArr.length > 1 ? domainArr[1] : `www.${domainArr[0]}`,
      branch: currentProject.prodBranch,
      project: currentProject,
      redirectTo: savedPrimaryDomain
    };

    const savedRedirectedDomain = await this.db.addDomain(redirectedDomainDetails);

    return { primaryDomain: savedPrimaryDomain, redirectedDomain: savedRedirectedDomain };
  }

  async updateDomain (domainId: string, domainDetails: DeepPartial<Domain>): Promise<boolean> {
    const domain = await this.db.getDomain({
      where: {
        id: domainId
      }
    });

    if (domain === null) {
      throw new Error(`Error finding domain with id ${domainId}`);
    }

    const newDomain = {
      ...domainDetails
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
    if (domainsRedirectedFrom.length > 0 && domainDetails.branch === domain.branch) {
      throw new Error('Remove all redirects to this domain before updating');
    }

    if (domainDetails.redirectToId) {
      const redirectedDomain = await this.db.getDomain({
        where: {
          id: domainDetails.redirectToId
        }
      });

      if (redirectedDomain === null) {
        throw new Error('Could not find Domain to redirect to');
      }

      if (redirectedDomain.redirectToId) {
        throw new Error('Unable to redirect to the domain because it is already redirecting elsewhere. Redirects cannot be chained.');
      }

      newDomain.redirectTo = redirectedDomain;
    }

    const updateResult = await this.db.updateDomainById(domainId, newDomain);

    return updateResult;
  }

  async authenticateGitHub (code:string, userId: string): Promise<{token: string}> {
    const { authentication: { token } } = await this.app.createToken({
      code
    });

    await this.db.updateUser(userId, { gitHubToken: token });

    return { token };
  }

  async unauthenticateGitHub (userId: string, data: DeepPartial<User>): Promise<boolean> {
    return this.db.updateUser(userId, data);
  }
}
