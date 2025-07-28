#!/bin/bash

# Ensure admin build files exist
if [ ! -f ".medusa/client/index.html" ]; then
    echo "Admin files not found, rebuilding..."
    npm run build
fi

# Start the medusa server
exec medusa start
