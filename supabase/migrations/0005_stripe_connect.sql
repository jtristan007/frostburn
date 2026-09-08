-- Stripe Connect: an operator collects payment on their own invoices via
-- their own connected Stripe account rather than Frostburn's platform
-- account. Adds the connect account/status to accounts, and payment
-- tracking to invoices.
--
-- Reconstructed from the live schema -- this migration was applied to
-- production (as "stripe_connect") when 51038a3 "Add Stripe Connect
-- payment collection for invoices" shipped, but the .sql file was never
-- committed. No new statements here; this file only brings the repo back
-- in sync with what's already live.

alter table public.accounts
  add column stripe_connect_account_id text unique,
  add column stripe_connect_status text not null default 'not_connected'
    check (stripe_connect_status in ('not_connected', 'onboarding', 'active')),
  add column stripe_connect_charges_enabled boolean not null default false;

-- pay_token is the customer-facing capability/secret for the public
-- /pay/[token] page, same pattern as quotes.share_token.
alter table public.invoices
  add column pay_token uuid not null unique default gen_random_uuid(),
  add column stripe_checkout_session_id text,
  add column stripe_payment_intent_id text,
  add column paid_at timestamptz;
