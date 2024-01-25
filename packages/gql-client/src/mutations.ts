import { gql } from '@apollo/client';

export const removeMember = gql`
mutation ($memberId: String!) {
  removeMember(memberId: $memberId)
}
`;

export const addEnvironmentVariables = gql`
mutation ($projectId: String!, $environmentVariables: [AddEnvironmentVariableInput!]) {
  addEnvironmentVariables(projectId: $projectId, environmentVariables: $environmentVariables)
}
`;

export const updateDeploymentToProd = gql`
mutation ($deploymentId: String!) {
  updateDeploymentToProd(deploymentId: $deploymentId)
}
`;

export const updateProjectMutation = gql`
mutation ($projectId: String!, $updateProject: UpdateProjectInput) {
  updateProject(projectId: $projectId, updateProject: $updateProject)
}`;

export const redeployToProd = gql`
mutation ($deploymentId: String!) {
  redeployToProd(deploymentId: $deploymentId)
}
`;
