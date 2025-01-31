#!/bin/bash
set -e

# Wait for the database to be ready
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Migrate database
echo "Database is ready. Applying migrations..."
npx drizzle-kit push

# Start server
echo "Starting the application..."
exec node dist/index.js