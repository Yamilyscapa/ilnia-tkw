#!/usr/bin/env bash
# Run the Vercel API for a named environment. Loads apps/api/.env.<env> and
# binds a per-env port so staging and prod serve side by side.
#
#   scripts/api.sh staging      # -> http://localhost:3001
#   scripts/api.sh production    # -> http://localhost:3002
#
# Note: `vercel dev` needs a one-time `vercel login` + project link.
set -euo pipefail

ENV="${1:-}"
case "$ENV" in
  staging) PORT=3001 ;;
  production) PORT=3002 ;;
  *)
    echo "usage: scripts/api.sh <staging|production>" >&2
    exit 1
    ;;
esac
shift

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/apps/api/.env.$ENV"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing $ENV_FILE — run scripts/sync-env.sh first" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# vercel dev loads .env.local with highest precedence; write the chosen env there
# so it can't be shadowed by a stale .env.
cp "$ENV_FILE" "$ROOT/apps/api/.env.local"

cd "$ROOT/apps/api"
exec vercel dev --listen "$PORT" "$@"
