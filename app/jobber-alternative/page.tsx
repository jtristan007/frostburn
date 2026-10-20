import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
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
const ROWS: { techs: string; jobber: number; frostburn: number }[] = [
  { techs: '1 tech', jobber: 139, frostburn: TIER_PRICES.starter },
  { techs: '3 techs', jobber: 197, frostburn: TIER_PRICES.starter },
  { techs: '5 techs', jobber: 199, frostburn: TIER_PRICES.starter },
  { techs: '10 techs', jobber: 299, frostburn: TIER_PRICES.growth },
  { techs: '15 techs', jobber: 399, frostburn: TIER_PRICES.growth },
]

const FAQS = [
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
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const eyebrow = 'font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3'
const h2 = 'text-3xl font-display font-bold text-white'

export default function JobberAlternativePage() {
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
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <p className={eyebrow}>Jobber alternative</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
            The Jobber alternative built for small HVAC shops.
          </h1>
          <p className="mt-6 text-lg text-mist max-w-2xl mx-auto">
            Jobber is solid software for every kind of home service. Frostburn does one job: run a 1–5 tech HVAC
            company. Equipment history, maintenance agreements and invoices that chase themselves, at one flat price.
          </p>
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
          <p className="mt-4 text-xs text-mist">No credit card required · Keep Jobber while you try it</p>
        </section>

        {/* Price comparison */}
        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>What you’d pay each month</p>
            <h2 className={h2}>Flat pricing. No per-tech math.</h2>
            <p className="mt-4 text-mist">
              Jobber prices by number of users, and automated invoice follow-ups start on its Connect plan. Frostburn
              includes automatic overdue reminders on every plan and charges one price for your whole team size.
            </p>

            <div className="mt-10 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/[0.04] text-mist">
                  <tr>
                    <th scope="col" className="px-3 sm:px-5 py-4 font-medium">Team size</th>
                    <th scope="col" className="px-3 sm:px-5 py-4 font-medium">Jobber</th>
                    <th scope="col" className="px-3 sm:px-5 py-4 font-medium text-ice">Frostburn</th>
                    <th scope="col" className="px-3 sm:px-5 py-4 font-medium">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-gray-200">
                  {ROWS.map((r) => {
                    const diff = r.jobber - r.frostburn
                    return (
                      <tr key={r.techs}>
                        <th scope="row" className="px-3 sm:px-5 py-4 font-medium text-white">{r.techs}</th>
                        <td className="px-3 sm:px-5 py-4 font-mono">${r.jobber}/mo</td>
                        <td className="px-3 sm:px-5 py-4 font-mono text-white font-semibold">${r.frostburn}/mo</td>
                        <td className="px-3 sm:px-5 py-4">
                          {diff > 0 ? (
                            <span className="text-green-400">Save ${diff}/mo</span>
                          ) : diff < 0 ? (
                            <span className="text-mist">Jobber ${-diff} less</span>
                          ) : (
                            <span className="text-mist">Same price</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-mist leading-relaxed">
              Jobber prices are its published list prices for month-to-month billing on the Connect plan (the lowest
              Jobber plan with automated invoice follow-ups), including $29/month per additional user where that’s the
              cheaper option, per getjobber.com/pricing as of {PRICES_CHECKED}. Jobber also offers lower prices with an
              annual commitment and temporary promotions; Frostburn has no annual commitment. Prices exclude tax.
              Jobber is a trademark of its owner; Frostburn is not affiliated with Jobber.
            </p>
          </div>
        </section>

        {/* HVAC-specific */}
        <section className="border-t border-white/10 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className={eyebrow}>Built for HVAC, not every trade</p>
            <h2 className={`${h2} max-w-2xl`}>Every screen assumes you fix heating and cooling.</h2>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
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
              ].map((f) => (
                <div key={f.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-white font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm text-mist leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Honest section */}
        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>The honest part</p>
            <h2 className={h2}>When Jobber is the better pick</h2>
            <p className="mt-4 text-mist">We’d rather you choose right than switch twice. Stay with Jobber if you:</p>
            <ul className="mt-6 space-y-3 text-gray-200">
              {[
                'Run more than one trade, like HVAC plus landscaping or cleaning, under the same account.',
                'Rely on online booking from your website or two-way texting with customers.',
                'Use Jobber’s marketing tools or depend on its large library of app integrations.',
                'Want a native app from the App Store or Google Play rather than a browser app.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-mist">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-mist">
              If you’re a small HVAC shop that mostly needs the schedule, the client history and the money collected,
              Frostburn is the simpler, flatter-priced fit.
            </p>
          </div>
        </section>

        {/* Switching */}
        <section id="switch" className="border-t border-white/10 py-20 scroll-mt-8">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>Switching from Jobber</p>
            <h2 className={h2}>Moving over takes an afternoon, not a weekend.</h2>
            <ol className="mt-10 space-y-6">
              {[
                {
                  t: 'Export your clients from Jobber',
                  d: 'Download your client list from Jobber as a CSV file.',
                },
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
              ].map((s, i) => (
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

        {/* FAQ */}
        <section className="border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <p className={eyebrow}>Questions</p>
            <h2 className={h2}>Before you switch</h2>
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

        {/* CTA */}
        <section className="border-t border-white/10 py-24 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Try it next to Jobber. Free for {TRIAL_PERIOD_DAYS} days.
            </h2>
            <p className="mt-4 text-mist">Import your clients, send your first invoice, and see which one you open on Monday.</p>
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
          <div className="flex gap-4 text-xs">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
