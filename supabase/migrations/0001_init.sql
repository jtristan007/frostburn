-- Frostburn initial schema.
--
-- Every tenant-owned table carries a denormalized account_id, defaulted to
-- private.current_account_id() so application code almost never passes it
-- explicitly on insert. RLS policies are a flat account_id = ... comparison
-- everywhere -- no joins in a policy body. See
-- https://supabase.com/docs/guides/database/postgres/row-level-security
-- for the security-definer-avoids-recursion and (select auth.uid())
-- performance patterns this migration follows.
--
-- Ordering note: accounts and account_users are created before the
-- private.current_account_id() helper function, because Postgres validates
-- a `language sql` function's body against the catalog at CREATE time (not
-- deferred like plpgsql) -- the function can't be declared before the table
-- it queries exists.

create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- accounts -- the tenant (an HVAC company) and Frostburn's own subscriber.
-- Deliberately NO insert/update/delete policy for `authenticated` at all:
-- the row is created only by the service-role client at signup, and
-- tier/stripe_* fields are written only by the Stripe webhook, also via the
-- service-role client. RLS defaults to deny, so the absence of a policy
-- *is* the enforcement -- a regular user can never set their own tier.
-- ---------------------------------------------------------------------------
create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text check (tier in ('starter', 'growth', 'pro')),
  subscription_status text check (
    subscription_status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid')
  ),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accounts enable row level security;

