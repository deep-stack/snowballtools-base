# deployer

- Install dependencies
  ```bash
  yarn
  ```
  ```bash
  brew install jq # if you do not have jq installed already
  ```

- Run script to deploy app
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

- Check deployment status [here](https://console.laconic.com/deployer).
- Check records [here](https://console.laconic.com/#/registry).

- If deployment fails due to low bond balance
  - Check balances
    ```bash
    # Account balance
    yarn laconic cns account get

    # Bond balance
    yarn laconic cns bond get --id 8fcf44b2f326b4b63ac57547777f1c78b7d494e5966e508f09001af53cb440ac
    ```
  - Command to refill bond
    ```bash
    yarn laconic cns bond refill --id 8fcf44b2f326b4b63ac57547777f1c78b7d494e5966e508f09001af53cb440ac --type aphoton --quantity 10000000
    ```
