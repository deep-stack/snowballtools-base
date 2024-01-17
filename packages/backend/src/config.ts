export interface ServerConfig {
  host: string;
  port: number;
  gqlPath?: string;
}

export interface DatabaseConfig {
  dbPath: string;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
}
