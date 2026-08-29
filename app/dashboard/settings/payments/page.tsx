import { getCurrentAccount } from '@/lib/account'
import { syncConnectedAccountStatus } from '@/lib/stripe-connect/client'
import { connectStripePayments } from '@/app/actions/stripe-connect'

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  not_connected: { label: 'Not connected', tone: 'text-gray-400' },
  onboarding: { label: 'Onboarding incomplete', tone: 'text-amber-600' },
  active: { label: 'Active', tone: 'text-green-700' },
}

export default async function PaymentsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>
}) {
  const { account } = await getCurrentAccount()
  const { onboarding } = await searchParams

  // Re-sync on every load while not yet fully active -- cheapest way to stay
  // eventually-consistent without a dedicated Connect webhook pipeline (see
  // lib/stripe-connect/client.ts). Harmless no-op once status is 'active'.
  // Wrapped: this calls Stripe with the connected account's ID, and that
  // retrieve fails hard (crashing the whole page) if the account was
  // created against a different Stripe key than the one currently
  // configured -- a real scenario, not hypothetical, since a test/sandbox
  // switch changes every existing connected account ID to something the
  // new key has never heard of. Falls back to the last known DB status
  // instead of taking the page down over it.
  let status = account.stripe_connect_status as string
  if (account.stripe_connect_account_id && status !== 'active') {
    try {
      status = await syncConnectedAccountStatus(account.id, account.stripe_connect_account_id)
    } catch (err) {
      console.error('Stripe Connect status sync failed:', err)
    }
  }

  const copy = STATUS_COPY[status] ?? STATUS_COPY.not_connected

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-1">Payments</h1>
      <p className="text-sm text-gray-400 mb-6">
        Connect your own Stripe account so customers can pay invoices online. Money goes straight to
        you — Frostburn never touches it.
      </p>

      {onboarding === 'refresh' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700">
          That onboarding link expired. Start again below.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm font-semibold text-navy mb-1">
          Status: <span className={copy.tone}>{copy.label}</span>
        </p>

        {status === 'active' ? (
          <p className="text-xs text-gray-400">
            Invoices now show a &quot;Pay now&quot; link that goes straight to your connected Stripe
            account.
          </p>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {status === 'onboarding'
                ? "You've started but Stripe still needs a bit more information before you can accept payments."
                : "You'll be sent to Stripe to set up (or connect) your own account."}
            </p>
            <form action={connectStripePayments}>
              <button
                type="submit"
                className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
              >
                {status === 'onboarding' ? 'Finish setup' : 'Connect Stripe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
