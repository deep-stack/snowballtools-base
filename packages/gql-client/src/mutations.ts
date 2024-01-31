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

export const addEnvironmentVariables = gql`
mutation ($projectId: String!, $environmentVariables: [AddEnvironmentVariableInput!]) {
  addEnvironmentVariables(projectId: $projectId, environmentVariables: $environmentVariables)
}
`;

export const updateEnvironmentVariable = gql`
mutation ($environmentVariableId: String!, $environmentVariable: UpdateEnvironmentVariableInput!) {
  updateEnvironmentVariable(environmentVariableId: $environmentVariableId, environmentVariable: $environmentVariable)
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

export const updateProjectMutation = gql`
mutation ($projectId: String!, $projectDetails: UpdateProjectInput) {
  updateProject(projectId: $projectId, projectDetails: $projectDetails)
}`;

export const updateDomainMutation = gql`
mutation ($domainId: String!, $domainDetails: UpdateDomainInput!) {
  updateDomain(domainId: $domainId, domainDetails: $domainDetails)
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

export const rollbackDeployment = gql`
mutation ($projectId: String! ,$deploymentId: String!) {
  rollbackDeployment(projectId: $projectId, deploymentId: $deploymentId)
}
`;

export const addDomain = gql`
mutation ($projectId: String!, $domainDetails: AddDomainInput!) {
  addDomain(projectId: $projectId, domainDetails: $domainDetails)
}
`;

export const authenticateGitHub = gql`
mutation ($code: String!) {
  authenticateGitHub(code: $code) {
    token
  }
}`;

export const unauthenticateGitHub = gql`
mutation {
  unauthenticateGitHub
}`;
