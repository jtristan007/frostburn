-- The shop's IANA time zone (e.g. America/Vancouver). Job times are entered
-- and shown as wall-clock times in this zone; "today" for dispatch and the
-- dashboard is computed in it. Captured from the owner's browser the first
-- time they schedule a job; null falls back to a west-coast default.
alter table public.accounts add column timezone text;
