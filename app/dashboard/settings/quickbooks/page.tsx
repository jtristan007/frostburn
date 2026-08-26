import { getCurrentAccount } from '@/lib/account'
import { getConnectionStatus } from '@/lib/quickbooks/client'
import { connectQuickBooks, disconnectQuickBooks } from '@/app/actions/quickbooks'

export default async function QuickBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>
}) {
  const { account } = await getCurrentAccount()
  const { connected, realmId } = await getConnectionStatus(account.id)
  const params = await searchParams

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">QuickBooks</h1>
      <p className="text-sm text-gray-400 mb-6">
        Connect QuickBooks Online to send your invoices there as they&apos;re created.
      </p>

      {params.connected && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6 text-sm text-green-700">
          QuickBooks connected.
        </div>
      )}
      {params.error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          {params.error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
        {connected ? (
          <>
            <p className="text-sm font-semibold text-navy mb-1">Connected</p>
            <p className="text-xs text-gray-400 mb-4">Company ID {realmId}</p>
            <form action={disconnectQuickBooks}>
              <button
                type="submit"
                className="text-sm font-semibold border border-gray-200 text-navy px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Disconnect
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-navy mb-1">Not connected</p>
            <p className="text-xs text-gray-400 mb-4">
              You&apos;ll be sent to QuickBooks to sign in and approve access.
            </p>
            <form action={connectQuickBooks}>
              <button
                type="submit"
                className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
              >
                Connect QuickBooks
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
