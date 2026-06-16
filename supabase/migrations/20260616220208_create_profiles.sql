-- Create the profiles table.
--
-- Supabase Auth owns identity (auth.users). A profile hangs off each user and
-- holds the app-level qualification that decides which feature flags they see.
-- It's a separate table because auth.users is managed by the auth system and
-- shouldn't carry our business columns.

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  is_premium  boolean not null default false,
  is_beta     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Lock the table down: nobody reaches it without an explicit policy.
alter table public.profiles enable row level security;

-- Base privilege for signed-in users. RLS still restricts which rows they see;
-- this just lets the authenticated role touch the table at all.
grant select on public.profiles to authenticated;

-- The backend's service_role manages tier changes; it bypasses RLS but still
-- needs the table grant.
grant all on public.profiles to service_role;

-- A user may read their own profile, and nothing else.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Note: there is deliberately no insert/update/delete policy. Profiles are
-- created by the trigger below, and tier changes only happen through the
-- service_role key (which bypasses RLS). This stops a client from promoting
-- itself to premium/beta.

-- Give every new auth user a profile automatically.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer            -- runs as owner so the insert isn't blocked by RLS
set search_path = ''        -- avoid search_path hijacking in a definer function
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
