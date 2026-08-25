-- Company logo: one file per account, used on printable invoices.
alter table public.accounts add column logo_url text;

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Public read (logos are shown on invoices customers view without auth).
create policy "logos_public_read" on storage.objects
  for select to public
  using (bucket_id = 'logos');

-- Write access restricted to the account's own folder, e.g.
-- logos/{account_id}/logo.png -- matches the RLS pattern used everywhere
-- else in this schema (private.current_account_id()).
create policy "logos_account_write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );

create policy "logos_account_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );

create policy "logos_account_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );
