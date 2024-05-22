#!/bin/bash

export ENV_FILE=packages/frontend/.env

# Load the .env file
if [ ! -f $ENV_FILE ]; then
    echo "$ENV_FILE file not found!"
    exit 1
fi

source $ENV_FILE

# Check if the LOCAL_SNOWBALL_SDK_DIR variable is set
if [ -z "$LOCAL_SNOWBALL_SDK_DIR" ]; then
    echo "LOCAL_SNOWBALL_SDK_DIR is not set in the .env file."
    exit 1
fi

# Define the list of package names, each on its own line
packages=(
  "types"
  "utils"
  "auth"
  "auth-lit"
  "smartwallet-alchemy-light"
  "link-lit-alchemy-light"
  "js-sdk"
)

# Check for the --reset flag
RESET=false
for arg in "$@"; do
    if [[ $arg == "--reset" ]]; then
        RESET=true
        break
    fi
done

# If --reset flag is provided, remove a specific package first
if [ "$RESET" = true ]; then
    # Build the remove command
    cmd="yarn workspace frontend remove"

    # Append each package path to the command
    for pkg in "${packages[@]}"; do
        cmd+=" @snowballtools/$pkg"
    done

    echo "Removing packages..."
    echo "Executing: $cmd"
    eval $cmd
fi


# Build the add command
cmd="yarn workspace frontend add"

# Append each package path to the command
for pkg in "${packages[@]}"; do
    cmd+=" $LOCAL_SNOWBALL_SDK_DIR/packages/$pkg"
done

echo "Adding packages..."
echo "Executing: $cmd"
eval $cmd

echo "SDK packages locally installed."
