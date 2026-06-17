# ilnia-tkw

A React Native prototype that securely shows environment-specific feature flags
based on a user's account status.

## Walkthrough

I built this to mirror a real multi-environment setup, but entirely on my
machine. I use **Vercel** and **Supabase** in their local flavors to simulate the
Staging and Production environments you'd have in production: same code, two
isolated backends. A script boots both in **parallel** as separate simulated
environments (distinct projects, ports, data, and JWT signing keys), so I can
run staging and prod side by side without one touching the other.

The same idea carries into the **Expo** mobile app: a build targets one
environment and talks only to that environment's API and database. The whole
flow (spinning up the environments, wiring the per-env config, seeding data, and
running the app) is driven by a **Makefile**, so it's one command to stand up and
reproducible from a clean checkout.

```
mobile (Expo)  ──►  Vercel edge API  ──►  Supabase (Postgres + Auth)
                    business logic         data + identity, RLS-gated
```

- **Supabase** owns the database and auth. Row-Level Security decides which flags
  a user may read; unauthorized reads/writes are rejected at the DB layer.
- **Vercel edge functions** are the backend: they verify the caller's token and
  serve flags. They never bypass RLS for user reads.
- **Mobile** signs in via the Supabase SDK, persists the session in the device
  keychain, and calls the API through a typed client.

## Environments

Staging and Production are two independent local stacks: separate containers,
data, ports, and **JWT signing keys** (a staging token is rejected by prod).

| | Staging | Production |
| --- | --- | --- |
| Supabase API / DB | `54321` / `54322` | `55321` / `55322` |
| Vercel API | `localhost:3001` | `localhost:3002` |
| Demo user | `user@staging.com` | `user@prod.com` |

The app picks its target from `APP_ENV` at build time (`app.config.ts`).

### Environment is baked at build time

`APP_ENV` is read when the native app is built, not when metro starts. The
debug build embeds the config (API/DB targets) and the Supabase session is keyed
per environment. So to switch the app between environments you **rebuild**, you
don't just restart metro:

- `make ios-staging` → installs the staging app (talks to `:3001` / `:54321`)
- `make ios-prod` → installs the prod app (talks to `:3002` / `:55321`)

Both use the same bundle id, so installing one replaces the other on a simulator.
`make mobile-staging` / `mobile-prod` only run the fast-refresh dev server for an
app already built for that env.

## Try it locally

**Prereqs:** Docker running · `vercel login` (once) · Xcode iOS Simulator.

Three commands, three terminals:

```sh
make setup          # one-time: both stacks + per-env config + demo users
make api-staging    # terminal 2: backend on :3001
make ios-staging    # terminal 3: builds and launches the app
```

Sign in with **`user@staging.com`** / **`Password123!`** → you land on the flags
list for staging.

**Switch to production** in fresh terminals (`make api-prod`, then `make
ios-prod`), then sign in with **`user@prod.com`** / **`Password123!`**. You'll see
a different flag set: that's the environment toggle. (`make setup` already
prepared both environments, so there's nothing else to run.)

Run `make` to list every command. After the first build, `make mobile-staging` /
`mobile-prod` is the faster fast-refresh dev server.

## End-to-end tests

[Maestro](https://maestro.mobile.dev) drives the real app: launch → login →
assert the UI reflects the backend config for that environment.

```sh
curl -Ls "https://get.maestro.mobile.dev" | bash   # once

# with the staging app running (db-staging + api-staging + mobile-staging + seed):
make e2e-staging   # asserts new_ui + premium_reports + beta_chat are shown

# with the prod app running (db-prod + api-prod + mobile-prod):
make e2e-prod      # asserts new_ui + beta_chat are NOT shown
```

Each flow targets the env the app was started with (env is baked when metro
starts). Flows live in `apps/mobile/.maestro/`.

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
| E2E flows | `apps/mobile/.maestro/` |

## Notes

- `apps/api/.env.*` and `apps/mobile/.env.local` are generated (keys derive from
  the gitignored signing keys), never committed. `make env-sync` regenerates them.
- `make reset` re-applies migrations + seeds on both DBs.
- `make down` stops both stacks.
