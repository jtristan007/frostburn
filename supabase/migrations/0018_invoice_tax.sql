-- Sales tax on invoices, for Canadian shops charging GST/HST.
--   invoices.subtotal  -- amount before tax; null on invoices entered as a
--                         single total (every invoice before this, and US
--                         shops), which display exactly as before.
--   invoices.tax_rate  -- percent applied to subtotal (5 = BC GST); total
--                         remains the amount charged, subtotal + tax.
--   accounts.gst_number -- GST/HST registration number, printed on invoices.
alter table public.invoices
  add column subtotal numeric(12, 2),
  add column tax_rate numeric(5, 3) not null default 0 check (tax_rate >= 0 and tax_rate <= 25);

alter table public.accounts
  add column gst_number text;
