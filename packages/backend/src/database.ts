import { DataSource } from 'typeorm';
import path from 'path';
import debug from 'debug';

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
        project: true
      },
      where: {
        project: {
          id: projectId
        }
      }
    });

    return deployments;
  }

  async getProjectMembers (projectId: string): Promise<ProjectMember[]> {
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
}