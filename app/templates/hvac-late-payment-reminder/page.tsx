import type { Metadata } from 'next'
import { TemplatePage } from '@/components/landing/template-page'
import { CopyButton } from '@/components/landing/template-tools'
import { TIER_PRICES } from '@/lib/stripe/plans'

const TITLE = 'Late Payment Reminder Email Templates for HVAC Invoices | Frostburn'
const DESCRIPTION =
  'Four free late payment reminder emails for HVAC and air conditioning contractors, from a friendly heads-up to a final notice, plus a short text message version. Copy, fill in and send.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates/hvac-late-payment-reminder' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/templates/hvac-late-payment-reminder' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

const EMAILS: { id: string; when: string; subject: string; body: string }[] = [
  {
    id: 'reminder-due',
    when: '1. A few days before the due date',
    subject: 'Invoice #[number] from [Company] is due on [date]',
    body: `Hi [Customer name],

Just a friendly reminder that invoice #[number] for $[amount] for the [service] at [address] is due on [due date].

You can pay here: [payment link], or reply to this email if you have any questions about the work.

Thanks again for choosing [Company].

[Your name]
[Company] | [phone]`,
  },
  {
    id: 'reminder-7',
    when: '2. About 7 days overdue',
    subject: 'Invoice #[number] is past due',
    body: `Hi [Customer name],

Our records show invoice #[number] for $[amount] was due on [due date] and is still open. It may have slipped through the cracks, so here is the link again: [payment link]

If you have already paid, thank you, and please ignore this email. If something about the invoice doesn't look right, just reply and we'll sort it out.

[Your name]
[Company] | [phone]`,
  },
  {
    id: 'reminder-30',
    when: '3. About 30 days overdue',
    subject: 'Second notice: invoice #[number] is 30 days past due',
    body: `Hi [Customer name],

Invoice #[number] for $[amount], due on [due date], is now 30 days past due.

Please pay by [date, about 7 days from now] using this link: [payment link]. If you need to spread the payment out, call me at [phone] and we can set up a plan.

[Late fee line, only if it is in your written terms: "As stated in our terms, a late fee of [amount] applies after [date]."]

[Your name]
[Company] | [phone]`,
  },
  {
    id: 'reminder-final',
    when: '4. Final notice (60+ days overdue)',
    subject: 'Final notice: invoice #[number]',
    body: `Hi [Customer name],

This is our final notice about invoice #[number] for $[amount], due on [due date]. We have reached out on [dates of earlier reminders] and have not received payment or heard back.

Please pay by [date] at [payment link] or call me at [phone] to agree on a payment plan. If we don't hear from you by then, we will [next step you are prepared to take, e.g. refer the balance to a collection agency / file in small claims court].

We'd much rather settle this directly with you.

[Your name]
[Company] | [phone]`,
  },
]

const SMS = `Hi [Name], it's [Your name] from [Company]. Quick reminder that invoice #[number] for $[amount] was due [date]. You can pay here: [payment link]. Thanks!`

function EmailCard({ id, when, subject, body }: { id: string; when: string; subject: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white text-slate-900 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-4 py-3">
        <div className="font-semibold text-sm">{when}</div>
        <div className="[&_button]:bg-navy [&_button]:text-white [&_button]:border-navy">
          <CopyButton targetId={id} label="Copy email" />
        </div>
      </div>
      <div id={id} className="px-4 py-4 text-[13px] sm:text-sm leading-relaxed">
        <div className="mb-3">
          <span className="text-slate-500">Subject: </span>
          <span className="font-semibold">{subject}</span>
        </div>
        <div className="whitespace-pre-line">{body}</div>
      </div>
    </div>
  )
}

const templateDoc = (
  <div className="space-y-5">
    {EMAILS.map((e) => (
      <EmailCard key={e.id} {...e} />
    ))}
    <div className="rounded-xl border border-white/10 bg-white text-slate-900 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-4 py-3">
        <div className="font-semibold text-sm">Text message version</div>
        <div className="[&_button]:bg-navy [&_button]:text-white [&_button]:border-navy">
          <CopyButton targetId="reminder-sms" label="Copy text" />
        </div>
      </div>
      <div id="reminder-sms" className="px-4 py-4 text-[13px] sm:text-sm leading-relaxed">
        {SMS}
      </div>
    </div>
  </div>
)

export default function HvacLatePaymentReminderPage() {
  return (
    <TemplatePage
      slug="hvac-late-payment-reminder"
      eyebrow="Free late payment reminder templates"
      title="Late payment reminder emails for HVAC invoices."
      intro="Four ready-to-send reminders for overdue HVAC and air conditioning invoices, from a friendly heads-up before the due date to a final notice, plus a short text message. Copy one, fill in the brackets and send."
      printable={false}
      document={templateDoc}
      howTo={[
        {
          t: 'Copy the right reminder',
          d: 'Pick the email that matches how late the invoice is and tap “Copy email”.',
        },
        {
          t: 'Fill in the brackets',
          d: 'Replace everything in [brackets] with the customer’s name, invoice number, amount, dates and your payment link.',
        },
        {
          t: 'Send it on schedule',
          d: 'Send each reminder at roughly the time shown. Consistent, polite follow-up gets more invoices paid than one angry message.',
        },
        {
          t: 'Call before the final notice',
          d: 'If the email reminders get no reply, a short phone call often solves it before you send the final notice.',
        },
      ]}
      tips={{
        heading: 'Getting overdue invoices paid',
        items: [
          {
            t: 'Make paying one click',
            d: 'Every reminder should include a payment link. The easier it is to pay, the less you have to ask.',
          },
          {
            t: 'Only charge fees you agreed to',
            d: 'Add a late fee only if it was in the written terms the customer agreed to, and check your state’s limits on late fees and interest.',
          },
          {
            t: 'Stay polite and specific',
            d: 'Name the invoice, amount and due date every time. A calm, factual tone gets paid faster and keeps the customer.',
          },
          {
            t: 'Know your next step',
            d: 'Before sending a final notice, decide what you will actually do next (a payment plan, collections or small claims) and follow through.',
          },
        ],
      }}
      ctaHeading="Let the reminders send themselves."
      ctaPoints={[
        'Frostburn emails a polite reminder automatically once an invoice is overdue, on every plan',
        'Every invoice has its own secure page so customers can pay by card online',
        'Paid invoices are marked paid automatically when the customer pays online',
        'Your morning briefing shows what’s owed and the reminders that went out',
        `Flat $${TIER_PRICES.starter}/month for 1–5 techs`,
      ]}
      faqs={[
        {
          q: 'When should I send a late payment reminder?',
          a: 'A common schedule is a friendly reminder a few days before the due date, another about a week after it, a firmer second notice at around 30 days and a final notice at 60 days or more.',
        },
        {
          q: 'Can I charge a late fee on an HVAC invoice?',
          a: 'Generally only if the late fee was in the written terms the customer agreed to before the work, and within your state’s limits on fees and interest. Rules vary by state, so check before you add one.',
        },
        {
          q: 'Should I send reminders by email or text?',
          a: 'Both work. Email is better for the invoice details and payment link; a short text is good for a quick nudge. Use whichever your customer responds to.',
        },
        {
          q: 'Are these templates free to use?',
          a: 'Yes. Copy and edit them as much as you like. No sign-up needed.',
        },
      ]}
    />
  )
}
