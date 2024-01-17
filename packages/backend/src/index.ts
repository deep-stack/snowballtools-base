import 'reflect-metadata';
import debug from 'debug';
import fs from 'fs';
import path from 'path';

import { Database } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolvers';
import { getConfig } from './utils';
import { Config } from './config';

const log = debug('snowball:server');
const configFilePath = 'environments/local.toml';

export const main = async (): Promise<void> => {
  // TODO: get config path using cli
  const { server, database } = await getConfig<Config>(configFilePath);

  const db = new Database(database);
  await db.init();

  const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql')).toString();
  const resolvers = await createResolvers(db);

  await createAndStartServer(typeDefs, resolvers, server);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
