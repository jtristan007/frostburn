import { getCurrentAccount } from '@/lib/account'
import { setOverdueReminders } from '@/app/actions/reminders'
import { invoiceReminderEmail } from '@/lib/resend/emails'
import { countryOf } from '@/lib/money'

export default async function RemindersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { supabase, user, account } = await getCurrentAccount()
  const { saved, error } = await searchParams
  const enabled = account.overdue_reminders_enabled !== false

  const [{ data: me }, { data: overdue }] = await Promise.all([
    supabase.from('account_users').select('role').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('invoices')
      .select('invoice_number, total, due_date, customers(name)')
      .eq('status', 'overdue')
      .order('due_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])
  const canEdit = me?.role === 'owner' || me?.role === 'admin'

  // Preview with the shop's oldest overdue invoice if it has one, otherwise
  // a sample -- either way it's the same template the nightly job sends.
  const customer = overdue?.customers as unknown as { name: string } | null
  const preview = invoiceReminderEmail({
    customerName: customer?.name ?? 'Jordan Smith',
    companyName: account.name,
    invoiceNumber: overdue?.invoice_number ?? 'INV-1042',
    total: overdue ? Number(overdue.total) : 385,
    dueDate: overdue?.due_date ?? '2026-10-15',
    country: countryOf(account),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">Reminders</h1>
      <p className="text-sm text-gray-400 mb-6">
        Frostburn emails your customers when an invoice goes overdue, so you don&apos;t have to chase payments.
      </p>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-navy">Automatic overdue reminders</p>
              <p className={`text-sm mt-0.5 ${enabled ? 'text-green-700' : 'text-amber-600'}`}>
                {enabled ? 'On' : 'Paused. No reminder emails are being sent.'}
              </p>
            </div>
            {canEdit && (
              <form action={setOverdueReminders}>
                <input type="hidden" name="enabled" value={enabled ? 'off' : 'on'} />
                <button
                  type="submit"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                    enabled
                      ? 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      : 'bg-ice text-navy hover:bg-ice-dim'
                  }`}
                >
                  {enabled ? 'Pause reminders' : 'Turn reminders on'}
                </button>
              </form>
            )}
          </div>

          {saved === 'on' && <p className="text-xs text-green-700 mt-3">Reminders are on.</p>}
          {saved === 'off' && <p className="text-xs text-green-700 mt-3">Reminders paused.</p>}
          {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
          {!canEdit && (
            <p className="text-xs text-gray-400 mt-3">Only the account owner or an admin can change this.</p>
          )}

          <h2 className="text-sm font-semibold text-navy mt-6 mb-2">How it works</h2>
          <ul className="text-sm text-gray-500 space-y-1.5 list-disc pl-5">
            <li>An invoice you&apos;ve sent becomes overdue the day after its due date.</li>
            <li>The customer gets a reminder that day, then 7, 14 and 30 days past due. Never daily.</li>
            <li>Only customers with an email address on file get reminders.</li>
            <li>Once an invoice is paid, online or marked paid by you, its reminders stop.</li>
            <li>Importing customers never sends anything.</li>
            <li>
              While paused, nothing is sent. When you turn reminders back on, they pick up on the next scheduled day.
              Missed reminders aren&apos;t sent all at once.
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-semibold text-navy">Preview</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            {overdue ? 'Using your oldest overdue invoice.' : 'Using a sample invoice.'} Subject: {preview.subject}
          </p>
          <iframe
            title="Reminder email preview"
            srcDoc={preview.html}
            sandbox=""
            className="w-full h-[420px] rounded-lg border border-gray-100 bg-white"
          />
        </section>
      </div>
    </div>
  )
}
