import { DataSource } from 'typeorm';
import path from 'path';
import debug from 'debug';

const log = debug('snowball:server');

export const initializeDatabase = async (
  database: string = 'db/snowball'
): Promise<void> => {
  try {
    const AppDataSource = new DataSource({
      type: 'better-sqlite3',
      database,
      entities: [path.join(__dirname, '/entity/*')],
      synchronize: true,
      logging: false
    });

    await AppDataSource.initialize();
    log('database initialized');
  } catch (error) {
    log(error);
  }
};
