import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHeader, MarketingFooter } from '@/components/landing/marketing-chrome'
import { PricingTiers } from '@/components/landing/pricing-tiers'
import { TIERS } from '@/components/landing/tiers'
import { TIER_PRICES, TIER_LABELS, TRIAL_PERIOD_DAYS, type Tier } from '@/lib/stripe/plans'

const TITLE = 'Pricing | Frostburn HVAC Software'
const DESCRIPTION = `Flat monthly pricing for HVAC shops: $${TIER_PRICES.starter}/month for 1–5 techs, $${TIER_PRICES.growth}/month for 6–15, $${TIER_PRICES.pro}/month for 15+. Not per user, month to month, ${TRIAL_PERIOD_DAYS}-day free trial.`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/pricing' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/pricing' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

// Included on every plan -- each verified against what the app does.
const INCLUDED = [
  'Scheduling and dispatch board',
  'Customer records with equipment history',
  'Pricing book and quotes customers approve online',
  'Invoices with online card payment',
  'Automatic reminders on overdue invoices',
  'Morning briefing email',
  'Customer import from a CSV (Jobber, Housecall Pro, QuickBooks, spreadsheets)',
  'Works on any phone, tablet or computer',
]

const FAQS = [
  {
    q: 'Is Frostburn priced per user?',
    a: `No. You pay one flat price for your team size: Starter covers 1–5 techs, Growth 6–15 and Pro 15+. Adding a tech doesn’t change your bill until you move up a size.`,
  },
  {
    q: 'How does the free trial work?',
    a: `Every plan starts with a ${TRIAL_PERIOD_DAYS}-day free trial and there’s no charge until it ends. No credit card is needed to start.`,
  },
  {
    q: 'Is there a contract?',
    a: 'No. Plans are billed monthly with no annual commitment.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Manage your plan from Billing in your settings, or email us and we’ll switch it for you.',
  },
  {
    q: 'What currency are prices in?',
    a: 'US dollars, before any applicable tax.',
  },
  {
    q: 'Who do I talk to about pricing?',
    a: 'Email info@frostburn.io. You’ll hear back from the person who built it.',
  },
]

const eyebrow = 'font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3'

export default function PricingPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Frostburn',
      description: DESCRIPTION,
      brand: { '@type': 'Brand', name: 'Frostburn' },
      offers: (Object.keys(TIER_PRICES) as Tier[]).map((tier) => ({
        '@type': 'Offer',
        name: `${TIER_LABELS[tier]} plan`,
        price: TIER_PRICES[tier],
        priceCurrency: 'USD',
        url: 'https://frostburn.io/pricing',
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#05070f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <MarketingHeader />

      <main>
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className={eyebrow}>Pricing</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              One flat price for your team size.
            </h1>
            <p className="mt-6 text-lg text-mist">
              Not per user. Month to month. Every plan starts with a {TRIAL_PERIOD_DAYS}-day free trial, and no
              credit card is needed to start.
            </p>
          </div>
          <PricingTiers tiers={TIERS} />
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>On every plan</p>
            <h2 className="text-3xl font-display font-bold text-white">Everything you need to run the week.</h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 text-gray-200">
                  <span className="text-ice">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>Questions</p>
            <h2 className="text-3xl font-display font-bold text-white">Pricing questions</h2>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer list-none flex justify-between gap-4 text-white font-medium">
                    {f.q}
                    <span className="text-ice transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-mist leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-24 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Try it free for {TRIAL_PERIOD_DAYS} days.
            </h2>
            <Link
              href="/signup"
              className="mt-8 inline-block font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Get Started Free →
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
