# deployer

- Install dependencies
  ```bash
  yarn
  ```
  ```bash
  brew install jq # if you do not have jq installed already
  ```

- Run script to deploy app

  - To deploy frontend app to `dashboard.staging.apps.snowballtools.com`

    ```
    ./deploy-frontend.staging.sh
    ```
  
  - To deploy frontend app to `dashboard.apps.snowballtools.com`

    ```
    ./deploy-frontend.sh
    ```

- Commit the updated [ApplicationRecord](records/application-record.yml) and [ApplicationDeploymentRequest](records/application-deployment-request.yml) files to the repository

## Notes

- Any config env can be updated in [records/application-deployment-request.yml](records/application-deployment-request.yml)
  ```yml
  record:
    ...
    config:
      env:
        LACONIC_HOSTED_CONFIG_app_server_url: https://snowballtools-base-api-001.apps.snowballtools.com
        ...
  ```
  - On changing `LACONIC_HOSTED_CONFIG_app_github_clientid`, the GitHub client ID and secret need to be changed in backend config too

## Troubleshoot

- Check deployment status in [web-app deployer](https://console.laconic.com/deployer).
- Check records in [registry console app](https://console.laconic.com/#/registry).

- If deployment fails due to low bond balance
  - Check balances
    ```bash
    # Account balance
    yarn laconic cns account get

    # Bond balance
    yarn laconic cns bond get --id 99c0e9aec0ac1b8187faa579be3b54f93fafb6060ac1fd29170b860df605be32
    ```
  - Command to refill bond
    ```bash
    yarn laconic cns bond refill --id 99c0e9aec0ac1b8187faa579be3b54f93fafb6060ac1fd29170b860df605be32 --type aphoton --quantity 10000000
    ```
