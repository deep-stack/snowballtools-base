import fs from 'fs-extra';
import path from 'path';
import toml from 'toml';
import debug from 'debug';

import { Project } from './entity/Project';
import { ProjectMember } from './entity/ProjectMember';
import { Deployment } from './entity/Deployment';

const log = debug('snowball:utils');

export const getConfig = async <ConfigType>(
  configFile: string
): Promise<ConfigType> => {
  const configFilePath = path.resolve(configFile);
  const fileExists = await fs.pathExists(configFilePath);
  if (!fileExists) {
    throw new Error(`Config file not found: ${configFilePath}`);
  }

  const config = toml.parse(await fs.readFile(configFilePath, 'utf8'));
  log('config', JSON.stringify(config, null, 2));

  return config;
};

export const projectToGqlType = (dbProject: Project, projectMembers: ProjectMember[]): any => {
  return {
    id: dbProject.id,
    owner: dbProject.owner,
    name: dbProject.name,
    repository: dbProject.repository,
    prodBranch: dbProject.prodBranch,
    description: dbProject.description,
    template: dbProject.template,
    framework: dbProject.framework,
    webhooks: dbProject.webhooks,
    members: projectMembers,
    createdAt: dbProject.createdAt,
    updatedAt: dbProject.updatedAt
  };
};

// TODO: Add domain field to deployment
export const deploymentToGqlType = (dbDeployment: Deployment): any => {
  return {
    id: dbDeployment.id,
    branch: dbDeployment.branch,
    commitHash: dbDeployment.commitHash,
    title: dbDeployment.title,
    environment: dbDeployment.environment,
    isCurrent: dbDeployment.isCurrent,
    status: dbDeployment.status,
    createdAt: dbDeployment.createdAt,
    updatedAt: dbDeployment.updatedAt
  };
};

export const projectMembersToGqlType = (dbProjectMember: ProjectMember): any => {
  return {
    id: dbProjectMember.id,
    member: dbProjectMember.member,
    permissions: dbProjectMember.permissions,
    createdAt: dbProjectMember.createdAt,
    updatedAt: dbProjectMember.updatedAt
  };
};
