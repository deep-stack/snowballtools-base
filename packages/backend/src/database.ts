import { DataSource, Like } from 'typeorm';
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

  async removeProjectMemberByMemberId (memberId: string): Promise<boolean> {
    // TODO: Check if user is authorized to delete members
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

  async getProjectsBySearchText (userId: number, searchText: string): Promise<ProjectMember[]> {
    // TODO: Query Project entity instead of ProjectMember
    const projectMemberRepository = this.dataSource.getRepository(ProjectMember);

    const projectMembers = await projectMemberRepository.find({
      relations: {
        project: {
          organization: true
        }
      },
      where: {
        member: {
          id: Number(userId)
        },
        project: {
          name: Like(`%${searchText}%`)
        }
      }
    }
    );

    return projectMembers;
  }
}
