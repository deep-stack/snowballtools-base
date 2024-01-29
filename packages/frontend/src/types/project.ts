import { Environment, Project } from 'gql-client';

export interface ProjectDetails extends Project {
  // TODO: isDomain flag
  domain?: string | null;
  // TODO: Use deployment branch
  source?: string;
  latestCommit: {
    message: string;
    createdAt: string;
    branch: string;
  };

  // TODO: Move out of project
  repositories?: RepositoryDetails[];
  repositoryId?: number;
}

export interface ProjectMember {
  id: string;
  member: Member;
  permissions: string[];
}

export interface DeploymentDetails {
  id: string;
  title: string;
  isProduction: boolean;
  domain: DomainDetails;
  status: Status;
  branch: string;
  environment: Environment;
  isCurrent: boolean;
  commit: {
    hash: string;
    message: string;
  };
  author: string;
  createdAt: string;
  updatedAt: string;
}

export enum Status {
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
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
