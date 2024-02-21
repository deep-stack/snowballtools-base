import { DataSource } from 'typeorm';
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
import { checkFileExists, getConfig, getEntities, loadAndSaveData } from '../src/utils';
import { Config } from '../src/config';
import { DEFAULT_CONFIG_FILE_PATH } from '../src/constants';

const log = debug('snowball:initialize-database');

const USER_DATA_PATH = './fixtures/users.json';
const PROJECT_DATA_PATH = './fixtures/projects.json';
const ORGANIZATION_DATA_PATH = './fixtures/organizations.json';
const USER_ORGANIZATION_DATA_PATH = './fixtures/user-organizations.json';
const PROJECT_MEMBER_DATA_PATH = './fixtures/project-members.json';
const PRIMARY_DOMAIN_DATA_PATH = './fixtures/primary-domains.json';
const DEPLOYMENT_DATA_PATH = './fixtures/deployments.json';
const ENVIRONMENT_VARIABLE_DATA_PATH = './fixtures/environment-variables.json';
const REDIRECTED_DOMAIN_DATA_PATH = './fixtures/redirected-domains.json';

const generateTestData = async (dataSource: DataSource) => {
  const userEntities = await getEntities(path.resolve(__dirname, USER_DATA_PATH));
  const savedUsers = await loadAndSaveData(User, dataSource, userEntities);

  const orgEntities = await getEntities(path.resolve(__dirname, ORGANIZATION_DATA_PATH));
  const savedOrgs = await loadAndSaveData(Organization, dataSource, orgEntities);

  const projectRelations = {
    owner: savedUsers,
    organization: savedOrgs
  };

  const projectEntities = await getEntities(path.resolve(__dirname, PROJECT_DATA_PATH));
  const savedProjects = await loadAndSaveData(Project, dataSource, projectEntities, projectRelations);

  const domainRepository = dataSource.getRepository(Domain);

  const domainPrimaryRelations = {
    project: savedProjects
  };

  const primaryDomainsEntities = await getEntities(path.resolve(__dirname, PRIMARY_DOMAIN_DATA_PATH));
  const savedPrimaryDomains = await loadAndSaveData(Domain, dataSource, primaryDomainsEntities, domainPrimaryRelations);

  const domainRedirectedRelations = {
    project: savedProjects,
    redirectTo: savedPrimaryDomains
  };

  const redirectDomainsEntities = await getEntities(path.resolve(__dirname, REDIRECTED_DOMAIN_DATA_PATH));
  await loadAndSaveData(Domain, dataSource, redirectDomainsEntities, domainRedirectedRelations);

  const savedDomains = await domainRepository.find();

  const userOrganizationRelations = {
    member: savedUsers,
    organization: savedOrgs
  };

  const userOrganizationsEntities = await getEntities(path.resolve(__dirname, USER_ORGANIZATION_DATA_PATH));
  await loadAndSaveData(UserOrganization, dataSource, userOrganizationsEntities, userOrganizationRelations);

  const projectMemberRelations = {
    member: savedUsers,
    project: savedProjects
  };

  const projectMembersEntities = await getEntities(path.resolve(__dirname, PROJECT_MEMBER_DATA_PATH));
  await loadAndSaveData(ProjectMember, dataSource, projectMembersEntities, projectMemberRelations);

  const deploymentRelations = {
    project: savedProjects,
    domain: savedDomains,
    createdBy: savedUsers
  };

  const deploymentsEntities = await getEntities(path.resolve(__dirname, DEPLOYMENT_DATA_PATH));
  await loadAndSaveData(Deployment, dataSource, deploymentsEntities, deploymentRelations);

  const environmentVariableRelations = {
    project: savedProjects
  };

  const environmentVariablesEntities = await getEntities(path.resolve(__dirname, ENVIRONMENT_VARIABLE_DATA_PATH));
  await loadAndSaveData(EnvironmentVariable, dataSource, environmentVariablesEntities, environmentVariableRelations);
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
