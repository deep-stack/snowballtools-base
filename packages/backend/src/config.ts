export interface ServerConfig {
  host: string;
  port: number;
  gqlPath?: string;
}

export interface DatabaseConfig {
  dbPath: string;
}

export interface GithubOauthConfig {
  clientId: string;
  clientSecret: string;
}

export interface RegistryConfig {
  restEndpoint: string;
  gqlEndpoint: string;
  chainId: string;
  privateKey: string;
  bondId: string;
  fee: {
    amount: string;
    denom: string;
    gas: string;
  }
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  githubOauth: GithubOauthConfig;
  registryConfig: RegistryConfig;
}
