# api — Vercel edge backend

Backend for the monorepo. Runs as Vercel edge functions. Talks to Supabase
(DB + auth). Supabase owns data + auth; this app owns business logic.

## Routes

| Route          | Auth | Description                       |
| -------------- | ---- | --------------------------------- |
| `GET /api/health` | no   | Liveness check.                   |
| `GET /api/me`     | yes  | Returns the bearer-token user.    |

## Local dev

1. Start the DB + auth (from repo root):

   ```sh
   supabase start
   ```

2. Copy keys printed by `supabase status` into `.env`:

   ```sh
   cp .env.example .env
   # fill SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY
   ```

3. Run the backend:

   ```sh
   pnpm dev   # vercel dev on http://localhost:3001
   ```

`vercel dev` reads `.env` automatically. First run prompts to link a Vercel
project — pick "Y" and create/link one (local-only is fine).

## Auth flow

Mobile signs in via Supabase Auth → gets an access token → calls this API with
`Authorization: Bearer <token>`. `lib/auth.ts#getUser` verifies it; `userClient`
forwards it so Postgres RLS runs as that user. `adminClient` (service_role)
bypasses RLS for trusted server work.
