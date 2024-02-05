# snowballtools

## Setup

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

## Backend

- Change directory to `packages/backend`

  ```bash
  cd packages/backend
  ```

- Load fixtures in database

  ```bash
  yarn db:load:fixtures
  ```

- Set `githubOauth.clientId` and `githubOauth.clientSecret` in backend [config file](packages/backend/environments/local.toml)
  - Client ID and secret will be available after creating Github OAuth app
    - https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
    - In "Homepage URL", type `http://localhost:3000`
    - In "Authorization callback URL", type `http://localhost:3000/projects/create`
    - Generate a new client secret after app is created

- Start the server

  ```bash
  yarn start
  ```

## Frontend

- Change directory to `packages/frontend` in a new terminal

  ```bash
  cd packages/frontend
  ```

- Copy the graphQL endpoint from terminal and add the endpoint in the [.env](packages/frontend/.env) file present in `packages/frontend`

  ```
  REACT_APP_GQL_SERVER_URL = 'http://localhost:8000/graphql'
  ```

- Copy the GitHub OAuth app client ID from previous steps and set it in frontend [.env](packages/frontend/.env) file

  ```
  REACT_APP_GITHUB_CLIENT_ID = <CLIENT_ID>
  ```

### Development

- Start the React application

  ```bash
  yarn start
  ```

- The React application will be running in `http://localhost:3000/`

### Production

- Build the React application

  ```bash
  yarn build
  ```

- Use a web server for hosting static built files

  ```bash
  python3 -m http.server -d build 3000
  ```
