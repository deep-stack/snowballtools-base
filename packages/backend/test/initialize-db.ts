import { DataSource, DeepPartial } from 'typeorm';
import * as fs from 'fs/promises';
import debug from 'debug';

import { User } from '../src/entity/User';
import { Organization } from '../src/entity/Organization';
import { Project } from '../src/entity/Project';
import { UserOrganization } from '../src/entity/UserOrganization';
import { EnvironmentVariable } from '../src/entity/EnvironmentVariable';
import { Domain } from '../src/entity/Domain';
import { ProjectMember } from '../src/entity/ProjectMember';
import { Deployment } from '../src/entity/Deployment';

const log = debug('snowball:initialize-database');

const loadAndSaveUsersData = async (dataSource: DataSource, filePath: string) => {
  // Read JSON files
  const usersData = await fs.readFile(filePath, 'utf-8');

  // Parse JSON data
  const users = JSON.parse(usersData) as DeepPartial<User>[];

  // Get entity repositories
  const userRepository = dataSource.getRepository(User);

  const savedUsers: User[] = [];

  // Save data
  for (const userData of users) {
    const user = userRepository.create(userData);
    // asse
    const dbUser = await userRepository.save(user);
    savedUsers.push(dbUser);
  }

  return savedUsers;
};

const loadAndSaveOrganizationData = async (dataSource: DataSource, filePath: string) => {
  // Read JSON files
  const organizationsData = await fs.readFile(filePath, 'utf-8');

  // Parse JSON data
  const organizations = JSON.parse(organizationsData) as DeepPartial<Organization>[];

  // Get entity repositories
  const organizationRepository = dataSource.getRepository(Organization);

  const savedOrgs:Organization[] = [];

  // Save data
  for (const organizationData of organizations) {
    const organization = organizationRepository.create(organizationData);
    const dbOrganization = await organizationRepository.save(organization);
    savedOrgs.push(dbOrganization);
  }

  return savedOrgs;
};

const loadAndSaveProjectsData = async (dataSource: DataSource, filePath: string) => {
  const savedUsers = await loadAndSaveUsersData(dataSource, 'test/fixtures/users.json');
  const savedOrgs = await loadAndSaveOrganizationData(dataSource, 'test/fixtures/organizations.json');

  // Read JSON files
  const projectsData = await fs.readFile(filePath, 'utf-8');

  // Parse JSON data
  const projects = JSON.parse(projectsData);

  console.log(projects);

  // Get entity repositories
  const projectRepository = dataSource.getRepository(Project);

  // Save data
  for (const projectData of projects) {
    const project = projectRepository.create(projectData as DeepPartial<Project>);
    project.owner = savedUsers[projectData.ownerIndex];
    project.organization = savedOrgs[projectData.organizationIndex];
    await projectRepository.save(project);
  }
};

const main = async () => {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'db/snowball',
    synchronize: true,
    logging: true,
    entities: [
      User,
      Organization,
      Project,
      UserOrganization,
      EnvironmentVariable,
      Domain,
      ProjectMember,
      Deployment
    ]
  });

  await dataSource.initialize();

  await loadAndSaveProjectsData(dataSource, 'test/fixtures/projects.json');
};

main().then(() => {
  log('Data loaded successfully');
})
  .catch((err) => {
    log(err);
  });
