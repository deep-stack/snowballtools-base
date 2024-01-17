import { DataSource } from 'typeorm';
import path from 'path';
import debug from 'debug';

import { DatabaseConfig } from './config';
import { User } from './entity/User';
import { Organization } from './entity/Organization';
import { UserOrganization } from './entity/UserOrganization';
import { Project } from './entity/Project';

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

  async getOrganizationsbyUserId (userId: number) : Promise<Organization[]> {
    const userOrganizationRepository = this.dataSource.getRepository(UserOrganization);

    const userOrgs = await userOrganizationRepository.find({
      relations: {
        user: true,
        organization: true
      },
      where: {
        user: {
          id: userId
        }
      }
    });

    const organizations = userOrgs.map(userOrg => userOrg.organization);
    return organizations;
  }

  async getProjectsbyOrganizationId (organizationId: number): Promise<Project[]> {
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
}
