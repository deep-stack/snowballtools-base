export interface PackageJSON {
  name?: string;
  version?: string;
  author?: string;
  description?: string;
  homepage?: string;
  license?: string;
  repository?: string;
}

export interface GitRepositoryDetails {
  id: number;
  name: string;
  full_name: string;
  visibility?: string;
  updated_at?: string | null;
  default_branch?: string;
}

export interface GitPushEventPayload {
  repository: GitRepositoryDetails;
  ref: string;
  head_commit: {
    id: string;
    message: string;
  };
}

export interface AppDeploymentRecordAttributes {
  application: string;
  dns: string;
  meta: string;
  name: string;
  request: string;
  type: string;
  url: string;
  version: string;
}

interface RegistryRecord {
  id: string;
  names: string[] | null;
  owners: string[];
  bondId: string;
  createTime: string;
  expiryTime: string;
}

export interface AppDeploymentRecord extends RegistryRecord {
  attributes: AppDeploymentRecordAttributes
}
