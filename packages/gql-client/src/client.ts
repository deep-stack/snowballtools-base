import { ApolloClient, DefaultOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import { getUser, getOrganizations, getDeployments, getProjectMembers, removeMember } from './queries';
import { getDeploymentsResponse, getOrganizationsResponse, getProjectMembersResponse, getUserResponse, removeMemberResponse } from './types';

export interface GraphQLConfig {
  gqlEndpoint: string;
}

// TODO: check options
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};

export class GQLClient {
  private client: ApolloClient<NormalizedCacheObject>;

  constructor (config: GraphQLConfig) {
    this.client = new ApolloClient({
      uri: config.gqlEndpoint,
      cache: new InMemoryCache(),
      defaultOptions
    });
  }

  async getUser () : Promise<getUserResponse> {
    const { data } = await this.client.query({
      query: getUser
    });

    return data;
  }

  async getOrganizations () : Promise<getOrganizationsResponse> {
    const { data } = await this.client.query({
      query: getOrganizations
    });

    return data;
  }

  async getDeployments (projectId: string) : Promise<getDeploymentsResponse> {
    const { data } = await this.client.query({
      query: getDeployments,
      variables: {
        projectId
      }
    });

    return data;
  }

  async removeMember (memberId: string): Promise<removeMemberResponse> {
    const { data } = await this.client.mutate({
      mutation: removeMember,
      variables: {
        memberId
      }
    });

    return data;
  }

  async getProjectMembers (projectId: string) : Promise<getProjectMembersResponse> {
    const { data } = await this.client.query({
      query: getProjectMembers,
      variables: {
        projectId
      }
    });

    return data;
  }
}
