import type { Metadata } from 'next'
import { TopicPage } from '@/components/landing/topic-page'
import { TIER_PRICES, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

const TITLE = 'HVAC Invoicing Software with Automatic Payment Reminders | Frostburn'
const DESCRIPTION = `HVAC invoicing software for small shops: quotes from your pricing book, online card payments, and automatic reminders on overdue invoices. Flat pricing from $${TIER_PRICES.starter}/month, ${TRIAL_PERIOD_DAYS}-day free trial.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/hvac-invoicing-software' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/hvac-invoicing-software' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

export default function HvacInvoicingSoftwarePage() {
  return (
    <TopicPage
      eyebrow="HVAC invoicing software"
      title="HVAC invoicing that gets you paid without the awkward calls."
      intro="Frostburn turns the job into an invoice in seconds, lets customers pay by card online, and sends the reminders on overdue invoices for you. Built for HVAC shops with 1–15 techs."
      problemsHeading="The work is done. The money isn’t in."
      problems={[
        {
          t: 'Invoices written at night',
          d: 'After a full day in the field, the paperwork waits until the kitchen table, and some of it never goes out.',
        },
        {
          t: 'Checks in the mail, someday',
          d: 'Without an easy way to pay, customers set the invoice aside and you wait weeks for money you already earned.',
        },
        {
          t: 'Chasing customers you like',
          d: 'Calling a good customer about a late bill is uncomfortable, so it gets put off and the balance keeps aging.',
        },
      ]}
      featuresHeading="From finished job to paid invoice, with less desk work."
      features={[
        {
          t: 'Quotes from your pricing book',
          d: 'Pick services and parts from your own price list. Send the quote as a link and the customer approves or declines it online.',
        },
        {
          t: 'Invoices in seconds',
          d: 'Create invoices with line items, totals and due dates, tied to the customer record.',
        },
        {
          t: 'Customers pay online',
          d: 'Every invoice has its own secure payment page, so customers pay by card instead of mailing a check.',
        },
        {
          t: 'Paid invoices update themselves',
          d: 'When a customer pays online, the invoice is marked paid automatically. No matching payments by hand.',
        },
        {
          t: 'Automatic overdue reminders',
          d: 'Once an invoice is overdue, Frostburn emails the customer a polite reminder with the amount due, on every plan.',
        },
        {
          t: 'Know what’s owed each morning',
          d: 'Your morning briefing shows revenue at risk and the reminders that went out overnight.',
        },
      ]}
      steps={[
        { t: 'Create your account', d: 'Add your company details. No credit card needed to start the trial.' },
        { t: 'Connect online payments', d: 'Set up card payments so customers can pay from the invoice link.' },
        { t: 'Add your pricing book', d: 'Enter the services and parts you charge for most so every quote and invoice takes seconds.' },
        { t: 'Send your first invoice', d: 'Overdue reminders and the morning briefing work from day one.' },
      ]}
      faqs={[
        {
          q: 'How do customers pay?',
          a: 'Each invoice has a secure online payment page. Customers open the link and pay by card; the invoice is marked paid automatically.',
        },
        {
          q: 'How do overdue reminders work?',
          a: 'When an invoice passes its due date, Frostburn emails the customer a reminder showing the invoice number and amount due. It’s included on every plan.',
        },
        {
          q: 'Can I send quotes too?',
          a: 'Yes. Build a quote from your pricing book and send it as a link. The customer can approve or decline it online.',
        },
        {
          q: 'What does it cost?',
          a: `Starter is $${TIER_PRICES.starter}/month for 1–5 techs, Growth is $${TIER_PRICES.growth}/month for 6–15 techs and Pro is $${TIER_PRICES.pro}/month for 15+. Flat by team size, month to month, with a ${TRIAL_PERIOD_DAYS}-day free trial.`,
        },
        {
          q: 'Is it just invoicing?',
          a: 'No. Frostburn also handles scheduling, equipment history and maintenance agreements, so the invoice is connected to the job and the customer’s history.',
        },
        {
          q: 'Who do I talk to if I have questions?',
          a: 'Email info@frostburn.io. You’ll hear back from the person who built it.',
        },
      ]}
      closing={`Send your first invoice today. Free for ${TRIAL_PERIOD_DAYS} days.`}
    />
  )
}
