#!/usr/bin/env bash
# Run the Supabase CLI against a named environment.
# Loads supabase/.env.<env> (config.toml reads these via env()) then execs supabase.
#
#   scripts/sb.sh staging start
#   scripts/sb.sh production db reset
set -euo pipefail

ENV="${1:-}"
case "$ENV" in
  staging | production) ;;
  *)
    echo "usage: scripts/sb.sh <staging|production> [supabase args...]" >&2
    exit 1
    ;;
esac
shift

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/supabase/.env.$ENV"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

cd "$ROOT"
exec supabase "$@"
