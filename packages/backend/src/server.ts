import debug from 'debug';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError
} from 'apollo-server-core';
import session from 'express-session';

import { TypeSource } from '@graphql-tools/utils';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { ServerConfig } from './config';
import { DEFAULT_GQL_PATH } from './constants';
import githubRouter from './routes/github';
import authRouter from './routes/auth';
import { Service } from './service';

const log = debug('snowball:server');

declare module 'express-session' {
  interface SessionData {
    address: string;
    chainId: number;
  }
}

export const createAndStartServer = async (
  serverConfig: ServerConfig,
  typeDefs: TypeSource,
  resolvers: any,
  service: Service
): Promise<ApolloServer> => {
  const { host, port, gqlPath = DEFAULT_GQL_PATH } = serverConfig;
  const { appOriginUrl, secret, domain, trustProxy } = serverConfig.session;

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
    context: async ({ req }) => {
      // https://www.apollographql.com/docs/apollo-server/v3/security/authentication#api-wide-authorization

      const { address } = req.session;

      if (!address) {
        throw new AuthenticationError('Unauthorized: No active session');
      }

      // Find/create user from ETH address in request session
      const user = await service.loadOrCreateUser(address);

      return { user };
    },
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ]
  });

  await server.start();

  app.use(cors({
    origin: appOriginUrl,
    credentials: true
  }));

  const sessionOptions: session.SessionOptions = {
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: new URL(appOriginUrl).protocol === 'https:',
      // TODO: Set cookie maxAge and handle cookie expiry in frontend
      // maxAge: SESSION_COOKIE_MAX_AGE,
      sameSite: new URL(appOriginUrl).protocol === 'https:' ? 'none' : 'lax'
    }
  };

  if (domain) {
    sessionOptions.cookie!.domain = domain;
  }

  if (trustProxy) {
    // trust first proxy
    app.set('trust proxy', 1);
  }

  app.use(
    session(sessionOptions)
  );

  server.applyMiddleware({
    app,
    path: gqlPath,
    cors: {
      origin: [appOriginUrl],
      credentials: true
    }
  });

  app.use(express.json());

  app.set('service', service);
  app.use('/auth', authRouter);
  app.use('/api/github', githubRouter);

  httpServer.listen(port, host, () => {
    log(`Server is listening on ${host}:${port}${server.graphqlPath}`);
  });

  return server;
};
