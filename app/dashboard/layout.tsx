import { getCurrentAccount } from '@/lib/account'
import { DashboardNav } from '@/components/dashboard/nav'
import { createPortalSession } from '@/app/actions/billing'
import { pastDueDaysLeft } from '@/lib/billing'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { account } = await getCurrentAccount()

  // Grace-period clock only applies while Stripe has the subscription
  // marked past_due/unpaid -- a recovered or since-canceled account won't
  // still be carrying a stale past_due_since (the webhook clears it), but
  // gating on the status too keeps this correct even if it somehow did.
  const inDunning = account.subscription_status === 'past_due' || account.subscription_status === 'unpaid'
  const daysLeft = inDunning ? pastDueDaysLeft(account.past_due_since) : null
  const locked = daysLeft === 0

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="print:hidden">
        <DashboardNav accountName={account.name} />
        {daysLeft !== null && (
          <div
            className={`px-6 py-3 text-sm font-semibold text-center ${locked ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}
          >
            {locked
              ? "Access is restricted until payment is updated."
              : `We couldn't charge your card on file -- update payment within ${daysLeft} day${daysLeft === 1 ? '' : 's'} to avoid losing access.`}{' '}
            <form action={createPortalSession} className="inline">
              <button type="submit" className="underline font-semibold">
                Update payment method
              </button>
            </form>
          </div>
        )}
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8 print:p-0 print:max-w-none">
        {locked ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-navy mb-2">Payment required</h1>
            <p className="text-sm text-gray-400">
              Update your payment method to restore access to your dashboard.
            </p>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
