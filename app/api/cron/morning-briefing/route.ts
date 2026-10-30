import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInvoiceReminderEmail, sendMorningBriefingEmail } from '@/lib/resend/emails'
import { reconcileOpenCheckouts } from '@/lib/stripe-connect/reconcile'

// Runs once daily (see vercel.json). Marks sent invoices past due as
// overdue, then for every account: emails a reminder for overdue invoices
// on the cadence in shouldRemind() (customer email on file only), then emails the
// account owner a briefing of the day's numbers. Uses the service-role
// client throughout -- a cron request has no user session to scope a
// normal client to, same reasoning as the Stripe webhook.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const todayStr = new Date().toISOString().slice(0, 10)

  // Mark invoices paid that customers paid through Stripe but the app never
  // heard about (no webhook delivered). Must run before the overdue
  // reminders below so nobody is chased for an invoice they already paid.
  const reconciled = await reconcileOpenCheckouts()

  // Agreement renewal rollover: an agreement whose renewal_date has passed
  // renews for another year and its included-visits counter resets --
  // otherwise visits_completed_this_period would climb forever and every
  // agreement would eventually look "used up." Runs across all accounts in
  // one query since the admin client isn't RLS-scoped.
  const { data: dueForRenewal } = await admin
    .from('agreements')
    .select('id, account_id, customer_id, renewal_date, annual_value')
    .lte('renewal_date', todayStr)
    .neq('status', 'expired')

  for (const agreement of dueForRenewal ?? []) {
    const nextRenewal = new Date(agreement.renewal_date)
    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1)
    await admin
      .from('agreements')
      .update({
        renewal_date: nextRenewal.toISOString().slice(0, 10),
        visits_completed_this_period: 0,
        status: 'active',
      })
      .eq('id', agreement.id)

    // account_id is set explicitly here, unlike the app's own inserts --
    // this runs on the admin client with no user session, so there's no
    // current_account_id() to default from.
    await admin.from('agreement_events').insert({
      account_id: agreement.account_id,
      agreement_id: agreement.id,
      customer_id: agreement.customer_id,
      event_type: 'renewed',
      annual_value: agreement.annual_value,
    })
  }

  // Sent invoices past their due date become overdue. Nothing else ever
  // set this status, so "revenue at risk" and the reminders below only
  // worked if the owner flipped it by hand.
  const { data: newlyOverdue } = await admin
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('status', 'sent')
    .lt('due_date', todayStr)
    .select('id')
  const newlyOverdueIds = new Set((newlyOverdue ?? []).map((i) => i.id))

  const { data: accounts, error: accountsError } = await admin
    .from('accounts')
    .select('id, name')

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 })
  }

  const results: Array<{ account: string; reminders: number; briefingSent: boolean }> = []

  for (const account of accounts ?? []) {
    const [overdueInvoices, customerCount, jobsToday, owner] = await Promise.all([
      admin
        .from('invoices')
        .select('id, invoice_number, total, due_date, customer_id, customers(name, email)')
        .eq('account_id', account.id)
        .eq('status', 'overdue'),
      admin
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', account.id),
      admin
        .from('jobs')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', account.id)
        .gte('scheduled_date', `${todayStr}T00:00:00`)
        .lt('scheduled_date', `${todayStr}T23:59:59`),
      admin
        .from('account_users')
        .select('user_id')
        .eq('account_id', account.id)
        .eq('role', 'owner')
        .maybeSingle(),
    ])

    let reminderCount = 0
    for (const invoice of overdueInvoices.data ?? []) {
      const customer = invoice.customers as unknown as { name: string; email: string | null } | null
      if (!customer?.email) continue
      if (!shouldRemind(invoice.id, invoice.due_date, todayStr, newlyOverdueIds)) continue
      const sent = await sendInvoiceReminderEmail({
        to: customer.email,
        customerName: customer.name,
        companyName: account.name,
        invoiceNumber: invoice.invoice_number,
        total: Number(invoice.total),
        dueDate: invoice.due_date,
      })
      if (sent) reminderCount++
    }

    const revenueAtRisk = (overdueInvoices.data ?? []).reduce(
      (sum, i) => sum + Number(i.total),
      0
    )

    let briefingSent = false
    if (owner.data?.user_id) {
      const { data: authUser } = await admin.auth.admin.getUserById(owner.data.user_id)
      const ownerEmail = authUser?.user?.email
      if (ownerEmail) {
        briefingSent = await sendMorningBriefingEmail({
          to: ownerEmail,
          companyName: account.name,
          revenueAtRisk,
          activeClients: customerCount.count ?? 0,
          jobsToday: jobsToday.count ?? 0,
          overdueCount: reminderCount,
        })
      }
    }

    results.push({ account: account.name, reminders: reminderCount, briefingSent })
  }

  return NextResponse.json({ ok: true, invoicesReconciled: reconciled, agreementsRenewed: dueForRenewal?.length ?? 0, results })
}

// Reminder cadence: the day an invoice goes overdue, then 7, 14 and 30 days
// past due -- instead of emailing the homeowner every single day. Invoices
// with no due date (only possible if marked overdue by hand) get none.
const REMINDER_DAYS_PAST_DUE = new Set([7, 14, 30])

function shouldRemind(
  invoiceId: string,
  dueDate: string | null,
  todayStr: string,
  newlyOverdueIds: Set<string>
) {
  if (newlyOverdueIds.has(invoiceId)) return true
  if (!dueDate) return false
  const daysPastDue = Math.round(
    (Date.parse(`${todayStr}T00:00:00Z`) - Date.parse(`${dueDate.slice(0, 10)}T00:00:00Z`)) / 86_400_000
  )
  return REMINDER_DAYS_PAST_DUE.has(daysPastDue)
}
