import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere
} from 'typeorm';
import path from 'path';
import debug from 'debug';
import assert from 'assert';
import { customAlphabet } from 'nanoid';
import { lowercase, numbers } from 'nanoid-dictionary';

import { DatabaseConfig, MiscConfig } from './config';
import { User } from './entity/User';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { Deployment } from './entity/Deployment';
import { ProjectMember } from './entity/ProjectMember';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Domain } from './entity/Domain';
import { getEntities, loadAndSaveData } from './utils';
import { UserOrganization } from './entity/UserOrganization';

const ORGANIZATION_DATA_PATH = '../test/fixtures/organizations.json';

const log = debug('snowball:database');

const nanoid = customAlphabet(lowercase + numbers, 8);

// TODO: Fix order of methods
export class Database {
  private dataSource: DataSource;
  private projectDomain: string;

  constructor ({ dbPath } : DatabaseConfig, { projectDomain } : MiscConfig) {
    this.dataSource = new DataSource({
      type: 'better-sqlite3',
      database: dbPath,
      entities: [path.join(__dirname, '/entity/*')],
      synchronize: true,
      logging: false
    });

    this.projectDomain = projectDomain;
  }

  async init (): Promise<void> {
    await this.dataSource.initialize();
    log('database initialized');

    const organizations = await this.getOrganizations({});

    // Load an organization if none exist
    if (!organizations.length) {
      const orgEntities = await getEntities(path.resolve(__dirname, ORGANIZATION_DATA_PATH));
      await loadAndSaveData(Organization, this.dataSource, [orgEntities[0]]);
    }
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

  async updateUser (user: User, data: DeepPartial<User>): Promise<boolean> {
    const userRepository = this.dataSource.getRepository(User);
    const updateResult = await userRepository.update({ id: user.id }, data);
    assert(updateResult.affected);

    return updateResult.affected > 0;
  }

  async getOrganizations (
    options: FindManyOptions<Organization>
  ): Promise<Organization[]> {
    const organizationRepository = this.dataSource.getRepository(Organization);
    const organizations = await organizationRepository.find(options);

    return organizations;
  }

  async getOrganization (
    options: FindOneOptions<Organization>
  ): Promise<Organization | null> {
    const organizationRepository = this.dataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne(options);

    return organization;
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

  async addUserOrganization (data: DeepPartial<UserOrganization>): Promise<UserOrganization> {
    const userOrganizationRepository = this.dataSource.getRepository(UserOrganization);
    const newUserOrganization = await userOrganizationRepository.save(data);

    return newUserOrganization;
  }

  async getProjects (options: FindManyOptions<Project>): Promise<Project[]> {
    const projectRepository = this.dataSource.getRepository(Project);
    const projects = await projectRepository.find(options);

    return projects;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const projectRepository = this.dataSource.getRepository(Project);

    const project = await projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect(
        'project.deployments',
        'deployments',
        'deployments.isCurrent = true'
      )
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

  async getProjectsInOrganization (
    userId: string,
    organizationSlug: string
  ): Promise<Project[]> {
    const projectRepository = this.dataSource.getRepository(Project);

    const projects = await projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect(
        'project.deployments',
        'deployments',
        'deployments.isCurrent = true'
      )
      .leftJoinAndSelect('deployments.domain', 'domain')
      .leftJoin('project.projectMembers', 'projectMembers')
      .leftJoin('project.organization', 'organization')
      .where(
        '(project.ownerId = :userId OR projectMembers.userId = :userId) AND organization.slug = :organizationSlug',
        {
          userId,
          organizationSlug
        }
      )
      .getMany();

    return projects;
  }

  /**
   * Get deployments with specified filter
   */
  async getDeployments (
    options: FindManyOptions<Deployment>
  ): Promise<Deployment[]> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const deployments = await deploymentRepository.find(options);

    return deployments;
  }

  async getDeploymentsByProjectId (projectId: string): Promise<Deployment[]> {
    return this.getDeployments({
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
  }

  async getDeployment (
    options: FindOneOptions<Deployment>
  ): Promise<Deployment | null> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const deployment = await deploymentRepository.findOne(options);

    return deployment;
  }

  async getDomains (options: FindManyOptions<Domain>): Promise<Domain[]> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const domains = await domainRepository.find(options);

    return domains;
  }

  async addDeployment (data: DeepPartial<Deployment>): Promise<Deployment> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);

    const id = nanoid();

    const updatedData = {
      ...data,
      id
    };
    const deployment = await deploymentRepository.save(updatedData);

    return deployment;
  }

