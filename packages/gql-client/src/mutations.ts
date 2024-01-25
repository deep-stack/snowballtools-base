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
