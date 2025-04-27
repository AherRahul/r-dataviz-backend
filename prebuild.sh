#!/bin/bash
echo "Advanced npm registry debugging and fixing..."

# Set registry to npmjs.org
npm config set registry https://registry.npmjs.org/ --global
npm config set registry https://registry.npmjs.org/ --location=project

# Create comprehensive .npmrc
cat > ./.npmrc << EOL
registry=https://registry.npmjs.org/
@*:registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=false
EOL

# The critical fix: regenerate package-lock.json with the new registry
echo "Regenerating package-lock.json with public registry URLs..."
rm -f package-lock.json
npm install --package-lock-only

# Debug - print current config
echo "Current npm registry:"
npm config get registry

# Now we can run the regular install
echo "Now running regular npm ci..."
