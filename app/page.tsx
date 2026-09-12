import Link from 'next/link'
import { Logo } from '@/components/logo'
import { FrostHero } from '@/components/landing/frost-hero'
import { TIER_TECH_RANGE_LABELS, TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

// Every tier gets the complete platform -- quotes, dispatch, invoicing,
// payments, agreements, QuickBooks, all of it. Nothing here is feature-gated
// in the app; the only real difference between tiers is crew size and
// support response time, so the copy says that instead of inventing
// exclusive features that don't exist in the product.
const TIERS = [
  {
    name: 'Starter',
    price: 149,
    techs: TIER_TECH_RANGE_LABELS.starter,
    features: [
      'The complete platform, no paywalls',
      'Quotes, dispatch, invoicing & payments',
      'Maintenance agreements & QuickBooks sync',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: 299,
    techs: TIER_TECH_RANGE_LABELS.growth,
    popular: true,
    features: [
      'Everything in Starter',
      'Built for a bigger crew to coordinate',
      'Priority support — faster response',
      'Same flat rate, no per-tech math',
    ],
  },
  {
    name: 'Pro',
    price: 499,
    techs: TIER_TECH_RANGE_LABELS.pro,
    features: [
      'Everything in Growth',
      'Direct line to the person who builds it',
      'First look at new features',
      'Help migrating your existing data',
    ],
  },
]

// The actual workflow the product runs, in order -- replaces the old
// generic 4-feature grid (Invoicing/Scheduling/Client Mgmt/Reports), which
// didn't show quote approvals, dispatching, photos, signatures, the
// customer portal, or QuickBooks at all. Every claim below maps to a real,
// shipped flow in the app, not aspirational copy.
const WORKFLOW = [
  {
    step: '1',
    title: 'Quote',
    wit: '"Send it. They approve it. No phone tag."',
    body: 'Build a quote from your pricing book and send a link. The customer approves or declines right from their phone — no account, no app, no chasing them down for a callback.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="text-[11px] text-gray-400 mb-3">Quote #204 · Rivera Residence</div>
        <div className="space-y-2 text-xs text-gray-300 mb-3">
          <div className="flex justify-between">
            <span>AC Tune-up + filter replacement</span>
            <span className="font-semibold text-white">$310</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="flex-1 text-center text-xs font-semibold text-navy bg-ice rounded-lg py-2">Approve</span>
          <span className="flex-1 text-center text-xs font-semibold text-mist border border-white/15 rounded-lg py-2">Decline</span>
        </div>
      </div>
    ),
  },
  {
    step: '2',
    title: 'Schedule',
    wit: '"Every job, every tech, one board."',
    body: 'Assign the job and it lands on your dispatch board. Your crew moves through Dispatched → En Route → Arrived with one tap, so you always know where everyone actually is.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="text-[11px] text-gray-400 mb-3">📍 Dispatch board · Today</div>
        <div className="space-y-2 text-xs">
          {[
            ['Mike', 'Johnson Family', 'En route', 'bg-amber-400/20 text-amber-300'],
            ['Dana', 'Chen Install', 'Arrived', 'bg-green-400/20 text-green-300'],
            ['Luis', 'Smith Emergency', 'Dispatched', 'bg-ice/20 text-ice'],
          ].map(([tech, job, status, c]) => (
            <div key={tech} className="flex items-center justify-between">
              <span className="text-gray-300">{tech} · {job}</span>
              <span className={`rounded px-2 py-0.5 font-medium ${c}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: '3',
    title: 'Complete',
    wit: '"Proof it happened, without a callback."',
    body: 'Your tech snaps before/after photos and captures a signature right on the job screen — from a phone, in the driveway. It stays attached to the job record for good.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="text-[11px] text-gray-400 mb-3">📸 Job completion · Rivera Residence</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded bg-white/5 border border-white/10 h-12 flex items-center justify-center text-[10px] text-mist">Before photo</div>
          <div className="rounded bg-white/5 border border-white/10 h-12 flex items-center justify-center text-[10px] text-mist">After photo</div>
        </div>
        <div className="rounded bg-white/5 border border-white/10 h-8 flex items-center px-3 text-[10px] text-mist italic">✓ Signed by customer</div>
      </div>
    ),
  },
  {
    step: '4',
    title: 'Invoice',
    wit: '"The invoice writes itself."',
    body: "Completing the job generates the invoice from your pricing book automatically. One click sends it to QuickBooks too — no retyping line items into another system.",
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
          <span>Invoice #1082 · $1,840</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300">Auto-generated from job record</span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-xs font-semibold text-green-400 flex items-center gap-1.5">
          ✓ Sent to QuickBooks
        </div>
      </div>
    ),
  },
  {
    step: '5',
    title: 'Collect',
    wit: '"Chase money, not memories."',
    body: 'Customers pay online from their portal link — card on file, no checks in the mail, no awkward follow-up calls. Overdue reminders go out automatically if they don\'t.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="text-[11px] text-gray-400 mb-3">Customer portal · Johnson Family</div>
        <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
          <span>Invoice #1082</span>
          <span className="text-xs font-bold text-green-400 border border-green-400/40 rounded px-2 py-0.5">✓ PAID</span>
        </div>
        <div className="text-[10px] text-mist">Paid online · card on file</div>
      </div>
    ),
  },
  {
    step: '6',
    title: 'Renew',
    wit: '"The maintenance plan that renews itself."',
    body: 'Maintenance agreements track visits and renewal dates on their own. When it\'s time, Frostburn reminds the customer and rolls the agreement into its next year automatically.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="text-[11px] text-gray-400 mb-3">📋 Annual maintenance plan</div>
        <div className="space-y-1.5 text-[11px] text-gray-300">
          <div>3 of 4 visits used this period</div>
          <div>Renews in 14 days · auto-reminder queued</div>
        </div>
      </div>
    ),
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen relative" style={{ background: '#05070f' }}>
      <div
        className="fixed inset-0 -z-50 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(5,7,15,0.8), rgba(5,7,15,0.94)), url(/frost-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />

      <FrostHero />

      <div className="border-t border-white/10 py-5">
        <p className="text-center font-mono text-[11px] tracking-wide text-mist">
          No credit card required to start &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">Sound familiar?</p>
          <h2 className="text-3xl font-display font-bold text-white max-w-2xl mx-auto">
            Running HVAC is already hard. The admin work shouldn&apos;t be.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                emoji: '💸',
                title: 'Invoices going cold',
                body: 'Jobs wrapped up weeks ago, still unpaid. Following up manually is exhausting — and awkward with clients you actually like.',
              },
              {
                emoji: '📋',
                title: 'Scheduling chaos',
                body: 'Double-booked jobs. Forgotten callbacks. Crew calling to ask where they’re supposed to be.',
              },
              {
                emoji: '😤',
                title: 'Zero visibility',
                body: 'No idea how the business is actually doing until you sit down and dig through everything yourself.',
              },
            ].map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
              >
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="text-sm text-mist mt-2">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">
            How it actually works
          </p>
          <h2 className="text-3xl font-display font-bold text-white">
            The office work handled.
            <br />
            The HVAC work stays yours.
          </h2>
          <p className="mt-3 text-mist">
            One job, start to finish — quote, schedule, complete, invoice, collect, renew.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {WORKFLOW.map((f) => (
            <div key={f.title} className="group relative">
              {/* glow: a soft white light behind the card, off by default,
                  fades in on hover -- lives on the wrapper so it isn't
                  clipped by the card's own rounded-corner + blur layers */}
              <div className="absolute -inset-4 rounded-3xl bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:border-ice/40">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-ice/15 border border-ice/40 text-ice text-[11px] font-mono font-semibold flex items-center justify-center">
                    {f.step}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                </div>
                {f.illustration}
                <div className="mt-5">
                  <p className="text-sm text-ice-dim font-medium">{f.wit}</p>
                  <p className="text-sm text-mist mt-2">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-ice to-blue-600 flex items-center justify-center text-lg font-bold text-white">
            ❄
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Built and run by one person</h3>
            <p className="text-sm text-mist mt-1.5">
              Frostburn isn&apos;t a call center or a team of account reps — it&apos;s one person
              who writes the code and answers the emails. If you have a question, a bug report, or
              anything else, you&apos;re talking directly to the person who built it.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">The upgrade</p>
          <h2 className="text-3xl font-display font-bold text-white">Before Frostburn. After Frostburn.</h2>
          <p className="mt-3 text-mist">
            The software doesn&apos;t change the work — it changes everything around the work.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6">
            <div className="text-xs font-semibold text-red-400 mb-4">✕ Without Frostburn</div>
            <ul className="space-y-3">
              {[
                ['📓', 'Invoices tracked in a notebook or your head'],
                ['😬', 'Awkward calls chasing clients for payment'],
                ['📅', 'Scheduling conflicts found out last minute'],
                ['❓', 'No idea how the business is actually performing'],
              ].map(([icon, text]) => (
                <li key={text} className="text-sm text-mist flex items-start gap-2.5">
                  <span>{icon}</span> {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-ice/30 bg-ice/[0.06] backdrop-blur-sm p-6">
            <div className="text-xs font-semibold text-ice mb-4">✓ With Frostburn</div>
            <ul className="space-y-3">
              {[
                ['💻', 'Every invoice sent and tracked in one place'],
                ['📧', 'Overdue reminders sent automatically — you never ask twice'],
                ['📆', 'Crew has their schedule, job notes, and history on any device'],
                ['📊', 'A morning briefing lands in your inbox automatically, every day'],
              ].map(([icon, text]) => (
                <li key={text} className="text-sm text-white font-medium flex items-start gap-2.5">
                  <span>{icon}</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">Works everywhere</p>
          <h2 className="text-3xl font-display font-bold text-white">
            Your office is wherever you have a signal.
          </h2>
          <p className="mt-3 text-mist max-w-xl mx-auto">
            Frostburn runs on iPhone, Android, Mac, Windows, and tablet — right in the browser, no
            download required.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['🍎', 'iPhone', 'Safari · iOS'],
              ['🤖', 'Android', 'Chrome'],
              ['💻', 'Mac & Windows', 'Any browser'],
              ['📱', 'iPad & Tablet', 'Full experience'],
            ].map(([icon, name, detail]) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-semibold text-white">{name}</div>
                <div className="text-xs text-mist mt-0.5">{detail}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-mist max-w-lg mx-auto">
            <strong className="text-white">No download. No install.</strong> Open a browser, log in,
            you&apos;re live.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">Getting started</p>
          <h2 className="text-3xl font-display font-bold text-white">Up and running in under 30 minutes.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            ['1', 'Create your account', 'Set up your business profile and pricing book. Zero tech knowledge required.'],
            ['2', 'Add your clients', 'Import existing customers or add them one by one. Each one gets welcomed automatically.'],
            ['3', 'You’re automated by default', 'Overdue reminders and your morning briefing go out on their own, every day, from day one.'],
            ['4', 'Go do the work', 'Focus on the jobs. Frostburn handles the desk stuff.'],
          ].map(([num, title, body]) => (
            <div key={num}>
              <div className="w-8 h-8 rounded-full border border-ice/40 bg-ice/10 text-ice font-mono text-sm font-semibold flex items-center justify-center mb-3">
                {num}
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-sm text-mist mt-1.5">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">
            Simple, honest pricing
          </p>
          <h2 className="text-3xl font-display font-bold text-white">
            Flat rate. No surprises. No per-tech math.
          </h2>
          <p className="mt-3 text-mist">
            Every plan starts with a {TRIAL_PERIOD_DAYS}-day free trial. No charge until it ends.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5">
            🔒 Founding customer pricing — lock in this rate for as long as you stay subscribed.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 backdrop-blur-sm relative ${
                tier.popular
                  ? 'border-ice/50 bg-ice/[0.06] shadow-[0_0_50px_-12px_rgba(56,189,248,0.5)]'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-ice text-navy px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
              <p className="text-sm text-mist mt-1">{tier.techs}</p>
              <p className="mt-4">
                <span className="font-mono text-4xl font-bold text-white">${tier.price}</span>
                <span className="text-mist text-sm">/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-ice">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block text-center text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                  tier.popular
                    ? 'bg-ice text-navy hover:bg-ice-dim'
                    : 'bg-white/10 text-white border border-white/15 hover:bg-white/15'
                }`}
              >
                Start Free Today
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24" style={{ background: '#05091a' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold text-white">Stop running your business from a notepad.</h2>
          <p className="mt-3 text-mist">
            Set up your pricing book, add your first client, and let the follow-up happen on its
            own.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="inline-block text-sm font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Get Started Free →
            </Link>
            <a
              href="mailto:j_tristan@me.com?subject=Book%20a%2015-minute%20walkthrough"
              className="inline-block text-sm font-semibold text-white px-6 py-3 rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
            >
              Book a 15-min walkthrough
            </a>
          </div>
          <p className="mt-6 text-xs text-mist">
            🍎 iPhone &nbsp;·&nbsp; 🤖 Android &nbsp;·&nbsp; 💻 Desktop &nbsp;·&nbsp; 📱 Tablet
            &nbsp;·&nbsp; No download required
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8" style={{ background: '#05091a' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-3">
          <Logo className="h-9" />
          <p className="text-sm text-mist">Frostburn — built for small HVAC operators.</p>
          <div className="flex gap-4 text-xs text-mist">
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/security" className="hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
