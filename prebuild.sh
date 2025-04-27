#!/bin/bash
echo "Advanced npm registry debugging..."

# Create comprehensive .npmrc
cat > ./.npmrc << EOL
registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=false
# Force all requests to use the main registry
strict-ssl=false
EOL

# Debug package-lock.json for registry references
echo "Checking for JFrog references in package-lock.json..."
if [ -f package-lock.json ]; then
  grep -i "jfrog" package-lock.json || echo "No direct JFrog references found in package-lock"
fi

# Try using npm with verbose logging
echo "Will attempt npm install with verbose logging"

# Continue with npm ci but add --verbose flag
# This will give more details about where npm is trying to fetch packages from
npm config set registry https://registry.npmjs.org/ --global
