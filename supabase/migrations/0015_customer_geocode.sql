-- Map coordinates for a customer's service address, filled in lazily by the
-- dispatch map (lib/geocode.ts) the first time the customer has a job on the
-- board. geocoded_address records the exact address string that was looked
-- up, so an edited address is re-geocoded and a failed lookup (lat/lng left
-- null) isn't retried on every page load. Purely additive; nothing else
-- reads these columns.

alter table public.customers
  add column latitude double precision,
  add column longitude double precision,
  add column geocoded_address text;
