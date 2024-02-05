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
import { getConfig } from '../src/utils';
import { Config } from '../src/config';
import { DEFAULT_CONFIG_FILE_PATH } from '../src/constants';

const log = debug('snowball:initialize-database');

const USER_DATA_PATH = './fixtures/users.json';
const PROJECT_DATA_PATH = './fixtures/projects.json';
const ORGANIZATION_DATA_PATH = './fixtures/organizations.json';
const USER_ORGANIZATION_DATA_PATH = './fixtures/user-orgnizations.json';
const PROJECT_MEMBER_DATA_PATH = './fixtures/project-members.json';
const PRIMARY_DOMAIN_DATA_PATH = './fixtures/primary-domains.json';
const DEPLOYMENT_DATA_PATH = './fixtures/deployments.json';
const ENVIRONMENT_VARIABLE_DATA_PATH = './fixtures/environment-variables.json';
const REDIRECTED_DOMAIN_DATA_PATH = './fixtures/redirected-domains.json';

const loadAndSaveData = async <Entity extends ObjectLiteral>(entityType: EntityTarget<Entity>, dataSource: DataSource, filePath: string, relations?: any | undefined) => {
  const entitiesData = await fs.readFile(filePath, 'utf-8');
  const entities = JSON.parse(entitiesData);
  const entityRepository = dataSource.getRepository(entityType);

  const savedEntity:Entity[] = [];

  for (const entityData of entities) {
    let entity = entityRepository.create(entityData as DeepPartial<Entity>);

    if (relations) {
      for (const field in relations) {
        const valueIndex = String(field + 'Index');

        entity = {
          ...entity,
          [field]: relations[field][entityData[valueIndex]]
        };
      }
    }
    const dbEntity = await entityRepository.save(entity);
    savedEntity.push(dbEntity);
  }

  return savedEntity;
};

const generateTestData = async (dataSource: DataSource) => {
  const savedUsers = await loadAndSaveData(User, dataSource, path.resolve(__dirname, USER_DATA_PATH));
  const savedOrgs = await loadAndSaveData(Organization, dataSource, path.resolve(__dirname, ORGANIZATION_DATA_PATH));

  const projectRelations = {
    owner: savedUsers,
    organization: savedOrgs
  };

  const savedProjects = await loadAndSaveData(Project, dataSource, path.resolve(__dirname, PROJECT_DATA_PATH), projectRelations);

  const domainRepository = dataSource.getRepository(Domain);

  const domainPrimaryRelations = {
    project: savedProjects
  };

  const savedPrimaryDomains = await loadAndSaveData(Domain, dataSource, path.resolve(__dirname, PRIMARY_DOMAIN_DATA_PATH), domainPrimaryRelations);

  const domainRedirectedRelations = {
    project: savedProjects,
    redirectTo: savedPrimaryDomains
  };

  await loadAndSaveData(Domain, dataSource, path.resolve(__dirname, REDIRECTED_DOMAIN_DATA_PATH), domainRedirectedRelations);

  const savedDomains = await domainRepository.find();

  const userOrganizationRelations = {
    member: savedUsers,
    organization: savedOrgs
  };

  await loadAndSaveData(UserOrganization, dataSource, path.resolve(__dirname, USER_ORGANIZATION_DATA_PATH), userOrganizationRelations);

  const projectMemberRelations = {
    member: savedUsers,
    project: savedProjects
  };

  await loadAndSaveData(ProjectMember, dataSource, path.resolve(__dirname, PROJECT_MEMBER_DATA_PATH), projectMemberRelations);

  const deploymentRelations = {
    project: savedProjects,
    domain: savedDomains,
    createdBy: savedUsers
  };

  await loadAndSaveData(Deployment, dataSource, path.resolve(__dirname, DEPLOYMENT_DATA_PATH), deploymentRelations);

  const environmentVariableRelations = {
    project: savedProjects
  };

  await loadAndSaveData(EnvironmentVariable, dataSource, path.resolve(__dirname, ENVIRONMENT_VARIABLE_DATA_PATH), environmentVariableRelations);
};

const checkFileExists = async (filePath: string) => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    log(err);
    return false;
  }
};

const main = async () => {
  const config = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);
  const isDbPresent = await checkFileExists(config.database.dbPath);

  if (!isDbPresent) {
    const dataSource = new DataSource({
      type: 'better-sqlite3',
      database: config.database.dbPath,
      synchronize: true,
      logging: true,
      entities: [path.join(__dirname, '../src/entity/*')]
    });

    await dataSource.initialize();

    await generateTestData(dataSource);
    log('Data loaded successfully');
  } else {
    log('WARNING: Database already exists');
  }
};

main().catch((err) => {
  log(err);
});
