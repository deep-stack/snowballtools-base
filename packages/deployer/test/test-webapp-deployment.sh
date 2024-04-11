#!/bin/bash

# Repository URL
REPO_URL="https://github.com/snowball-tools-platform/test-progressive-web-app"

# Get the latest commit hash from the repository
LATEST_HASH=$(git ls-remote $REPO_URL HEAD | awk '{print $1}')

# Fetch the package.json file content
# Extract version from package.json content
package_json=$(wget -qO- "$REPO_URL/raw/$LATEST_HASH/package.json")
PACKAGE_VERSION=$(echo "$package_json" | jq -r '.version')

# Current date and time for note
CURRENT_DATE_TIME=$(date -u)

CONFIG_FILE=packages/deployer/config.yml
REGISTRY_BOND_ID="99c0e9aec0ac1b8187faa579be3b54f93fafb6060ac1fd29170b860df605be32"

# Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts

APP_NAME=deployment-test-app

# Get latest version from registry and increment application-record version
NEW_APPLICATION_VERSION=$(yarn --silent laconic -c $CONFIG_FILE cns record list --type ApplicationRecord --all --name "$APP_NAME" 2>/dev/null | jq -r -s ".[] | sort_by(.createTime) | reverse | [ .[] | select(.bondId == \"$REGISTRY_BOND_ID\") ] | .[0].attributes.version" | awk -F. -v OFS=. '{$NF += 1 ; print}')

if [ -z "$NEW_APPLICATION_VERSION" ] || [ "1" == "$NEW_APPLICATION_VERSION" ]; then
  # Set application-record version if no previous records were found
  NEW_APPLICATION_VERSION=0.0.1
fi

# Generate application-record.yml with incremented version
RECORD_FILE=packages/deployer/test/records/application-record.yml

cat > $RECORD_FILE <<EOF
record:
  type: ApplicationRecord
  version: $NEW_APPLICATION_VERSION
  repository_ref: $LATEST_HASH
  repository: ["$REPO_URL"]
  app_type: webapp
  name: $APP_NAME
  app_version: $PACKAGE_VERSION
EOF

# Generate application-deployment-request.yml
REQUEST_RECORD_FILE=packages/deployer/test/records/application-deployment-request.yml

cat > $REQUEST_RECORD_FILE <<EOF
record:
  type: ApplicationDeploymentRequest
  version: '1.0.0'
  name: $APP_NAME@$PACKAGE_VERSION
  application: crn://snowballtools/applications/$APP_NAME@$PACKAGE_VERSION
  dns: test
  config:
    env:
      CERC_TEST_WEBAPP_CONFIG1="this string"
      CERC_TEST_WEBAPP_CONFIG2="this different string"
      CERC_WEBAPP_DEBUG=0
  meta:
    note: Deployment test @ $CURRENT_DATE_TIME
    repository: "$REPO_URL"
    repository_ref: $LATEST_HASH
EOF

echo "Record files generated successfully."

# Publish ApplicationRecord
RECORD_ID=$(yarn --silent laconic -c $CONFIG_FILE cns record publish --filename $RECORD_FILE | jq -r '.id')
echo "ApplicationRecord published"
echo $RECORD_ID

# Set name to record
REGISTRY_APP_CRN="crn://snowballtools/applications/$APP_NAME"

sleep 2
yarn --silent laconic -c $CONFIG_FILE cns name set "$REGISTRY_APP_CRN@${PACKAGE_VERSION}" "$RECORD_ID"
sleep 2
yarn --silent laconic -c $CONFIG_FILE cns name set "$REGISTRY_APP_CRN@${LATEST_HASH}" "$RECORD_ID"
sleep 2
# Set name if latest release
yarn --silent laconic -c $CONFIG_FILE cns name set "$REGISTRY_APP_CRN" "$RECORD_ID"
echo "$REGISTRY_APP_CRN set for ApplicationRecord"

# Check if record exists for REGISTRY_APP_CRN
APP_RECORD=$(yarn --silent laconic -c $CONFIG_FILE cns name resolve "$REGISTRY_APP_CRN" | jq '.[0]')
if [ -z "$APP_RECORD" ] || [ "null" == "$APP_RECORD" ]; then
  echo "No record found for $REGISTRY_APP_CRN."
  exit 1
fi

sleep 2
DEPLOYMENT_REQUEST_ID=$(yarn --silent laconic -c $CONFIG_FILE cns record publish --filename $REQUEST_RECORD_FILE | jq -r '.id')
echo "ApplicationDeploymentRequest published"
echo $DEPLOYMENT_REQUEST_ID

# Deployment checks
RETRY_INTERVAL=30
MAX_RETRIES=10

# Check that a ApplicationDeploymentRecord is published
retry_count=0
while true; do
  deployment_records_response=$(yarn --silent laconic -c $CONFIG_FILE cns record list --type ApplicationDeploymentRecord --all --name "$APP_NAME" request $DEPLOYMENT_REQUEST_ID)
  len_deployment_records=$(echo $deployment_records_response | jq 'length')

  # Check if number of records returned is 0
  if [ $len_deployment_records -eq 0 ]; then
    # Check if retries are exhausted
    if [ $retry_count -eq $MAX_RETRIES ]; then
      echo "Retries exhausted"
      echo "ApplicationDeploymentRecord for deployment request $DEPLOYMENT_REQUEST_ID not found"
      exit 1
    else
      echo "ApplicationDeploymentRecord not found, retrying in $RETRY_INTERVAL sec..."
      sleep $RETRY_INTERVAL
      retry_count=$((retry_count+1))
    fi
  else
    echo "ApplicationDeploymentRecord found"
    break
  fi
done

fetched_application_record_id=$(echo $deployment_records_response | jq -r '.[0].attributes.application')
fetched_url=$(echo $deployment_records_response | jq -r '.[0].attributes.url')

# Check if ApplicationDeploymentRecord has the correct record id
if [ "$fetched_application_record_id" = "$RECORD_ID" ]; then
  echo "ApplicationRecord id matched"
else
  echo "ApplicationRecord id does not match, expected: $RECORD_ID, received: $fetched_application_record_id"
  exit 1
fi

# Check if url present in ApplicationDeploymentRecord active
url_response=$(curl -s -o /dev/null -I -w "%{http_code}" "$fetched_url")
if [ "$url_response" = "200" ]; then
  echo "Deployment URL $fetched_url is active"
else
  echo "Deployment URL $fetched_url is not active, received code $url_response"
  exit 1
fi
