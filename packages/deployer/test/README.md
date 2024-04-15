# deployer test

Check if the live web app deployer is in a working state

- Web app repo used: https://github.com/snowball-tools-platform/test-progressive-web-app (main branch)
- Config used: [../config.yml](../config.yml)
- The script [test-webapp-deployment-undeployment.sh](./test-webapp-deployment-undeployment.sh) performs the following:
  - Create / update [`ApplicationRecord`](./records/application-record.yml) and [`ApplicationDeploymentRequest`](./records/application-deployment-request.yml) records with latest meta data from the repo
  - Fetch the latest version of `deployment-test-app` from registry and increment `ApplicationRecord` version
  - Publish the resulting `ApplicationRecord` record
  - Set names to the record and check name resolution
  - Publish the `ApplicationDeploymentRequest` record
  - Check that the deployment occurs
    - Check that a `ApplicationDeploymentRecord` is created
    - Check that the deployment record has correct `ApplicationRecord` id
    - Check that the URL present in deployment record is active
  - Create and publish a [`ApplicationDeploymentRemovalRequest`](./records/application-deployment-removal-request.yml) record
  - Check that the deployment is removed
    - Check that a `ApplicationDeploymentRemovalRecord` is created
    - Check that the deployment URL goes down
- The test script is run in a GitHub CI [workflow](../../../.github/workflows/test-app-deployment.yaml) that:
  - Is scheduled to run everyday on the default (`main`) branch or can be triggered manually
  - Sends Slack alerts to configured channels on failure
