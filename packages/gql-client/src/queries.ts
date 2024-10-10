import { gql } from '@apollo/client';

export const getUser = gql`
query {
  user {
    id
    name
    email
    createdAt
    updatedAt
    gitHubToken
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
    auctionId
    deployerLrn
    framework
    repository
    webhooks
    icon
    subDomain
    organization {
      id
      name
    }
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
      }
      createdBy {
        id
        name
      }
    }
  }
}
`;

export const getProjectsInOrganization = gql`
query ($organizationSlug: String!) {
  projectsInOrganization(organizationSlug: $organizationSlug) {
    id
    name
    createdAt
    description
    framework
    auctionId
    deployerLrn
    prodBranch
    webhooks
    repository
    updatedAt
    icon
    subDomain
    deployments {
      id
      branch
      isCurrent
      status
      updatedAt
      commitHash
      commitMessage
      createdAt
      environment
      domain {
        status
        branch
        createdAt
        updatedAt
        id
        name
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
    slug
    createdAt
    updatedAt
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
      id
      name
      status
      updatedAt
    }
    branch
    commitHash
    commitMessage
    url
    auctionId
    deployerLrn
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
      isVerified
    }
    isPending
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
    auctionId
    deployerLrn
    prodBranch
    webhooks
    updatedAt
    template
    repository
    organization {
      id
      name
      slug
      createdAt
      updatedAt
    }
  }
}
`;

export const getDomains = gql`
query ($projectId: String!, $filter: FilterDomainsInput) {
  domains(projectId: $projectId, filter: $filter) {
    branch
    createdAt
    redirectTo {
      id
      name
      branch
      status
    }
    id
    name
    status
    updatedAt
  }
}
`;

export const getAuctionData = gql`
query ($auctionId: String!) {
  getAuctionData(auctionId: $auctionId){
    id
    kind
    status
    ownerAddress
    createTime
    commitsEndTime
    revealsEndTime
    commitFee {
      type
      quantity
    }
    revealFee {
      type
      quantity
    }
    minimumBid {
      type
      quantity
    }
    winnerAddresses
    winningBids
    winningPrice
    maxPrice
    numProviders
    fundsReleased
  }
}
`;
