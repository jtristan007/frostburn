import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HVAC Scheduling Best Practices: Stop Double-Booking & No-Shows | Frostburn',
  description:
    'Eliminate scheduling chaos with proven tactics. Reduce double-bookings, no-shows, and crew confusion. Keep your team on task.',
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
            HVAC Scheduling: Stop Double-Booking & No-Shows
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Keep your crew on task and eliminate the chaos of last-minute schedule changes and forgotten callbacks.
          </p>
          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>6 min read</span>
            <span>•</span>
            <span>Posted September 22, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="text-gray-800 space-y-6">
          <p className="text-lg text-gray-700">
            Monday morning. 7 AM. Your crew is ready to head out. Then the chaos starts:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 bg-red-50 p-4 rounded">
            <li>Tech A: "Wait, is Johnson or Rivera first today?"</li>
            <li>Tech B: "I thought Rivera was tomorrow. Now I'm heading the wrong direction."</li>
            <li>Your phone: Missed call from a client asking where the crew is</li>
            <li>Your brain: "I need to figure out which jobs got done and which are rescheduled."</li>
          </ul>
          <p className="text-gray-700 mt-4">
            This is the reality for contractors without a solid scheduling system. And it's costing you money, frustrating your crew, and damaging client trust.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-8">Why HVAC Scheduling Is Harder Than Other Trades</h2>
          <p className="text-gray-700">
            HVAC jobs aren't predictable:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Variable duration:</strong> A simple tune-up is 45 minutes. A full system install is 8 hours.</li>
            <li><strong>Emergency calls:</strong> A furnace dies in January. You need to slot in emergency repairs.</li>
            <li><strong>Follow-ups:</strong> Customer calls back mid-week about a filter. Now you're juggling callbacks.</li>
            <li><strong>Seasonal swings:</strong> Spring and fall are slammed. Winter and summer are quieter. Demand fluctuates wildly.</li>
            <li><strong>Multiple technicians:</strong> You can't just book one tech. You need to balance workload across the crew.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mt-8">The Real Cost of Bad Scheduling</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-semibold text-navy mb-2">1. Lost Revenue from No-Shows</h3>
              <p className="text-gray-700">
                A customer forgets the appointment. Your crew shows up and wastes a service call. That's $150–300 in lost revenue and fuel.
              </p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-semibold text-navy mb-2">2. Crew Inefficiency</h3>
              <p className="text-gray-700">
                Confusion about the schedule means wasted time (and fuel) driving to the wrong location or in the wrong order.
              </p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-semibold text-navy mb-2">3. Missed Upsell Opportunities</h3>
              <p className="text-gray-700">
                If your crew doesn't have access to customer equipment history, they miss maintenance opportunities. "Oh, your furnace filter is dirty—here's what I can do."
              </p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-semibold text-navy mb-2">4. Client Frustration</h3>
              <p className="text-gray-700">
                Rescheduled appointments, no-shows, and confusion breed bad reviews and lost referrals.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">6 Tactics to Fix Your Scheduling</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">1. Single Source of Truth</h3>
              <p className="text-gray-700 mb-3">
                Stop managing schedules in your head, texts, and a notebook. Use one system where the entire crew can see the week ahead.
              </p>
              <p className="text-gray-700">
                <strong>Pro tip:</strong> Use a system your crew can access on any device—phone, tablet, computer. No app install required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">2. Job Details at a Glance</h3>
              <p className="text-gray-700 mb-3">
                Each scheduled job should show:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Customer name and address</li>
                <li>Phone number</li>
                <li>What equipment they have (furnace, AC unit, etc.)</li>
                <li>When they were last serviced</li>
                <li>Any active maintenance agreements</li>
                <li>Job type (tune-up, repair, emergency, etc.)</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Your tech shows up knowing the full context. That's professionalism. That's upsell opportunities.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">3. Automatic Appointment Reminders</h3>
              <p className="text-gray-700 mb-3">
                Send clients a reminder 24 hours before the appointment. Reduces no-shows by 40–60%.
              </p>
              <p className="text-gray-700">
                <strong>Formula:</strong> "Hi [Name], this is a reminder that we're scheduled to service your HVAC system tomorrow at 2 PM. We'll be at [address]. Reply or call if you need to reschedule."
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">4. Realistic Timeouts</h3>
              <p className="text-gray-700 mb-3">
                Don't pack your schedule so tight that one job running 30 minutes over throws the entire day into chaos.
              </p>
              <p className="text-gray-700">
                Build in 15-30 minute buffer between jobs for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Travel time between locations</li>
                <li>Unexpected findings (extra parts needed, etc.)</li>
                <li>Invoice and payment</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">5. Route Optimization</h3>
              <p className="text-gray-700 mb-3">
                Don't book jobs randomly. Group them geographically to minimize drive time.
              </p>
              <p className="text-gray-700">
                <strong>Example:</strong> All three jobs on Tuesday are in the North End. Tech knows the route before leaving the shop.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-navy mb-3">6. Emergency Slots Reserved</h3>
              <p className="text-gray-700 mb-3">
                Always keep 1–2 slots open for emergency calls. During heating season (winter) and cooling season (summer), keep them clear.
              </p>
              <p className="text-gray-700">
                This protects your revenue and keeps clients happy when their system dies mid-season.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-8">The Result: A Smooth Schedule</h2>
          <p className="text-gray-700">
            Contractors who implement these tactics report:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>No-shows reduced by 40–60%</li>
            <li>Crew efficiency up 20–30% (less wasted drive time)</li>
            <li>More completed jobs per day</li>
            <li>Better client satisfaction (fewer reschedules)</li>
            <li>More upsell opportunities (crew has customer history)</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mt-8">How Frostburn Solves This</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 pl-6 py-4 my-6">
            <p className="text-gray-800 mb-4">
              Frostburn gives you a centralized scheduling system built for HVAC:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Visual calendar:</strong> See the week at a glance, identify bottlenecks</li>
              <li><strong>Full job details:</strong> Equipment, customer history, maintenance agreements all on one screen</li>
              <li><strong>Automatic reminders:</strong> Send appointment confirmations to clients</li>
              <li><strong>Mobile access:</strong> Crew sees schedule on any device—no app required</li>
              <li><strong>Notes integration:</strong> Technicians add notes mid-job. Next tech or follow-up has full context</li>
            </ul>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-navy mb-4">Stop the scheduling chaos</h3>
            <p className="text-gray-700 mb-6">
              Try Frostburn free for 30 days. Schedule your first week of jobs and see how it feels to have your crew aligned and your schedule running smoothly.
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
            Your crew knows exactly where to be and what to do.
          </h2>
          <p className="text-white/80 mb-8">
            No more confusion. No more double-bookings. Just smooth scheduling.
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
