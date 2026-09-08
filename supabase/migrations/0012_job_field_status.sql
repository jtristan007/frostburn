-- Granular day-of technician status, separate from the existing lifecycle
-- `status` column (scheduled/in-progress/complete/cancelled) so nothing
-- that already reads `status` needs to change. field_status is null until
-- a job is actually dispatched; a technician (or dispatcher) advances it
-- through dispatched -> en_route -> arrived over the course of the day.
-- Marking the job complete still goes through the existing completion flow
-- and the existing `status` column -- this is purely additive.

alter table public.jobs
  add column field_status text check (field_status in ('dispatched', 'en_route', 'arrived')),
  add column field_status_updated_at timestamptz;
