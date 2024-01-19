export interface ProjectDetails {
  icon: string;
  name: string;
  title: string;
  organization: string;
  url: string;
  domain: string | null;
  id: number;
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
  members: MemberPermission[];
  ownerId: number;
}

export interface MemberPermission {
  id: number;
  permissions: string[];
}

export interface DeploymentDetails {
  title: string;
  isProduction: boolean;
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
  LIVE = 'live',
  PENDING = 'pending',
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
  id: number;
}
