-- Production seed: conservative. No staging-only UI, and beta_chat is shipped
-- but disabled (off for everyone) — it isn't live in prod yet.

insert into public.feature_flags (key, description, enabled, requires_premium, requires_beta)
values
  ('dark_mode',       'Dark theme — everyone',    true,  false, false),
  ('premium_reports', 'Analytics — premium only', true,  true,  false),
  ('beta_chat',       'In-app chat — beta only',  false, false, true)
on conflict (key) do nothing;
