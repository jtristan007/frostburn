-- Fix findings from get_advisors run immediately after 0001_init:
-- 1. set_updated_at had a mutable search_path (security WARN).
-- 2. Several foreign keys were missing a covering index (performance INFO).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index agreements_customer_id_idx on public.agreements(customer_id);
create index invoice_items_account_id_idx on public.invoice_items(account_id);
create index invoices_customer_id_idx on public.invoices(customer_id);
create index invoices_job_id_idx on public.invoices(job_id);
create index jobs_customer_id_idx on public.jobs(customer_id);
create index jobs_equipment_id_idx on public.jobs(equipment_id);
create index quote_items_account_id_idx on public.quote_items(account_id);
create index quote_items_pricing_book_item_id_idx on public.quote_items(pricing_book_item_id);
create index quotes_customer_id_idx on public.quotes(customer_id);
create index service_history_customer_id_idx on public.service_history(customer_id);
create index service_history_job_id_idx on public.service_history(job_id);
create index service_history_technician_id_idx on public.service_history(technician_id);
