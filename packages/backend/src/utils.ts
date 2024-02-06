import fs from 'fs-extra';
import path from 'path';
import toml from 'toml';
import debug from 'debug';

import { Organization } from './entity/Organization';

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

export const organizationToGqlType = (dbOrganization: Organization): any => {
  return {
    id: dbOrganization.id,
    name: dbOrganization.name,
    members: dbOrganization.userOrganizations,
    createdAt: dbOrganization.createdAt,
    updatedAt: dbOrganization.updatedAt
  };
};
