-- The logos and job-media buckets are public, so their files are served by
-- URL without any storage.objects policy. The old "public read" SELECT
-- policies only added the ability for anyone with the anon key to LIST
-- every tenant's folders -- exposing account ids, customer signatures and
-- job photos across all accounts. Replace them with SELECT limited to the
-- caller's own account folder (needed for upsert on logo upload).
drop policy if exists "logos_public_read" on storage.objects;
drop policy if exists "job_media_public_read" on storage.objects;

create policy "logos_account_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );

create policy "job_media_account_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'job-media'
    and (storage.foldername(name))[1] = private.current_account_id()::text
  );
