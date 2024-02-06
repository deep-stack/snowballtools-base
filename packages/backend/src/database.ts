import { DataSource, DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import path from 'path';
import debug from 'debug';
import assert from 'assert';

import { DatabaseConfig } from './config';
import { User } from './entity/User';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { Deployment } from './entity/Deployment';
import { ProjectMember } from './entity/ProjectMember';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Domain } from './entity/Domain';
import { PROJECT_DOMAIN } from './constants';
import { UserOrganization } from './entity/UserOrganization';

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

  async getUser (options: FindOneOptions<User>): Promise<User | null> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne(options);

    return user;
  }

  async addUser (data: DeepPartial<User>): Promise<User> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.save(data);

    return user;
  }

  async updateUser (userId: string, data: DeepPartial<User>): Promise<boolean> {
    const userRepository = this.dataSource.getRepository(User);
    const updateResult = await userRepository.update({ id: userId }, data);
    assert(updateResult.affected);

    return updateResult.affected > 0;
  }

  async getOrganizationMembers (options: FindManyOptions<UserOrganization>): Promise<UserOrganization[]> {
    const userOrganizationRepository = this.dataSource.getRepository(UserOrganization);
    const userOrganizations = await userOrganizationRepository.find(options);

    return userOrganizations;
  }

  async getOrganizationsByUserId (userId: string): Promise<Organization[]> {
    const organizationRepository = this.dataSource.getRepository(Organization);

    const userOrgs = await organizationRepository.find({
      where: {
        userOrganizations: {
          member: {
            id: userId
          }
        }
      }
    });

    return userOrgs;
  }

  async getProjectsByOrganizationId (organizationId: string): Promise<Project[]> {
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
      .leftJoinAndSelect('deployments.createdBy', 'user')
      .leftJoinAndSelect('deployments.domain', 'domain')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.organization', 'organization')
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

  async getDeployment (options: FindOneOptions<Deployment>): Promise<Deployment | null> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const deployment = await deploymentRepository.findOne(options);

    return deployment;
  }

  async getDomains (options: FindManyOptions<Domain>): Promise<Domain[]> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const domains = await domainRepository.find(options);

    return domains;
  }

  async addDeployement (data: DeepPartial<Deployment>): Promise<Deployment> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const deployment = await deploymentRepository.save(data);

    return deployment;
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

    const deleteResult = await projectMemberRepository.delete({ id: projectMemberId });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async updateProjectMemberById (projectMemberId: string, data: DeepPartial<ProjectMember>): Promise<boolean> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);
    const updateResult = await projectMemberRepository.update({ id: projectMemberId }, data);

    return Boolean(updateResult.affected);
  }

  async addProjectMembers (data: DeepPartial<ProjectMember>[]): Promise<ProjectMember[]> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);
    const newProjectMembers = await projectMemberRepository.save(data);

    return newProjectMembers;
  }

  async addEnvironmentVariables (data: DeepPartial<EnvironmentVariable>[]): Promise<EnvironmentVariable[]> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);
    const savedEnvironmentVariables = await environmentVariableRepository.save(data);

    return savedEnvironmentVariables;
  }

  async updateEnvironmentVariable (environmentVariableId: string, update: DeepPartial<EnvironmentVariable>): Promise<boolean> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);
    const updateResult = await environmentVariableRepository.update({ id: environmentVariableId }, update);

    return Boolean(updateResult.affected);
  }

  async deleteEnvironmentVariable (environmentVariableId: string): Promise<boolean> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);
    const deleteResult = await environmentVariableRepository.delete({ id: environmentVariableId });

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
        id: projectMemberId
      }
    }
    );

    if (projectMemberWithProject.length === 0) {
      throw new Error('Member does not exist');
    }

    return projectMemberWithProject[0];
  }

  async getProjectsBySearchText (userId: string, searchText: string): Promise<Project[]> {
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
    const updateResult = await deploymentRepository.update({ id: deploymentId }, updates);

    return Boolean(updateResult.affected);
  }

  async addProject (userId: string, projectDetails: DeepPartial<Project>): Promise<Project> {
    const projectRepository = this.dataSource.getRepository(Project);

    // TODO: Check if organization exists
    const newProject = projectRepository.create(projectDetails);
    // TODO: Set default empty array for webhooks in TypeORM
    newProject.webhooks = [];
    // TODO: Set icon according to framework
    newProject.icon = '';

    newProject.owner = Object.assign(new User(), {
      id: userId
    });

    newProject.organization = Object.assign(new Organization(), {
      id: projectDetails.organizationId
    });

    newProject.subDomain = `${newProject.name}.${PROJECT_DOMAIN}`;

    return projectRepository.save(newProject);
  }

  async updateProjectById (projectId: string, updates: DeepPartial<Project>): Promise<boolean> {
    const projectRepository = this.dataSource.getRepository(Project);
    const updateResult = await projectRepository.update({ id: projectId }, updates);

    return Boolean(updateResult.affected);
  }

  async deleteProjectById (projectId: string): Promise<boolean> {
    const projectRepository = this.dataSource.getRepository(Project);
    const project = await projectRepository.findOneOrFail({
      where: {
        id: projectId
      },
      relations: {
        projectMembers: true
      }
    });

    const deleteResult = await projectRepository.softRemove(project);

    return Boolean(deleteResult);
  }

  async deleteDomainById (domainId: string): Promise<boolean> {
    const domainRepository = this.dataSource.getRepository(Domain);

    const deleteResult = await domainRepository.softDelete({ id: domainId });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async addDomain (data: DeepPartial<Domain>): Promise<Domain> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const newDomain = await domainRepository.save(data);

    return newDomain;
  }

  async getDomain (options: FindOneOptions<Domain>): Promise<Domain | null> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const domain = await domainRepository.findOne(options);

    return domain;
  }

  async updateDomainById (domainId: string, updates: DeepPartial<Domain>): Promise<boolean> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const updateResult = await domainRepository.update({ id: domainId }, updates);

    return Boolean(updateResult.affected);
  }

  async getDomainsByProjectId (projectId: string, filter?: FindOptionsWhere<Domain>): Promise<Domain[]> {
    const domainRepository = this.dataSource.getRepository(Domain);

    const domains = await domainRepository.find({
      relations: {
        redirectTo: true
      },
      where: {
        project: {
          id: projectId
        },
        ...filter
      }
    });

    return domains;
  }
}
