export interface ServerConfig {
  host: string;
  port: number;
  gqlPath?: string;
}

export interface Config {
  server: ServerConfig;
}
