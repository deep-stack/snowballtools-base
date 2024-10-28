#!/bin/bash

PKG_DIR="./packages/frontend"
OUTPUT_DIR="${PKG_DIR}/dist"
DEST_DIR=${1:-/data}

if [[ -d "$DEST_DIR" ]]; then
  echo "${DEST_DIR} already exists." 1>&2
  exit 1
fi

cat > $PKG_DIR/.env <<EOF
VITE_SERVER_URL = 'LACONIC_HOSTED_CONFIG_server_url'
VITE_GITHUB_CLIENT_ID = 'LACONIC_HOSTED_CONFIG_github_clientid'
VITE_GITHUB_PWA_TEMPLATE_REPO = 'LACONIC_HOSTED_CONFIG_github_pwa_templaterepo'
VITE_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO = 'LACONIC_HOSTED_CONFIG_github_image_upload_templaterepo'
VITE_WALLET_CONNECT_ID = 'LACONIC_HOSTED_CONFIG_wallet_connect_id'
VITE_LACONICD_CHAIN_ID = 'LACONIC_HOSTED_CONFIG_laconicd_chain_id'
VITE_LIT_RELAY_API_KEY = 'LACONIC_HOSTED_CONFIG_lit_relay_api_key'
VITE_BUGSNAG_API_KEY = 'LACONIC_HOSTED_CONFIG_bugsnag_api_key'
VITE_PASSKEY_WALLET_RPID = 'LACONIC_HOSTED_CONFIG_passkey_wallet_rpid'
VITE_TURNKEY_API_BASE_URL = 'LACONIC_HOSTED_CONFIG_turnkey_api_base_url'
VITE_TURNKEY_ORGANIZATION_ID = 'LACONIC_HOSTED_CONFIG_turnkey_organization_id'
EOF

yarn || exit 1
yarn build --ignore backend || exit 1

if [[ ! -d "$OUTPUT_DIR" ]]; then
  echo "Missing output directory: $OUTPUT_DIR" 1>&2
  exit 1
fi

mv "$OUTPUT_DIR" "$DEST_DIR"
