import debug from 'debug';
import { customAlphabet } from 'nanoid';
import { lowercase, numbers } from 'nanoid-dictionary';

import { Database } from './database';
import { Deployment, Environment } from './entity/Deployment';
import { Domain } from './entity/Domain';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { Permission, ProjectMember } from './entity/ProjectMember';
import { User } from './entity/User';
import { DeepPartial } from 'typeorm';

const log = debug('snowball:service');

const nanoid = customAlphabet(lowercase + numbers, 8);

export class Service {
  private db: Database;

  constructor (db: Database) {
    this.db = db;
  }

  async getUser (userId: number): Promise<User | null> {
    return this.db.getUser({
      where: {
        id: userId
      }
    });
  }

  async getOrganizationsByUserId (userId: number): Promise<Organization[]> {
    const dbOrganizations = await this.db.getOrganizationsByUserId(userId);
    return dbOrganizations;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);
    return dbProject;
  }

  async getProjectsInOrganization (userId:string, organizationId: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsInOrganization(userId, organizationId);
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

  async searchProjects (userId:string, searchText: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySearchText(Number(userId), searchText);
    return dbProjects;
  }

  async getDomainsByProjectId (projectId: string): Promise<Domain[]> {
    const dbDomains = await this.db.getDomainsByProjectId(projectId);
    return dbDomains;
  }

  async updateProjectMember (projectMemberId: string, data: {permissions: Permission[]}): Promise<boolean> {
    try {
      return await this.db.updateProjectMemberById(projectMemberId, data);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async addProjectMember (projectId: string,
    data: {
      email: string,
      permissions: Permission[]
    }): Promise<boolean> {
    try {
      // TODO: Send invitation
      let user = await this.db.getUser({
        where: {
          email: data.email
        }
      });

      if (!user) {
        user = await this.db.createUser({
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

      return Boolean(newProjectMember);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async addEnvironmentVariables (projectId: string, data: { environments: string[], key: string, value: string}[]): Promise<boolean> {
    try {
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
      return savedEnvironmentVariables.length > 0;
    } catch (err) {
      log(err);
      return false;
    }
  }

  async updateEnvironmentVariable (environmentVariableId: string, data : DeepPartial<EnvironmentVariable>): Promise<boolean> {
    try {
      return await this.db.updateEnvironmentVariable(environmentVariableId, data);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async removeEnvironmentVariable (environmentVariableId: string): Promise<boolean> {
    try {
      return await this.db.deleteEnvironmentVariable(environmentVariableId);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async updateDeploymentToProd (deploymentId: string): Promise<boolean> {
    try {
      return await this.db.updateDeploymentById(deploymentId, {
        environment: Environment.Production
      });
    } catch (err) {
      log(err);
      return false;
    }
  }

  async addProject (userId: string, data: DeepPartial<Project>): Promise<boolean> {
    try {
      await this.db.addProject(userId, data);
      return true;
    } catch (err) {
      log(err);
      return false;
    }
  }

  async updateProject (projectId: string, data: DeepPartial<Project>): Promise<boolean> {
    try {
      return await this.db.updateProjectById(projectId, data);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async deleteProject (projectId: string): Promise<boolean> {
    try {
      return await this.db.deleteProjectById(projectId);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async deleteDomain (domainId: string): Promise<boolean> {
    try {
      const domainsRedirectedFrom = await this.db.getDomains({
        where: {
          redirectToId: Number(domainId)
        }
      });

      if (domainsRedirectedFrom.length > 0) {
        throw new Error('Cannot delete domain since it has redirects from other domains');
      }

      return await this.db.deleteDomainById(domainId);
    } catch (err) {
      log(err);
      return false;
    }
  }

  async redeployToProd (userId: string, deploymentId: string): Promise<Deployment| boolean> {
    try {
      const deployment = await this.db.getDeployment({
        relations: {
          project: true,
          domain: true,
          createdBy: true
        },
        where: {
          id: deploymentId
        }
      });

      if (deployment === null) {
        throw new Error('Deployment not found');
      }

      const { createdAt, updatedAt, ...updatedDeployment } = deployment;

      if (updatedDeployment.environment === Environment.Production) {
        // TODO: Put isCurrent field in project
        updatedDeployment.isCurrent = true;
        updatedDeployment.createdBy = Object.assign(new User(), {
          id: Number(userId)
        });
      }

      updatedDeployment.id = nanoid();
      updatedDeployment.url = `${updatedDeployment.id}-${updatedDeployment.project.subDomain}`;

      const oldDeployment = await this.db.updateDeploymentById(deploymentId, { domain: null, isCurrent: false });
      const newDeployement = await this.db.createDeployement(updatedDeployment);

      return oldDeployment && Boolean(newDeployement);
    } catch (err) {
      log(err);
      return false;
    }
  }
}
