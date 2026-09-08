-- What a standalone visit under this agreement would cost at retail
-- (e.g. a standard tune-up price from the pricing book). This is the input
-- for an honest "value delivered vs. price paid" comparison -- NOT a true
-- profit-margin figure, which would need labor/materials cost data that
-- doesn't exist yet. Defaults to $150, a typical single-visit HVAC tune-up
-- rate, editable per agreement.

alter table public.agreements
  add column standard_visit_value numeric(10, 2) not null default 150;
