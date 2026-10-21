import type { Metadata } from 'next'
import { TopicPage } from '@/components/landing/topic-page'
import { TIER_PRICES, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

const TITLE = 'HVAC Software for Small Business | Frostburn'
const DESCRIPTION = `HVAC software built for 1–15 tech shops: scheduling and dispatch, equipment history, maintenance agreements, quotes and invoices that chase themselves. Flat pricing from $${TIER_PRICES.starter}/month, ${TRIAL_PERIOD_DAYS}-day free trial.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/hvac-software-small-business' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/hvac-software-small-business' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

export default function HvacSoftwareSmallBusinessPage() {
  return (
    <TopicPage
      eyebrow="HVAC software for small business"
      title="HVAC software for small shops that don’t have an office admin."
      intro="Frostburn runs the desk side of a 1–15 tech HVAC company: the schedule, every customer’s equipment, maintenance agreements, quotes and the invoices that need collecting. One flat monthly price, set up in an afternoon."
      problemsHeading="Big-shop software is overkill. Spreadsheets aren’t enough."
      problems={[
        {
          t: 'Built for someone else',
          d: 'Most field-service tools serve every trade at once, or are priced and staffed for companies with dispatchers and a call center.',
        },
        {
          t: 'The bill climbs with every hire',
          d: 'Per-user pricing means adding your next tech costs you twice: the wage and the software seat.',
        },
        {
          t: 'Paper and memory don’t scale',
          d: 'Which units are under warranty, who is due for maintenance, which invoices are late. It all lives in your head until something slips.',
        },
      ]}
      featuresHeading="Everything a small HVAC shop runs on, in one place."
      features={[
        {
          t: 'Scheduling and dispatch',
          d: 'Book jobs, see the day on a dispatch board, and keep recurring maintenance visits on the calendar.',
        },
        {
          t: 'Equipment history on every customer',
          d: 'Unit type, model, serial number, install date, warranty expiration and filter due date on the customer record.',
        },
        {
          t: 'Maintenance agreements',
          d: 'Track who is on a plan, which visits are due and what the plans are worth over the year. (Growth plan.)',
        },
        {
          t: 'Quotes customers approve online',
          d: 'Build a quote from your pricing book and send a link. The customer approves or declines it from their phone.',
        },
        {
          t: 'Invoices that chase themselves',
          d: 'Customers pay by card online, the invoice marks itself paid, and overdue invoices get automatic email reminders.',
        },
        {
          t: 'A morning briefing in your inbox',
          d: 'Revenue at risk, jobs today and reminders sent overnight, delivered before your first coffee.',
        },
      ]}
      steps={[
        { t: 'Create your account', d: 'Add your company details. No credit card needed to start the trial.' },
        {
          t: 'Import your customers',
          d: 'Upload a CSV from Jobber, Housecall Pro, QuickBooks or any spreadsheet. The importer matches the columns for you.',
        },
        { t: 'Add your pricing book', d: 'Enter the services and parts you charge for most so quotes and invoices take seconds.' },
        { t: 'Run your week', d: 'Schedule jobs, send invoices, and let the reminders and morning briefing run on their own.' },
      ]}
      faqs={[
        {
          q: 'What does Frostburn cost?',
          a: `Starter is $${TIER_PRICES.starter}/month for 1–5 techs, Growth is $${TIER_PRICES.growth}/month for 6–15 techs and Pro is $${TIER_PRICES.pro}/month for 15+. It’s a flat price for your team size, not per user, and every plan starts with a ${TRIAL_PERIOD_DAYS}-day free trial.`,
        },
        {
          q: 'Is Frostburn only for HVAC?',
          a: 'Yes. Equipment history, filter and warranty tracking and maintenance agreements are built in because every screen assumes you fix heating and cooling.',
        },
        {
          q: 'How big a shop is it built for?',
          a: 'Roughly 1–15 technicians: owner-operators and small crews without a full-time office admin.',
        },
        {
          q: 'Is there a contract?',
          a: 'No. Plans are month to month, with no annual commitment.',
        },
        {
          q: 'Does it work on a phone?',
          a: 'Yes. Frostburn runs in the browser on any iPhone, Android phone, tablet or computer, with nothing to install.',
        },
        {
          q: 'Who do I talk to if I have questions?',
          a: 'Email info@frostburn.io. You’ll hear back from the person who built it.',
        },
      ]}
      closing={`Try it on your own shop. Free for ${TRIAL_PERIOD_DAYS} days.`}
    />
  )
}
