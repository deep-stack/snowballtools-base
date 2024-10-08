export interface PackageJSON {
  name: string;
  version: string;
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
  deleted: boolean;
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

export interface AppDeploymentRemovalRecordAttributes {
  deployment: string;
  request: string;
  type: 'ApplicationDeploymentRemovalRecord';
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
  attributes: AppDeploymentRecordAttributes;
}

export interface AppDeploymentRemovalRecord extends RegistryRecord {
  attributes: AppDeploymentRemovalRecordAttributes;
}

export interface AddProjectFromTemplateInput {
  templateOwner: string;
  templateRepo: string;
  owner: string;
  name: string;
  isPrivate: boolean;
}

export interface Auction {
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
  winningBids: string[];
  winningPrice?: string;
  maxPrice?: string;
  numProviders: number;
  fundsReleased: boolean;
}

export interface AuctionData {
  maxPrice: string,
  numProviders: number,
}
