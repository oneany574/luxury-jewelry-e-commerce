#!/bin/bash

# Initialize Prisma and create database tables
echo "Installing dependencies..."
pnpm install

echo "Creating database schema..."
npx prisma migrate dev --name init

echo "Database initialization complete!"
