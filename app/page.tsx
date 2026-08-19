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
