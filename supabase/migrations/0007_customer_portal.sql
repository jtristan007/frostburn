-- Lightweight client portal: portal_token is the customer's own
-- capability/secret for a public /portal/[token] page, same pattern as
-- quotes.share_token -- read via the service-role client by token, not an
-- anon RLS carve-out.
--
-- Reconstructed from the live schema -- applied to production (as
-- "customer_portal") alongside 16d5107 "Add a lightweight client portal",
-- but never committed. No new statements here; this file only brings the
-- repo back in sync with what's already live.

alter table public.customers add column portal_token uuid not null unique default gen_random_uuid();
