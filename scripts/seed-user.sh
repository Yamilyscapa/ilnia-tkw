#!/usr/bin/env bash
# Seed the demo user for an environment (user@staging.com / user@prod.com).
#
#   scripts/seed-user.sh staging
set -euo pipefail

ENV="${1:-}"
case "$ENV" in
  staging | production) ;;
  *)
    echo "usage: scripts/seed-user.sh <staging|production>" >&2
    exit 1
    ;;
esac

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/apps/api/.env.$ENV"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing $ENV_FILE — run scripts/sync-env.sh first" >&2
  exit 1
fi

cd "$ROOT/apps/api"
exec node --env-file=".env.$ENV" --import tsx scripts/seed-user.ts
