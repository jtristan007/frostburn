import { resend, EMAIL_FROM } from '@/lib/resend/client'

// Server-only. Every function here swallows its own send error (logs, does
// not throw) -- a failed notification email should never break the
// customer/invoice flow that triggered it.

function wrapper(bodyHtml: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px 0 16px; font-size: 18px; font-weight: 700;">
        <span style="color:#05091a">Frost</span><span style="color:#38bdf8">burn</span>
      </div>
      ${bodyHtml}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        Sent by Frostburn on behalf of your service provider.
      </div>
    </div>
  `
}

export async function sendInvoiceReminderEmail(params: {
  to: string
  customerName: string
  companyName: string
  invoiceNumber: string
  total: number
  dueDate: string | null
}) {
  const { to, customerName, companyName, invoiceNumber, total, dueDate } = params
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Reminder: Invoice ${invoiceNumber} from ${companyName} is overdue`,
      html: wrapper(`
        <p>Hi ${customerName},</p>
        <p>This is a friendly reminder that invoice <strong>${invoiceNumber}</strong> from <strong>${companyName}</strong> is now overdue.</p>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin:16px 0;">
          <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.04em;">Amount due</div>
          <div style="font-size:24px; font-weight:700;">$${total.toFixed(2)}</div>
          ${dueDate ? `<div style="font-size:13px; color:#64748b; margin-top:4px;">Was due ${dueDate}</div>` : ''}
        </div>
        <p>If you've already sent payment, thank you -- please disregard this message.</p>
      `),
    })
  } catch (err) {
    console.error('sendInvoiceReminderEmail failed:', err)
  }
}

export async function sendWelcomeEmail(params: {
  to: string
  customerName: string
  companyName: string
}) {
  const { to, customerName, companyName } = params
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Welcome to ${companyName}`,
      html: wrapper(`
        <p>Hi ${customerName},</p>
        <p>You're now set up as a customer of <strong>${companyName}</strong>. We'll keep your service history, equipment, and invoices organized here going forward.</p>
        <p>If you have any questions, just reach out to ${companyName} directly.</p>
      `),
    })
  } catch (err) {
    console.error('sendWelcomeEmail failed:', err)
  }
}

export async function sendMorningBriefingEmail(params: {
  to: string
  companyName: string
  revenueAtRisk: number
  activeClients: number
  jobsToday: number
  overdueCount: number
}) {
  const { to, companyName, revenueAtRisk, activeClients, jobsToday, overdueCount } = params
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Morning briefing for ${companyName} -- ${new Date().toLocaleDateString()}`,
      html: wrapper(`
        <p>Good morning,</p>
        <p>Here's where things stand for <strong>${companyName}</strong> today${overdueCount > 0 ? `, including ${overdueCount} overdue invoice reminder${overdueCount === 1 ? '' : 's'} sent automatically overnight` : ''}.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px 0 0 10px;">
              <div style="font-size:11px; color:#64748b; text-transform:uppercase;">Revenue at risk</div>
              <div style="font-size:20px; font-weight:700;">$${revenueAtRisk.toFixed(0)}</div>
            </td>
            <td style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-left:none;">
              <div style="font-size:11px; color:#64748b; text-transform:uppercase;">Active clients</div>
              <div style="font-size:20px; font-weight:700;">${activeClients}</div>
            </td>
            <td style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-left:none; border-radius:0 10px 10px 0;">
              <div style="font-size:11px; color:#64748b; text-transform:uppercase;">Jobs today</div>
              <div style="font-size:20px; font-weight:700;">${jobsToday}</div>
            </td>
          </tr>
        </table>
      `),
    })
  } catch (err) {
    console.error('sendMorningBriefingEmail failed:', err)
  }
}
