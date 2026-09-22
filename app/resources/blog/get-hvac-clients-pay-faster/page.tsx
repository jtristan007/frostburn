import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Get HVAC Clients to Pay Faster | Payment Strategies for Contractors',
  description:
    'Proactive tactics to accelerate cash flow and build better payment habits with your customer base. Collect faster, stress less.',
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
            How to Get HVAC Clients to Pay Faster
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Build better payment habits with customers. Get paid on time instead of chasing payments.
          </p>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>7 min read</span>
            <span>•</span>
            <span>Posted September 22, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="text-gray-800 space-y-6">
          <p className="text-lg text-gray-700">
            You've built a great reputation. Clients call you first. Your work is excellent. So why do so many of them pay late?
          </p>
          <p className="text-gray-700">
            Here's the truth: It's not malice. It's not because they're bad people. It's because paying you isn't their priority. Your invoice is one of dozens they receive each week.
          </p>
          <p className="text-gray-700">
            But there's something even more true: <strong>The contractors who get paid fastest do something different upfront.</strong> They set expectations. They make paying easy. They follow up systematically.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-8">Why HVAC Contractors Struggle with Payment Speed</h2>
          <p className="text-gray-700 mb-3">
            Three reasons clients delay payment to contractors specifically:
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-navy mb-2">1. One-Off vs. Recurring Vendors</h3>
              <p className="text-gray-700">
                A homeowner pays their electric bill monthly (recurring). But your HVAC service? That's irregular. It's not top-of-mind. It's easy to deprioritize.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">2. The Handyman Expectation</h3>
              <p className="text-gray-700">
                Some clients expect contractors to accept cash on the spot or wait until the next visit. They're used to handymen. Professional invoicing feels formal. They delay.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">3. No Automatic Reminders</h3>
              <p className="text-gray-700">
                Without a reminder, your invoice gets buried in their inbox. No one calls to follow up. It drifts to the bottom of the pile.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">8 Tactics to Get Paid Faster (Starting Today)</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">1. Set Expectations Before the Work Begins</h3>
              <p className="text-gray-700 mb-3">
                When you book the appointment, tell them the payment terms upfront:
              </p>
              <p className="text-gray-700 italic border-l-4 border-gray-300 pl-4">
                "We'll send a detailed invoice when we're done. We accept payment by card, ACH transfer, or check. Payment is due within 7 days. You'll get a reminder if we haven't received it."
              </p>
              <p className="text-gray-700 mt-3">
                This eliminates surprise. They know what's coming.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">2. Invoice Same Day or Next Morning</h3>
              <p className="text-gray-700 mb-3">
                The faster an invoice reaches them, the higher the priority. Invoices sent weeks later get lost.
              </p>
              <p className="text-gray-700">
                <strong>Tactic:</strong> Use software that generates invoices in seconds. Email it before you leave the job.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">3. Make Payment Dead Simple</h3>
              <p className="text-gray-700 mb-3">
                The more friction to pay, the longer they'll delay. Offer multiple payment methods:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Direct link in invoice:</strong> "Click here to pay with card" (fastest)</li>
                <li><strong>ACH transfer:</strong> Routing and account number on invoice</li>
                <li><strong>Check:</strong> If they prefer (slower, but acceptable)</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Clients who can click a link and pay in 30 seconds do it. Clients who have to find your bank info will procrastinate.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">4. Send Automatic Reminders (Without the Awkwardness)</h3>
              <p className="text-gray-700 mb-3">
                You can't follow up manually for every invoice. Automate it:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>3 days before due date:</strong> "Your invoice is due soon. Pay here."</li>
                <li><strong>On the due date:</strong> "Invoice due today."</li>
                <li><strong>3 days overdue:</strong> "We haven't received your payment. Click here to settle it."</li>
                <li><strong>Weekly after that:</strong> Escalating tone, but still friendly and professional</li>
              </ul>
              <p className="text-gray-700 mt-3">
                This removes the awkwardness of personal chasing and keeps payment top-of-mind.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">5. Be Specific About Due Dates</h3>
              <p className="text-gray-700 mb-3">
                Don't say "Net 30." Write it out: <strong>"Due by December 15"</strong>
              </p>
              <p className="text-gray-700">
                Specific dates stick. Vague terms get forgotten.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">6. Include Payment Terms (Optional Late Fees)</h3>
              <p className="text-gray-700 mb-3">
                On your invoice, include something like:
              </p>
              <p className="text-gray-700 italic border-l-4 border-gray-300 pl-4">
                "Payment due by [date]. Late payments incur a 1.5% monthly service fee."
              </p>
              <p className="text-gray-700 mt-3">
                Late fees work. Clients see them and think twice about delaying. (Optional—only if comfortable enforcing them)
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">7. Offer Incentive for Early Payment</h3>
              <p className="text-gray-700 mb-3">
                Flip the script: "If you pay within 3 days, we'll knock off $25."
              </p>
              <p className="text-gray-700">
                Some clients will pay immediately for a small discount. That gets cash in hand faster.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">8. Track Who Pays Late Consistently</h3>
              <p className="text-gray-700 mb-3">
                Some clients always pay late. Others never do. You should know which is which.
              </p>
              <p className="text-gray-700">
                For consistent late payers, you might:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Require payment upfront (cash, check, or card before they leave)</li>
                <li>Require deposit before scheduling</li>
                <li>Increase payment terms (e.g., "Due immediately" vs. "Due in 7 days")</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">The Math: Why Faster Payment Matters</h2>
          <p className="text-gray-700 mb-4">
            Let's say you do $10,000 in work each month:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Current state (45-day average payment):</strong> You're always owed $15,000 from past work</li>
            <li><strong>With these tactics (15-day average):</strong> You're only owed $5,000</li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Result:</strong> $10,000 extra cash in hand that you can use for supplies, equipment, or payroll without financing it. That's real money.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-8">How Frostburn Automates All This</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4 my-6">
            <p className="text-gray-800 mb-4">
              Instead of juggling spreadsheets and sending manual follow-ups:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Automatic reminders:</strong> Scheduled emails go out on your timeline</li>
              <li><strong>Payment links:</strong> Direct invoice links reduce friction</li>
              <li><strong>Payment tracking:</strong> See at a glance: paid, pending, overdue</li>
              <li><strong>Revenue at risk:</strong> Dashboard shows you exactly how much is sitting unpaid</li>
              <li><strong>Late fee automation:</strong> Apply late fees automatically based on your rules</li>
            </ul>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-navy mb-4">Get paid faster starting today</h3>
            <p className="text-gray-700 mb-6">
              Try Frostburn free for 30 days. Send an invoice immediately after your next job and see how automatic reminders transform your cash flow.
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
            Stop chasing payments. Build a system where clients pay on time automatically.
          </h2>
          <p className="text-white/80 mb-8">
            Better cash flow. Less stress. More money for your business.
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
