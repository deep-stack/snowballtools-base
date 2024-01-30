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

const log = debug('snowball:server');

export const main = async (): Promise<void> => {
  // TODO: get config path using cli
  const { server, database, githubOauth } = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);

  const db = new Database(database);
  await db.init();

  // TODO: Move to Service class
  const app = new OAuthApp({
    clientType: 'oauth-app',
    clientId: githubOauth.clientId,
    clientSecret: githubOauth.clientSecret
  });

  const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql')).toString();
  const resolvers = await createResolvers(db, app);

  await createAndStartServer(typeDefs, resolvers, server);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
