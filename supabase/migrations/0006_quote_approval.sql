-- Lets a customer approve or decline a quote from the public share link
-- (no login required -- reachable via quotes.share_token, same
-- service-role-mediated pattern as the rest of the public quote page).
--
-- Reconstructed from the live schema -- applied to production (as
-- "quote_approval") alongside 327656c "Let customers approve or decline a
-- quote from the public link", but never committed. No new statements
-- here; this file only brings the repo back in sync with what's already
-- live.

alter table public.quotes add column responded_at timestamptz;

alter table public.quotes drop constraint quotes_status_check;
alter table public.quotes add constraint quotes_status_check
  check (status in ('draft', 'sent', 'approved', 'declined'));
