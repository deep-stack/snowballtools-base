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

export const updateDomainMutation = gql`
mutation ($domainId: String!, $updateDomain: UpdateDomainInput!) {
  updateDomain(domainId: $domainId, updateDomain: $updateDomain)
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
  rollbackDeployment(proejctId: $projectId, deploymentId: $deploymentId)
}
`;

export const addDomain = gql`
mutation ($projectId: String!, $domainDetails: AddDomainInput!) {
  addDomain(projectId: $projectId, domainDetails: $domainDetails)
}
`;
