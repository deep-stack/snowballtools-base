import debug from 'debug';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  AuthenticationError,
} from 'apollo-server-core';
import cookieSession from 'cookie-session';

import { TypeSource } from '@graphql-tools/utils';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { ServerConfig } from './config';
import { DEFAULT_GQL_PATH } from './constants';
import githubRouter from './routes/github';
import authRouter from './routes/auth';
import stagingRouter from './routes/staging';
import { Service } from './service';

const log = debug('snowball:server');

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export const createAndStartServer = async (
  serverConfig: ServerConfig,
  typeDefs: TypeSource,
  resolvers: any,
  service: Service,
): Promise<ApolloServer> => {
  const { host, port, gqlPath = DEFAULT_GQL_PATH } = serverConfig;
  const { appOriginUrl, secret, domain, trustProxy } = serverConfig.session;

  const app = express();

  // Create HTTP server
  const httpServer = createServer(app);

  // Create the schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: async ({ req }) => {
      // https://www.apollographql.com/docs/apollo-server/v3/security/authentication#api-wide-authorization

      const { userId } = req.session;

      if (!userId) {
        throw new AuthenticationError('Unauthorized: No active session');
      }

      const user = await service.getUser(userId);

      return { user };
    },
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  app.use(
    cors({
      origin: appOriginUrl,
      credentials: true,
    }),
  );

  if (trustProxy) {
    // trust first proxy
    app.set('trust proxy', 1);
  }

  app.use(
    cookieSession({
      secret: secret,
      secure: new URL(appOriginUrl).protocol === 'https:',
      // 23 hours (less than 24 hours to avoid sessionSigs expiration issues)
      maxAge: 23 * 60 * 60 * 1000,
      sameSite: new URL(appOriginUrl).protocol === 'https:' ? 'none' : 'lax',
      domain: domain || undefined,
    }),
  );

  server.applyMiddleware({
    app,
    path: gqlPath,
    cors: {
      origin: [appOriginUrl],
      credentials: true,
    },
  });

  app.use(express.json());

  app.set('service', service);
  app.use('/auth', authRouter);
  app.use('/api/github', githubRouter);
  app.use('/staging', stagingRouter);

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });

  httpServer.listen(port, host, () => {
    log(`Server is listening on ${host}:${port}${server.graphqlPath}`);
  });

  return server;
};
