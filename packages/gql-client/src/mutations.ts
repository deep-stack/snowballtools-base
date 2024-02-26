import { gql } from '@apollo/client';

export const removeProjectMember = gql`
mutation ($projectMemberId: String!) {
  removeProjectMember(projectMemberId: $projectMemberId)
}
`;

export const updateProjectMember = gql`
mutation ($projectMemberId: String!, $data: UpdateProjectMemberInput) {
  updateProjectMember(projectMemberId: $projectMemberId, data: $data)
}
`;

export const addProjectMember = gql`
mutation ($projectId: String!, $data: AddProjectMemberInput) {
  addProjectMember(projectId: $projectId, data: $data)
}
`;

export const addEnvironmentVariables = gql`
mutation ($projectId: String!, $data: [AddEnvironmentVariableInput!]) {
  addEnvironmentVariables(projectId: $projectId, data: $data)
}
`;

export const updateEnvironmentVariable = gql`
mutation ($environmentVariableId: String!, $data: UpdateEnvironmentVariableInput!) {
  updateEnvironmentVariable(environmentVariableId: $environmentVariableId, data: $data)
}
`;

export const removeEnvironmentVariable = gql`
mutation ($environmentVariableId: String!) {
  removeEnvironmentVariable(environmentVariableId: $environmentVariableId)
}
`;

export const updateDeploymentToProd = gql`
mutation ($deploymentId: String!) {
  updateDeploymentToProd(deploymentId: $deploymentId)
}
`;

export const addProject = gql`
mutation ($organizationSlug: String!, $data: AddProjectInput) {
  addProject(organizationSlug: $organizationSlug, data: $data) {
    id
  }
}`;

export const updateProjectMutation = gql`
mutation ($projectId: String!, $data: UpdateProjectInput) {
  updateProject(projectId: $projectId, data: $data)
}`;

export const updateDomainMutation = gql`
mutation ($domainId: String!, $data: UpdateDomainInput!) {
  updateDomain(domainId: $domainId, data: $data)
}`;

export const redeployToProd = gql`
mutation ($deploymentId: String!) {
  redeployToProd(deploymentId: $deploymentId)
}
`;

export const deleteProject = gql`
mutation ($projectId: String!) {
  deleteProject(projectId: $projectId)
}
`;

export const deleteDomain = gql`
mutation ($domainId: String!) {
  deleteDomain(domainId: $domainId)
}`;

export const rollbackDeployment = gql`
mutation ($projectId: String! ,$deploymentId: String!) {
  rollbackDeployment(projectId: $projectId, deploymentId: $deploymentId)
}
`;

export const addDomain = gql`
mutation ($projectId: String!, $data: AddDomainInput!) {
  addDomain(projectId: $projectId, data: $data)
}
`;

export const authenticateGitHub = gql`
mutation ($code: String!) {
  authenticateGitHub(code: $code) {
    token
  }
}`;

export const authenticateGit = gql`
mutation ($type: GitType!, $code: String!) {
  authenticateGit(type: $type, code: $code) {
    token
  }
}`;

export const unauthenticateGitHub = gql`
mutation {
  unauthenticateGitHub
}`;
