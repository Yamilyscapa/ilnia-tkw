-- Create the feature_flags table.
--
-- Each flag can set gates (requires_premium / requires_beta). The visibility
-- rule lives in the RLS policy below, so the database itself decides who may
-- read a flag — the API never has to filter by hand.

create table public.feature_flags (
  id               uuid primary key default gen_random_uuid(),
  key              text unique not null,
  description      text,
  enabled          boolean not null default true,
  requires_premium boolean not null default false,
  requires_beta    boolean not null default false,
  created_at       timestamptz not null default now()
);

alter table public.feature_flags enable row level security;

-- A flag is visible only when it's enabled and the caller clears every gate it
-- sets. An ungated flag (both false) is visible to any signed-in user; a gated
-- flag checks the caller's profile.
create policy "feature_flags_select_qualified"
  on public.feature_flags for select
  using (
    enabled
    and (not requires_premium or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_premium
    ))
    and (not requires_beta or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_beta
    ))
  );

-- Again, no write policy: flags are managed by the seed file and admin tooling
-- through service_role. Clients get read-only access through RLS.
