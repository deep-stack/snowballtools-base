import { DataSource } from 'typeorm';
import path from 'path';

export const initializeDatabase = async (): Promise<void> => {
  try {
    const AppDataSource = new DataSource({
      type: 'better-sqlite3',
      database: 'db/snowball',
      entities: [path.join(__dirname, '/entity/*')],
      synchronize: true,
      logging: false
    });

    await AppDataSource.initialize();
    console.log('database initialized');
  } catch (error) {
    console.log(error);
  }
};
