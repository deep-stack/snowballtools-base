"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AuctionStatus: () => AuctionStatus,
  DeploymentStatus: () => DeploymentStatus,
  DomainStatus: () => DomainStatus,
  Environment: () => Environment,
  GQLClient: () => GQLClient,
  Permission: () => Permission,
  Role: () => Role
});
module.exports = __toCommonJS(src_exports);

// src/client.ts
var import_client3 = require("@apollo/client");

// src/queries.ts
var import_client = require("@apollo/client");
var getUser = import_client.gql`
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
var getProject = import_client.gql`
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
var getProjectsInOrganization = import_client.gql`
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
var getOrganizations = import_client.gql`
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
var getDeployments = import_client.gql`
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
var getEnvironmentVariables = import_client.gql`
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
var getProjectMembers = import_client.gql`
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
var searchProjects = import_client.gql`
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
var getDomains = import_client.gql`
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
var getAuctionStatus = import_client.gql`
query ($auctionId: String!) {
  getAuctionStatus(auctionId: $auctionId)
}
`;

// src/mutations.ts
var import_client2 = require("@apollo/client");
var removeProjectMember = import_client2.gql`
  mutation ($projectMemberId: String!) {
    removeProjectMember(projectMemberId: $projectMemberId)
  }
`;
var updateProjectMember = import_client2.gql`
  mutation ($projectMemberId: String!, $data: UpdateProjectMemberInput) {
    updateProjectMember(projectMemberId: $projectMemberId, data: $data)
  }
`;
var addProjectMember = import_client2.gql`
  mutation ($projectId: String!, $data: AddProjectMemberInput) {
    addProjectMember(projectId: $projectId, data: $data)
  }
`;
var addEnvironmentVariables = import_client2.gql`
  mutation ($projectId: String!, $data: [AddEnvironmentVariableInput!]) {
    addEnvironmentVariables(projectId: $projectId, data: $data)
  }
`;
var updateEnvironmentVariable = import_client2.gql`
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
var removeEnvironmentVariable = import_client2.gql`
  mutation ($environmentVariableId: String!) {
    removeEnvironmentVariable(environmentVariableId: $environmentVariableId)
  }
`;
var updateDeploymentToProd = import_client2.gql`
  mutation ($deploymentId: String!) {
    updateDeploymentToProd(deploymentId: $deploymentId)
  }
`;
var addProjectFromTemplate = import_client2.gql`
  mutation ($organizationSlug: String!, $data: AddProjectFromTemplateInput, $lrn: String, $auctionData: AuctionData) {
    addProjectFromTemplate(organizationSlug: $organizationSlug, data: $data, lrn: $lrn, auctionData: $auctionData) {
      id
    }
  }
`;
var addProject = import_client2.gql`
  mutation ($organizationSlug: String!, $data: AddProjectInput, $lrn: String, $auctionData: AuctionData) {
    addProject(organizationSlug: $organizationSlug, data: $data, lrn: $lrn, auctionData: $auctionData) {
      id
    }
  }
`;
var updateProjectMutation = import_client2.gql`
  mutation ($projectId: String!, $data: UpdateProjectInput) {
    updateProject(projectId: $projectId, data: $data)
  }
`;
var updateDomainMutation = import_client2.gql`
  mutation ($domainId: String!, $data: UpdateDomainInput!) {
    updateDomain(domainId: $domainId, data: $data)
  }
`;
var redeployToProd = import_client2.gql`
  mutation ($deploymentId: String!) {
    redeployToProd(deploymentId: $deploymentId)
  }
`;
var deleteProject = import_client2.gql`
  mutation ($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;
var deleteDomain = import_client2.gql`
  mutation ($domainId: String!) {
    deleteDomain(domainId: $domainId)
  }
`;
var rollbackDeployment = import_client2.gql`
  mutation ($projectId: String!, $deploymentId: String!) {
    rollbackDeployment(projectId: $projectId, deploymentId: $deploymentId)
  }
`;
var deleteDeployment = import_client2.gql`
  mutation ($deploymentId: String!) {
    deleteDeployment(deploymentId: $deploymentId)
  }
`;
var addDomain = import_client2.gql`
  mutation ($projectId: String!, $data: AddDomainInput!) {
    addDomain(projectId: $projectId, data: $data)
  }
`;
var authenticateGitHub = import_client2.gql`
  mutation ($code: String!) {
    authenticateGitHub(code: $code) {
      token
    }
  }
`;
var unauthenticateGitHub = import_client2.gql`
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
    this.client = new import_client3.ApolloClient({
      uri: config.gqlEndpoint,
      cache: new import_client3.InMemoryCache(),
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
  getAuctionStatus(auctionId) {
    return __async(this, null, function* () {
      const { data } = yield this.client.query({
        query: getAuctionStatus,
        variables: {
          auctionId
        }
      });
      return data;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuctionStatus,
  DeploymentStatus,
  DomainStatus,
  Environment,
  GQLClient,
  Permission,
  Role
});
//# sourceMappingURL=index.js.map