import assert from 'assert';
import debug from 'debug';
import fs from 'fs-extra';
import { Octokit } from 'octokit';
import path from 'path';
import toml from 'toml';
import { DataSource, DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';

import { Config } from './config';
import { DEFAULT_CONFIG_FILE_PATH } from './constants';
import { PackageJSON } from './types';

const log = debug('snowball:utils');

export async function getConfig() {
  // TODO: get config path using cli
  return await _getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);
}

const _getConfig = async <ConfigType>(
  configFile: string,
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

export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    log(err);
    return false;
  }
};

export const getEntities = async (filePath: string): Promise<any> => {
  const entitiesData = await fs.readFile(filePath, 'utf-8');
  const entities = JSON.parse(entitiesData);
  return entities;
};

export const loadAndSaveData = async <Entity extends ObjectLiteral>(
  entityType: EntityTarget<Entity>,
  dataSource: DataSource,
  entities: any,
  relations?: any | undefined,
): Promise<Entity[]> => {
  const entityRepository = dataSource.getRepository(entityType);

  const savedEntity: Entity[] = [];

  for (const entityData of entities) {
    let entity = entityRepository.create(entityData as DeepPartial<Entity>);

    if (relations) {
      for (const field in relations) {
        const valueIndex = String(field + 'Index');

        entity = {
          ...entity,
          [field]: relations[field][entityData[valueIndex]],
        };
      }
    }
    const dbEntity = await entityRepository.save(entity);
    savedEntity.push(dbEntity);
  }

  return savedEntity;
};

export const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getRepoDetails = async (
  octokit: Octokit,
  repository: string,
  commitHash: string | undefined,
): Promise<{
  repo: string;
  packageJSON: PackageJSON;
  repoUrl: string;
}> => {
  const [owner, repo] = repository.split('/');
  const { data: packageJSONData } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: 'package.json',
    ref: commitHash,
  });

  if (!packageJSONData) {
    throw new Error('Package.json file not found');
  }

  assert(!Array.isArray(packageJSONData) && packageJSONData.type === 'file');
  const packageJSON: PackageJSON = JSON.parse(atob(packageJSONData.content));

  assert(packageJSON.name, "name field doesn't exist in package.json");

  const repoUrl = (
    await octokit.rest.repos.get({
      owner,
      repo,
    })
  ).data.html_url;

  return {
    repo,
    packageJSON,
    repoUrl
  };
}
