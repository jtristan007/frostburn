-- Fix a finding from get_advisors: job_photos.account_id (added in
-- 0008_job_completion_capture, applied to production before that file
-- existed in the repo) was missing a covering index for its foreign key.

create index job_photos_account_id_idx on public.job_photos(account_id);
