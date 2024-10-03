import * as fs from 'fs/promises';
import debug from 'debug';

import { getConfig } from '../src/utils';

const log = debug('snowball:delete-database');

const deleteFile = async (filePath: string) => {
  await fs.unlink(filePath);
  log(`File ${filePath} has been deleted.`);
};

const main = async () => {
  const config = await getConfig();

  deleteFile(config.database.dbPath);
};

main().catch((err) => log(err));
