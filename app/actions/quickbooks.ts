'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { getAuthorizeUrl, disconnectAccount, pushInvoice } from '@/lib/quickbooks/client'

export async function connectQuickBooks() {
  const { account } = await getCurrentAccount()
  redirect(getAuthorizeUrl(account.id))
}

export async function disconnectQuickBooks() {
  const { account } = await getCurrentAccount()
  await disconnectAccount(account.id)
  revalidatePath('/dashboard/settings/quickbooks')
}

export async function sendInvoiceToQuickBooks(invoiceId: string): Promise<{ error?: string }> {
  const { supabase, account } = await getCurrentAccount()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, invoice_number, total, qb_invoice_id, customers(name)')
    .eq('id', invoiceId)
    .maybeSingle()

  if (!invoice) return { error: 'Invoice not found.' }
  if (invoice.qb_invoice_id) return { error: 'Already sent to QuickBooks.' }

  const customerName = (invoice.customers as unknown as { name: string } | null)?.name
  if (!customerName) return { error: 'This invoice has no customer to bill.' }

  try {
    const qbInvoiceId = await pushInvoice(account.id, {
      invoice_number: invoice.invoice_number,
      total: Number(invoice.total),
      customerName,
    })

    await supabase.from('invoices').update({ qb_invoice_id: qbInvoiceId }).eq('id', invoiceId)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not send this invoice to QuickBooks.' }
  }

  revalidatePath(`/dashboard/invoices/${invoiceId}`)
  return {}
}
