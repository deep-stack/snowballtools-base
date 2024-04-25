#!/bin/bash

PKG_DIR="./packages/frontend"
OUTPUT_DIR="${PKG_DIR}/dist"
DEST_DIR=${1:-/data}

if [[ -d "$DEST_DIR" ]]; then
  echo "${DEST_DIR} already exists." 1>&2
  exit 1
fi

cat > $PKG_DIR/.env <<EOF
VITE_SERVER_URL = 'LACONIC_HOSTED_CONFIG_app_server_url'
VITE_GITHUB_CLIENT_ID = 'LACONIC_HOSTED_CONFIG_app_github_clientid'
VITE_GITHUB_PWA_TEMPLATE_REPO = 'LACONIC_HOSTED_CONFIG_app_github_pwa_templaterepo'
VITE_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO = 'LACONIC_HOSTED_CONFIG_app_github_image_upload_templaterepo'
VITE_WALLET_CONNECT_ID = 'LACONIC_HOSTED_CONFIG_app_wallet_connect_id'
EOF

yarn || exit 1
yarn build || exit 1

if [[ ! -d "$OUTPUT_DIR" ]]; then
  echo "Missing output directory: $OUTPUT_DIR" 1>&2
  exit 1
fi

mv "$OUTPUT_DIR" "$DEST_DIR"
