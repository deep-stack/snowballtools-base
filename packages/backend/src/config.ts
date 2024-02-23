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
  }
}

export interface RegistryConfig {
  restEndpoint: string;
  gqlEndpoint: string;
  chainId: string;
  privateKey: string;
  bondId: string;
  fetchDeploymentRecordDelay: number;
  authority: string;
  fee: {
    amount: string;
    denom: string;
    gas: string;
  }
}

export interface MiscConfig {
  projectDomain: string;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  gitHub: GitHubConfig;
  registryConfig: RegistryConfig;
  misc: MiscConfig;
}
