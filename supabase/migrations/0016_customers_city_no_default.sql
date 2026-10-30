-- Drop the leftover 'Vancouver' default on customers.city. The app now sends
-- an explicit null for a blank city, so this only matters for inserts that
-- omit the column entirely -- those should get no city, not a made-up one.
alter table public.customers alter column city drop default;
