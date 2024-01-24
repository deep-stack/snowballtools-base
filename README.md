# snowballtools

- Clone the  `snowballtools` repo

  ```bash
  git clone git@github.com:snowball-tools/snowballtools-base.git
  ```

- In root of the repo, install depedencies

  ```bash
  yarn
  ```

- Build packages

  ```bash
  yarn build --ignore frontend
  ```

- Change directory to `packages/backend`

  ```bash
  cd packages/backend
  ```

- Load fixtures in database

  ```bash
  yarn db:load:fixtures
  ```

- Start the server

  ```bash
  yarn start
  ```

- Copy the graphQL endpoint from terminal and add the endpoint in the `.env` file present in `packages/frontend`

  ```
  REACT_APP_GQL_SERVER_URL = 'http://localhost:8000/graphql'
  ```

- Change directory to `packages/frontend`

  ```bash
  cd packages/frontend
  ```

- Start the React application

  ```bash
  yarn start
  ```

- The React application will be running in `http://localhost:3000/`
