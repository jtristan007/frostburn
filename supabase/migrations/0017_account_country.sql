-- Which country the HVAC company operates in. Decides the country its
-- Stripe connected account is created in (fixed once created) and the
-- currency its invoices are charged in: US -> USD, CA -> CAD. Existing
-- accounts default to US, matching how they were set up so far.
alter table public.accounts
  add column country text not null default 'US' check (country in ('US', 'CA'));