create trigger set_updated_at before update on public.accounts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- account_users -- user <-> tenant mapping. One row per technician. Not
-- relying on auth.users metadata alone since it isn't reliably readable
-- client-side, and full_name is cached here for technician-assignment UI.
-- ---------------------------------------------------------------------------
create table public.account_users (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'technician' check (role in ('owner', 'admin', 'technician')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.account_users enable row level security;

create index account_users_account_id_idx on public.account_users(account_id);

-- ---------------------------------------------------------------------------
-- Helper: resolve the calling user's account_id without recursively hitting
-- account_users's own RLS policy (security definer + private schema is the
-- documented way to avoid that self-referential trap). Must come after
-- account_users -- see the ordering note at the top of this file.
-- ---------------------------------------------------------------------------
create or replace function private.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select account_id
  from public.account_users
  where user_id = (select auth.uid())
  limit 1;
$$;

create policy "accounts_select_own" on public.accounts
  for select to authenticated
  using (id = private.current_account_id());

create policy "account_users_select_teammates" on public.account_users
  for select to authenticated
  using (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  city text default 'Vancouver',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;
create index customers_account_id_idx on public.customers(account_id);

create trigger set_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

create policy "customers_tenant_isolation" on public.customers
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- equipment -- per customer. filter_due_date drives the "due" alert,
-- computed in queries (filter_due_date <= current_date) rather than a
-- separate boolean that could go stale.
-- ---------------------------------------------------------------------------
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  unit_type text,
  model text,
  serial_number text,
  install_date date,
  warranty_expiration date,
  filter_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.equipment enable row level security;
create index equipment_account_id_idx on public.equipment(account_id);
create index equipment_customer_id_idx on public.equipment(customer_id);

create trigger set_updated_at before update on public.equipment
  for each row execute function public.set_updated_at();

create policy "equipment_tenant_isolation" on public.equipment
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- jobs -- referenced by service_history below, so it must be declared first.
-- ---------------------------------------------------------------------------
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  equipment_id uuid references public.equipment(id) on delete set null,
  job_type text not null check (job_type in ('tune-up', 'install', 'emergency', 'inspection')),
  scheduled_date timestamptz not null,
  assigned_technician_id uuid references auth.users(id) on delete set null,
  status text not null default 'scheduled' check (status in ('scheduled', 'in-progress', 'complete', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;
create index jobs_account_id_scheduled_date_idx on public.jobs(account_id, scheduled_date);
create index jobs_assigned_technician_id_idx on public.jobs(assigned_technician_id);

create trigger set_updated_at before update on public.jobs
  for each row execute function public.set_updated_at();

create policy "jobs_tenant_isolation" on public.jobs
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- service_history -- per unit. customer_id is denormalized off equipment so
-- the per-customer timeline query never has to join through equipment.
-- ---------------------------------------------------------------------------
create table public.service_history (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  technician_id uuid references auth.users(id) on delete set null,
  service_date date not null default current_date,
  work_performed text not null,
  price numeric(10, 2),
  created_at timestamptz not null default now()
);

alter table public.service_history enable row level security;
create index service_history_account_id_idx on public.service_history(account_id);
create index service_history_equipment_id_idx on public.service_history(equipment_id, service_date desc);

create policy "service_history_tenant_isolation" on public.service_history
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- agreements -- maintenance plans the HVAC company sells to ITS customers.
-- Distinct from Frostburn's own tiers on `accounts`. status is intentionally
-- NOT derived here from renewal_date/next_service_date to keep this
-- migration simple -- flagged in the plan as worth reconciling with a
-- scheduled job or a view later; for now the app must set it explicitly.
-- ---------------------------------------------------------------------------
create table public.agreements (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  plan_tier text not null check (plan_tier in ('silver', 'gold', 'platinum')),
  unit_count integer not null default 1,
  annual_value numeric(10, 2) not null,
  start_date date,
  renewal_date date not null,
  next_service_date date,
  auto_remind boolean not null default true,
  status text not null default 'active' check (status in ('active', 'due', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.agreements enable row level security;
create index agreements_account_id_renewal_date_idx on public.agreements(account_id, renewal_date);

create trigger set_updated_at before update on public.agreements
  for each row execute function public.set_updated_at();

create policy "agreements_tenant_isolation" on public.agreements
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- pricing_book_items -- scoped per account (not a shared global catalog) so
-- an operator can edit their own prices later. Seeded at account creation
-- from lib/pricing-book/seed-data.ts.
-- ---------------------------------------------------------------------------
create table public.pricing_book_items (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  category text not null check (category in ('heating', 'cooling', 'indoor_air_quality', 'emergency')),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricing_book_items enable row level security;
create index pricing_book_items_account_id_idx on public.pricing_book_items(account_id);

create trigger set_updated_at before update on public.pricing_book_items
  for each row execute function public.set_updated_at();

create policy "pricing_book_items_tenant_isolation" on public.pricing_book_items
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- quotes / quote_items -- share_token is the capability/secret for the
-- public /quote/[token] page. That route reads via the service-role client
-- by token, NOT an anon RLS carve-out -- tenant isolation stays uniform for
-- the authenticated app, and the public route must select only
-- display-safe columns itself.
-- ---------------------------------------------------------------------------
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'sent')),
  total numeric(10, 2) not null default 0,
  share_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;
create index quotes_account_id_idx on public.quotes(account_id);

create trigger set_updated_at before update on public.quotes
  for each row execute function public.set_updated_at();

create policy "quotes_tenant_isolation" on public.quotes
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  quote_id uuid not null references public.quotes(id) on delete cascade,
  pricing_book_item_id uuid references public.pricing_book_items(id) on delete set null,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) generated always as (quantity * unit_price) stored
);

alter table public.quote_items enable row level security;
create index quote_items_quote_id_idx on public.quote_items(quote_id);

create policy "quote_items_tenant_isolation" on public.quote_items
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

-- ---------------------------------------------------------------------------
-- invoices / invoice_items -- "revenue at risk" is sum(total) where
-- status = 'overdue', a query, not a stored column.
-- ---------------------------------------------------------------------------
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  invoice_number text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date date not null default current_date,
  due_date date,
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invoices enable row level security;
create index invoices_account_id_status_idx on public.invoices(account_id, status);
create unique index invoices_account_id_invoice_number_idx on public.invoices(account_id, invoice_number);

create trigger set_updated_at before update on public.invoices
  for each row execute function public.set_updated_at();

create policy "invoices_tenant_isolation" on public.invoices
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) generated always as (quantity * unit_price) stored
);

alter table public.invoice_items enable row level security;
create index invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

create policy "invoice_items_tenant_isolation" on public.invoice_items
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());
