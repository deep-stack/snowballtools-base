import { Project, Deployment } from 'gql-client';

export interface ProjectDetails extends Project {
  latestCommit: Commit;

  // TODO: Move out of project
  repositories?: RepositoryDetails[];
  repositoryId?: number;
}

export interface ProjectMember {
  id: string;
  member: Member;
  permissions: string[];
}

export interface DeploymentDetails extends Deployment {
  commit: Commit;
  author: string;
}

export enum Status {
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

// TODO: Use GitRepositoryDetails
export interface RepositoryDetails {
  title: string;
  updatedAt: string;
  user: string;
  private: boolean;
  branch: string[];
}

export interface GitRepositoryDetails {
  id: number;
  name: string;
  full_name: string;
  owner: {
    id: number;
    login: string;
  };
  visibility?: string;
  updated_at: string | null;
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

export interface Commit {
  message: string;
  createdAt: string;
  branch: string;
}
