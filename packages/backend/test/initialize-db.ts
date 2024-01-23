import { DataSource, DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';
import * as fs from 'fs/promises';
import debug from 'debug';
import path from 'path';

import { User } from '../src/entity/User';
import { Organization } from '../src/entity/Organization';
import { Project } from '../src/entity/Project';
import { UserOrganization } from '../src/entity/UserOrganization';
import { EnvironmentVariable } from '../src/entity/EnvironmentVariable';
import { Domain } from '../src/entity/Domain';
import { ProjectMember } from '../src/entity/ProjectMember';
import { Deployment } from '../src/entity/Deployment';

const log = debug('snowball:initialize-database');

const USER_DATA_PATH = './fixtures/users.json';
const PROJECT_DATA_PATH = './fixtures/projects.json';
const ORGANIZATION_DATA_PATH = './fixtures/organizations.json';
const USER_ORGANIZATION_DATA_PATH = './fixtures/user-orgnizations.json';

const loadAndSaveData = async <Entity extends ObjectLiteral>(entityType: EntityTarget<Entity>, dataSource: DataSource, filePath: string) => {
  const entitiesData = await fs.readFile(filePath, 'utf-8');
  const entities = JSON.parse(entitiesData) as DeepPartial<Entity>[];
  const entityRepository = dataSource.getRepository(entityType);

  const savedEntity:Entity[] = [];

  for (const entityData of entities) {
    const entity = entityRepository.create(entityData);
    const dbEntity = await entityRepository.save(entity);
    savedEntity.push(dbEntity);
  }

  return savedEntity;
};

const generateTestData = async (dataSource: DataSource) => {
  const savedUsers = await loadAndSaveData(User, dataSource, path.resolve(__dirname, USER_DATA_PATH));
  const savedOrgs = await loadAndSaveData(Organization, dataSource, path.resolve(__dirname, ORGANIZATION_DATA_PATH));

  const projectsData = await fs.readFile(path.resolve(__dirname, PROJECT_DATA_PATH), 'utf-8');
  const projects = JSON.parse(projectsData);
  const projectRepository = dataSource.getRepository(Project);

  for (const projectData of projects) {
    const project = projectRepository.create(projectData as DeepPartial<Project>);
    project.owner = savedUsers[projectData.ownerIndex];
    project.organization = savedOrgs[projectData.organizationIndex];
    await projectRepository.save(project);
  }

  const userOrgData = await fs.readFile(path.resolve(__dirname, USER_ORGANIZATION_DATA_PATH), 'utf-8');
  const userOrgs = JSON.parse(userOrgData);
  const userOrgRepository = dataSource.getRepository(UserOrganization);

  for (const userOrgData of userOrgs) {
    const userOrg = userOrgRepository.create(userOrgData as DeepPartial<UserOrganization>);
    userOrg.member = savedUsers[userOrgData.memberIndex];
    userOrg.organization = savedOrgs[userOrgData.organizationIndex];

    await userOrgRepository.save(userOrg);
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

  await generateTestData(dataSource);
};

main().then(() => {
  log('Data loaded successfully');
})
  .catch((err) => {
    log(err);
  });
