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
    projects {
      id
      owner {
        id
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
