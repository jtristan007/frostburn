import Link from 'next/link'
import { Logo } from '@/components/logo'
import { FrostHero } from '@/components/landing/frost-hero'

const TIERS = [
  {
    name: 'Starter',
    price: 149,
    techs: '1–3 techs',
    features: [
      'Pricing book & quotes',
      'Equipment history',
      'Scheduling',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: 299,
    techs: '4–15 techs',
    popular: true,
    features: [
      'Everything in Starter',
      'Maintenance agreement tracking',
      'Filter & warranty alerts',
      'Priority support',
    ],
  },
  {
    name: 'Pro',
    price: 499,
    techs: '15+ techs',
    features: [
      'Everything in Growth',
      'Multi-location dashboard',
      'Advanced analytics',
      'Dedicated account manager',
    ],
  },
]

const FEATURES = [
  {
    title: 'Invoicing & Payments',
    wit: '"Chase money, not memories."',
    body: 'Send professional invoices in seconds. Automatic reminders go out on overdue accounts without you making a single awkward call.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
          <span className="font-bold text-ice">❄ FROSTBURN</span>
          <span>Invoice #1082 · Due Jun 15</span>
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>AC Unit Installation</span>
            <span className="font-semibold text-white">$1,200</span>
          </div>
          <div className="flex justify-between">
            <span>Labor (3 hrs @ $150)</span>
            <span className="font-semibold text-white">$450</span>
          </div>
          <div className="flex justify-between">
            <span>Refrigerant + Materials</span>
            <span className="font-semibold text-white">$190</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">Total due</div>
            <div className="text-lg font-bold text-ice">$1,840</div>
          </div>
          <span className="text-xs font-bold text-green-400 border border-green-400/40 rounded px-2 py-1">
            ✓ PAID
          </span>
        </div>
      </div>
    ),
  },
  {
    title: 'Scheduling & Jobs',
    wit: '"Be everywhere at once. Without the clone."',
    body: 'Recurring maintenance, emergency calls, seasonal tune-ups. Your crew knows exactly where to be, what to bring, and what was done last visit.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="text-[11px] text-gray-400 mb-3">📅 Week of Jul 7 – 11</div>
        <div className="grid grid-cols-5 gap-1.5 text-[10px]">
          {[
            { d: 'MON', jobs: [{ t: 'AC Tune-up\nRivera', c: 'bg-ice/20 text-ice' }, { t: 'Heater\nJohnson', c: 'bg-amber-400/20 text-amber-300' }] },
            { d: 'TUE', jobs: [{ t: 'PM Visit\n3 stops', c: 'bg-green-400/20 text-green-300' }] },
            { d: 'WED', jobs: [{ t: 'Install\nChen', c: 'bg-ice/20 text-ice' }, { t: 'Inspect\nLopez', c: 'bg-ice/20 text-ice' }] },
            { d: 'THU', jobs: [{ t: '🚨 Emergency\nSmith', c: 'bg-red-400/20 text-red-300 ring-1 ring-red-400' }, { t: 'PM Visit', c: 'bg-green-400/20 text-green-300' }] },
            { d: 'FRI', jobs: [{ t: 'Service\n4 jobs', c: 'bg-green-400/20 text-green-300' }] },
          ].map((day) => (
            <div key={day.d} className="space-y-1">
              <div className="text-gray-500 font-semibold text-center">{day.d}</div>
              {day.jobs.map((j, i) => (
                <div key={i} className={`rounded px-1 py-1 leading-tight font-medium whitespace-pre-line ${j.c}`}>
                  {j.t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Client Management',
    wit: '"Every handshake. Every detail. On file."',
    body: "Full history for every customer — equipment installed, service dates, warranty info, last tech's notes. New clients onboarded automatically the moment they sign up.",
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ice to-blue-600 flex items-center justify-center text-sm font-bold text-white">
            J
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Johnson Family</div>
            <div className="text-[11px] text-amber-300">⭐ Premium · Since 2021</div>
          </div>
        </div>
        <div className="space-y-1.5 text-[11px] text-gray-300">
          <div>🌡️ Lennox 3-ton unit · Installed Mar 2022</div>
          <div>🔧 Last service: June 30 · Tech: Mike</div>
          <div>📋 Annual maintenance plan · Active</div>
          <div>💰 Lifetime value: $6,840 · 0 late pays</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Reports',
    wit: '"Know your numbers without doing the math."',
    body: 'Revenue at risk, monthly totals, active clients — all live, all in one glance. No spreadsheets required.',
    illustration: (
      <div className="rounded-xl bg-navy-mid border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] text-gray-400">Monthly Revenue</div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">$18,400</div>
            <div className="text-[10px] text-green-400 font-semibold">↑ 23% vs last month</div>
          </div>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[
            { h: 38, m: 'Feb' },
            { h: 44, m: 'Mar' },
            { h: 35, m: 'Apr' },
            { h: 52, m: 'May' },
            { h: 48, m: 'Jun' },
            { h: 67, m: 'Jul', bright: true },
          ].map((b) => (
            <div key={b.m} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-sm ${b.bright ? 'bg-ice' : 'bg-white/15'}`}
                style={{ height: `${b.h}px` }}
              />
              <div className={`text-[9px] ${b.bright ? 'text-ice font-bold' : 'text-gray-500'}`}>{b.m}</div>
            </div>
          ))}
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

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">
            What Frostburn does
          </p>
          <h2 className="text-3xl font-display font-bold text-white">One platform. Everything handled.</h2>
          <p className="mt-3 text-mist">
            From the first call to the final payment — and all the follow-up in between.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="group relative">
              {/* glow: a soft white light behind the card, off by default,
                  fades in on hover -- lives on the wrapper so it isn't
                  clipped by the card's own rounded-corner + blur layers */}
              <div className="absolute -inset-4 rounded-3xl bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:border-ice/40">
                {f.illustration}
                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-ice-dim font-medium mt-1">{f.wit}</p>
                  <p className="text-sm text-mist mt-2">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
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
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-block text-sm font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Get Started Free →
            </Link>
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
          </div>
        </div>
      </footer>
    </div>
  )
}
