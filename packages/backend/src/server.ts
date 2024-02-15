import debug from 'debug';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';

import { TypeSource } from '@graphql-tools/utils';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { ServerConfig } from './config';
import { DEFAULT_GQL_PATH, USER_ID } from './constants';
import githubRouter from './routes/github';
import { Service } from './service';

const log = debug('snowball:server');

export const createAndStartServer = async (
  serverConfig: ServerConfig,
  typeDefs: TypeSource,
  resolvers: any,
  service: Service
): Promise<ApolloServer> => {
  const { host, port, gqlPath = DEFAULT_GQL_PATH } = serverConfig;

  const app = express();

  // Create HTTP server
  const httpServer = createServer(app);

  // Create the schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: () => {
      // TODO: Use userId derived from auth token
      return { userId: USER_ID };
    },
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ]
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: gqlPath
  });

  app.set('service', service);
  app.use(express.json());
  app.use('/api/github', githubRouter);

  httpServer.listen(port, host, () => {
    log(`Server is listening on ${host}:${port}${server.graphqlPath}`);
  });

  return server;
};
