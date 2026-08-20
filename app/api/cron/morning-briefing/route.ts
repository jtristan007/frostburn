import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInvoiceReminderEmail, sendMorningBriefingEmail } from '@/lib/resend/emails'

// Runs once daily (see vercel.json). For every account: emails a reminder
// for each overdue invoice with a customer email on file, then emails the
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
      await sendInvoiceReminderEmail({
        to: customer.email,
        customerName: customer.name,
        companyName: account.name,
        invoiceNumber: invoice.invoice_number,
        total: Number(invoice.total),
        dueDate: invoice.due_date,
      })
      reminderCount++
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
        await sendMorningBriefingEmail({
          to: ownerEmail,
          companyName: account.name,
          revenueAtRisk,
          activeClients: customerCount.count ?? 0,
          jobsToday: jobsToday.count ?? 0,
          overdueCount: reminderCount,
        })
        briefingSent = true
      }
    }

    results.push({ account: account.name, reminders: reminderCount, briefingSent })
  }

  return NextResponse.json({ ok: true, results })
}
