-- An append-only log of agreement lifecycle events -- created, renewed,
-- cancelled -- with the annual_value at that moment. Agreements themselves
-- only ever hold current state (renewal_date gets overwritten on rollover,
-- a cancelled agreement's row is just left at status='expired'), so there
-- was previously no way to answer "what's our renewal rate" or "what's our
-- recurring revenue trend" -- both need history that accumulates over
-- time, which this starts capturing from today rather than losing it.
--
-- This will show nothing meaningful until real agreements actually renew
-- or lapse -- that's expected, not a bug, for a pre-launch product.
create table public.agreement_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  agreement_id uuid not null references public.agreements(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  event_type text not null check (event_type in ('created', 'renewed', 'cancelled')),
  annual_value numeric(10, 2) not null,
  event_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.agreement_events enable row level security;
create index agreement_events_account_id_event_date_idx on public.agreement_events(account_id, event_date);

create policy "agreement_events_tenant_isolation" on public.agreement_events
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());
