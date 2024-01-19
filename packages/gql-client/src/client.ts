import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import { getUser, getOrganizations, getDeployments } from './queries';

export interface GraphQLConfig {
  gqlEndpoint: string;
}

export class GQLClient {
  private client: ApolloClient<NormalizedCacheObject>;

  constructor (config: GraphQLConfig) {
    this.client = new ApolloClient({
      uri: config.gqlEndpoint,
      cache: new InMemoryCache()
    });
  }

  async getUser () : Promise<any> {
    const { data } = await this.client.query({
      query: getUser
    });

    return data;
  }

  async getOrganizations () : Promise<any> {
    const { data } = await this.client.query({
      query: getOrganizations
    });

    return data;
  }

  async getDeployments (projectId: string) : Promise<any> {
    const { data } = await this.client.query({
      query: getDeployments,
      variables: {
        projectId
      }
    });

    return data;
  }
}
