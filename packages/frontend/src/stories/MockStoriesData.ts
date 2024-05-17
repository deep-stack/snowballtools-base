import {
  User,
  Project,
  Organization,
  Role,
  OrganizationMember,
  ProjectMember,
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

const organizationMember: OrganizationMember = {
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

const member: ProjectMember = {
  id: '1',
  member: user,
  permissions: [],
  isPending: false,
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
};

export const project: Project = {
  id: '1',
  name: 'Project',
  owner: user,
  deployments: [],
  repository: 'Repository',
  prodBranch: 'Prod Branch',
  description: 'Description',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
  framework: 'NextJS',
  environmentVariables: [],
  organization: organization,
  template: 'Template',
  members: [member],
  webhooks: ['beepboop'],
  icon: 'Icon',
  subDomain: 'SubDomain',
};
