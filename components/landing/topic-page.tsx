import Link from 'next/link'
import { MarketingHeader, MarketingFooter } from '@/components/landing/marketing-chrome'
import { PricingTiers } from '@/components/landing/pricing-tiers'
import { TIERS } from '@/components/landing/tiers'
import { TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

// Shared layout for search-topic landing pages (/hvac-...). Each page
// supplies only its copy; every product claim must match what the app does.

export type Item = { t: string; d: string }
export type Faq = { q: string; a: string }

export type TopicProps = {
  eyebrow: string
  title: string
  intro: string
  problemsHeading: string
  problems: Item[]
  featuresHeading: string
  features: Item[]
  steps: Item[]
  faqs: Faq[]
  closing: string
}

const eyebrowCls = 'font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3'
const h2 = 'text-3xl font-display font-bold text-white'

export function TopicPage(p: TopicProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="min-h-screen" style={{ background: '#05070f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <MarketingHeader />

      <main>
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <p className={eyebrowCls}>{p.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">{p.title}</h1>
          <p className="mt-6 text-lg text-mist max-w-2xl mx-auto">{p.intro}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Start your {TRIAL_PERIOD_DAYS}-day free trial →
            </Link>
            <a
              href="#pricing"
              className="font-semibold bg-white/10 text-white border border-white/15 px-6 py-3 rounded-lg hover:bg-white/15 transition-colors"
            >
              See pricing
            </a>
          </div>
          <p className="mt-4 text-xs text-mist">No credit card required · Month to month</p>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className={eyebrowCls}>Sound familiar?</p>
            <h2 className={`${h2} max-w-2xl`}>{p.problemsHeading}</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {p.problems.map((f) => (
                <div key={f.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-white font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm text-mist leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className={eyebrowCls}>What you get</p>
            <h2 className={`${h2} max-w-2xl`}>{p.featuresHeading}</h2>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {p.features.map((f) => (
                <div key={f.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-white font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm text-mist leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrowCls}>Getting started</p>
            <h2 className={h2}>Up and running in an afternoon.</h2>
            <ol className="mt-10 space-y-6">
              {p.steps.map((s, i) => (
                <li key={s.t} className="flex gap-5">
                  <span className="flex-none w-9 h-9 rounded-full bg-ice/15 text-ice font-mono font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-white font-semibold">{s.t}</h3>
                    <p className="mt-1 text-sm text-mist">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="border-t border-white/10 py-20 scroll-mt-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className={eyebrowCls}>Simple, honest pricing</p>
              <h2 className={h2}>Flat rate. No per-tech math.</h2>
              <p className="mt-3 text-mist">
                Every plan starts with a {TRIAL_PERIOD_DAYS}-day free trial. No charge until it ends.
              </p>
            </div>
            <PricingTiers tiers={TIERS} />
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrowCls}>Questions</p>
            <h2 className={h2}>Before you sign up</h2>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {p.faqs.map((f) => (
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{p.closing}</h2>
            <p className="mt-4 text-mist">
              Add your first client, send your first invoice, and let the follow-up happen on its own.
            </p>
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
