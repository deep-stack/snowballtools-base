import 'reflect-metadata';
import debug from 'debug';

import { initializeDatabase } from './database';
import { createAndStartServer } from './server';
import { createResolvers } from './resolver';
import { typeDefs } from './schema';

const log = debug('snowball:server');

const serverConfig = {
  host: 'localhost',
  port: 8000
};

export const main = async (): Promise<void> => {
  await initializeDatabase();
  await createAndStartServer(typeDefs, createResolvers, serverConfig);
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
