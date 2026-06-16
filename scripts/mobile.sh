#!/usr/bin/env bash
# Run the Expo app pointed at a named environment. Injects APP_ENV (picks the
# backend targets in app.config.ts) and the live anon key from the stack.
#
#   scripts/mobile.sh staging              # expo start (dev client)
#   scripts/mobile.sh staging run:ios      # build + install the dev client
set -euo pipefail

ENV="${1:-}"
case "$ENV" in
  staging | production) ;;
  *)
    echo "usage: scripts/mobile.sh <staging|production> [expo args...]" >&2
    exit 1
    ;;
esac
shift

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
anon="$("$ROOT/scripts/sb.sh" "$ENV" status -o env 2>/dev/null | grep -E '^ANON_KEY=' | cut -d'"' -f2)"

if [[ -z "$anon" ]]; then
  echo "no anon key for '$ENV' — is the stack running? (pnpm db:$ENV)" >&2
  exit 1
fi

export APP_ENV="$ENV"
export EXPO_PUBLIC_SUPABASE_ANON_KEY="$anon"

# Also persist to .env.local so the key is present no matter how Expo/metro is
# launched (wrapper, `expo run:ios`, or Xcode). Gitignored.
cat >"$ROOT/apps/mobile/.env.local" <<EOF
APP_ENV=$ENV
EXPO_PUBLIC_SUPABASE_ANON_KEY=$anon
EOF

cd "$ROOT/apps/mobile"
if [[ $# -eq 0 ]]; then set -- start; fi
exec pnpm exec expo "$@"
