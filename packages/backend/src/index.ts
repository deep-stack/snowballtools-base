import 'reflect-metadata';
import debug from 'debug';
import fs from 'fs';
import path from 'path';

import { Database } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolvers';
import { getConfig } from './utils';
import { Config } from './config';
import { DEFAULT_CONFIG_FILE_PATH } from './constants';

const log = debug('snowball:server');

export const main = async (): Promise<void> => {
  // TODO: get config path using cli
  const { server, database } = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);

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
