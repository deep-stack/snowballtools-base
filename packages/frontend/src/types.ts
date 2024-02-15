import { Project } from 'gql-client';

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

export interface GitCommitWithBranch {
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

export type OutletContextType = {
  project: Project;
  onUpdate: () => Promise<void>;
};

export type EnvironmentVariablesFormValues = {
  variables: {
    key: string;
    value: string;
  }[];
  environment: {
    development: boolean;
    preview: boolean;
    production: boolean;
  };
};
