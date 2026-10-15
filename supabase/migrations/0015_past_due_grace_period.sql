-- Stripe retries a failed renewal charge on its own schedule and marks the
-- subscription past_due/unpaid, but nothing here tells the app when to
-- actually warn the customer or cut off access. This is Frostburn's own
-- clock for that: set by the webhook the first time an account enters
-- past_due/unpaid, cleared on recovery. The dashboard uses it to show a
-- grace-period countdown and then lock out once it elapses.
alter table public.accounts add column past_due_since timestamptz;
