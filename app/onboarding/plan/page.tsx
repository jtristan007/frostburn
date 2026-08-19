import { createCheckoutSession } from '@/app/actions/billing'
import { TIER_LABELS, TIER_PRICES, type Tier } from '@/lib/stripe/plans'

const TIER_ORDER: Tier[] = ['starter', 'growth', 'pro']

const TECH_RANGES: Record<Tier, string> = {
  starter: '1–3 techs',
  growth: '4–15 techs',
  pro: '15+ techs',
}

export default function OnboardingPlanPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-navy">Pick a plan to get started</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your email is confirmed. Choose a plan and you&apos;re in.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TIER_ORDER.map((tier) => (
            <form key={tier} action={createCheckoutSession.bind(null, tier)}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-navy">{TIER_LABELS[tier]}</h3>
                <p className="text-sm text-gray-400 mt-1">{TECH_RANGES[tier]}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-navy">${TIER_PRICES[tier]}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </p>
                <button
                  type="submit"
                  className="mt-8 w-full text-sm font-semibold py-2.5 rounded-lg bg-ice text-navy hover:bg-ice-dim transition-colors"
                >
                  Choose {TIER_LABELS[tier]}
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
