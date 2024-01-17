import { DataSource } from 'typeorm';
import path from 'path';
import debug from 'debug';

import { User } from './entity/User';
import { DatabaseConfig } from './config';

const log = debug('snowball:database');

export class Database {
  private dataSource: DataSource;

  constructor ({ database }: DatabaseConfig) {
    this.dataSource = new DataSource({
      type: 'better-sqlite3',
      database,
      entities: [path.join(__dirname, '/entity/*')],
      synchronize: true,
      logging: false
    });

    this.dataSource.initialize().then(
      () => log('database initialized')
    ).catch(
      (err) => log(err)
    );
  }

  static init (dbConfig: DatabaseConfig): Database {
    return new Database(dbConfig);
  }

  async getUser (userId: number) : Promise<User | null> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: userId
    });

    return user;
  }
}
