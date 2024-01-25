import * as fs from 'fs/promises';
import path from 'path';
import debug from 'debug';

const log = debug('snowball:delete-database');

const DB_PATH = '../db/snowball';

const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    log(`File ${filePath} has been deleted.`);
  } catch (err) {
    log(err);
  }
};

deleteFile(path.resolve(__dirname, DB_PATH));
