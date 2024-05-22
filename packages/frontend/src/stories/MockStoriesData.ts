import {
  User,
  Project,
  Organization,
  Role,
  OrganizationMember,
  ProjectMember,
  EnvironmentVariable,
  Deployment,
  DeploymentStatus,
  DomainStatus,
  Domain,
  Environment,
} from 'gql-client';

export const user: User = {
  id: '1',
  email: 'helloworld@helloworld.com',
  isVerified: true,
  createdAt: '2021-08-01T00:00:00.000Z',
  name: 'Hello World',
  updatedAt: '2021-08-01T00:00:00.000Z',
  gitHubToken: 'GitHub Token',
};

export const organizationMember: OrganizationMember = {
  id: '1',
  member: user,
  role: Role.Owner,
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
};

export const organization: Organization = {
  id: '1',
  name: 'Organization',
  slug: 'organization',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  members: [organizationMember],
  projects: [],
};

export const member: ProjectMember = {
  id: '1',
  member: user,
  permissions: [],
  isPending: false,
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
};

export const environmentVariable0: EnvironmentVariable = {
  id: '1',
  key: 'API_KEY',
  value: '123456',
  environment: Environment.Development,
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
};

export const environmentVariable1: EnvironmentVariable = {
  id: '2',
  key: 'API_KEY_2',
  value: '123456',
  environment: Environment.Development,
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
};

export const domain0: Domain = {
  id: '1',
  name: 'Domain',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  branch: 'Branch',
  status: DomainStatus.Live,
  redirectTo: null,
};

export const deployment0: Deployment = {
  id: '1',
  url: 'https://deployment.com',
  status: DeploymentStatus.Ready,
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  branch: 'Branch',
  environment: Environment.Development,
  isCurrent: true,
  commitHash: 'Commit Hash',
  domain: domain0,
  commitMessage: 'Commit Message',
  createdBy: user,
};

export const project: Project = {
  id: '1',
  name: 'GithubUsername-ProjectName',
  owner: user,
  deployments: [deployment0],
  repository: 'Repository',
  prodBranch: 'Prod Branch',
  description: 'Description',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  framework: 'NextJS',
  environmentVariables: [environmentVariable0, environmentVariable1],
  organization: organization,
  template: 'Template',
  members: [member],
  webhooks: ['beepboop'],
  icon: 'Icon',
  subDomain: 'SubDomain',
};