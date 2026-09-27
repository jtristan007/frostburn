'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tier = {
  name: string
  price: number
  techs: string
  popular?: boolean
  features: string[]
}

export function PricingTiers({ tiers }: { tiers: Tier[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tiers.map((tier, i) => {
        const highlighted = tier.popular || hovered === i
        return (
          <div
            key={tier.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`rounded-2xl border p-8 backdrop-blur-sm relative transition-colors ${
              highlighted
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
        )
      })}
    </div>
  )
}
