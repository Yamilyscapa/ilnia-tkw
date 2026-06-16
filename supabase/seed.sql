-- Seed runs as superuser on `supabase db reset` (bypasses RLS).
-- Three flags, one per visibility tier — enough to demo the access rule.

insert into public.feature_flags (key, description, requires_premium, requires_beta)
values
  ('dark_mode',       'Dark theme — visible to everyone',  false, false),
  ('premium_reports', 'Analytics — premium users only',    true,  false),
  ('beta_chat',       'In-app chat — beta users only',     false, true)
on conflict (key) do nothing;
