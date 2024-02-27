#!/bin/bash

# Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts

RECORD_FILE=records/application-record.yml
CONFIG_FILE=config.yml
RCD_APP_VERSION="0.1.1"
REPO_REF="13fc92bf0e5d145645fe678c7f30f0c51ebf0226"

# Publish ApplicationRecord
RECORD_ID=$(yarn --silent laconic -c $CONFIG_FILE cns record publish --filename $RECORD_FILE | jq -r '.id')
echo "ApplicationRecord published"
echo $RECORD_ID

# Set name to record
REGISTRY_APP_CRN="crn://snowballtools/applications/snowballtools-base-frontend"

yarn --silent laconic -c $CONFIG_FILE cns name set "$REGISTRY_APP_CRN@${RCD_APP_VERSION}" "$RECORD_ID"
yarn --silent laconic -c $CONFIG_FILE cns name set "$REGISTRY_APP_CRN@${REPO_REF}" "$RECORD_ID"
# Set name if latest release
yarn --silent laconic -c $CONFIG_FILE cns name set "$REGISTRY_APP_CRN" "$RECORD_ID"
echo "$REGISTRY_APP_CRN set for ApplicationRecord"

# Check if record found for REGISTRY_APP_CRN
APP_RECORD=$(yarn --silent laconic -c $CONFIG_FILE cns name resolve "$REGISTRY_APP_CRN" | jq '.[0]')
if [ -z "$APP_RECORD" ] || [ "null" == "$APP_RECORD" ]; then
  echo "No record found for $REGISTRY_APP_CRN."
  exit 1
fi

RECORD_FILE=records/application-deployment-request.yml

DEPLOYMENT_REQUEST_ID=$(yarn --silent laconic -c $CONFIG_FILE cns record publish --filename $RECORD_FILE | jq -r '.id')
echo "ApplicationDeploymentRequest published"
echo $DEPLOYMENT_REQUEST_ID
