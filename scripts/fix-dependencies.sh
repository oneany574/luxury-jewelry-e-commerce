#!/bin/bash

# Fix Turbopack node_modules symlink issue
echo "Fixing node_modules symlink issue..."

# Remove corrupted node_modules
if [ -d "node_modules" ]; then
  echo "Removing corrupted node_modules..."
  rm -rf node_modules
fi

# Remove lock file to ensure fresh install
if [ -f "pnpm-lock.yaml" ]; then
  echo "Removing pnpm lock file..."
  rm pnpm-lock.yaml
fi

# Reinstall dependencies
echo "Installing dependencies with pnpm..."
pnpm install --no-frozen-lockfile

echo "Dependencies fixed successfully!"
