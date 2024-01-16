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

import { ServerConfig } from './type';

const log = debug('snowball:server');

const DEFAULT_GQL_PATH = '/graphql';

export const createAndStartServer = async (
  typeDefs: TypeSource,
  resolvers: any,
  serverConfig: ServerConfig
): Promise<ApolloServer> => {
  const { host, port, gqlPath = DEFAULT_GQL_PATH } = serverConfig;

  const app = express();

  // Create HTTP server
  const httpServer = createServer(app);

  // Create the schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: await resolvers()
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
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

  httpServer.listen(port, host, () => {
    log(`Server is listening on ${host}:${port}${server.graphqlPath}`);
  });

  return server;
};
