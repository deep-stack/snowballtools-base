#!/bin/bash

source .env
echo "Using REGISTRY_BOND_ID: $REGISTRY_BOND_ID"
echo "Using DEPLOYER_LRN: $DEPLOYER_LRN"

# Repository URL
REPO_URL="https://git.vdb.to/cerc-io/snowballtools-base"

# Get the latest commit hash from the repository
LATEST_HASH=$(git ls-remote $REPO_URL HEAD | awk '{print $1}')

# Extract version from ../frontend/package.json
PACKAGE_VERSION=$(jq -r '.version' ../frontend/package.json)

# Current date and time for note
CURRENT_DATE_TIME=$(date -u)

CONFIG_FILE=config.yml

# Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts

# Get latest version from registry and increment application-record version
NEW_APPLICATION_VERSION=$(yarn --silent laconic -c $CONFIG_FILE registry record list --type ApplicationRecord --all --name "snowballtools-base-frontend" 2>/dev/null | jq -r -s ".[] | sort_by(.createTime) | reverse | [ .[] | select(.bondId == \"$REGISTRY_BOND_ID\") ] | .[0].attributes.version" | awk -F. -v OFS=. '{$NF += 1 ; print}')

if [ -z "$NEW_APPLICATION_VERSION" ] || [ "1" == "$NEW_APPLICATION_VERSION" ]; then
  # Set application-record version if no previous records were found
  NEW_APPLICATION_VERSION=0.0.1
fi

# Generate application-deployment-request.yml
cat >./records/application-deployment-request.yml <<EOF
record:
  type: ApplicationDeploymentRequest
  version: '1.0.0'
  name: snowballtools-base-frontend@$PACKAGE_VERSION
  application: lrn://snowballtools/applications/snowballtools-base-frontend@$PACKAGE_VERSION
  deployer: $DEPLOYER_LRN
  dns: dashboard
  config:
    env:
      LACONIC_HOSTED_CONFIG_server_url: https://snowball-backend.pwa.laconic.com
      LACONIC_HOSTED_CONFIG_github_clientid: b7c63b235ca1dd5639ab
      LACONIC_HOSTED_CONFIG_github_pwa_templaterepo: snowball-tools/test-progressive-web-app
      LACONIC_HOSTED_CONFIG_github_image_upload_templaterepo: snowball-tools/image-upload-pwa-example
      LACONIC_HOSTED_CONFIG_wallet_connect_id: eda9ba18042a5ea500f358194611ece2
      LACONIC_HOSTED_CONFIG_lit_relay_api_key: 15DDD969-E75F-404D-AAD9-58A37C4FD354_snowball
      LACONIC_HOSTED_CONFIG_bugsnag_api_key: 8c480cd5386079f9dd44f9581264a073
      LACONIC_HOSTED_CONFIG_passkey_wallet_rpid: dashboard.pwa.laconic.com
      LACONIC_HOSTED_CONFIG_turnkey_api_base_url: https://api.turnkey.com
      LACONIC_HOSTED_CONFIG_turnkey_organization_id: 5049ae99-5bca-40b3-8317-504384d4e591
  meta:
    note: Added by Snowball @ $CURRENT_DATE_TIME
    repository: "$REPO_URL"
    repository_ref: $LATEST_HASH
EOF

# Generate application-record.yml with incremented version
cat >./records/application-record.yml <<EOF
record:
  type: ApplicationRecord
  version: $NEW_APPLICATION_VERSION
  repository_ref: $LATEST_HASH
  repository: ["$REPO_URL"]
  app_type: webapp
  name: snowballtools-base-frontend
  app_version: $PACKAGE_VERSION
EOF

echo "Files generated successfully."

RECORD_FILE=records/application-record.yml

# Publish ApplicationRecord
publish_response=$(yarn --silent laconic -c $CONFIG_FILE registry record publish --filename $RECORD_FILE)
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to publish record"
  exit $rc
fi
RECORD_ID=$(echo $publish_response | jq -r '.id')
echo "ApplicationRecord published"
echo $RECORD_ID

# Set name to record
REGISTRY_APP_LRN="lrn://snowballtools/applications/snowballtools-base-frontend"

sleep 2
yarn --silent laconic -c $CONFIG_FILE registry name set "$REGISTRY_APP_LRN@${PACKAGE_VERSION}" "$RECORD_ID"
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to set name: $REGISTRY_APP_LRN@${PACKAGE_VERSION}"
  exit $rc
fi
sleep 2
yarn --silent laconic -c $CONFIG_FILE registry name set "$REGISTRY_APP_LRN@${LATEST_HASH}" "$RECORD_ID"
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to set hash"
  exit $rc
fi
sleep 2
# Set name if latest release
yarn --silent laconic -c $CONFIG_FILE registry name set "$REGISTRY_APP_LRN" "$RECORD_ID"
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to set release"
  exit $rc
fi
echo "$REGISTRY_APP_LRN set for ApplicationRecord"

# Check if record found for REGISTRY_APP_LRN
query_response=$(yarn --silent laconic -c $CONFIG_FILE registry name resolve "$REGISTRY_APP_LRN")
rc=$?
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to query name"
  exit $rc
fi
APP_RECORD=$(echo $query_response | jq '.[0]')
if [ -z "$APP_RECORD" ] || [ "null" == "$APP_RECORD" ]; then
  echo "No record found for $REGISTRY_APP_LRN."
  exit 1
fi

RECORD_FILE=records/application-deployment-request.yml

sleep 2
deployment_response=$(yarn --silent laconic -c $CONFIG_FILE registry record publish --filename $RECORD_FILE)
if [ $rc -ne 0 ]; then
  echo "FATAL: Failed to query deployment request"
  exit $rc
fi
DEPLOYMENT_REQUEST_ID=$(echo $deployment_response | jq -r '.id')
echo "ApplicationDeploymentRequest published"
echo $DEPLOYMENT_REQUEST_ID
