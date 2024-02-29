# snowballtools-base

## Setup

### Clone the `snowballtools-base` repo

  ```bash
  git clone git@github.com:snowball-tools/snowballtools-base.git
  cd snowballtools-base
  ```

### Install dependencies in root

  ```bash
  yarn
  ```

### Build packages

  ```bash
  yarn build --ignore frontend
  ```

### Configuration Files

- For Backend:

  ```bash
  cp packages/backend/environments/local.toml.example packages/backend/environments/local.toml
  ```

- For Frontend:

  ```bash
  cp packages/frontend/.env.example packages/frontend/.env
  ```

### Backend Production

- Let us assume the following domains for backend and frontend
  - Backend server: `api.snowballtools.com`
  - Frontend app: `dashboard.snowballtools.com`

- Update the following in backend [config file](packages/backend/environments/local.toml)
  
  ```toml
  [server]
    ...
    [server.session]
      # Secret should be changed to a different random string
      secret = "p4yfpkqnddkui2iw7t6hbhwq74lbqs7sidnc382"
      # Set URL of the frontend app
      appOriginUrl = "https://dashboard.snowballtools.com"
      # Set to true for session cookies to work behind proxy
      trustProxy = true
      # Set empty domain when using secure connection
      domain = ""
  ```

- Set `gitHub.oAuth.clientId` and `gitHub.oAuth.clientSecret` in backend [config file](packages/backend/environments/local.toml)
  - [OAuth App Creation](https://github.com/organizations/<org>/settings/applications/new)
    - Homepage URL: `https://dashboard.snowballtools.com`
    - Authorization callback URL: `https://dashboard.snowballtools.com/organization/projects/create`
    - Generate a new client secret after app is created

- Set `gitHub.webhookUrl` in backend [config file](packages/backend/environments/local.toml)

  ```toml
  [gitHub]
    webhookUrl = "https://api.snowballtools.com"
  ```

- Let us assume domain for Laconicd to be `api.laconic.com` and set the following in backend [config file](packages/backend/environments/local.toml)

  ```toml
  [registryConfig]
    fetchDeploymentRecordDelay = 5000
    # Use actual port for REST endpoint
    restEndpoint = "http://api.laconic.com:1317"
    # Use actual port for GQL endpoint
    gqlEndpoint = "http://api.laconic.com:9473/api"
    # Set private key of account to be used in Laconicd
    privateKey = "0wtu92cd4f1y791ezpjwgzzazni4dmd3q3mzqc3t6i6r9v06ji784tey6hwmnn69"
    # Set Bond ID to be used for publishing records
    bondId = "8xk8c2pb61kajwixpm223zvptr2x2ncajq0vd998p6aqhvqqep2reu6pik245epf"
    chainId = "laconic_9000-1"
    # Set authority that is existing in the chain
    authority = "laconic"
    [registryConfig.fee]
      amount = "200000"
      denom = "aphoton"
      gas = "750000"
  ```

### Backend Development

- Set `gitHub.oAuth.clientId` and `gitHub.oAuth.clientSecret` in backend [config file](packages/backend/environments/local.toml)
  - [OAuth App Creation](https://github.com/organizations/<org>/settings/applications/new)
    - Homepage URL: `http://localhost:3000`
    - Authorization callback URL: `http://localhost:3000/organization/projects/create`
    - Generate a new client secret after app is created

- Setup Laconicd
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

  - Set authority in `registryConfig.authority` in backend [config file](packages/backend/environments/local.toml)

  - Run the script to create bond, reserve the authority and set authority bond

    ```bash
    yarn test:registry:init
    # snowball:initialize-registry bondId: 6af0ab81973b93d3511ae79841756fb5da3fd2f70ea1279e81fae7c9b19af6c4 +0ms
    ```

    - Get the bond id and set `registryConfig.bondId` in backend [config file](packages/backend/environments/local.toml)

- Setup ngrok for GitHub webhooks
  - [ngrok getting started](https://ngrok.com/docs/getting-started/)
  - Start ngrok and point to backend server endpoint

    ```bash
    ngrok http http://localhost:8000
    ```

  - Look for the forwarding URL in ngrok

    ```bash
    Forwarding                    https://19c1-61-95-158-116.ngrok-free.app -> http://localhost:8000
    ```

  - Set `gitHub.webhookUrl` in backend [config file](packages/backend/environments/local.toml)

    ```toml
    [gitHub]
      webhookUrl = "https://19c1-61-95-158-116.ngrok-free.app"
    ```

## Frontend

- Change directory to `packages/frontend` in a new terminal

  ```bash
  cd packages/frontend
  ```

- Copy the GitHub OAuth app client ID from previous steps and set it in frontend [.env](packages/frontend/.env) file

  ```env
  REACT_APP_GITHUB_CLIENT_ID = <CLIENT_ID>
  ```

- Set `REACT_APP_GITHUB_PWA_TEMPLATE_REPO` and `REACT_APP_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO` in [.env](packages/frontend/.env) file

  ```env
  REACT_APP_GITHUB_PWA_TEMPLATE_REPO = 'cerc-io/test-progressive-web-app'   # Set actual owner/name of the template repo that will be used for creating new repo
  REACT_APP_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO = 'cerc-io/image-upload-pwa-example'  # Set actual owner/name of the template repo that will be used for creating new repo
  ```

### Frontend Production

- Let us assume the following domains for backend and frontend
  - Backend server: `api.snowballtools.com`
  - Frontend app: `dashboard.snowballtools.com`

- Set the following values in [.env](packages/frontend/.env) file

  ```env
  REACT_APP_SERVER_URL = 'https://api.snowballtools.com'   # Backend server endpoint
  ```

- Sign in to [wallet connect](https://cloud.walletconnect.com/sign-in) to create a project ID
  - Create a project and add information to use wallet connect SDK
    - Add project name and select project type as `App`
    - Set project home page URL to `https://dashboard.snowballtools.com`
  - On creation of project, use the `Project ID` and set it in `REACT_APP_WALLET_CONNECT_ID` in [.env](packages/frontend/.env) file

  ```env
  REACT_APP_WALLET_CONNECT_ID = <PROJECT_ID>
  ```

- Build the React application

  ```bash
  yarn build
  ```

- Use a web server for hosting static built files

  ```bash
  python3 -m http.server -d build 3000
  ```

### Frontend Development

- Copy the graphQL endpoint from terminal and add the endpoint in the [.env](packages/frontend/.env) file present in `packages/frontend`

  ```env
  REACT_APP_SERVER_URL = 'http://localhost:8000'
  ```

- Sign in to [wallet connect](https://cloud.walletconnect.com/sign-in) to create a project ID.
  - Create a project and add information to use wallet connect SDK
    - Add project name and select project type as `App`
    - Project home page URL is not required to be set
  - On creation of project, use the `Project ID` and set it in `REACT_APP_WALLET_CONNECT_ID` in [.env](packages/frontend/.env) file

  ```env
  REACT_APP_WALLET_CONNECT_ID = <Project_ID>
  ```

- The React application will be running in `http://localhost:3000/`

## Development

- Start the backend server

  ```bash
  yarn start:backend
  ```

- Start the frontend

  ```bash
  yarn start
  ```
