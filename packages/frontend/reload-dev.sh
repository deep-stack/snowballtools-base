#!/bin/bash

(cd /Users/rabbit-m2/p/snowball/snowball-ts-sdk && NO_CLEAN=1 turbo build)

(cd ../.. && ./scripts/yarn-file-for-local-dev.sh)

rm -rf node_modules/.vite

yarn dev
