#!/bin/bash
# =============================================================================
# Vercel Build Script
# - Auto-detect database provider based on DATABASE_URL
# - Swaps Prisma schema provider (sqlite -> postgresql) if needed
# - Generates Prisma client
# - Pushes schema to database
# - Builds Next.js
# =============================================================================
set -e

echo "=== Vercel build starting ==="

# Detect database provider based on DATABASE_URL
DB_URL="${DATABASE_URL:-}"
if [[ "$DB_URL" == postgres* || "$DB_URL" == postgresql* ]]; then
  echo "[vercel-build] DATABASE_URL is Postgres, switching schema provider to postgresql"
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
elif [[ "$DB_URL" == file:* ]]; then
  echo "[vercel-build] DATABASE_URL is SQLite (file), keeping schema as-is"
else
  echo "[vercel-build] WARNING: DATABASE_URL not set or unknown format. Schema unchanged."
fi

# Show the active provider for debugging
ACTIVE_PROVIDER=$(grep -oP 'provider = "\K[^"]+' prisma/schema.prisma | head -1)
echo "[vercel-build] Active Prisma provider: $ACTIVE_PROVIDER"

# Generate Prisma client
echo "[vercel-build] Running prisma generate..."
bunx prisma generate

# Push schema to database (creates tables if not exist)
echo "[vercel-build] Running prisma db push..."
bunx prisma db push --accept-data-loss

# Build Next.js
echo "[vercel-build] Running next build..."
next build

echo "=== Vercel build complete ==="
