import express, { Request, Response } from 'express';

// TODO: Add db connection setup here

const app = express();
const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express Server!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
