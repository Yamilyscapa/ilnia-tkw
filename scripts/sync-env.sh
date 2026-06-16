#!/usr/bin/env bash
# Generate apps/api/.env.<env> from each running Supabase stack's live keys.
# The keys are signed by the per-env signing key, so they change whenever keys
# are regenerated — hence generated, never committed.
#
#   scripts/sync-env.sh            # both
#   scripts/sync-env.sh staging    # one
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ $# -gt 0 ]]; then ENVS=("$1"); else ENVS=(staging production); fi

for env in "${ENVS[@]}"; do
  status="$("$ROOT/scripts/sb.sh" "$env" status -o env 2>/dev/null)"
  url="$(grep -E '^API_URL=' <<<"$status" | cut -d'"' -f2)"
  anon="$(grep -E '^ANON_KEY=' <<<"$status" | cut -d'"' -f2)"
  service="$(grep -E '^SERVICE_ROLE_KEY=' <<<"$status" | cut -d'"' -f2)"

  if [[ -z "$url" || -z "$anon" || -z "$service" ]]; then
    echo "could not read keys for '$env' — is the stack running? (scripts/sb.sh $env start)" >&2
    exit 1
  fi

  out="$ROOT/apps/api/.env.$env"
  cat >"$out" <<EOF
APP_ENV=$env
SUPABASE_URL=$url
SUPABASE_ANON_KEY=$anon
SUPABASE_SERVICE_ROLE_KEY=$service
EOF
  echo "wrote: $out"
done
