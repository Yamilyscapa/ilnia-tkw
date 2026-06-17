#!/usr/bin/env bash
# Run the Maestro E2E flow for an environment. The app must already be running
# under that env (the env is baked when metro starts):
#
#   make db-staging api-staging mobile-staging   # in their own terminals
#   make seed
#   scripts/e2e.sh staging
set -euo pipefail

ENV="${1:-}"
case "$ENV" in
  staging | production) ;;
  *)
    echo "usage: scripts/e2e.sh <staging|production>" >&2
    exit 1
    ;;
esac

if ! command -v maestro >/dev/null 2>&1; then
  echo "maestro not found. Install: curl -sL https://get.maestro.mobile.dev | bash" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
flow="$ROOT/apps/mobile/.maestro/login.$([[ "$ENV" == production ]] && echo prod || echo staging).yaml"

exec maestro test "$flow"
