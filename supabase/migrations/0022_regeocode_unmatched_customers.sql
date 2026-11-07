-- The dispatch map can now place Canadian addresses (and US addresses the
-- Census geocoder misses) through OpenStreetMap. Addresses that failed
-- under the old US-only lookup were saved with null coordinates so they
-- wouldn't be retried; clear that marker once so they get looked up again
-- with the new geocoder. Data-only, no schema change.

update public.customers
set geocoded_address = null
where geocoded_address is not null
  and (latitude is null or longitude is null);
