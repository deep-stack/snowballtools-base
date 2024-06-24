# backend

This backend is a [node.js](https://nodejs.org/) [express.js](https://expressjs.com/) [apollo server](https://www.apollographql.com/docs/apollo-server/) project in a [yarn workspace](https://yarnpkg.com/features/workspaces).

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

Copy the `envionments/local.toml.example` file to `envionments/local.toml`:

```zsh
cp envionments/local.toml.example envionments/local.toml
```

#### Staging environment variables

In the deployment repository, update staging [staging/configmaps/config/prod.toml](https://git.vdb.to/cerc-io/snowballtools-base-api-deployments/src/commit/318c2bc09f334dca79c3501838512749f9431bf1/deployments/staging/configmaps/config/prod.toml)

#### Production environment variables

In the deployment repository, update production [production/configmaps/config/prod.toml](https://git.vdb.to/cerc-io/snowballtools-base-api-deployments/src/commit/318c2bc09f334dca79c3501838512749f9431bf1/deployments/production/configmaps/config/prod.toml)

### Run development server

```zsh
yarn start
```

## Deployment

Clone the deployer repository:

```zsh
git clone git@git.vdb.to:cerc-io/snowballtools-base-api-deployments.git
```

### Staging

```zsh
echo trigger >> .gitea/workflows/triggers/staging-deploy
git commit -a -m "Deploy v0.0.8"  # replace with version number
git push
```

### Production

```zsh
echo trigger >> .gitea/workflows/triggers/production-deploy
git commit -a -m "Deploy v0.0.8" # replace with version number
git push
```

### Deployment status

Dumb for now

- [Staging](https://snowballtools-base-api.staging.apps.snowballtools.com/staging/version)
- [Production](https://snowballtools-base-api.apps.snowballtools.com/staging/version)

Update version number manually in [routes/staging.ts](/packages/backend/src/routes/staging.ts)
