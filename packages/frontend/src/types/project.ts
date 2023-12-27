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
