-- Photo and signature capture when a technician completes a job.
--
-- Reconstructed from the live schema -- applied to production (as
-- "job_completion_capture") alongside fee595d "Add photo and signature
-- capture on job completion", but never committed. No new statements
-- here; this file only brings the repo back in sync with what's already
-- live.

alter table public.jobs
  add column signature_url text,
  add column signed_by text,
  add column signed_at timestamptz;

create table public.job_photos (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null default private.current_account_id() references public.accounts(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  url text not null,
  kind text not null default 'after' check (kind in ('before', 'after')),
  created_at timestamptz not null default now()
);

alter table public.job_photos enable row level security;
create index job_photos_job_id_idx on public.job_photos(job_id);

create policy "job_photos_tenant_isolation" on public.job_photos
  for all to authenticated
  using (account_id = private.current_account_id())
  with check (account_id = private.current_account_id());

insert into storage.buckets (id, name, public)
values ('job-media', 'job-media', true)
on conflict (id) do nothing;

-- Public read (photos are shown on the customer portal / quote pages
-- without auth). Write/delete restricted to the account's own folder, e.g.
-- job-media/{account_id}/xyz.jpg -- same pattern as the logos bucket.
create policy "job_media_public_read" on storage.objects
  for select to public
  using (bucket_id = 'job-media');

create policy "job_media_account_write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'job-media'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );

create policy "job_media_account_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'job-media'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );
