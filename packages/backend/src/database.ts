import { DataSource, DeepPartial } from 'typeorm';
import path from 'path';
import debug from 'debug';
import assert from 'assert';

import { DatabaseConfig } from './config';
import { User } from './entity/User';
import { Organization } from './entity/Organization';
import { UserOrganization } from './entity/UserOrganization';
import { Project } from './entity/Project';
import { Deployment } from './entity/Deployment';
import { ProjectMember } from './entity/ProjectMember';
import { EnvironmentVariable } from './entity/EnvironmentVariable';

const log = debug('snowball:database');

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

  async init () : Promise<void> {
    await this.dataSource.initialize();
    log('database initialized');
  }

  async getUser (userId: number) : Promise<User | null> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: userId
    });

    return user;
  }

  async getOrganizationsByUserId (userId: number) : Promise<Organization[]> {
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

  async getProjectByProjectId (projectId: string): Promise<Project | null> {
    const projectRepository = this.dataSource.getRepository(Project);

    const project = await projectRepository.findOne({
      relations: {
        organization: true,
        owner: true
      },
      where: {
        id: projectId
      }
    });

    return project;
  }

  async getDeploymentsByProjectId (projectId: string): Promise<Deployment[]> {
    const deploymentRepository = this.dataSource.getRepository(Deployment);

    const deployments = await deploymentRepository.find({
      relations: {
        project: true,
        domain: true
      },
      where: {
        project: {
          id: projectId
        }
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
      relations: {
        project: true
      },
      where: {
        project: {
          id: projectId
        }
      }
    });

    return environmentVariables;
  }

  async removeProjectMemberById (memberId: string): Promise<boolean> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);

    const deleted = await projectMemberRepository.delete(memberId);

    if (deleted.affected) {
      return deleted.affected > 0;
    } else {
      return false;
    }
  }

  async addEnvironmentVariablesByProjectId (projectId: string, environmentVariables: any[]): Promise<boolean> {
    const environmentVariableRepository = this.dataSource.getRepository(EnvironmentVariable);
    const projectRepository = this.dataSource.getRepository(Project);

    const project = await projectRepository.findOneBy({
      id: projectId
    });
    assert(project);

    const environmentVariablesPromises = environmentVariables.map(async environmentVariable => {
      const envVar = new EnvironmentVariable();

      envVar.key = environmentVariable.key;
      envVar.value = environmentVariable.value;
      envVar.environments = environmentVariable.environments;
      envVar.project = project;

      return environmentVariableRepository.save(envVar);
    });

    const savedEnvironmentVariables = await Promise.all(environmentVariablesPromises);
    return savedEnvironmentVariables.length > 0;
  }

  async getProjectMemberByMemberId (memberId: string): Promise<ProjectMember> {
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);

    const projectMemberWithProject = await projectMemberRepository.find({
      relations: {
        project: {
          owner: true
        },
        member: true
      },
      where: {
        id: Number(memberId)
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
}
