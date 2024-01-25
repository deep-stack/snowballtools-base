import * as fs from 'fs/promises';
import debug from 'debug';

import { getConfig } from '../src/utils';
import { Config } from '../src/config';
import { DEFAULT_CONFIG_FILE_PATH } from '../src/constants';

const log = debug('snowball:delete-database');

const deleteFile = async (filePath: string) => {
  await fs.unlink(filePath);
  log(`File ${filePath} has been deleted.`);
};

const main = async () => {
  const config = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);

  deleteFile(config.database.dbPath);
};

main().catch(err => log(err));
