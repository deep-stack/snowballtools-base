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
  deployment: string;
  source: string;
  latestCommit: {
    message: string;
    createdAt: string;
    branch: string;
  };
  repositoryId: number;
  members: number[];
}

export interface DeploymentDetails {
  title: string;
  isProduction: boolean;
  status: Status;
  branch: string;
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
  PRODUCTION = 'production',
  PREVIEW = 'preview',
  DEVELOPMENT = 'development',
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

export interface Member {
  name: string;
  email: string;
  isOwner: boolean;
  id: number;
}
