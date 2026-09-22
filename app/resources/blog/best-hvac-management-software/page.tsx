import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best HVAC Management Software for Small Contractors | Frostburn',
  description:
    'Compare top HVAC business management software. Find the right invoicing, scheduling, and payment collection tool for your 1-15 technician shop.',
}

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/resources" className="text-white/60 hover:text-white mb-4 inline-block">
            ← Back to Resources
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Best HVAC Management Software for Small Contractors
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Stop comparing endless feature lists. Here's how to pick the right software for your business size and workflow.
          </p>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>10 min read</span>
            <span>•</span>
            <span>Posted September 22, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="text-gray-800 space-y-6">
          <p className="text-lg text-gray-700">
            You're drowning in software options. Jobber. ServiceTitan. Square for Contractors. HomeAdvisor Pro. Each one promises to "transform your business." But which one actually fits a 1–5 tech HVAC shop?
          </p>

          <h2 className="text-2xl font-bold text-navy mt-8">The Problem: Enterprise Software Built for Everyone</h2>
          <p className="text-gray-700">
            Most HVAC software falls into two buckets:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Enterprise tools</strong> (Jobber, ServiceTitan): Built for 50+ person companies. Packed with features you'll never use. $200+/month per tech.</li>
            <li><strong>Generic field service tools</strong> (Square, HomeAdvisor): Not built for HVAC specifically. Missing crucial features like maintenance agreements, warranty tracking, equipment history.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Small contractors get squeezed: pay for features you don't need, or use software that doesn't fit your workflow.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-8">What Actually Matters for Small HVAC Shops</h2>
          <p className="text-gray-700">
            Before comparing software, know what you actually need:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-navy mb-2">1. Invoicing That Doesn't Take Hours</h3>
              <p className="text-gray-700">
                You need to send a professional invoice seconds after the job is done. Not custom quotes. Not endless templates. Quick, clean, professional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">2. Automatic Payment Reminders</h3>
              <p className="text-gray-700">
                You're not manually chasing clients. The software sends reminders automatically: 3 days before due, on the due date, and weekly after.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">3. Scheduling That Works for Your Crew</h3>
              <p className="text-gray-700">
                Your techs need to see the week's schedule, job notes, and customer history on any device—no app download required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">4. Equipment & Maintenance Tracking</h3>
              <p className="text-gray-700">
                HVAC is maintenance-driven. You need to know what equipment each customer has, when they were last serviced, and what warranty is active.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">5. One Dashboard. Not Ten Tabs.</h3>
              <p className="text-gray-700">
                You need to see: revenue at risk (unpaid invoices), active clients, this week's jobs, and your pipeline—all in one glance.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">The Comparison: Jobber vs. Alternatives</h2>

          <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 my-6">
            <h3 className="font-semibold text-navy mb-3">Jobber</h3>
            <p className="text-gray-700 mb-3">
              <strong>Best for:</strong> Multi-location companies with 20+ employees
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-3">
              <li>✅ Comprehensive feature set (invoicing, scheduling, estimates, CRM)</li>
              <li>✅ Mobile app for crew in the field</li>
              <li>✅ Strong integrations (QuickBooks, Stripe, etc.)</li>
              <li>❌ Overkill for small shops—$200-300/month</li>
              <li>❌ Confusing pricing model (per technician)</li>
              <li>❌ Steep learning curve for small teams</li>
              <li>❌ Requires mandatory mobile app install</li>
            </ul>
            <p className="text-gray-700"><strong>Cost:</strong> $199/tech/month + $99/month base</p>
          </div>

          <div className="border-l-4 border-green-600 pl-6 py-4 bg-green-50 my-6">
            <h3 className="font-semibold text-navy mb-3">ServiceTitan</h3>
            <p className="text-gray-700 mb-3">
              <strong>Best for:</strong> Growing companies (15+ techs) with multiple locations
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-3">
              <li>✅ Enterprise-grade reporting and analytics</li>
              <li>✅ Advanced CRM and customer management</li>
              <li>✅ Multi-location management</li>
              <li>❌ $299-400+/month for small shops</li>
              <li>❌ Overkill features you won't use</li>
              <li>❌ Requires dedicated implementation</li>
              <li>❌ Very expensive to start</li>
            </ul>
            <p className="text-gray-700"><strong>Cost:</strong> $299+/month (minimum)</p>
          </div>

          <div className="border-l-4 border-orange-600 pl-6 py-4 bg-orange-50 my-6">
            <h3 className="font-semibold text-navy mb-3">Frostburn (Built for Small HVAC Shops)</h3>
            <p className="text-gray-700 mb-3">
              <strong>Best for:</strong> 1–5 technician HVAC companies
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-3">
              <li>✅ Flat-rate pricing: $149–499/month (not per technician)</li>
              <li>✅ Built specifically for HVAC workflows</li>
              <li>✅ Automatic payment reminders out of the box</li>
              <li>✅ Equipment & maintenance agreement tracking</li>
              <li>✅ No app install required—works in any browser</li>
              <li>✅ 30-day free trial, cancel anytime</li>
              <li>✅ Setup in 20 minutes</li>
              <li>❌ Simpler than enterprise tools (fewer advanced features)</li>
            </ul>
            <p className="text-gray-700"><strong>Cost:</strong> $149/month (Starter, 1–3 techs)</p>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">How to Choose: A Decision Framework</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-navy text-lg mb-2">1. How many technicians do you have?</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>1–5 techs:</strong> Frostburn (built for your size)</li>
                <li><strong>6–15 techs:</strong> Frostburn Growth plan or Jobber</li>
                <li><strong>15+ techs:</strong> ServiceTitan or Jobber (enterprise features needed)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-navy text-lg mb-2">2. Is HVAC-specific tracking important?</h3>
              <p className="text-gray-700">
                If maintenance agreements, equipment history, and warranty alerts matter → <strong>Frostburn or specialized HVAC tools</strong>
              </p>
              <p className="text-gray-700 mt-2">
                If you just need basic invoicing and scheduling → <strong>Any generic field service tool works</strong>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-navy text-lg mb-2">3. How important is flat-rate pricing?</h3>
              <p className="text-gray-700">
                If you're tired of per-technician pricing eating into margins → <strong>Frostburn ($149–499/month flat)</strong>
              </p>
              <p className="text-gray-700 mt-2">
                If per-tech models don't bother you → <strong>Jobber works, just calculate true cost</strong>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-navy text-lg mb-2">4. How quick do you need to get up and running?</h3>
              <p className="text-gray-700">
                If you want to start today (literally) → <strong>Frostburn: 20 minutes to invoicing</strong>
              </p>
              <p className="text-gray-700 mt-2">
                If you have time for onboarding → <strong>Jobber or ServiceTitan (requires training)</strong>
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">The Real Cost Comparison</h2>
          <p className="text-gray-700 mb-4">
            Let's say you run a 3-technician HVAC shop:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Jobber:</strong> $199 × 3 techs + $99 = <strong>$696/month</strong></li>
            <li><strong>ServiceTitan:</strong> $299/month minimum × 3 = <strong>$897+/month</strong></li>
            <li><strong>Frostburn Growth:</strong> <strong>$299/month</strong> (flat, includes all 3 techs)</li>
          </ul>
          <p className="text-gray-700 mt-6">
            <strong>Annual difference:</strong> Frostburn saves you $4,764–7,176/year compared to Jobber or ServiceTitan. That's a new van or equipment investment.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-8">The Bottom Line</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4 my-6">
            <p className="text-gray-800 font-semibold mb-2">
              For 1–5 technician HVAC shops:
            </p>
            <p className="text-gray-700">
              Don't pay for enterprise software. Use a tool built for your size. You'll get out of setup faster, pay less per month, and have a system that actually fits your workflow instead of forcing your workflow into a tool designed for 50-person companies.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-navy mb-4">Ready to switch?</h3>
            <p className="text-gray-700 mb-6">
              Try Frostburn free for 30 days. Set up your invoicing, add your clients, and see how much time you save. No credit card required. Cancel anytime.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </article>

      {/* Footer CTA */}
      <div className="bg-navy py-12 md:py-16 mt-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your business is different from Jobber's enterprise customers.
          </h2>
          <p className="text-white/80 mb-8">
            Use software built for HVAC contractors your size.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-navy px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Frostburn Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
