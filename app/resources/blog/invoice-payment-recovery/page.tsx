import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Contractor\'s Guide to Invoice Payment Recovery | Frostburn',
  description:
    'Stop chasing payments. Learn proven strategies for faster invoice payment collection, reducing accounts receivable, and getting paid on time.',
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
            The Contractor's Guide to Invoice Payment Recovery
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Stop wasting time chasing payments. Use these proven tactics to get paid faster and reduce unpaid invoices.
          </p>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>8 min read</span>
            <span>•</span>
            <span>Posted September 22, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16 prose prose-invert">
        <div className="text-gray-800">
          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">The Problem: Invoices Going Cold</h2>
          <p className="text-gray-700 mb-4">
            As an HVAC contractor, you've already done the hard work: completed the job, satisfied the customer, and sent the invoice.
            But then... nothing. Days go by. A week. Two weeks. You're still waiting for payment while your crew is ready for the next job.
          </p>
          <p className="text-gray-700 mb-4">
            This is the reality for most small contractors:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Jobs wrapped up weeks ago still sitting as unpaid</li>
            <li>Awkward calls chasing clients for payment</li>
            <li>No visibility into who owes what</li>
            <li>Cash flow disruption affecting your business</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">Why This Happens</h2>
          <p className="text-gray-700 mb-4">
            Clients aren't malicious. They're busy running their own operations. Your invoice gets mixed in with dozens of others, and
            payment gets deprioritized unless you stay top of mind.
          </p>
          <p className="text-gray-700 mb-4">
            The contractors who get paid faster do one thing differently: <strong>they follow up systematically.</strong>
          </p>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">5 Tactics for Faster Payment Collection</h2>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6">1. Send Invoices the Same Day (or Next Morning)</h3>
          <p className="text-gray-700 mb-4">
            The faster an invoice reaches the client's inbox, the sooner it gets on their radar. If you're writing invoices manually
            at the end of the week, you're already behind.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Tactic:</strong> Use software that lets you send invoices within hours of job completion. The cognitive load is
            still fresh, and the client is most satisfied.
          </p>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6">2. Include Clear Payment Terms</h3>
          <p className="text-gray-700 mb-4">
            "Net 30" is fine, but many contractors skip this entirely. Don't assume. Make it explicit:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Payment due date (e.g., "Due by October 15")</li>
            <li>Payment methods accepted</li>
            <li>Late fees (optional, but effective)</li>
          </ul>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6">3. Automate Reminders</h3>
          <p className="text-gray-700 mb-4">
            Don't manually send follow-up emails. Set up automated reminders that go out:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>3 days before due date (gentle reminder)</li>
            <li>On the due date</li>
            <li>3 days after (overdue notice)</li>
            <li>Weekly thereafter (escalating tone)</li>
          </ul>
          <p className="text-gray-700 mb-4">
            This removes the awkwardness of manual chasing and puts payment top-of-mind consistently.
          </p>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6">4. Make Paying Easy</h3>
          <p className="text-gray-700 mb-4">
            Friction kills payment speed. The more hoops a client jumps through, the longer they'll delay. Offer multiple payment
            options:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Credit/debit card (fastest)</li>
            <li>ACH transfer</li>
            <li>Check (acceptable for larger invoices)</li>
            <li>Direct payment link (reduces friction)</li>
          </ul>

          <h3 className="text-xl font-semibold text-navy mb-3 mt-6">5. Track Everything</h3>
          <p className="text-gray-700 mb-4">
            You can't improve what you don't measure. Know at a glance:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Total revenue at risk (unpaid invoices)</li>
            <li>Average days to payment</li>
            <li>Which clients pay late consistently</li>
            <li>Overdue vs. upcoming invoices</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">The Result: Getting Paid 3x Faster</h2>
          <p className="text-gray-700 mb-4">
            Contractors who implement these tactics consistently report:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Average payment cycle cut from 45 days to 15 days</li>
            <li>30% fewer unpaid invoices after 60 days</li>
            <li>Eliminated manual payment chasing</li>
            <li>Better cash flow for growth</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mb-4 mt-8">How Frostburn Automates This</h2>
          <p className="text-gray-700 mb-4">
            Instead of juggling spreadsheets, emails, and manual reminders, Frostburn handles payment recovery automatically:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li><strong>Same-day invoicing:</strong> Send professional invoices seconds after the job is done</li>
            <li><strong>Automatic reminders:</strong> Scheduled follow-ups go out without your involvement</li>
            <li><strong>Easy payments:</strong> Direct payment links reduce friction</li>
            <li><strong>Live dashboard:</strong> See revenue at risk, overdue invoices, and cash flow at a glance</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded">
            <p className="text-gray-800 font-semibold">
              The bottom line: Stop chasing payments. Automate the process and let the system do the work.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-navy mb-4">Ready to implement this?</h3>
            <p className="text-gray-700 mb-6">
              Try Frostburn free for 30 days. No credit card required. See how automated invoicing and payment reminders transform your
              cash flow.
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
            Stop wasting time on admin work.
          </h2>
          <p className="text-white/80 mb-8">
            Get paid faster, schedule better, manage your HVAC business like a pro.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-navy px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Frostburn Free →
          </Link>
          <p className="text-white/40 text-xs mt-8">Created by Dragonwire.ai</p>
        </div>
      </div>
    </div>
  )
}
