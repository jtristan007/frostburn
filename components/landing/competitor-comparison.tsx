import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'
import { TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

// Shared layout for /<competitor>-alternative pages. Each page supplies only
// its data; every competitor price must be sourced and dated in `priceNote`.

export type PriceRow = { techs: string; competitor: number; frostburn: number }
// For competitors that don't publish prices: compare terms side by side
// instead of inventing numbers.
export type PriceFact = { label: string; competitor: string; frostburn: string }
export type Faq = { q: string; a: string }
export type Feature = { t: string; d: string }

export type ComparisonProps = {
  competitor: string
  heroIntro: string
  priceIntro: string
  // Exactly one of `rows` (published per-team-size prices) or `priceFacts`.
  rows?: PriceRow[]
  priceFacts?: PriceFact[]
  priceNote: ReactNode
  features: Feature[]
  betterPick: string[]
  betterPickOutro: string
  switchSteps: Feature[]
  faqs: Faq[]
}

const eyebrow = 'font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3'
const h2 = 'text-3xl font-display font-bold text-white'
const cell = 'px-3 sm:px-5 py-4'

export function CompetitorComparison(p: ComparisonProps) {
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

      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Frostburn home">
            <Logo className="h-12" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <p className={eyebrow}>{p.competitor} alternative</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
            The {p.competitor} alternative built for small HVAC shops.
          </h1>
          <p className="mt-6 text-lg text-mist max-w-2xl mx-auto">{p.heroIntro}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Start your {TRIAL_PERIOD_DAYS}-day free trial →
            </Link>
            <a
              href="#switch"
              className="font-semibold bg-white/10 text-white border border-white/15 px-6 py-3 rounded-lg hover:bg-white/15 transition-colors"
            >
              How switching works
            </a>
          </div>
          <p className="mt-4 text-xs text-mist">
            No credit card required · Keep {p.competitor} while you try it
          </p>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>What you’d pay each month</p>
            <h2 className={h2}>Flat pricing. No per-tech math.</h2>
            <p className="mt-4 text-mist">{p.priceIntro}</p>

            <div className="mt-10 overflow-x-auto rounded-xl border border-white/10">
              {p.priceFacts ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/[0.04] text-mist">
                  <tr>
                    <th scope="col" className={`${cell} font-medium`}><span className="sr-only">Compared</span></th>
                    <th scope="col" className={`${cell} font-medium`}>{p.competitor}</th>
                    <th scope="col" className={`${cell} font-medium text-ice`}>Frostburn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-gray-200">
                  {p.priceFacts.map((f) => (
                    <tr key={f.label}>
                      <th scope="row" className={`${cell} font-medium text-white`}>{f.label}</th>
                      <td className={cell}>{f.competitor}</td>
                      <td className={`${cell} text-white font-semibold`}>{f.frostburn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/[0.04] text-mist">
                  <tr>
                    <th scope="col" className={`${cell} font-medium`}>Team size</th>
                    <th scope="col" className={`${cell} font-medium`}>{p.competitor}</th>
                    <th scope="col" className={`${cell} font-medium text-ice`}>Frostburn</th>
                    <th scope="col" className={`${cell} font-medium`}>Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-gray-200">
                  {(p.rows ?? []).map((r) => {
                    const diff = r.competitor - r.frostburn
                    return (
                      <tr key={r.techs}>
                        <th scope="row" className={`${cell} font-medium text-white`}>{r.techs}</th>
                        <td className={`${cell} font-mono`}>${r.competitor}/mo</td>
                        <td className={`${cell} font-mono text-white font-semibold`}>${r.frostburn}/mo</td>
                        <td className={cell}>
                          {diff > 0 ? (
                            <span className="text-green-400">Save ${diff}/mo</span>
                          ) : diff < 0 ? (
                            <span className="text-mist">{p.competitor} ${-diff} less</span>
                          ) : (
                            <span className="text-mist">Same price</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              )}
            </div>
            <p className="mt-4 text-xs text-mist leading-relaxed">
              {p.priceNote} Prices exclude tax. {p.competitor} is a trademark of its owner; Frostburn is not affiliated
              with {p.competitor}.
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className={eyebrow}>Built for HVAC, not every trade</p>
            <h2 className={`${h2} max-w-2xl`}>Every screen assumes you fix heating and cooling.</h2>
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
            <p className={eyebrow}>The honest part</p>
            <h2 className={h2}>When {p.competitor} is the better pick</h2>
            <p className="mt-4 text-mist">
              We’d rather you choose right than switch twice. Stay with {p.competitor} if you:
            </p>
            <ul className="mt-6 space-y-3 text-gray-200">
              {p.betterPick.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-mist">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-mist">{p.betterPickOutro}</p>
          </div>
        </section>

        <section id="switch" className="border-t border-white/10 py-20 scroll-mt-8">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>Switching from {p.competitor}</p>
            <h2 className={h2}>Moving over takes an afternoon, not a weekend.</h2>
            <ol className="mt-10 space-y-6">
              {p.switchSteps.map((s, i) => (
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

        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>Questions</p>
            <h2 className={h2}>Before you switch</h2>
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Try it next to {p.competitor}. Free for {TRIAL_PERIOD_DAYS} days.
            </h2>
            <p className="mt-4 text-mist">
              Import your clients, send your first invoice, and see which one you open on Monday.
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

      <footer className="border-t border-white/10 py-8" style={{ background: '#05091a' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-3 text-sm text-mist">
          <Link href="/" aria-label="Frostburn home">
            <Logo className="h-9" />
          </Link>
          <p>
            Contact:{' '}
            <a href="mailto:info@frostburn.io" className="text-ice hover:underline">
              info@frostburn.io
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/jobber-alternative" className="hover:text-white">Jobber alternative</Link>
            <Link href="/housecall-pro-alternative" className="hover:text-white">Housecall Pro alternative</Link>
            <Link href="/servicetitan-alternative" className="hover:text-white">ServiceTitan alternative</Link>
            <Link href="/fieldedge-alternative" className="hover:text-white">FieldEdge alternative</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature cards shared by every comparison page -- each one verified against
// what the app actually does. Keep in sync with the product.
export const HVAC_FEATURES: Feature[] = [
  {
    t: 'Equipment history on every client',
    d: 'Unit type, model, serial number, install date, warranty expiration and filter due date, right on the client record before you knock on the door.',
  },
  {
    t: 'Invoices that chase themselves',
    d: 'Overdue reminders go out automatically on every plan. No awkward calls to customers you actually like.',
  },
  {
    t: 'Customers pay online',
    d: 'Every invoice has its own secure payment page, so customers can pay by card online instead of mailing a check.',
  },
  {
    t: 'Maintenance agreements',
    d: 'Track who’s on a plan, what’s due and what it’s worth over the year, so recurring revenue doesn’t slip. (Growth plan.)',
  },
  {
    t: 'Filter & warranty tracking',
    d: 'Know which customers are due for a filter or coming off warranty before they call someone else. (Growth plan.)',
  },
  {
    t: 'A morning briefing in your inbox',
    d: 'Revenue at risk, jobs today and reminders sent overnight, delivered before your first coffee.',
  },
]
