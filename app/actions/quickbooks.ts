'use server'

import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { getAuthorizeUrl, disconnectAccount, pushInvoice } from '@/lib/quickbooks/client'
import { taxBreakdown } from '@/lib/money'

const QB_STATE_COOKIE = 'qb_oauth_state'

// OAuth `state` is a random nonce also kept in an httpOnly cookie, and the
// callback requires the two to match. It used to be the account id, which
// is guessable, so a crafted callback link could attach an attacker's
// QuickBooks company to a logged-in victim's account.
export async function connectQuickBooks() {
  await getCurrentAccount()
  const state = randomBytes(24).toString('hex')
  ;(await cookies()).set(QB_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/quickbooks',
    maxAge: 600,
  })
  redirect(getAuthorizeUrl(state))
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
    .select('*, customers(name)')
    .eq('id', invoiceId)
    .maybeSingle()

  if (!invoice) return { error: 'Invoice not found.' }
  if (invoice.qb_invoice_id) return { error: 'Already sent to QuickBooks.' }
  // The QuickBooks push sends a single sales line for the whole total, so
  // GST would be booked as sales income instead of tax collected. Until
  // the push maps GST to the company's QuickBooks tax codes, refuse rather
  // than put wrong numbers in the owner's books.
  if (taxBreakdown(invoice)) {
    return {
      error:
        'Invoices with GST/HST can’t be sent to QuickBooks yet. Enter this one in QuickBooks directly so the tax is recorded correctly.',
    }
  }

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
