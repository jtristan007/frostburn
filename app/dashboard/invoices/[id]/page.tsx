import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { PrintButton } from '@/components/dashboard/print-button'
import { SendToQuickBooksButton } from '@/components/dashboard/send-to-quickbooks-button'
import { getConnectionStatus } from '@/lib/quickbooks/client'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
}

export default async function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, account } = await getCurrentAccount()

  const [{ data: invoice }, qbStatus] = await Promise.all([
    supabase
      .from('invoices')
      .select(
        'id, invoice_number, status, issue_date, due_date, total, qb_invoice_id, pay_token, job_id, customers(name, email, phone, address, city)'
      )
      .eq('id', id)
      .maybeSingle(),
    getConnectionStatus(account.id),
  ])

  if (!invoice) notFound()

  const customer = invoice.customers as unknown as {
    name: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
  } | null

  // A signed-off job attached to this invoice is proof of work done -- show
  // it right on the printed invoice when there is one, same evidence a
  // dispute or insurance claim would need months later.
  const { data: job } = invoice.job_id
    ? await supabase.from('jobs').select('signature_url, signed_by, signed_at').eq('id', invoice.job_id).maybeSingle()
    : { data: null }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/dashboard/invoices" className="text-sm text-gray-400 hover:text-navy">
          ← Back to invoices
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/invoices/${invoice.id}/edit`}
            className="text-sm font-semibold border border-gray-200 text-navy px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <PrintButton />
        </div>
      </div>

      {qbStatus.connected && (
        <div className="flex justify-end mb-4 print:hidden">
          <SendToQuickBooksButton invoiceId={invoice.id} alreadySent={!!invoice.qb_invoice_id} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-2xl print:border-0 print:rounded-none print:p-0 print:max-w-none">
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            {account.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.logo_url} alt={account.name} className="h-14 w-auto object-contain" />
            ) : null}
            <p className="text-lg font-bold text-navy">{account.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-navy tracking-tight">INVOICE</p>
            <p className="text-sm text-gray-400 mt-1">{invoice.invoice_number}</p>
            <p className="text-xs font-semibold uppercase tracking-wide mt-2 text-ice">
              {STATUS_LABELS[invoice.status] ?? invoice.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Bill to</p>
            <p className="text-sm font-medium text-navy">{customer?.name ?? 'Unknown customer'}</p>
            {customer?.address && <p className="text-sm text-gray-500">{customer.address}</p>}
            {customer?.city && <p className="text-sm text-gray-500">{customer.city}</p>}
            {customer?.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}
            {customer?.email && <p className="text-sm text-gray-500">{customer.email}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Dates</p>
            <p className="text-sm text-gray-500">Issued {invoice.issue_date}</p>
            {invoice.due_date && <p className="text-sm text-gray-500">Due {invoice.due_date}</p>}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex justify-end">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total due</p>
            <p className="text-3xl font-bold text-navy">${Number(invoice.total).toFixed(2)}</p>
          </div>
        </div>

        {job?.signature_url && (
          <div className="border-t border-gray-100 mt-6 pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Signed off by</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={job.signature_url} alt="Customer signature" className="h-16 bg-white" />
            {job.signed_by && (
              <p className="text-sm text-gray-500 mt-1">
                {job.signed_by}
                {job.signed_at ? ` — ${new Date(job.signed_at).toLocaleDateString()}` : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {account.stripe_connect_charges_enabled && invoice.status !== 'paid' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl mt-6 print:hidden">
          <p className="text-sm text-gray-500 mb-3">Pay-online link for this customer:</p>
          <code className="block text-xs bg-gray-50 rounded-lg px-3 py-2 break-all">
            {`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/pay/${invoice.pay_token}`}
          </code>
        </div>
      )}
    </div>
  )
}
