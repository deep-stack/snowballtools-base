export interface ProjectDetails {
  icon: string;
  name: string;
  title: string;
  owner: Member;
  organization: string;
  description: string;
  url: string;
  domain: string | null;
  id: string;
  createdAt: string;
  createdBy: string;
  deployments: DeploymentDetails[];
  source: string;
  latestCommit: {
    message: string;
    createdAt: string;
    branch: string;
  };
  repositoryId: number;
  repositories: RepositoryDetails[];
  members: ProjectMember[];
  ownerId: number;
  environmentVariables: EnvironmentVariable[];
}

export interface ProjectMember {
  id: string;
  member: Member;
  permissions: string[];
}

export interface DeploymentDetails {
  title: string;
  isProduction: boolean;
  domain: DomainDetails;
  status: Status;
  branch: string;
  environment: Environments;
  isCurrent: boolean;
  commit: {
    hash: string;
    message: string;
  };
  author: string;
  updatedAt: string;
}

export enum Status {
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

export enum Environments {
  PRODUCTION = 'Production',
  PREVIEW = 'Preview',
  DEVELOPMENT = 'Development',
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  id: number;
  environments: Environments[];
}

export interface RepositoryDetails {
  title: string;
  updatedAt: string;
  user: string;
  private: boolean;
  branch: string[];
}

export enum GitSelect {
  GITHUB = 'github',
  GITEA = 'gitea',
  NONE = 'none',
}

export enum DomainStatus {
  LIVE = 'Live',
  PENDING = 'Pending',
}

export interface DomainDetails {
  id: number;
  projectid: number;
  name: string;
  status: DomainStatus;
  record: {
    type: string;
    name: string;
    value: string;
  };
  isRedirectedto: boolean;
}

export enum Permission {
  VIEW = 'view',
  EDIT = 'edit',
}

export interface Member {
  name: string;
  email: string;
  id: string;
}

export interface ProjectSearchOutletContext {
  projects: ProjectDetails[];
}
