import 'reflect-metadata';
import debug from 'debug';
import fs from 'fs';
import path from 'path';

import { OAuthApp } from '@octokit/oauth-app';

import { Database } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolvers';
import { getConfig } from './utils';
import { Config } from './config';
import { DEFAULT_CONFIG_FILE_PATH } from './constants';
import { Service } from './service';
import { Registry } from './registry';

const log = debug('snowball:server');
const OAUTH_CLIENT_TYPE = 'oauth-app';

export const main = async (): Promise<void> => {
  // TODO: get config path using cli
  const { server, database, githubOauth, registryConfig } = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);

  const app = new OAuthApp({
    clientType: OAUTH_CLIENT_TYPE,
    clientId: githubOauth.clientId,
    clientSecret: githubOauth.clientSecret
  });

  const db = new Database(database);
  await db.init();

  const registry = new Registry(registryConfig);
  const service = new Service(db, app, registry);

  const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql')).toString();
  const resolvers = await createResolvers(service);

  await createAndStartServer(typeDefs, resolvers, server);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
