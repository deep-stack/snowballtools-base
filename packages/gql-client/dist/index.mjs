var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/client.ts
import {
  ApolloClient,
  InMemoryCache
} from "@apollo/client";

// src/queries.ts
import { gql } from "@apollo/client";
var getUser = gql`
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
var getProject = gql`
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
    deployerLrns
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
var getProjectsInOrganization = gql`
query ($organizationSlug: String!) {
  projectsInOrganization(organizationSlug: $organizationSlug) {
    id
    name
    createdAt
    description
    framework
    auctionId
    deployerLrns
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
var getOrganizations = gql`
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
var getDeployments = gql`
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
var getEnvironmentVariables = gql`
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
var getProjectMembers = gql`
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
var searchProjects = gql`
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
    deployerLrns
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
var getDomains = gql`
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
var getAuctionData = gql`
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
    winnerBids {
      type
      quantity
    }
    winnerPrice {
      type
      quantity
    }
    maxPrice {
      type
      quantity
    }
    numProviders
    fundsReleased
    bids {
      bidderAddress
      status
      commitHash
      commitTime
      revealTime
      commitFee {
        type
        quantity
      }
      revealFee {
        type
        quantity
      }
      bidAmount {
        type
        quantity
      }
    }
  }
}
`;

// src/mutations.ts
import { gql as gql2 } from "@apollo/client";
var removeProjectMember = gql2`
  mutation ($projectMemberId: String!) {
    removeProjectMember(projectMemberId: $projectMemberId)
  }
`;
var updateProjectMember = gql2`
  mutation ($projectMemberId: String!, $data: UpdateProjectMemberInput) {
    updateProjectMember(projectMemberId: $projectMemberId, data: $data)
  }
`;
var addProjectMember = gql2`
  mutation ($projectId: String!, $data: AddProjectMemberInput) {
    addProjectMember(projectId: $projectId, data: $data)
  }
`;
var addEnvironmentVariables = gql2`
  mutation ($projectId: String!, $data: [AddEnvironmentVariableInput!]) {
    addEnvironmentVariables(projectId: $projectId, data: $data)
  }
`;
var updateEnvironmentVariable = gql2`
  mutation (
    $environmentVariableId: String!
    $data: UpdateEnvironmentVariableInput!
  ) {
    updateEnvironmentVariable(
      environmentVariableId: $environmentVariableId
      data: $data
    )
  }
`;
var removeEnvironmentVariable = gql2`
  mutation ($environmentVariableId: String!) {
    removeEnvironmentVariable(environmentVariableId: $environmentVariableId)
  }
`;
var updateDeploymentToProd = gql2`
  mutation ($deploymentId: String!) {
    updateDeploymentToProd(deploymentId: $deploymentId)
  }
`;
var addProjectFromTemplate = gql2`
  mutation ($organizationSlug: String!, $data: AddProjectFromTemplateInput, $lrn: String, $auctionData: AuctionData) {
    addProjectFromTemplate(organizationSlug: $organizationSlug, data: $data, lrn: $lrn, auctionData: $auctionData) {
      id
    }
  }
`;
var addProject = gql2`
  mutation ($organizationSlug: String!, $data: AddProjectInput, $lrn: String, $auctionData: AuctionData) {
    addProject(organizationSlug: $organizationSlug, data: $data, lrn: $lrn, auctionData: $auctionData) {
      id
    }
  }
`;
var updateProjectMutation = gql2`
  mutation ($projectId: String!, $data: UpdateProjectInput) {
    updateProject(projectId: $projectId, data: $data)
  }
`;
var updateDomainMutation = gql2`
  mutation ($domainId: String!, $data: UpdateDomainInput!) {
    updateDomain(domainId: $domainId, data: $data)
  }
`;
var redeployToProd = gql2`
  mutation ($deploymentId: String!) {
    redeployToProd(deploymentId: $deploymentId)
  }
