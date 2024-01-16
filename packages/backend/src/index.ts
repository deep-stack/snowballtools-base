import 'reflect-metadata';
import debug from 'debug';

import { initializeDatabase } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolver';
import { typeDefs } from './schema';
import { getConfig } from './utils';
import { Config } from './type';

const log = debug('snowball:server');
const configFilePath = 'environments/local.toml';

export const main = async (): Promise<void> => {
  // TODO: get config path using cli
  const { server } = await getConfig<Config>(configFilePath);

  await initializeDatabase();
  await createAndStartServer(typeDefs, createResolvers, server);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
