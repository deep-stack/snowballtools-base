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

export const getProject = gql`
query ($projectId: String!) {
  project(projectId: $projectId) {
    createdAt
    description
    id
    name
    template
    updatedAt
    prodBranch
    framework
    repository
    webhooks
    icon
    owner {
      id
      name
      email
    }
    deployments {
      id
      branch
      isCurrent
      status
      title
      updatedAt
      commitHash
      createdAt
      environment
      domain {
        status
        branch
        createdAt
        updatedAt
        id
        name
        isRedirected
      }
    }
  }
}
`;

export const getProjectsInOrganization = gql`
query ($organizationId: String!) {
  projectsInOrganization(organizationId: $organizationId) {
    id
    name
    createdAt
    description
    framework
    prodBranch
    webhooks
    repository
    updatedAt
    icon
    deployments {
      id
      branch
      isCurrent
      status
      title
      updatedAt
      commitHash
      createdAt
      environment
      domain {
        status
        branch
        createdAt
        updatedAt
        id
        name
        isRedirected
      }
    }
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
    createdBy {
      id
      name
      email
    }
  }
}
`;

export const getEnvironmentVariables = gql`
query ($projectId: String!)  {
  environmentVariables(projectId: $projectId) {
    createdAt
    environment
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

export const getDomains = gql`
query ($projectId: String!) {
  domains(projectId: $projectId) {
    branch
    createdAt
    isRedirected
    redirectTo
    id
    name
    status
    updatedAt
  }
}
`;
