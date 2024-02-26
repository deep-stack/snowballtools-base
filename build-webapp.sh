#!/bin/bash

PKG_DIR="./packages/frontend"
OUTPUT_DIR="${PKG_DIR}/build"
DEST_DIR=${1:-/data}

if [[ -d "$DEST_DIR" ]]; then
  echo "${DEST_DIR} already exists." 1>&2
  exit 1
fi

if [[ -f "$PKG_DIR/.env" ]]; then
  echo "Using existing .env file"
else
  mv "$PKG_DIR/.env.example" "$PKG_DIR/.env"
  echo "Created .env file. Please populate with the correct values."
  exit 1
fi

cat > $PKG_DIR/.env <<EOF
REACT_APP_SERVER_URL = 'LACONIC_HOSTED_CONFIG_app_server_url'
REACT_APP_GITHUB_CLIENT_ID = 'LACONIC_HOSTED_CONFIG_app_github_clientid'
REACT_APP_GITHUB_PWA_TEMPLATE_REPO = 'LACONIC_HOSTED_CONFIG_app_github_pwa_templaterepo'
REACT_APP_GITHUB_IMAGE_UPLOAD_PWA_TEMPLATE_REPO = 'LACONIC_HOSTED_CONFIG_app_github_image_upload_templaterepo'
REACT_APP_WALLET_CONNECT_ID = 'LACONIC_HOSTED_CONFIG_app_wallet_connect_id'
EOF

yarn || exit 1
yarn build || exit 1

if [[ ! -d "$OUTPUT_DIR" ]]; then
  echo "Missing output directory: $OUTPUT_DIR" 1>&2
  exit 1
fi

mv "$OUTPUT_DIR" "$DEST_DIR"
