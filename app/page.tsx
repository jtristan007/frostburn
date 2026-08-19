import Link from 'next/link'

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
    <div className="min-h-screen">
      <div
        className="relative"
        style={{ background: 'linear-gradient(160deg, #080f28, #0d1530)' }}
      >
        <header className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight text-white">
              Frost<span className="text-ice">burn</span>
            </span>
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

        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="inline-block text-xs font-medium text-ice bg-ice/10 border border-ice/20 rounded-full px-3 py-1 mb-6">
            Built for HVAC operators in Canada &amp; the Pacific Northwest
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            HVAC software that runs your business.
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            While you&apos;re under a crawlspace, Frostburn is chasing your unpaid invoices,
            tracking maintenance agreements, and keeping your schedule straight.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="text-sm font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Start Free Today →
            </Link>
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-ice uppercase tracking-wide mb-3">
            What Frostburn does
          </p>
          <h2 className="text-3xl font-bold text-navy">One platform. Everything handled.</h2>
          <p className="mt-3 text-gray-400">
            From the first call to the final payment — and all the follow-up in between.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 p-6 transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:border-ice/30"
            >
              {f.illustration}
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-navy">{f.title}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{f.wit}</p>
                <p className="text-sm text-gray-500 mt-2">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 ${
                tier.popular ? 'border-ice/40 shadow-md relative' : 'border-gray-100'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-ice text-navy px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-navy">{tier.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{tier.techs}</p>
              <p className="mt-4">
                <span className="text-4xl font-bold text-navy">${tier.price}</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
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
                    : 'bg-gray-50 text-navy hover:bg-gray-100'
                }`}
              >
                Start Free Today
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8" style={{ background: '#05091a' }}>
        <div className="max-w-6xl mx-auto px-6 text-sm text-gray-400 text-center">
          Frostburn — built for Canada and the Pacific Northwest.
        </div>
      </footer>
    </div>
  )
}
