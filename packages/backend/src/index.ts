import express, { Request, Response } from 'express';
import 'reflect-metadata';

import { initializeDatabase } from './database';

export const main = async (): Promise<any> => {
  initializeDatabase();
  const app = express();
  const port = 8080;

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express Server!');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

main().then(() => {
  console.log('Starting server...');
}).catch(err => {
  console.log(err);
});