  async getProjectMembersByProjectId (
    projectId: string
  ): Promise<ProjectMember[]> {
    const projectMemberRepository =
      this.dataSource.getRepository(ProjectMember);

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

  async getEnvironmentVariablesByProjectId (
    projectId: string,
    filter?: FindOptionsWhere<EnvironmentVariable>
  ): Promise<EnvironmentVariable[]> {
    const environmentVariableRepository =
      this.dataSource.getRepository(EnvironmentVariable);

    const environmentVariables = await environmentVariableRepository.find({
      where: {
        project: {
          id: projectId
        },
        ...filter
      }
    });

    return environmentVariables;
  }

  async removeProjectMemberById (projectMemberId: string): Promise<boolean> {
    const projectMemberRepository =
      this.dataSource.getRepository(ProjectMember);

    const deleteResult = await projectMemberRepository.delete({
      id: projectMemberId
    });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async updateProjectMemberById (
    projectMemberId: string,
    data: DeepPartial<ProjectMember>
  ): Promise<boolean> {
    const projectMemberRepository =
      this.dataSource.getRepository(ProjectMember);
    const updateResult = await projectMemberRepository.update(
      { id: projectMemberId },
      data
    );

    return Boolean(updateResult.affected);
  }

  async addProjectMember (
    data: DeepPartial<ProjectMember>
  ): Promise<ProjectMember> {
    const projectMemberRepository =
      this.dataSource.getRepository(ProjectMember);
    const newProjectMember = await projectMemberRepository.save(data);

    return newProjectMember;
  }

  async addEnvironmentVariables (
    data: DeepPartial<EnvironmentVariable>[]
  ): Promise<EnvironmentVariable[]> {
    const environmentVariableRepository =
      this.dataSource.getRepository(EnvironmentVariable);
    const savedEnvironmentVariables =
      await environmentVariableRepository.save(data);

    return savedEnvironmentVariables;
  }

  async updateEnvironmentVariable (
    environmentVariableId: string,
    data: DeepPartial<EnvironmentVariable>
  ): Promise<boolean> {
    const environmentVariableRepository =
      this.dataSource.getRepository(EnvironmentVariable);
    const updateResult = await environmentVariableRepository.update(
      { id: environmentVariableId },
      data
    );

    return Boolean(updateResult.affected);
  }

  async deleteEnvironmentVariable (
    environmentVariableId: string
  ): Promise<boolean> {
    const environmentVariableRepository =
      this.dataSource.getRepository(EnvironmentVariable);
    const deleteResult = await environmentVariableRepository.delete({
      id: environmentVariableId
    });

    if (deleteResult.affected) {
      return deleteResult.affected > 0;
    } else {
      return false;
    }
  }

  async getProjectMemberById (projectMemberId: string): Promise<ProjectMember> {
    const projectMemberRepository =
      this.dataSource.getRepository(ProjectMember);

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
    });

    if (projectMemberWithProject.length === 0) {
      throw new Error('Member does not exist');
    }

    return projectMemberWithProject[0];
  }

  async getProjectsBySearchText (
    userId: string,
    searchText: string
  ): Promise<Project[]> {
    const projectRepository = this.dataSource.getRepository(Project);

    const projects = await projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.organization', 'organization')
      .leftJoin('project.projectMembers', 'projectMembers')
      .where(
        '(project.owner = :userId OR projectMembers.member.id = :userId) AND project.name LIKE :searchText',
        {
          userId,
          searchText: `%${searchText}%`
        }
      )
      .getMany();

    return projects;
  }

  async updateDeploymentById (
    deploymentId: string,
    data: DeepPartial<Deployment>
  ): Promise<boolean> {
    return this.updateDeployment({ id: deploymentId }, data);
  }

  async updateDeployment (
    criteria: FindOptionsWhere<Deployment>,
    data: DeepPartial<Deployment>
  ): Promise<boolean> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const updateResult = await deploymentRepository.update(criteria, data);

    return Boolean(updateResult.affected);
  }

  async updateDeploymentsByProjectIds (
    projectIds: string[],
    data: DeepPartial<Deployment>
  ): Promise<boolean> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);

    const updateResult = await deploymentRepository
      .createQueryBuilder()
      .update(Deployment)
      .set(data)
      .where('projectId IN (:...projectIds)', { projectIds })
      .execute();

    return Boolean(updateResult.affected);
  }

  async deleteDeploymentById (deploymentId: string): Promise<boolean> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);
    const deployment = await deploymentRepository.findOneOrFail({
      where: {
        id: deploymentId
      }
    });

    const deleteResult = await deploymentRepository.softRemove(deployment);

    return Boolean(deleteResult);
  }

  async addProject (user: User, organizationId: string, data: DeepPartial<Project>): Promise<Project> {
    const projectRepository = this.dataSource.getRepository(Project);

    // TODO: Check if organization exists
    const newProject = projectRepository.create(data);
    // TODO: Set default empty array for webhooks in TypeORM
    newProject.webhooks = [];
    // TODO: Set icon according to framework
    newProject.icon = '';

    newProject.owner = user;

    newProject.organization = Object.assign(new Organization(), {
      id: organizationId
    });

    newProject.subDomain = `${newProject.name}.${this.projectDomain}`;

    return projectRepository.save(newProject);
  }

  async updateProjectById (
    projectId: string,
    data: DeepPartial<Project>
  ): Promise<boolean> {
    const projectRepository = this.dataSource.getRepository(Project);
    const updateResult = await projectRepository.update(
      { id: projectId },
      data
    );

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

  async updateDomainById (
    domainId: string,
    data: DeepPartial<Domain>
  ): Promise<boolean> {
    const domainRepository = this.dataSource.getRepository(Domain);
    const updateResult = await domainRepository.update({ id: domainId }, data);

    return Boolean(updateResult.affected);
  }

  async getDomainsByProjectId (
    projectId: string,
    filter?: FindOptionsWhere<Domain>
  ): Promise<Domain[]> {
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
