import fs from 'fs-extra';
import path from 'path';
import toml from 'toml';
import debug from 'debug';
import { DataSource, DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';

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
  relations?: any | undefined
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
          [field]: relations[field][entityData[valueIndex]]
        };
      }
    }
    const dbEntity = await entityRepository.save(entity);
    savedEntity.push(dbEntity);
  }

  return savedEntity;
};

export const sleep = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
