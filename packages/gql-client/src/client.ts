import { ApolloClient, DefaultOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import * as queries from './queries';
import * as types from './types';
import * as mutations from './mutations';

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

  async getUser () : Promise<types.GetUserResponse> {
    const { data } = await this.client.query({
      query: queries.getUser
    });

    return data;
  }

  async getProject (projectId: string) : Promise<types.GetProjectResponse> {
    const { data } = await this.client.query({
      query: queries.getProject,
      variables: {
        projectId
      }
    });

    return data;
  }

  async getProjectsInOrganization (organizationSlug: string) : Promise<types.GetProjectsInOrganizationResponse> {
    const { data } = await this.client.query({
      query: queries.getProjectsInOrganization,
      variables: {
        organizationSlug
      }
    });

    return data;
  }

  async getOrganizations () : Promise<types.GetOrganizationsResponse> {
    const { data } = await this.client.query({
      query: queries.getOrganizations
    });

    return data;
  }

  async getDeployments (projectId: string) : Promise<types.GetDeploymentsResponse> {
    const { data } = await this.client.query({
      query: queries.getDeployments,
      variables: {
        projectId
      }
    });

    return data;
  }

  async getEnvironmentVariables (projectId: string) : Promise<types.GetEnvironmentVariablesResponse> {
    const { data } = await this.client.query({
      query: queries.getEnvironmentVariables,
      variables: {
        projectId
      }
    });

    return data;
  }

  async getProjectMembers (projectId: string) : Promise<types.GetProjectMembersResponse> {
    const result = await this.client.query({
      query: queries.getProjectMembers,
      variables: {
        projectId
      }
    });

    return result.data;
  }

  async addProjectMember (projectId: string, data: types.AddProjectMemberInput) : Promise<types.AddProjectMemberResponse> {
    const result = await this.client.mutate({
      mutation: mutations.addProjectMember,
      variables: {
        projectId,
        data
      }
    });

    return result.data;
  }

  async updateProjectMember (projectMemberId: string, data: types.UpdateProjectMemberInput): Promise<types.UpdateProjectMemberResponse> {
    const result = await this.client.mutate({
      mutation: mutations.updateProjectMember,
      variables: {
        projectMemberId,
        data
      }
    });

    return result.data;
  }

  async removeProjectMember (projectMemberId: string): Promise<types.RemoveProjectMemberResponse> {
    const result = await this.client.mutate({
      mutation: mutations.removeProjectMember,
      variables: {
        projectMemberId
      }
    });

    return result.data;
  }

  async searchProjects (searchText: string) : Promise<types.SearchProjectsResponse> {
    const { data } = await this.client.query({
      query: queries.searchProjects,
      variables: {
        searchText
      }
    });

    return data;
  }

  async addEnvironmentVariables (projectId: string, data: types.AddEnvironmentVariableInput[]): Promise<types.AddEnvironmentVariablesResponse> {
    const result = await this.client.mutate({
      mutation: mutations.addEnvironmentVariables,
      variables: {
        projectId,
        data
      }
    });

    return result.data;
  }

  async updateEnvironmentVariable (environmentVariableId: string, data: types.UpdateEnvironmentVariableInput): Promise<types.UpdateEnvironmentVariableResponse> {
    const result = await this.client.mutate({
      mutation: mutations.updateEnvironmentVariable,
      variables: {
        environmentVariableId,
        data
      }
    });

    return result.data;
  }

  async removeEnvironmentVariable (environmentVariableId: string): Promise<types.RemoveEnvironmentVariableResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.removeEnvironmentVariable,
      variables: {
        environmentVariableId
      }
    });

    return data;
  }

  async updateDeploymentToProd (deploymentId: string): Promise<types.UpdateDeploymentToProdResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.updateDeploymentToProd,
      variables: {
        deploymentId
      }
    });

    return data;
  }

  async addProject (organizationSlug: string, data: types.AddProjectInput): Promise<types.AddProjectResponse> {
    const result = await this.client.mutate({
      mutation: mutations.addProject,
      variables: {
        organizationSlug,
        data
      }
    });

    return result.data;
  }

  async updateProject (projectId: string, projectDetails: types.UpdateProjectInput): Promise<types.UpdateProjectResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.updateProjectMutation,
      variables: {
        projectId,
        projectDetails
      }
    });

    return data;
  }

  async updateDomain (domainId: string, domainDetails: types.UpdateDomainInput): Promise<types.UpdateDomainResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.updateDomainMutation,
      variables: {
        domainId,
        domainDetails
      }
    });

    return data;
  }

  async redeployToProd (deploymentId: string): Promise<types.RedeployToProdResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.redeployToProd,
      variables: {
        deploymentId
      }
    });

    return data;
  }

  async deleteProject (projectId: string): Promise<types.DeleteProjectResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.deleteProject,
      variables: {
        projectId
      }
    });

    return data;
  }

  async deleteDomain (domainId: string): Promise<types.DeleteDomainResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.deleteDomain,
      variables: {
        domainId
      }
    });

    return data;
  }

  async rollbackDeployment (projectId: string, deploymentId: string): Promise<types.RollbackDeploymentResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.rollbackDeployment,
      variables: {
        projectId,
        deploymentId
      }
    });

    return data;
  }

  async addDomain (projectId: string, domainDetails: types.AddDomainInput): Promise<types.AddDomainResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.addDomain,
      variables: {
        projectId,
        domainDetails
      }
    });

    return data;
  }

  async getDomains (projectId: string, filter?: types.FilterDomainInput): Promise<types.GetDomainsResponse> {
    const { data } = await this.client.query({
      query: queries.getDomains,
      variables: {
        projectId,
        filter
      }
    });

    return data;
  }

  async authenticateGitHub (code: string): Promise<types.AuthenticateGitHubResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.authenticateGitHub,
      variables: {
        code
      }
    });

    return data;
  }

  async unauthenticateGithub (): Promise<types.UnauthenticateGitHubResponse> {
    const { data } = await this.client.mutate({
      mutation: mutations.unauthenticateGitHub
    });

    return data;
  }
}
