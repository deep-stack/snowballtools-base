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
  environment: Environment
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
  redirectTo?: Domain
  createdAt: string
  updatedAt: string
}

export type User = {
  id: string
  name: string
  email: string
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
  createdBy: User
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

export type OrganizationProject = {
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
  projects: OrganizationProject[]
  createdAt: string
  updatedAt: string
  members: OrganizationMember[]
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
  organization: Organization
  icon: string
}

export type GetProjectMembersResponse = {
  projectMembers: ProjectMember[]
}

export type RemoveProjectMemberResponse = {
  removeProjectMember: boolean;
}

export type UpdateProjectMemberResponse = {
  updateProjectMember: boolean;
}

export type GetDeploymentsResponse = {
  deployments: Deployment[]
}

export type GetEnvironmentVariablesResponse = {
  environmentVariables: EnvironmentVariable[]
}

export type GetOrganizationsResponse = {
  organizations: Organization[]
}

export type GetUserResponse = {
  user: User
}

export type GetProjectResponse = {
  project: Project | null
}

export type GetProjectsInOrganizationResponse = {
  projectsInOrganization: Project[]
}

export type GetDomainsResponse = {
  domains: Domain[]
}

export type SearchProjectsResponse = {
  searchProjects: Project[]
}

export type AddEnvironmentVariablesResponse = {
  addEnvironmentVariables: boolean;
}

export type AddEnvironmentVariableInput = {
  environments: string[];
  key: string;
  value: string;
}

export type UpdateEnvironmentVariableInput = {
  key: string;
  value: string;
}

export type UpdateProjectMemberInput = {
  permissions: Permission[];
}

export type UpdateEnvironmentVariableResponse = {
  updateEnvironmentVariable: boolean;
}

export type RemoveEnvironmentVariableResponse = {
  removeEnvironmentVariable: boolean;
}

export type UpdateDeploymentToProdResponse = {
  updateDeploymentToProd: boolean;
}

export type UpdateProjectResponse = {
  updateProject: boolean;
}

export type UpdateDomainResponse = {
  updateDomain: boolean;
}

export type DeleteProjectResponse = {
  deleteProject: boolean;
}

export type UpdateProjectInput = {
  name: string
  description: string
}

export type UpdateDomainInput = {
  name?: string;
  isRedirected?: boolean;
  branch?: string;
  redirectTo?: string;
}

export type RedeployToProdResponse = {
  redeployToProd: boolean
}

export type RollbackDeploymentResponse = {
  rollbackDeployment: boolean
}

export type AddDomainInput = {
  name: string
}

export type AddDomainResponse = {
  addDomain: true
}

export type AuthenticateGithubResponse = {
  authenticateGithub: {
    token: string
  }
}
