import 'reflect-metadata';
import debug from 'debug';
import fs from 'fs';
import path from 'path';

import { OAuthApp } from '@octokit/oauth-app';

import { Database } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolvers';
import { getConfig } from './utils';
import { Service } from './service';
import { Registry } from './registry';

const log = debug('snowball:server');
const OAUTH_CLIENT_TYPE = 'oauth-app';

export const main = async (): Promise<void> => {
  const { server, database, gitHub, registryConfig, misc } = await getConfig();

  const app = new OAuthApp({
    clientType: OAUTH_CLIENT_TYPE,
    clientId: gitHub.oAuth.clientId,
    clientSecret: gitHub.oAuth.clientSecret,
  });

  const db = new Database(database, misc);
  await db.init();

  const registry = new Registry(registryConfig);
  const service = new Service(
    { gitHubConfig: gitHub, registryConfig },
    db,
    app,
    registry,
  );

  const typeDefs = fs
    .readFileSync(path.join(__dirname, 'schema.gql'))
    .toString();
  const resolvers = await createResolvers(service);

  await createAndStartServer(server, typeDefs, resolvers, service);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
