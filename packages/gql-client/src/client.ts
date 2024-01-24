import { ApolloClient, DefaultOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import { getUser, getOrganizations, getDeployments, getProjectMembers, searchProjects, getEnvironmentVariables } from './queries';
import { AddEnvironmentVariableInput, AddEnvironmentVariablesResponse, GetDeploymentsResponse, GetEnvironmentVariablesResponse, GetOrganizationsResponse, GetProjectMembersResponse, SearchProjectsResponse, GetUserResponse, RemoveMemberResponse, UpdateDeploymentToProdResponse } from './types';
import { removeMember, addEnvironmentVariables, updateDeploymentToProd } from './mutations';

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

  async getUser () : Promise<GetUserResponse> {
    const { data } = await this.client.query({
      query: getUser
    });

    return data;
  }

  async getOrganizations () : Promise<GetOrganizationsResponse> {
    const { data } = await this.client.query({
      query: getOrganizations
    });

    return data;
  }

  async getDeployments (projectId: string) : Promise<GetDeploymentsResponse> {
    const { data } = await this.client.query({
      query: getDeployments,
      variables: {
        projectId
      }
    });

    return data;
  }

  async getEnvironmentVariables (projectId: string) : Promise<GetEnvironmentVariablesResponse> {
    const { data } = await this.client.query({
      query: getEnvironmentVariables,
      variables: {
        projectId
      }
    });

    return data;
  }

  async removeMember (memberId: string): Promise<RemoveMemberResponse> {
    const { data } = await this.client.mutate({
      mutation: removeMember,
      variables: {
        memberId
      }
    });

    return data;
  }

  async getProjectMembers (projectId: string) : Promise<GetProjectMembersResponse> {
    const { data } = await this.client.query({
      query: getProjectMembers,
      variables: {
        projectId
      }
    });

    return data;
  }

  async searchProjects (searchText: string) : Promise<SearchProjectsResponse> {
    const { data } = await this.client.query({
      query: searchProjects,
      variables: {
        searchText
      }
    });

    return data;
  }

  async addEnvironmentVariables (projectId: string, environmentVariables: AddEnvironmentVariableInput[]): Promise<AddEnvironmentVariablesResponse> {
    const { data } = await this.client.mutate({
      mutation: addEnvironmentVariables,
      variables: {
        projectId,
        environmentVariables
      }
    });

    return data;
  }

  async updateDeploymentToProd (deploymentId: string): Promise<UpdateDeploymentToProdResponse> {
    const { data } = await this.client.mutate({
      mutation: updateDeploymentToProd,
      variables: {
        deploymentId
      }
    });

    return data;
  }
}
