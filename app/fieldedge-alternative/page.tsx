import type { Metadata } from 'next'
import { CompetitorComparison, HVAC_FEATURES } from '@/components/landing/competitor-comparison'
import { TIER_PRICES, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

const TITLE = 'FieldEdge Alternative for Small HVAC Shops | Frostburn'
const DESCRIPTION =
  'Comparing FieldEdge for a 1–15 tech HVAC company? Frostburn is HVAC-only software with published flat pricing, a 30-day free trial and no annual contract, plus automatic overdue-invoice reminders.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/fieldedge-alternative' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/fieldedge-alternative' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

// FieldEdge does not publish prices: fieldedge.com/pricing lists three plans
// (Select, Premier, Elite) with "Request Pricing" buttons, and its FAQ says
// "FieldEdge does not offer a free trial" and refers to a "contract period".
// Third-party estimates exist but aren't FieldEdge's numbers, so this page
// compares terms, not dollars. Checked Oct 21, 2026. Re-check before editing.
const PRICES_CHECKED = 'October 21, 2026'

export default function FieldEdgeAlternativePage() {
  return (
    <CompetitorComparison
      competitor="FieldEdge"
      heroIntro="FieldEdge is a full field-service suite with QuickBooks ties and a guided onboarding team. Frostburn does one job: run a small HVAC company. Equipment history, maintenance agreements and invoices that chase themselves, at a flat price you can see before you talk to anyone."
      priceIntro="FieldEdge quotes each plan after you request pricing, and doesn’t offer a free trial. Frostburn publishes one flat monthly price for your team size, and you can try it free for 30 days."
      priceFacts={[
        {
          label: 'Published pricing',
          competitor: 'No. Each plan says “Request Pricing”',
          frostburn: `Yes. $${TIER_PRICES.starter}/mo (1–5 techs), $${TIER_PRICES.growth}/mo (6–15), $${TIER_PRICES.pro}/mo (15+)`,
        },
        {
          label: 'Free trial',
          competitor: 'No free trial',
          frostburn: `${TRIAL_PERIOD_DAYS} days, no credit card to start`,
        },
        {
          label: 'How to get started',
          competitor: 'Request pricing or book a demo',
          frostburn: 'Sign up and start using it today',
        },
        {
          label: 'Commitment',
          competitor: 'Contract period',
          frostburn: 'Month to month, no annual contract',
        },
      ]}
      priceNote={`FieldEdge details are from fieldedge.com/pricing as of ${PRICES_CHECKED}, which lists three plans (Select, Premier and Elite) without published amounts, states that FieldEdge does not offer a free trial, and refers to a contract period. Ask FieldEdge for a quote for your team size to compare dollars directly.`}
      features={HVAC_FEATURES}
      betterPick={[
        'Run your books in QuickBooks Desktop and want your field software tied into it.',
        'Want a hands-on onboarding team to set everything up for you.',
        'Want a flat-rate pricebook and a broader suite of add-ons from one vendor.',
        'Want a native app from the App Store or Google Play rather than a browser app.',
      ]}
      betterPickOutro="If you’re a small HVAC shop that mostly needs the schedule, the equipment history, maintenance agreements and the money collected, without a sales process or a contract, Frostburn is the simpler fit."
      switchSteps={[
        {
          t: 'Export your customers from FieldEdge',
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
          d: `Keep FieldEdge during your ${TRIAL_PERIOD_DAYS}-day trial. Overdue reminders and your morning briefing work from day one.`,
        },
      ]}
      faqs={[
        {
          q: 'How much does FieldEdge cost compared to Frostburn?',
          a: `FieldEdge doesn’t publish its prices; you request a quote for your plan and team. Frostburn is a flat $${TIER_PRICES.starter}/month for 1–5 techs, $${TIER_PRICES.growth}/month for 6–15 techs and $${TIER_PRICES.pro}/month for 15+, with no per-user charges.`,
        },
        {
          q: 'Can I try Frostburn before I commit?',
          a: `Yes. Every plan starts with a ${TRIAL_PERIOD_DAYS}-day free trial and no credit card is needed to start. After that it’s month to month.`,
        },
        {
          q: 'Can I bring my customers over from FieldEdge?',
          a: 'Yes. Export your customer list as a CSV and upload it in Frostburn. The importer matches common column names automatically and shows a preview so you can fix any column before importing.',
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
