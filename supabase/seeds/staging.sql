-- Staging seed: experimental features turned on so we can exercise them.
-- new_ui is staging-only and beta_chat is live here, so even a free user sees
-- a different set than production.

insert into public.feature_flags (key, description, enabled, requires_premium, requires_beta)
values
  ('dark_mode',       'Dark theme — everyone',          true,  false, false),
  ('new_ui',          'Redesigned UI — staging only',   true,  false, false),
  ('premium_reports', 'Analytics — premium only',       true,  true,  false),
  ('beta_chat',       'In-app chat — beta only',        true,  false, true)
on conflict (key) do nothing;
