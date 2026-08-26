-- QuickBooks OAuth tokens -- deliberately no client-facing RLS policy at
-- all (not even SELECT). Only the service-role client should ever read or
-- write these; nothing about your OAuth tokens should be reachable from
-- the browser, unlike the rest of this schema which is scoped read/write
-- via private.current_account_id().
create table public.quickbooks_connections (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references public.accounts(id) on delete cascade,
  realm_id text not null,
  access_token text not null,
  refresh_token text not null,
  access_token_expires_at timestamptz not null,
  refresh_token_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quickbooks_connections enable row level security;

create trigger set_updated_at before update on public.quickbooks_connections
  for each row execute function public.set_updated_at();

-- Tracks whether/what a given invoice has been pushed to QuickBooks as,
-- so "Send to QuickBooks" doesn't create a duplicate on a second click.
alter table public.invoices add column qb_invoice_id text;
