import { getCurrentAccount } from '@/lib/account'
import { createPortalSession } from '@/app/actions/billing'
import { TIER_LABELS, type Tier } from '@/lib/stripe/plans'

export default async function BillingSettingsPage() {
  const { account } = await getCurrentAccount()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">Billing</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-400">Current plan</p>
        <p className="text-xl font-bold text-navy mt-1">
          {account.tier ? TIER_LABELS[account.tier as Tier] : 'No plan selected'}
        </p>
        <p className="text-sm text-gray-400 mt-1 capitalize">
          {account.subscription_status ?? 'Not subscribed yet'}
        </p>

        {account.stripe_customer_id ? (
          <form action={createPortalSession} className="mt-6">
            <button
              type="submit"
              className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Manage billing
            </button>
          </form>
        ) : (
          <a
            href="/onboarding/plan"
            className="inline-block mt-6 text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
          >
            Choose a plan
          </a>
        )}
      </div>
    </div>
  )
}
