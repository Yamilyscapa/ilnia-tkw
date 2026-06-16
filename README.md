# ilina-tkw

A React Native prototype that securely shows environment-specific feature flags
based on a user's account status. Runs **entirely locally** — Supabase CLI for
the DB + auth, Vercel CLI for the API. Staging and Production are fully isolated.

```
mobile (Expo)  ──►  Vercel edge API  ──►  Supabase (Postgres + Auth)
                    business logic         data + identity, RLS-gated
```

- **Supabase** owns the database and auth. Row-Level Security decides which flags
  a user may read — unauthorized reads/writes are rejected at the DB layer.
- **Vercel edge functions** are the backend: they verify the caller's token and
  serve flags. They never bypass RLS for user reads.
- **Mobile** signs in via the Supabase SDK, persists the session in the device
  keychain, and calls the API through a typed client.

## Environments

Staging and Production are two independent local stacks — separate containers,
data, ports, and **JWT signing keys** (a staging token is rejected by prod).

| | Staging | Production |
| --- | --- | --- |
| Supabase API / DB | `54321` / `54322` | `55321` / `55322` |
| Vercel API | `localhost:3001` | `localhost:3002` |
| Demo user | `user@staging.com` | `user@prod.com` |

The app picks its target from `APP_ENV` at build time (`app.config.ts`).

## Prerequisites

- Docker running (Supabase local stack)
- Node 18+, pnpm
- `vercel login` once (the API runs via `vercel dev`)
- iOS Simulator / Xcode (the app uses native modules)

## Quickstart

```sh
make setup            # deps → signing keys → both stacks → env files → demo users
make api-staging      # terminal 2 — vercel dev on :3001
make ios-staging      # terminal 3 — first run only (builds the dev client)
make mobile-staging   # thereafter — fast-refresh dev server
```

Sign in with `user@staging.com` / `Password123!`.

Production is symmetric: `make api-prod`, `make ios-prod`, `make mobile-prod`.

Run `make` to list every command.

## How the pieces fit

| Concern | Where |
| --- | --- |
| Schema + RLS | `supabase/migrations/` |
| Per-env data | `supabase/seeds/{staging,production}.sql` |
| One config, two stacks | `supabase/config.toml` (env-parameterized) + `supabase/.env.*` |
| Signing keys (gitignored) | `scripts/gen-keys.sh` → `supabase/keys/` |
| API endpoints | `apps/api/api/{health,me,flags}.ts` |
| Mobile client | `apps/mobile/src/lib/{supabase,api}.ts` |
| Orchestration | `Makefile` + `scripts/` |

## Notes

- `apps/api/.env.*` and `apps/mobile/.env.local` are generated (keys derive from
  the gitignored signing keys), never committed. `make env-sync` regenerates them.
- `make reset` re-applies migrations + seeds on both DBs.
- `make down` stops both stacks.
