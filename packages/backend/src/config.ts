export interface ServerConfig {
  host: string;
  port: number;
  gqlPath?: string;
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
  fee: {
    amount: string;
    denom: string;
    gas: string;
  }
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  gitHub: GitHubConfig;
  registryConfig: RegistryConfig;
}
