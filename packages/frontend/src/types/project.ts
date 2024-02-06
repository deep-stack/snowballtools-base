import { Project, Deployment } from 'gql-client';

export interface ProjectDetails extends Project {
  latestCommit: Commit;

  // TODO: Move out of project
  repositories?: RepositoryDetails[];
  repositoryId?: number;
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

export interface GitOrgDetails {
  id: number;
  login: string;
  avatar_url: string;
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
  owner: GitOrgDetails | null;
  visibility?: string;
  updated_at?: string | null;
  default_branch?: string;
}

export interface GitBranchDetails {
  name: string;
}

export interface GitCommitDetails {
  branch: GitBranchDetails;
  commit: {
    author: {
      name?: string;
      date?: string;
    } | null;
    message: string;
  };
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
  id: string;
  projectid: string;
  name: string;
  status: DomainStatus;
  record: {
    type: string;
    name: string;
    value: string;
  };
}

export interface ProjectSearchOutletContext {
  projects: ProjectDetails[];
}

export interface Commit {
  message: string;
  createdAt: string;
  branch: string;
}
