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
  Permission,
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
  permissions: [Permission.Edit],
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
  name: 'domain.com',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  branch: 'Branch',
  status: DomainStatus.Live,
  redirectTo: null,
};

export const domain1: Domain = {
  id: '2',
  name: 'www.domain.com',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  branch: 'Branch',
  status: DomainStatus.Live,
  redirectTo: domain0,
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
  deployer: {
    deployerApiUrl: 'https://webapp-deployer-api.example.com',
    deployerId: 'bafyreicrtgmkir4evvvysxdqxddf2ftdq2wrzuodgvwnxr4rmubi4obdfu',
    deployerLrn: 'lrn://deployer.apps.snowballtools.com ',
  },
  applicationDeploymentRequestId:
    'bafyreiaycvq6imoppnpwdve4smj6t6ql5svt5zl3x6rimu4qwyzgjorize',
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
  auctionId: '7553538436710373822151221341b43f577e07b0525d083cc9b2de98890138a1',
  deployers: [
    {
      deployerApiUrl: 'https://webapp-deployer-api.example.com',
      deployerId: 'bafyreicrtgmkir4evvvysxdqxddf2ftdq2wrzuodgvwnxr4rmubi4obdfu',
      deployerLrn: 'lrn://deployer.apps.snowballtools.com ',
    },
  ],
  paymentAddress: '0x657868687686rb4787987br8497298r79284797487',
  txHash: '74btygeuydguygf838gcergurcbhuedbcjhu',
  webhooks: ['beepboop'],
  icon: 'Icon',
  fundsReleased: true,
  baseDomains: ['baseDomain'],
};
