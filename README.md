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
  yarn test:db:load:fixtures
  ```

- Set `gitHub.oAuth.clientId` and `gitHub.oAuth.clientSecret` in backend [config file](packages/backend/environments/local.toml)
  - Client ID and secret will be available after creating Github OAuth app
    - https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
    - In "Homepage URL", type `http://localhost:3000`
    - In "Authorization callback URL", type `http://localhost:3000/organization/projects/create`
    - Generate a new client secret after app is created

- Run the laconicd stack following this [doc](https://git.vdb.to/cerc-io/stack-orchestrator/src/branch/main/docs/laconicd-with-console.md)

- Get the private key and set `registryConfig.privateKey` in backend [config file](packages/backend/environments/local.toml)

  ```bash
  laconic-so --stack fixturenet-laconic-loaded deploy exec laconicd "laconicd keys export mykey --unarmored-hex --unsafe"
  # WARNING: The private key will be exported as an unarmored hexadecimal string. USE AT YOUR OWN RISK. Continue? [y/N]: y
  # 754cca7b4b729a99d156913aea95366411d072856666e95ba09ef6c664357d81
  ```

- Get the REST and GQL endpoint ports of Laconicd and replace the ports for `registryConfig.restEndpoint` and `registryConfig.gqlEndpoint` in backend [config file](packages/backend/environments/local.toml)

  ```bash
  # For registryConfig.restEndpoint
  laconic-so --stack fixturenet-laconic-loaded deploy port laconicd 1317
  # 0.0.0.0:32777

  # For registryConfig.gqlEndpoint
  laconic-so --stack fixturenet-laconic-loaded deploy port laconicd 9473
  # 0.0.0.0:32771
  ```

- Run the script to create bond, reserve the authority and set authority bond

  ```bash
  yarn test:registry:init
  # snowball:initialize-registry bondId: 6af0ab81973b93d3511ae79841756fb5da3fd2f70ea1279e81fae7c9b19af6c4 +0ms
  ```

  - Get the bond id and set `registryConfig.bondId` in backend [config file](packages/backend/environments/local.toml)

- Setup ngrok for GitHub webhooks
  - https://ngrok.com/docs/getting-started/
  - Start ngrok and point to backend server endpoint
    ```bash
    ngrok http http://localhost:8000
    ```
  - Look for the forwarding URL in ngrok
    ```
    ...
    Forwarding                    https://19c1-61-95-158-116.ngrok-free.app -> http://localhost:8000
    ...
    ```
  - Set `gitHub.webhookUrl` in backend [config file](packages/backend/environments/local.toml)
    ```toml
    ...
    [gitHub]
      webhookUrl = "https://19c1-61-95-158-116.ngrok-free.app"
    ...
    ```

- Start the server in `packages/backend`

  ```bash
  yarn start
  ```

## Frontend

- Change directory to `packages/frontend` in a new terminal

  ```bash
  cd packages/frontend
  ```

- Copy the graphQL endpoint from terminal and add the endpoint in the [.env](packages/frontend/.env) file present in `packages/frontend`

  ```env
  REACT_APP_GQL_SERVER_URL = 'http://localhost:8000/graphql'
  ```

- Copy the GitHub OAuth app client ID from previous steps and set it in frontend [.env](packages/frontend/.env) file

  ```env
  REACT_APP_GITHUB_CLIENT_ID = <CLIENT_ID>
  ```

- Set `REACT_APP_GITHUB_TEMPLATE_REPO` in [.env](packages/frontend/.env) file

  ```env
  REACT_APP_GITHUB_TEMPLATE_REPO = cerc-io/test-progressive-web-app
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

