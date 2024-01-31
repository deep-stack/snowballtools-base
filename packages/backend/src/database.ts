import { DataSource, DeepPartial } from 'typeorm';
import path from 'path';
import debug from 'debug';
import assert from 'assert';

import { DatabaseConfig } from './config';
import { User } from './entity/User';
import { Organization } from './entity/Organization';
import { UserOrganization } from './entity/UserOrganization';
import { Project } from './entity/Project';
import { Deployment, Environment } from './entity/Deployment';
import { ProjectMember } from './entity/ProjectMember';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Domain } from './entity/Domain';

const log = debug('snowball:database');

// TODO: Fix order of methods
export class Database {
  private dataSource: DataSource;

  constructor ({ dbPath }: DatabaseConfig) {
    this.dataSource = new DataSource({
      type: 'better-sqlite3',
      database: dbPath,
      entities: [path.join(__dirname, '/entity/*')],
      synchronize: true,
      logging: false
    });
  }

  async init (): Promise<void> {
    await this.dataSource.initialize();
    log('database initialized');
  }

  async getUser (userId: number): Promise<User | null> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: userId
    });

    return user;
  }

  async updateUser (userId: number, data: DeepPartial<User>): Promise<boolean> {
    const userRepository = this.dataSource.getRepository(User);
    const updateResult = await userRepository.update({ id: Number(userId) }, data);
    assert(updateResult.affected);

    return updateResult.affected > 0;
  }

  async getOrganizationsByUserId (userId: number): Promise<Organization[]> {
    const userOrganizationRepository = this.dataSource.getRepository(UserOrganization);

    const userOrgs = await userOrganizationRepository.find({
      relations: {
        member: true,
        organization: true
      },
      where: {
        member: {
          id: userId
        }
      }
    });

    const organizations = userOrgs.map(userOrg => userOrg.organization);
    return organizations;
  }

  async getProjectsByOrganizationId (organizationId: number): Promise<Project[]> {
    const projectRepository = this.dataSource.getRepository(Project);

    const projects = await projectRepository.find({
      relations: {
        organization: true,
        owner: true
      },
      where: {
        organization: {
          id: organizationId
        }
      }
    });

    return projects;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const projectRepository = this.dataSource.getRepository(Project);

    const project = await projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.deployments', 'deployments', 'deployments.isCurrent = true')
      .leftJoinAndSelect('deployments.domain', 'domain')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('project.id = :projectId', {
        projectId
      })
      .getOne();

    return project;
  }

  async getProjectsInOrganization (userId: string, organizationId: string): Promise<Project[]> {
    const projectRepository = this.dataSource.getRepository(Project);

    const projects = await projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.deployments', 'deployments', 'deployments.isCurrent = true')
      .leftJoinAndSelect('deployments.domain', 'domain')
      .leftJoin('project.projectMembers', 'projectMembers')
      .where('(project.ownerId = :userId OR projectMembers.userId = :userId) AND project.organizationId = :organizationId', {
        userId,
        organizationId
      })
      .getMany();

    return projects;
  }

  async getDeploymentsByProjectId (projectId: string): Promise<Deployment[]> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);

    const deployments = await deploymentRepository.find({
      relations: {
        project: true,
        domain: true,
        createdBy: true
      },
      where: {
        project: {
          id: projectId
        }
      },
      order: {
        createdAt: 'DESC'
      }
    });

    return deployments;
  }

  async getProjectMembersByProjectId (projectId: string): Promise<ProjectMember[]> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);

    const projectMembers = await projectMemberRepository.find({
      relations: {
        project: true,
        member: true
      },
      where: {
        project: {
          id: projectId
        }
      }
    });

    return projectMembers;
  }

  async getEnvironmentVariablesByProjectId (projectId: string): Promise<EnvironmentVariable[]> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);

    const environmentVariables = await environmentVariableRepository.find({
      where: {
        project: {
          id: projectId
        }
      }
    });

    return environmentVariables;
  }

  async removeProjectMemberById (projectMemberId: string): Promise<boolean> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);

    const deleteResult = await projectMemberRepository.delete({ id: Number(projectMemberId) });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async updateProjectMemberById (projectMemberId: string, data: DeepPartial<ProjectMember>): Promise<boolean> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);
    const updateResult = await projectMemberRepository.update({ id: Number(projectMemberId) }, data);

    if (updateResult.affected) {
      return updateResult.affected > 0;
    } else {
      return false;
    }
  }

  async addEnvironmentVariablesByProjectId (projectId: string, environmentVariables: {
    environments: string[];
    key: string;
    value: string;
  }[]): Promise<boolean> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);

    const formattedEnvironmentVariables = environmentVariables.map((environmentVariable) => {
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

    const savedEnvironmentVariables = await environmentVariableRepository.save(formattedEnvironmentVariables);
    return savedEnvironmentVariables.length > 0;
  }

  async updateEnvironmentVariable (environmentVariableId: string, update: DeepPartial<EnvironmentVariable>): Promise<boolean> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);
    const updateResult = await environmentVariableRepository.update({ id: Number(environmentVariableId) }, update);

    if (updateResult.affected) {
      return updateResult.affected > 0;
    } else {
      return false;
    }
  }

  async deleteEnvironmentVariable (environmentVariableId: string): Promise<boolean> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);
    const deleteResult = await environmentVariableRepository.delete({ id: Number(environmentVariableId) });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async getProjectMemberById (projectMemberId: string): Promise<ProjectMember> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);

    const projectMemberWithProject = await projectMemberRepository.find({
      relations: {
        project: {
          owner: true
        },
        member: true
      },
      where: {
        id: Number(projectMemberId)
      }
    }
    );

    if (projectMemberWithProject.length === 0) {
      throw new Error('Member does not exist');
    }

    return projectMemberWithProject[0];
  }

  async getProjectsBySearchText (userId: number, searchText: string): Promise<Project[]> {
    const projectRepository = this.dataSource.getRepository(Project);

    const projects = await projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.organization', 'organization')
      .leftJoin('project.projectMembers', 'projectMembers')
      .where('(project.owner = :userId OR projectMembers.member.id = :userId) AND project.name LIKE :searchText', {
        userId,
        searchText: `%${searchText}%`
      })
      .getMany();

    return projects;
  }

  async updateDeploymentById (deploymentId: string, updates: DeepPartial<Deployment>): Promise<boolean> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const updateResult = await deploymentRepository.update({ id: Number(deploymentId) }, updates);

    if (updateResult.affected) {
      return updateResult.affected > 0;
    } else {
      return false;
    }
  }

  async updateProjectById (projectId: string, updates: DeepPartial<Project>): Promise<boolean> {
    const projectRepository = this.dataSource.getRepository(Project);
    const updateResult = await projectRepository.update({ id: projectId }, updates);

    if (updateResult.affected) {
      return updateResult.affected > 0;
    } else {
      return false;
    }
  }

  async redeployToProdById (userId: string, deploymentId: string): Promise<Deployment> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const deployment = await deploymentRepository.findOne({
      relations: {
        project: true,
        domain: true,
        createdBy: true
      },
      where: {
        id: Number(deploymentId)
      }
    });

    if (deployment === null) {
      throw new Error('Deployment not found');
    }
    const { id, createdAt, updatedAt, ...updatedDeployment } = deployment;

    if (updatedDeployment.environment === Environment.Production) {
      // TODO: Put isCurrent field in project
      updatedDeployment.isCurrent = true;
      updatedDeployment.createdBy = Object.assign(new User(), {
        id: Number(userId)
      });
    }

    await deploymentRepository.update({ id: Number(deploymentId) }, { domain: null, isCurrent: false });

    return deploymentRepository.save(updatedDeployment);
  }

  async deleteProjectById (projectId: string): Promise<boolean> {
    const projectRepository = this.dataSource.getRepository(Project);
    const deleteResult = await projectRepository.softDelete({ id: projectId });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async deleteDomainById (domainId: string): Promise<boolean> {
    const domainRepository = this.dataSource.getRepository(Domain);

    const domainsRedirectedFrom = await domainRepository.find({
      where: {
        redirectToId: Number(domainId)
      }
    });

    if (domainsRedirectedFrom.length > 0) {
      throw new Error('Cannot delete domain since it has redirects from other domains');
    }

    const deleteResult = await domainRepository.softDelete({ id: Number(domainId) });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async rollbackDeploymentById (projectId: string, deploymentId: string): Promise<boolean> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);

    // TODO: Implement transactions
    const oldCurrentDeployment = await deploymentRepository.findOne({
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

    const oldCurrentDeploymentUpdate = await deploymentRepository.update({ project: { id: projectId }, isCurrent: true }, { isCurrent: false, domain: null });

    const newCurrentDeploymentUpdate = await deploymentRepository.update({ id: Number(deploymentId) }, { isCurrent: true, domain: oldCurrentDeployment?.domain });

    if (oldCurrentDeploymentUpdate.affected && newCurrentDeploymentUpdate.affected) {
      return oldCurrentDeploymentUpdate.affected > 0 && newCurrentDeploymentUpdate.affected > 0;
    } else {
      return false;
    }
  }

  async addDomainByProjectId (projectId: string, domainDetails: { name: string }): Promise<Domain[]> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const projectRepository = this.dataSource.getRepository(Project);

    const currentProject = await projectRepository.findOneBy({
      id: projectId
    });

    if (currentProject === null) {
      throw new Error(`Project with ${projectId} not found`);
    }

    const primaryDomainDetails = {
      ...domainDetails,
      branch: currentProject.prodBranch,
      project: currentProject
    };

    const primaryDomain = domainRepository.create(primaryDomainDetails as DeepPartial<Domain>);
    const savedPrimaryDomain = await domainRepository.save(primaryDomain);

    const domainArr = domainDetails.name.split('www.');

    const redirectedDomainDetails = {
      name: domainArr.length > 1 ? domainArr[1] : `www.${domainArr[0]}`,
      branch: currentProject.prodBranch,
      project: currentProject,
      redirectTo: savedPrimaryDomain
    };

    const redirectedDomain = domainRepository.create(redirectedDomainDetails as DeepPartial<Domain>);
    const savedRedirectedDomain = await domainRepository.save(redirectedDomain);

    return [savedPrimaryDomain, savedRedirectedDomain];
  }

  async getDomainsByProjectId (projectId: string): Promise<Domain[]> {
    const domainRepository = this.dataSource.getRepository(Domain);

    const domains = await domainRepository.find({
      relations: {
        redirectTo: true
      },
      where: {
        project: {
          id: projectId
        }
      }
    });

    return domains;
  }

  async updateDomainById (domainId: string, data: DeepPartial<Domain>): Promise<boolean> {
    const domainRepository = this.dataSource.getRepository(Domain);

    const domain = await domainRepository.findOne({
      where: {
        id: Number(domainId)
      }
    });

    const newDomain: DeepPartial<Domain> = {
      ...data
    };

    if (domain === null) {
      throw new Error(`Error finding domain with id ${domainId}`);
    }

    const domainsRedirectedFrom = await domainRepository.find({
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
      const redirectedDomain = await domainRepository.findOne({
        where: {
          id: Number(data.redirectToId)
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

    const updateResult = await domainRepository.update({ id: Number(domainId) }, newDomain);

    if (updateResult.affected) {
      return updateResult.affected > 0;
    } else {
      return false;
    }
  }
}
