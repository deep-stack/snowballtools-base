import debug from 'debug';

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export interface GraphQLConfig {
  gqlEndpoint: string;
}

const log = debug('snowball:gql-client');

export class GQLClient {
  private client?: ApolloClient<NormalizedCacheObject>;

  constructor (config: GraphQLConfig) {
    log('GQL endpoint', config.gqlEndpoint);
  }
}
