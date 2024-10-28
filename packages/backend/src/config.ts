export interface SessionConfig {
  secret: string;
  appOriginUrl: string;
  trustProxy: boolean;
  domain: string;
}

export interface ServerConfig {
  host: string;
  port: number;
  gqlPath?: string;
  sessionSecret: string;
  appOriginUrl: string;
  isProduction: boolean;
  session: SessionConfig;
}

export interface DatabaseConfig {
  dbPath: string;
}

export interface GitHubConfig {
  webhookUrl: string;
  oAuth: {
    clientId: string;
    clientSecret: string;
  };
}

export interface RegistryConfig {
  restEndpoint: string;
  gqlEndpoint: string;
  chainId: string;
  privateKey: string;
  bondId: string;
  fetchDeploymentRecordDelay: number;
  checkAuctionStatusDelay: number;
  authority: string;
  fee: {
    gas: string;
    fees: string;
    gasPrice: string;
  };
}

export interface AuctionConfig {
  commitFee: string;
  commitsDuration: string;
  revealFee: string;
  revealsDuration: string;
  denom: string;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  gitHub: GitHubConfig;
  registryConfig: RegistryConfig;
  auction: AuctionConfig;
}
