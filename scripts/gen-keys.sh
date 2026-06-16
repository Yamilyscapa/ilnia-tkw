#!/usr/bin/env bash
# Generate a per-environment JWT signing key. Different keys mean a token minted
# by one stack is rejected by the other. Keys are local secrets and gitignored;
# run this once after cloning.
#
#   scripts/gen-keys.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KEYS_DIR="$ROOT/supabase/keys"
mkdir -p "$KEYS_DIR"

# `supabase gen` parses config.toml, which reads ports via env(). Load any env
# so the parse succeeds. Blank out the signing-keys path so gen prints a fresh
# key to stdout instead of trying to read the (not-yet-existing) file.
set -a
# shellcheck disable=SC1091
source "$ROOT/supabase/.env.staging"
SUPABASE_SIGNING_KEYS_PATH=""
set +a
cd "$ROOT"

for env in staging production; do
  out="$KEYS_DIR/$env.signing_keys.json"
  if [[ -f "$out" ]]; then
    echo "exists, skipping: $out"
    continue
  fi
  key="$(supabase gen signing-key --algorithm ES256)"
  if [[ "$key" == *'"_tag":"Error"'* ]]; then
    echo "gen failed: $key" >&2
    exit 1
  fi
  # signing_keys_path expects a JWK array (one entry per active key).
  printf '[%s]\n' "$key" >"$out"
  echo "generated: $out"
done
