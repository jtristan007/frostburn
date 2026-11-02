-- Lets a shop pause automatic overdue-invoice reminder emails (Settings >
-- Reminders), e.g. while it moves over from another system. On by default
-- so existing accounts keep their current behavior.
alter table public.accounts
  add column overdue_reminders_enabled boolean not null default true;
