# frontend

This is a [vite](https://vitejs.dev/) [react](https://reactjs.org/) [nextjs](https://nextjs.org/) project in a [yarn workspace](https://yarnpkg.com/features/workspaces).

## Getting Started

### Install dependencies

In the root of the project, run:

```zsh
yarn
```

### Build backend

```zsh
yarn build --ignore frontend
```

### Environment variables

#### Local

Copy the `.env.example` file to `.env`:

```zsh
cp .env.example .env
```

#### Staging environment variables

Change in [deployer/deploy-frontend.staging.sh](/packages/deployer/deploy-frontend.staging.sh)

#### Production environment variables

Change in [deployer/deploy-frontend.sh](/packages/deployer/deploy-frontend.sh)

### Run development server

```zsh
yarn dev
```

## Deployment

From the root of the project,

### Staging

```zsh
cd packages/deployer && ./deploy-frontend.staging.sh
```

### Production

```zsh
cd packages/deployer && ./deploy-frontend.sh
```

### Deployment status

Check the status of the deployment [here](https://webapp-deployer.apps.snowballtools.com)
