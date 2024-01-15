import express, { Request, Response } from 'express';

// TODO: Add db connection setup here
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'db/Snowball',
  entities: [User],
  synchronize: true,
  logging: false
});

AppDataSource.initialize()
  .then(() => {
    console.log('database initialized');
  })
  .catch((error) => console.log(error));

const app = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express Server!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
