import process from 'process';

export const DEFAULT_CONFIG_FILE_PATH = process.env.SNOWBALL_BACKEND_CONFIG_FILE_PATH || 'environments/local.toml';

export const DEFAULT_GQL_PATH = '/graphql';

// Note: temporary hardcoded user, later to be derived from auth token
export const USER_ID = process.env.SNOWBALL_BACKEND_USER_ID || '60f4355d-9549-4aac-9b54-eeefceeabef0';

export const PROJECT_DOMAIN = process.env.SNOWBALL_BACKEND_PROJECT_DOMAIN || 'snowball.xyz';
