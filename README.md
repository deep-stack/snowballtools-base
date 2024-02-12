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

- Run the laconicd stack following this [doc](https://git.vdb.to/cerc-io/stack-orchestrator/src/branch/main/docs/laconicd-with-console.md)

- Create the bond and set `registryConfig.bondId` in backend [config file](packages/backend/environments/local.toml)

  ```bash
  laconic-so --stack fixturenet-laconic-loaded deploy exec cli "laconic cns bond create --type aphoton --quantity 1000000000 --gas 200000 --fees 200000aphoton"

  # {"bondId":"b40f1308510f799860fb6f1ede47245a2d59f336631158f25ae0eec30aabaf89"}
  ```

  - Export the bond id that is generated

    ```bash
    export BOND_ID=<BOND-ID>
    ```

- Get the private key and set `registryConfig.privateKey` in backend [config file](packages/backend/environments/local.toml)

  ```bash
  laconic-so --stack fixturenet-laconic-loaded deploy exec laconicd "laconicd keys export mykey --unarmored-hex --unsafe"
  # WARNING: The private key will be exported as an unarmored hexadecimal string. USE AT YOUR OWN RISK. Continue? [y/N]: y
  # 754cca7b4b729a99d156913aea95366411d072856666e95ba09ef6c664357d81
  ```

- Get the rest and GQL endpoint of laconicd and set it to `registryConfig.restEndpoint` and `registryConfig.gqlEndpoint` in backend [config file](packages/backend/environments/local.toml)

  ```bash
  # For registryConfig.restEndpoint
  laconic-so --stack fixturenet-laconic-loaded deploy port laconicd 1317
  # 0.0.0.0:32777

  # For registryConfig.gqlEndpoint
  laconic-so --stack fixturenet-laconic-loaded deploy port laconicd 9473
  # 0.0.0.0:32771
  ```

- Reserve authority for `snowball`

  ```bash
  laconic-so --stack fixturenet-laconic-loaded deploy exec cli "laconic cns authority reserve snowball"
  # {"success":true}
  ```

- Set authority bond

  ```bash
  laconic-so --stack fixturenet-laconic-loaded deploy exec cli "laconic cns authority bond set snowball $BOND_ID"
  # {"success":true}
  ```

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

  ```env
  REACT_APP_GQL_SERVER_URL = 'http://localhost:8000/graphql'
  ```

- Copy the GitHub OAuth app client ID from previous steps and set it in frontend [.env](packages/frontend/.env) file

  ```env
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

