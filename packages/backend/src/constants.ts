import process from 'process';

export const DEFAULT_CONFIG_FILE_PATH = process.env.SNOWBALL_BACKEND_CONFIG_FILE_PATH || 'environments/local.toml';

export const DEFAULT_GQL_PATH = '/graphql';
