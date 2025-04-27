#!/bin/bash
echo "Configuring npm registry..."
# Remove any existing .npmrc files
rm -f ~/.npmrc
rm -f ./.npmrc

# Create a fresh .npmrc in the project directory
echo "registry=https://registry.npmjs.org/" > ./.npmrc
echo "@*:registry=https://registry.npmjs.org/" >> ./.npmrc
echo "//registry.npmjs.org/:always-auth=false" >> ./.npmrc

# Set registry directly via npm
npm config set registry https://registry.npmjs.org/ --global
npm config set registry https://registry.npmjs.org/ --location=project

# Debug - print current config
echo "Current npm registry:"
npm config get registry
