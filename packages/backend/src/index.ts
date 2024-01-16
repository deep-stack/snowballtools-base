import 'reflect-metadata';
import debug from 'debug';
import fs from 'fs';
import path from 'path';

import { initializeDatabase } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolver';
import { getConfig } from './utils';
import { Config } from './type';

const log = debug('snowball:server');
const configFilePath = 'environments/local.toml';

export const main = async (): Promise<void> => {
  // TODO: get config path using cli
  const { server } = await getConfig<Config>(configFilePath);

  await initializeDatabase();
  const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql')).toString();
  await createAndStartServer(typeDefs, createResolvers, server);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