`;
var deleteProject = gql2`
  mutation ($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;
var deleteDomain = gql2`
  mutation ($domainId: String!) {
    deleteDomain(domainId: $domainId)
  }
`;
var rollbackDeployment = gql2`
  mutation ($projectId: String!, $deploymentId: String!) {
    rollbackDeployment(projectId: $projectId, deploymentId: $deploymentId)
  }
`;
var deleteDeployment = gql2`
  mutation ($deploymentId: String!) {
    deleteDeployment(deploymentId: $deploymentId)
  }
`;
var addDomain = gql2`
  mutation ($projectId: String!, $data: AddDomainInput!) {
    addDomain(projectId: $projectId, data: $data)
  }
`;
var authenticateGitHub = gql2`
  mutation ($code: String!) {
    authenticateGitHub(code: $code) {
      token
    }
  }
`;
var unauthenticateGitHub = gql2`
  mutation {
    unauthenticateGitHub
  }
`;

// src/client.ts
var defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore"
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  }
};
var GQLClient = class {
  constructor(config) {
    this.client = new ApolloClient({
      uri: config.gqlEndpoint,
      cache: new InMemoryCache(),
      defaultOptions,
      credentials: "include"
    });
  }
  getUser() {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getUser
      });
      return data;
    });
  }
  getProject(projectId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getProject,
        variables: {
          projectId
        }
      });
      return data;
    });
  }
  getProjectsInOrganization(organizationSlug) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getProjectsInOrganization,
        variables: {
          organizationSlug
        }
      });
      return data;
    });
  }
  getOrganizations() {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getOrganizations
      });
      return data;
    });
  }
  getDeployments(projectId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getDeployments,
        variables: {
          projectId
        }
      });
      return data;
    });
  }
  getEnvironmentVariables(projectId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getEnvironmentVariables,
        variables: {
          projectId
        }
      });
      return data;
    });
  }
  getProjectMembers(projectId) {
    return __async(this, null, function* () {
      const result = yield this.client.query({
        query: getProjectMembers,
        variables: {
          projectId
        }
      });
      return result.data;
    });
  }
  addProjectMember(projectId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: addProjectMember,
        variables: {
          projectId,
          data
        }
      });
      return result.data;
    });
  }
  updateProjectMember(projectMemberId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: updateProjectMember,
        variables: {
          projectMemberId,
          data
        }
      });
      return result.data;
    });
  }
  removeProjectMember(projectMemberId) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: removeProjectMember,
        variables: {
          projectMemberId
        }
      });
      return result.data;
    });
  }
  searchProjects(searchText) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: searchProjects,
        variables: {
          searchText
        }
      });
      return data;
    });
  }
  addEnvironmentVariables(projectId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: addEnvironmentVariables,
        variables: {
          projectId,
          data
        }
      });
      return result.data;
    });
  }
  updateEnvironmentVariable(environmentVariableId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: updateEnvironmentVariable,
        variables: {
          environmentVariableId,
          data
        }
      });
      return result.data;
    });
  }
  removeEnvironmentVariable(environmentVariableId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: removeEnvironmentVariable,
        variables: {
          environmentVariableId
        }
      });
      return data;
    });
  }
  updateDeploymentToProd(deploymentId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: updateDeploymentToProd,
        variables: {
          deploymentId
        }
      });
      return data;
    });
  }
  addProjectFromTemplate(organizationSlug, data, lrn, auctionData) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: addProjectFromTemplate,
        variables: {
          organizationSlug,
          data,
          lrn,
          auctionData
        }
      });
      return result.data;
    });
  }
  addProject(organizationSlug, data, lrn, auctionData) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: addProject,
        variables: {
          organizationSlug,
          data,
          lrn,
          auctionData
        }
      });
      return result.data;
    });
  }
  updateProject(projectId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: updateProjectMutation,
        variables: {
          projectId,
          data
        }
      });
      return result.data;
    });
  }
  updateDomain(domainId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: updateDomainMutation,
        variables: {
          domainId,
          data
        }
      });
      return result.data;
    });
  }
  redeployToProd(deploymentId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: redeployToProd,
        variables: {
          deploymentId
        }
      });
      return data;
    });
  }
  deleteProject(projectId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: deleteProject,
        variables: {
          projectId
        }
      });
      return data;
    });
  }
  deleteDomain(domainId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: deleteDomain,
        variables: {
          domainId
        }
      });
      return data;
    });
  }
  rollbackDeployment(projectId, deploymentId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: rollbackDeployment,
        variables: {
          projectId,
          deploymentId
        }
      });
      return data;
    });
  }
  deleteDeployment(deploymentId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: deleteDeployment,
        variables: {
          deploymentId
        }
      });
      return data;
    });
  }
  addDomain(projectId, data) {
    return __async(this, null, function* () {
      const result = yield this.client.mutate({
        mutation: addDomain,
        variables: {
          projectId,
          data
        }
      });
      return result.data;
    });
  }
  getDomains(projectId, filter) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getDomains,
        variables: {
          projectId,
          filter
        }
      });
      return data;
    });
  }
  authenticateGitHub(code) {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: authenticateGitHub,
        variables: {
          code
        }
      });
      return data;
    });
  }
  unauthenticateGithub() {
    return __async(this, null, function* () {
      const { data } = yield this.client.mutate({
        mutation: unauthenticateGitHub
      });
      return data;
    });
  }
  getAuctionData(auctionId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getAuctionData,
        variables: {
          auctionId
        }
      });
      return data.getAuctionData;
    });
  }
};

// src/types.ts
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["Owner"] = "Owner";
  Role2["Maintainer"] = "Maintainer";
  Role2["Reader"] = "Reader";
  return Role2;
})(Role || {});
var Permission = /* @__PURE__ */ ((Permission2) => {
  Permission2["View"] = "View";
  Permission2["Edit"] = "Edit";
  return Permission2;
})(Permission || {});
var Environment = /* @__PURE__ */ ((Environment2) => {
  Environment2["Production"] = "Production";
  Environment2["Preview"] = "Preview";
  Environment2["Development"] = "Development";
  return Environment2;
})(Environment || {});
var DeploymentStatus = /* @__PURE__ */ ((DeploymentStatus2) => {
  DeploymentStatus2["Building"] = "Building";
  DeploymentStatus2["Ready"] = "Ready";
  DeploymentStatus2["Error"] = "Error";
  DeploymentStatus2["Deleting"] = "Deleting";
  return DeploymentStatus2;
})(DeploymentStatus || {});
var AuctionStatus = /* @__PURE__ */ ((AuctionStatus2) => {
  AuctionStatus2["AuctionStatusCommitPhase"] = "commit";
  AuctionStatus2["AuctionStatusRevealPhase"] = "reveal";
  AuctionStatus2["AuctionStatusExpired"] = "expired";
  AuctionStatus2["AuctionStatusCompleted"] = "completed";
  return AuctionStatus2;
})(AuctionStatus || {});
var DomainStatus = /* @__PURE__ */ ((DomainStatus2) => {
  DomainStatus2["Live"] = "Live";
  DomainStatus2["Pending"] = "Pending";
  return DomainStatus2;
})(DomainStatus || {});
export {
  AuctionStatus,
  DeploymentStatus,
  DomainStatus,
  Environment,
  GQLClient,
  Permission,
  Role
};
//# sourceMappingURL=index.mjs.map