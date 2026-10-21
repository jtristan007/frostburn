import type { Metadata } from 'next'
import { CompetitorComparison, HVAC_FEATURES } from '@/components/landing/competitor-comparison'
import { TIER_PRICES, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

const TITLE = 'ServiceTitan Alternative for Small HVAC Shops | Frostburn'
const DESCRIPTION =
  'Looking at ServiceTitan for a 1–15 tech HVAC company? Frostburn is HVAC-only software with published flat pricing, a free trial instead of a sales demo, and automatic overdue-invoice reminders. Set up in an afternoon.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/servicetitan-alternative' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/servicetitan-alternative' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

// ServiceTitan does not publish prices: servicetitan.com/pricing lists three
// packages (Starter, Essentials, The Works), says pricing is per technician,
// and shows "Request Pricing" instead of amounts. Third-party estimates exist
// but aren't ServiceTitan's numbers, so this page compares terms, not dollars.
// Checked Oct 21, 2026. Re-check before editing.
const PRICES_CHECKED = 'October 21, 2026'

export default function ServiceTitanAlternativePage() {
  return (
    <CompetitorComparison
      competitor="ServiceTitan"
      heroIntro="ServiceTitan is a powerful platform for large service companies with dispatchers, call centers and payroll teams. Frostburn does one job: run a small HVAC company. Equipment history, maintenance agreements and invoices that chase themselves, at a flat price you can see before you talk to anyone."
      priceIntro="ServiceTitan prices per technician and quotes through a sales demo. Frostburn publishes one flat monthly price for your team size, and you can start a free trial today."
      priceFacts={[
        {
          label: 'Published pricing',
          competitor: 'No. Each package says “Request Pricing”',
          frostburn: `Yes. $${TIER_PRICES.starter}/mo (1–5 techs), $${TIER_PRICES.growth}/mo (6–15), $${TIER_PRICES.pro}/mo (15+)`,
        },
        {
          label: 'How the price is set',
          competitor: 'Per technician',
          frostburn: 'Flat by team size, not per user',
        },
        {
          label: 'How to get started',
          competitor: 'Book a demo with sales',
          frostburn: `Sign up and start a ${TRIAL_PERIOD_DAYS}-day free trial`,
        },
        {
          label: 'Commitment',
          competitor: 'Quoted during the sales process',
          frostburn: 'Month to month, no annual contract',
        },
      ]}
      priceNote={`ServiceTitan details are from servicetitan.com/pricing as of ${PRICES_CHECKED}, which lists three packages (Starter, Essentials and The Works), describes its pricing as per technician, and does not publish amounts. Ask ServiceTitan for a quote for your team size to compare dollars directly.`}
      features={HVAC_FEATURES}
      betterPick={[
        'Have dispatchers or a call center booking jobs for a large crew.',
        'Need payroll, commission tracking or configurable technician pay built in.',
        'Run multiple trades or a large multi-location operation with dedicated office staff.',
        'Want a native app from the App Store or Google Play rather than a browser app.',
      ]}
      betterPickOutro="If you’re a small HVAC shop that mostly needs the schedule, the equipment history, maintenance agreements and the money collected, without a sales process or a long rollout, Frostburn is the simpler fit."
      switchSteps={[
        {
          t: 'Export your customers from ServiceTitan',
          d: 'Download your customer list as a CSV file.',
        },
        {
          t: 'Upload it to Frostburn',
          d: 'The importer recognizes common column names like name, email, phone and address. Check the preview, adjust any column, click import.',
        },
        {
          t: 'Add your pricing book',
          d: 'Enter the services and parts you charge for most so quotes and invoices take seconds.',
        },
        {
          t: 'Run both until you’re sure',
          d: `Keep ServiceTitan during your ${TRIAL_PERIOD_DAYS}-day trial. Overdue reminders and your morning briefing work from day one.`,
        },
      ]}
      faqs={[
        {
          q: 'How much does ServiceTitan cost compared to Frostburn?',
          a: `ServiceTitan doesn’t publish its prices; it quotes per technician after a sales demo. Frostburn is a flat $${TIER_PRICES.starter}/month for 1–5 techs, $${TIER_PRICES.growth}/month for 6–15 techs and $${TIER_PRICES.pro}/month for 15+, with no per-user charges.`,
        },
        {
          q: 'Can I bring my customers over from ServiceTitan?',
          a: 'Yes. Export your customer list as a CSV and upload it in Frostburn. The importer matches common column names automatically and shows a preview so you can fix any column before importing.',
        },
        {
          q: 'Do I need a demo or a sales call to start?',
          a: `No. Sign up and you’re in, with a ${TRIAL_PERIOD_DAYS}-day free trial. No credit card is needed to start.`,
        },
        {
          q: 'Is Frostburn a good fit for a big shop?',
          a: 'Frostburn is built for HVAC companies with roughly 1–15 technicians. If you run a large crew with dispatchers, payroll and multiple trades, ServiceTitan’s depth may be worth its price.',
        },
        {
          q: 'Is there a phone app?',
          a: 'Frostburn runs in the browser on any iPhone, Android phone, tablet or computer, with nothing to install. There isn’t a separate app-store app.',
        },
        {
          q: 'Who do I talk to if I have questions?',
          a: 'Email info@frostburn.io. You’ll hear back from the person who built it.',
        },
      ]}
    />
  )
}
