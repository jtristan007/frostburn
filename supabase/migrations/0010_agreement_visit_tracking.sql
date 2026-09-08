-- Links a job to the maintenance agreement it fulfills, and tracks how many
-- of an agreement's included visits have been used this period. This is the
-- structural piece the "included vs. billable visits," renewal automation,
-- and future profitability/retention reporting all depend on -- previously
-- agreements and jobs had no relationship to each other at all.
--
-- Additive only: existing agreements default to 2 included visits/year
-- (a standard spring/fall HVAC tune-up cadence) with 0 used so far, and
-- existing jobs are simply not linked to an agreement. Nothing here changes
-- existing behavior until the app starts setting these fields.

alter table public.jobs
  add column agreement_id uuid references public.agreements(id) on delete set null,
  add column included_visit boolean not null default false;

create index jobs_agreement_id_idx on public.jobs(agreement_id);

alter table public.agreements
  add column visits_included_per_year integer not null default 2,
  add column visits_completed_this_period integer not null default 0;
