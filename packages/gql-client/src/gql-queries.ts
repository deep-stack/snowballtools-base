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
