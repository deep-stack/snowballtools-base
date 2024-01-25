import { gql } from '@apollo/client';

export const getUser = gql`
query {
  user {
    id
    name
    email
    createdAt
    updatedAt
  }
}
`;

export const getOrganizations = gql`
query {
  organizations {
    id
    name
    projects {
      id
      owner {
        id
        name
      }
      deployments {
        id
      }
      name
      repository
      prodBranch
      description
      template
      framework
      webhooks
      members {
        id
        permissions
        member{
          id
          name
          email
        }
      }
      environmentVariables {
        id
        environments
        key
        value
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
}
`;

export const getDeployments = gql`
query ($projectId: String!)  {
  deployments(projectId: $projectId) {
    id
    domain{
      branch
      createdAt
      isRedirected
      id
      name
      status
      updatedAt
    }
    branch
    commitHash
    title
    environment
    isCurrent
    status
    createdAt
    updatedAt
  }
}
`;

export const getEnvironmentVariables = gql`
query ($projectId: String!)  {
  environmentVariables(projectId: $projectId) {
    createdAt
    environments
    id
    key
    updatedAt
    value
  }
}
`;

export const getProjectMembers = gql`
query ($projectId: String!) {
  projectMembers(projectId: $projectId) {
    id
    member {
      id
      name
      email
    }
    createdAt
    updatedAt
    permissions
  }
}
`;

export const searchProjects = gql`
query ($searchText: String!) {
  searchProjects(searchText: $searchText) {
    id
    name
    prodBranch
    repository
    createdAt
    description
    framework
    prodBranch
    webhooks
    updatedAt
    template
    repository
    organization {
      id
      name
      createdAt
      updatedAt
    }
  }
}
`;