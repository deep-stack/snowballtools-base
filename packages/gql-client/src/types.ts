/* eslint-disable no-use-before-define */
// Note: equivalent to types present in GQL schema

export enum Role {
  Owner = 'Owner',
  Maintainer = 'Maintainer',
  Reader = 'Reader',
}

export enum Permission {
  View = 'View',
  Edit = 'Edit',
}

export enum Environment {
  Production = 'Production',
  Preview = 'Preview',
  Development = 'Development',
}

export enum DeploymentStatus {
  Building = 'Building',
  Ready = 'Ready',
  Error = 'Error',
}

export enum DomainStatus {
  Live = 'Live',
  Pending = 'Pending',
}

export type EnvironmentVariable = {
  id: string
  environments: Environment[]
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

export type Domain = {
  id: string
  branch: string
  name: string
  isRedirected: boolean
  status: DomainStatus
  createdAt: string
  updatedAt: string
}

export type Deployment = {
  id: string
  domain: Domain
  branch: string
  commitHash: string
  title: string
  environment: Environment
  isCurrent: boolean
  status: DeploymentStatus
  createdAt: string
  updatedAt: string
}

export type User = {
  id: string
  name: string
  email: string
  organizations: Organization[]
  projects: Project[]
  createdAt: string
  updatedAt: string
}

export type OrganizationMember = {
  id: string
  member: User
  role: Role
  createdAt: string
  updatedAt: string
}

export type ProjectMember = {
  id: string
  member: User
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export type Project = {
  id: string
  owner: User
  deployments: Deployment[]
  name: string
  repository: string
  prodBranch: string
  description: string
  template: string
  framework: string
  webhooks: string[]
  members: ProjectMember[]
  environmentVariables: EnvironmentVariable[]
  createdAt: string
  updatedAt: string
}

export type Organization = {
  id: string
  name: string
  projects: Project[]
  createdAt: string
  updatedAt: string
  members: OrganizationMember[]
}

export type getProjectMembersResponse = {
  projectMembers: ProjectMember[]
}

export type removeMemberResponse = {
  removeMember: boolean;
}

export type getDeploymentsResponse = {
  deployments: Deployment[]
}

export type getOrganizationsResponse = {
  organizations: Organization[]
}

export type getUserResponse = {
  user: User
}
