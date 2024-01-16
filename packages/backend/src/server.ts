import express, { Request, Response } from 'express';
import 'reflect-metadata';
import debug from 'debug';

import { initializeDatabase } from './database';

const log = debug('snowball:server');

export const main = async (): Promise<void> => {
  await initializeDatabase();

  const app = express();
  const port = 8080;

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express Server!');
  });

  app.listen(port, () => {
    log(`Server is running at http://localhost:${port}`);
  });
};

main()
  .then(() => {
    log('Starting server...');
  })
  .catch((err) => {
    log(err);
  });
