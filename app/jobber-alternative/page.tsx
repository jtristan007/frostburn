import type { Metadata } from 'next'
import { CompetitorComparison, HVAC_FEATURES } from '@/components/landing/competitor-comparison'
import { TIER_PRICES, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

const TITLE = 'Jobber Alternative for Small HVAC Shops | Frostburn'
const DESCRIPTION =
  'Comparing Jobber for a 1–5 tech HVAC company? Frostburn is built only for HVAC: equipment history, maintenance agreements and automatic overdue-invoice reminders at one flat price. Import your Jobber clients in minutes.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/jobber-alternative' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/jobber-alternative' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

// Jobber list prices, monthly with no commitment, for the cheapest Jobber
// setup that includes automated invoice follow-ups (Connect plan, plus $29
// per extra user where that beats the next bundle). Source:
// getjobber.com/pricing, checked Oct 19, 2026. Re-check before editing.
const PRICES_CHECKED = 'October 19, 2026'

export default function JobberAlternativePage() {
  return (
    <CompetitorComparison
      competitor="Jobber"
      heroIntro="Jobber is solid software for every kind of home service. Frostburn does one job: run a 1–5 tech HVAC company. Equipment history, maintenance agreements and invoices that chase themselves, at one flat price."
      priceIntro="Jobber prices by number of users, and automated invoice follow-ups start on its Connect plan. Frostburn includes automatic overdue reminders on every plan and charges one price for your whole team size."
      rows={[
        { techs: '1 tech', competitor: 139, frostburn: TIER_PRICES.starter },
        { techs: '3 techs', competitor: 197, frostburn: TIER_PRICES.starter },
        { techs: '5 techs', competitor: 199, frostburn: TIER_PRICES.starter },
        { techs: '10 techs', competitor: 299, frostburn: TIER_PRICES.growth },
        { techs: '15 techs', competitor: 399, frostburn: TIER_PRICES.growth },
      ]}
      priceNote={`Jobber prices are its published list prices for month-to-month billing on the Connect plan (the lowest Jobber plan with automated invoice follow-ups), including $29/month per additional user where that’s the cheaper option, per getjobber.com/pricing as of ${PRICES_CHECKED}. Jobber also offers lower prices with an annual commitment and temporary promotions; Frostburn has no annual commitment.`}
      features={HVAC_FEATURES}
      betterPick={[
        'Run more than one trade, like HVAC plus landscaping or cleaning, under the same account.',
        'Rely on online booking from your website or two-way texting with customers.',
        'Use Jobber’s marketing tools or depend on its large library of app integrations.',
        'Want a native app from the App Store or Google Play rather than a browser app.',
      ]}
      betterPickOutro="If you’re a small HVAC shop that mostly needs the schedule, the client history and the money collected, Frostburn is the simpler, flatter-priced fit."
      switchSteps={[
        { t: 'Export your clients from Jobber', d: 'Download your client list from Jobber as a CSV file.' },
        {
          t: 'Upload it to Frostburn',
          d: 'The importer reads Jobber’s column names automatically. Check the preview, click import, done.',
        },
        {
          t: 'Add your pricing book',
          d: 'Enter the services and parts you charge for most so quotes and invoices take seconds.',
        },
        {
          t: 'Run both until you’re sure',
          d: `Keep Jobber during your ${TRIAL_PERIOD_DAYS}-day trial. Overdue reminders and your morning briefing work from day one.`,
        },
      ]}
      faqs={[
        {
          q: 'Can I bring my clients over from Jobber?',
          a: 'Yes. Export your client list from Jobber as a CSV and upload it in Frostburn. The importer recognizes Jobber’s column names, so names, emails, phone numbers and addresses land in the right place without manual mapping.',
        },
        {
          q: 'Do I have to cancel Jobber before I try Frostburn?',
          a: `No. Run both side by side during the ${TRIAL_PERIOD_DAYS}-day free trial and only switch once you’re sure. No credit card is needed to start.`,
        },
        {
          q: 'Is Frostburn priced per user?',
          a: `No. Starter is a flat $${TIER_PRICES.starter}/month for 1–5 techs and Growth is $${TIER_PRICES.growth}/month for 6–15 techs. Adding your third or fifth tech doesn’t change your bill.`,
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
