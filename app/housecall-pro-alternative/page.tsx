import type { Metadata } from 'next'
import { CompetitorComparison, HVAC_FEATURES } from '@/components/landing/competitor-comparison'
import { TIER_PRICES, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

const TITLE = 'Housecall Pro Alternative for Small HVAC Shops | Frostburn'
const DESCRIPTION =
  'Comparing Housecall Pro for your HVAC company? Frostburn is built only for HVAC, with flat pricing, maintenance agreements on the Growth plan and automatic overdue-invoice reminders. Import your Housecall Pro customers in minutes.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/housecall-pro-alternative' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/housecall-pro-alternative' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

// Housecall Pro list prices, monthly billing, cheapest plan that fits the
// team size: Basic (1 user) $79, Essentials (5 users) $189, Max (8 users)
// $329 + $35 per extra user. Basic/Essentials add-on user prices aren't
// published, so 2-5 techs use Essentials. Source: housecallpro.com/pricing,
// checked Oct 19, 2026. Re-check before editing.
const PRICES_CHECKED = 'October 19, 2026'

export default function HousecallProAlternativePage() {
  return (
    <CompetitorComparison
      competitor="Housecall Pro"
      heroIntro="Housecall Pro is built for every home-service trade. Frostburn does one job: run a 1–5 tech HVAC company. Equipment history, maintenance agreements and invoices that chase themselves, at one flat price that doesn’t climb with every tech you hire."
      priceIntro="Housecall Pro bundles a set number of users into each plan and charges per extra user on Max, its only plan with recurring service plans. Frostburn charges one price for your whole team size, with automatic overdue reminders on every plan."
      rows={[
        { techs: '1 tech', competitor: 79, frostburn: TIER_PRICES.starter },
        { techs: '3 techs', competitor: 189, frostburn: TIER_PRICES.starter },
        { techs: '5 techs', competitor: 189, frostburn: TIER_PRICES.starter },
        { techs: '8 techs', competitor: 329, frostburn: TIER_PRICES.growth },
        { techs: '10 techs', competitor: 399, frostburn: TIER_PRICES.growth },
        { techs: '15 techs', competitor: 574, frostburn: TIER_PRICES.growth },
      ]}
      priceNote={`Housecall Pro prices are its published list prices for monthly billing on the cheapest plan that covers each team size: Basic (1 user), Essentials (5 users) and Max (8 users, plus $35/month per additional user), per housecallpro.com/pricing as of ${PRICES_CHECKED}. Housecall Pro doesn’t publish add-on user prices for Basic or Essentials, so 2–5 techs are shown on Essentials. Recurring service plans are on Housecall Pro’s Max plan; on Frostburn, maintenance agreements are on Growth ($${TIER_PRICES.growth}/month). Housecall Pro also offers lower prices with annual billing and introductory promotions; Frostburn has no annual commitment.`}
      features={HVAC_FEATURES}
      betterPick={[
        'Are a one-tech shop watching every dollar — Housecall Pro Basic is $79/month.',
        'Rely on online booking, GPS tracking of your techs, or route planning.',
        'Offer customer financing or need live phone support and a Spanish-language app.',
        'Want a native app from the App Store or Google Play rather than a browser app.',
      ]}
      betterPickOutro="If you’re a small HVAC shop that mostly needs the schedule, the equipment history, maintenance agreements and the money collected — without the bill jumping every time you hire — Frostburn is the simpler fit."
      switchSteps={[
        {
          t: 'Export your customers from Housecall Pro',
          d: 'Download your customer list from Housecall Pro as a CSV file.',
        },
        {
          t: 'Upload it to Frostburn',
          d: 'The importer reads Housecall Pro’s column names automatically. Check the preview, click import, done.',
        },
        {
          t: 'Add your pricing book',
          d: 'Enter the services and parts you charge for most so quotes and invoices take seconds.',
        },
        {
          t: 'Run both until you’re sure',
          d: `Keep Housecall Pro during your ${TRIAL_PERIOD_DAYS}-day trial. Overdue reminders and your morning briefing work from day one.`,
        },
      ]}
      faqs={[
        {
          q: 'Can I bring my customers over from Housecall Pro?',
          a: 'Yes. Export your customer list from Housecall Pro as a CSV and upload it in Frostburn. The importer recognizes Housecall Pro’s column names, so names, emails, phone numbers and addresses land in the right place without manual mapping.',
        },
        {
          q: 'Do I have to cancel Housecall Pro before I try Frostburn?',
          a: `No. Run both side by side during the ${TRIAL_PERIOD_DAYS}-day free trial and only switch once you’re sure. No credit card is needed to start.`,
        },
        {
          q: 'Where are maintenance agreements on each?',
          a: `Housecall Pro includes recurring service plans on its Max plan. Frostburn includes maintenance agreement tracking on Growth at $${TIER_PRICES.growth}/month.`,
        },
        {
          q: 'Is Frostburn priced per user?',
          a: `No. Starter is a flat $${TIER_PRICES.starter}/month for 1–5 techs and Growth is $${TIER_PRICES.growth}/month for 6–15 techs. Hiring your next tech doesn’t change your bill until you pass 5.`,
        },
        {
          q: 'Is there a phone app?',
          a: 'Frostburn runs in the browser on any iPhone, Android phone, tablet or computer — nothing to install. There isn’t a separate app-store app.',
        },
        {
          q: 'Who do I talk to if I have questions?',
          a: 'Email info@frostburn.io. You’ll hear back from the person who built it.',
        },
      ]}
    />
  )
}
