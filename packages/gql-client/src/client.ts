import { ApolloClient, DefaultOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

import { getUser, getOrganizations, getDeployments, getProjectMembers, searchProjects, getEnvironmentVariables, getProject, getDomains, getProjectsInOrganization } from './queries';
import { AddEnvironmentVariableInput, AddEnvironmentVariablesResponse, GetDeploymentsResponse, GetEnvironmentVariablesResponse, GetOrganizationsResponse, GetProjectMembersResponse, SearchProjectsResponse, GetUserResponse, UpdateDeploymentToProdResponse, GetProjectResponse, UpdateProjectResponse, UpdateProjectInput, RedeployToProdResponse, DeleteProjectResponse, GetProjectsInOrganizationResponse, RollbackDeploymentResponse, AddDomainInput, AddDomainResponse, GetDomainsResponse, UpdateDomainInput, UpdateDomainResponse, AuthenticateGitHubResponse, UnauthenticateGitHubResponse, UpdateEnvironmentVariableResponse, UpdateEnvironmentVariableInput, RemoveEnvironmentVariableResponse, UpdateProjectMemberInput, RemoveProjectMemberResponse, UpdateProjectMemberResponse, DeleteDomainResponse, AddProjectMemberInput, AddProjectMemberResponse, AddProjectInput, AddProjectResponse } from './types';
import { removeProjectMember, addEnvironmentVariables, updateDeploymentToProd, updateProjectMutation, redeployToProd, deleteProject, addDomain, rollbackDeployment, updateDomainMutation, authenticateGitHub, unauthenticateGitHub, updateEnvironmentVariable, removeEnvironmentVariable, updateProjectMember, deleteDomain, addProjectMember, addProject } from './mutations';

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

  async getProject (projectId: string) : Promise<GetProjectResponse> {
    const { data } = await this.client.query({
      query: getProject,
      variables: {
        projectId
      }
    });

    return data;
  }

  async getProjectsInOrganization (organizationId: string) : Promise<GetProjectsInOrganizationResponse> {
    const { data } = await this.client.query({
      query: getProjectsInOrganization,
      variables: {
        organizationId
      }
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

  async getProjectMembers (projectId: string) : Promise<GetProjectMembersResponse> {
    const result = await this.client.query({
      query: getProjectMembers,
      variables: {
        projectId
      }
    });

    return result.data;
  }

  async addProjectMember (projectId: string, data: AddProjectMemberInput) : Promise<AddProjectMemberResponse> {
    const result = await this.client.mutate({
      mutation: addProjectMember,
      variables: {
        projectId,
        data
      }
    });

    return result.data;
  }

  async updateProjectMember (projectMemberId: string, data: UpdateProjectMemberInput): Promise<UpdateProjectMemberResponse> {
    const result = await this.client.mutate({
      mutation: updateProjectMember,
      variables: {
        projectMemberId,
        data
      }
    });

    return result.data;
  }

  async removeProjectMember (projectMemberId: string): Promise<RemoveProjectMemberResponse> {
    const result = await this.client.mutate({
      mutation: removeProjectMember,
      variables: {
        projectMemberId
      }
    });

    return result.data;
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

  async addEnvironmentVariables (projectId: string, data: AddEnvironmentVariableInput[]): Promise<AddEnvironmentVariablesResponse> {
    const result = await this.client.mutate({
      mutation: addEnvironmentVariables,
      variables: {
        projectId,
        data
      }
    });

    return result.data;
  }

  async updateEnvironmentVariable (environmentVariableId: string, data: UpdateEnvironmentVariableInput): Promise<UpdateEnvironmentVariableResponse> {
    const result = await this.client.mutate({
      mutation: updateEnvironmentVariable,
      variables: {
        environmentVariableId,
        data
      }
    });

    return result.data;
  }

  async removeEnvironmentVariable (environmentVariableId: string): Promise<RemoveEnvironmentVariableResponse> {
    const { data } = await this.client.mutate({
      mutation: removeEnvironmentVariable,
      variables: {
        environmentVariableId
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

  async addProject (projectDetails: AddProjectInput): Promise<AddProjectResponse> {
    const { data } = await this.client.mutate({
      mutation: addProject,
      variables: {
        projectDetails
      }
    });

    return data;
  }

  async updateProject (projectId: string, projectDetails: UpdateProjectInput): Promise<UpdateProjectResponse> {
    const { data } = await this.client.mutate({
      mutation: updateProjectMutation,
      variables: {
        projectId,
        projectDetails
      }
    });

    return data;
  }

  async updateDomain (domainId: string, domainDetails: UpdateDomainInput): Promise<UpdateDomainResponse> {
    const { data } = await this.client.mutate({
      mutation: updateDomainMutation,
      variables: {
        domainId,
        domainDetails
      }
    });

    return data;
  }

  async redeployToProd (deploymentId: string): Promise<RedeployToProdResponse> {
    const { data } = await this.client.mutate({
      mutation: redeployToProd,
      variables: {
        deploymentId
      }
    });

    return data;
  }

  async deleteProject (projectId: string): Promise<DeleteProjectResponse> {
    const { data } = await this.client.mutate({
      mutation: deleteProject,
      variables: {
        projectId
      }
    });

    return data;
  }

  async deleteDomain (domainId: string): Promise<DeleteDomainResponse> {
    const { data } = await this.client.mutate({
      mutation: deleteDomain,
      variables: {
        domainId
      }
    });

    return data;
  }

  async rollbackDeployment (projectId: string, deploymentId: string): Promise<RollbackDeploymentResponse> {
    const { data } = await this.client.mutate({
      mutation: rollbackDeployment,
      variables: {
        projectId,
        deploymentId
      }
    });

    return data;
  }

  async addDomain (projectId: string, domainDetails: AddDomainInput): Promise<AddDomainResponse> {
    const { data } = await this.client.mutate({
      mutation: addDomain,
      variables: {
        projectId,
        domainDetails
      }
    });

    return data;
  }

  async getDomains (projectId: string): Promise<GetDomainsResponse> {
    const { data } = await this.client.query({
      query: getDomains,
      variables: {
        projectId
      }
    });

    return data;
  }

  async authenticateGitHub (code: string): Promise<AuthenticateGitHubResponse> {
    const { data } = await this.client.mutate({
      mutation: authenticateGitHub,
      variables: {
        code
      }
    });

    return data;
  }

  async unauthenticateGithub (): Promise<UnauthenticateGitHubResponse> {
    const { data } = await this.client.mutate({
      mutation: unauthenticateGitHub
    });

    return data;
  }
}
