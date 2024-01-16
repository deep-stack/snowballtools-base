export interface ServerConfig {
  host: string;
  port: number;
  gqlPath?: string;
}

export interface DatabaseConfig {
  database: string;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
}
