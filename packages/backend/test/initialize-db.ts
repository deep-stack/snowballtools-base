import { DataSource } from 'typeorm';
import * as fs from 'fs/promises';
import debug from 'debug';

import { User } from '../src/entity/User';
import { Organization } from '../src/entity/Organization';
import { Project } from '../src/entity/Project';
import { UserOrganization } from '../src/entity/UserOrganization';
import { EnvironmentVariable } from '../src/entity/EnvironmentVariable';
import { Domain } from '../src/entity/Domain';
import { ProjectMember } from '../src/entity/ProjectMember';
import { Deployment } from '../src/entity/Deployment';

const log = debug('snowball:initialize-database');

const loadData = async () => {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'db/snowball',
    synchronize: true,
    logging: true,
    entities: [
      User,
      Organization,
      Project,
      UserOrganization,
      EnvironmentVariable,
      Domain,
      ProjectMember,
      Deployment
    ]
  });

  await dataSource.initialize();

  // Read JSON files
  const userData = await fs.readFile('../fixtures/users.json', 'utf-8');

  // Parse JSON data
  const users = JSON.parse(userData);

  // Get entity repositories
  const userRepository = dataSource.getRepository(User);

  // Save Users
  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
  }
};

loadData().then(() => {
  log('Data loaded successfully');
})
  .catch((err) => {
    log(err);
  });
