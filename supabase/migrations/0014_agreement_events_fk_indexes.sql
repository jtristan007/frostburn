-- get_advisors flagged both foreign keys on agreement_events (added in
-- 0013) as missing a covering index -- the account_id/event_date index
-- added there doesn't cover lookups by agreement_id or customer_id alone,
-- which is exactly what the retention page's join and any future
-- per-agreement or per-customer history query will do.
create index agreement_events_agreement_id_idx on public.agreement_events(agreement_id);
create index agreement_events_customer_id_idx on public.agreement_events(customer_id);
