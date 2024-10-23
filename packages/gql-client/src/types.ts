import { addProjectFromTemplate } from "./mutations";
// Note: equivalent to types present in GQL schema

export enum Role {
  Owner = "Owner",
  Maintainer = "Maintainer",
  Reader = "Reader",
}

export enum Permission {
  View = "View",
  Edit = "Edit",
}

export enum Environment {
  Production = "Production",
  Preview = "Preview",
  Development = "Development",
}

export enum DeploymentStatus {
  Building = "Building",
  Ready = "Ready",
  Error = "Error",
  Deleting = "Deleting",
}

export enum AuctionStatus {
  AuctionStatusCommitPhase = "commit",
  AuctionStatusRevealPhase = "reveal",
  AuctionStatusExpired = "expired",
  AuctionStatusCompleted = "completed",
}

export type Bid = {
  auctionId: string;
  bidderAddress: string;
  status: string;
  commitHash: string;
  commitTime?: Date;
  commitFee?: string;
  revealTime?: Date;
  revealFee?: string;
  bidAmount?: string;
}

export type Auction = {
  id: string;
  kind: string;
  status: string;
  ownerAddress: string;
  createTime?: Date;
  commitsEndTime?: Date;
  revealsEndTime?: Date;
  commitFee?: string;
  revealFee?: string;
  minimumBid?: string;
  winnerAddresses: string[];
  winnerBids?: string[];
  winnerPrice?: string;
  maxPrice?: string;
  numProviders: number;
  fundsReleased: boolean;
  bids: Bid[];
}

export enum DomainStatus {
  Live = "Live",
  Pending = "Pending",
}

export type EnvironmentVariable = {
  id: string;
  environment: Environment;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type Domain = {
  id: string;
  branch: string;
  name: string;
  status: DomainStatus;
  redirectTo: Domain | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  gitHubToken: string | null;
};

export type Deployment = {
  id: string;
  domain: Domain;
  branch: string;
  commitHash: string;
  commitMessage: string;
  url?: string;
  deployer: Deployer;
  environment: Environment;
  isCurrent: boolean;
  baseDomain?: string;
  status: DeploymentStatus;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  applicationDeploymentRequestId: string;
};

export type Deployer = {
  deployerLrn: string;
  deployerId: string;
  deployerApiUrl: string;
}

export type OrganizationMember = {
  id: string;
  member: User;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMember = {
  id: string;
  member: User;
  permissions: Permission[];
  isPending: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationProject = {
  id: string;
  owner: User;
  deployments: Deployment[];
  name: string;
  repository: string;
  prodBranch: string;
  description: string;
  template: string;
  framework: string;
  webhooks: string[];
  members: ProjectMember[];
  environmentVariables: EnvironmentVariable[];
  createdAt: string;
  updatedAt: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  projects: OrganizationProject[];
  createdAt: string;
  updatedAt: string;
  members: OrganizationMember[];
};

export type Project = {
  id: string;
  owner: User;
  deployments: Deployment[];
  name: string;
  repository: string;
  prodBranch: string;
  description: string;
  template: string;
  framework: string;
  deployers: [Deployer]
  auctionId: string;
  fundsReleased: boolean;
  webhooks: string[];
  members: ProjectMember[];
  environmentVariables: EnvironmentVariable[];
  createdAt: string;
  updatedAt: string;
  organization: Organization;
  icon: string;
  baseDomains?: string[] | null;
};

export type GetProjectMembersResponse = {
  projectMembers: ProjectMember[];
};

export type AddProjectMemberResponse = {
  addProjectMember: boolean;
};

export type RemoveProjectMemberResponse = {
  removeProjectMember: boolean;
};

export type UpdateProjectMemberResponse = {
  updateProjectMember: boolean;
};

export type GetDeploymentsResponse = {
  deployments: Deployment[];
};

export type GetEnvironmentVariablesResponse = {
  environmentVariables: EnvironmentVariable[];
};

export type GetOrganizationsResponse = {
  organizations: Organization[];
};

export type GetUserResponse = {
  user: User;
};

export type GetProjectResponse = {
  project: Project | null;
};

export type GetProjectsInOrganizationResponse = {
  projectsInOrganization: Project[];
};

export type GetDomainsResponse = {
  domains: Domain[];
};

export type GetDeployersResponse = {
  deployers: Deployer[];
};

export type SearchProjectsResponse = {
  searchProjects: Project[];
};

export type AddEnvironmentVariablesResponse = {
  addEnvironmentVariables: boolean;
};

export type AddEnvironmentVariableInput = {
  environments: string[];
  key: string;
  value: string;
};

export type UpdateEnvironmentVariableInput = {
  key: string;
  value: string;
};

export type UpdateProjectMemberInput = {
  permissions: Permission[];
};

export type AddProjectMemberInput = {
  email: string;
  permissions: Permission[];
};

export type UpdateEnvironmentVariableResponse = {
  updateEnvironmentVariable: boolean;
};

export type RemoveEnvironmentVariableResponse = {
  removeEnvironmentVariable: boolean;
};

export type UpdateDeploymentToProdResponse = {
  updateDeploymentToProd: boolean;
};

export type AddProjectFromTemplateResponse = {
  addProjectFromTemplate: Project;
};

export type AddProjectResponse = {
  addProject: Project;
};

export type UpdateProjectResponse = {
  updateProject: boolean;
};

export type UpdateDomainResponse = {
  updateDomain: boolean;
};

export type DeleteProjectResponse = {
  deleteProject: boolean;
};

export type DeleteDomainResponse = {
  deleteDomain: boolean;
};

export type AddProjectFromTemplateInput = {
  templateOwner: string;
  templateRepo: string;
  owner: string;
  name: string;
  isPrivate: boolean;
};

export type AddProjectInput = {
  name: string;
  repository: string;
  prodBranch: string;
  template?: string;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string;
  prodBranch?: string;
  webhooks?: string[];
  organizationId?: string;
};

export type UpdateDomainInput = {
  name?: string;
  branch?: string;
  redirectToId?: string | null;
};

export type RedeployToProdResponse = {
  redeployToProd: boolean;
};

export type RollbackDeploymentResponse = {
  rollbackDeployment: boolean;
};

export type DeleteDeploymentResponse = {
  deleteDeployment: boolean;
};

export type AddDomainInput = {
  name: string;
};

export type FilterDomainInput = {
  branch?: string;
  status?: DomainStatus;
};

export type AddDomainResponse = {
  addDomain: true;
};

export type AuthenticateGitHubResponse = {
  authenticateGitHub: {
    token: string;
  };
};

export type UnauthenticateGitHubResponse = {
  unauthenticateGitHub: boolean;
};

export type AuctionParams = {
  maxPrice: string;
  numProviders: number;
};
