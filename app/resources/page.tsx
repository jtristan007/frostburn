import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HVAC Business Resources & Guides | Frostburn',
  description:
    'Free guides and resources for HVAC contractors: invoicing tips, scheduling best practices, payment collection strategies, and business growth insights.',
}

const resources = [
  {
    title: 'The Contractor\'s Guide to Invoice Payment Recovery',
    excerpt: 'Stop chasing payments. Learn proven strategies for faster payment collection and reducing accounts receivable.',
    category: 'Invoicing',
    readTime: '8 min',
    slug: 'invoice-payment-recovery',
  },
  {
    title: 'HVAC Scheduling: Stop Double-Booking & No-Shows',
    excerpt: 'Reduce scheduling chaos with systems that keep your crew on task and eliminate coordination delays.',
    category: 'Scheduling',
    readTime: '6 min',
    slug: 'hvac-scheduling-best-practices',
  },
  {
    title: 'The Best HVAC Management Software for Small Contractors',
    excerpt: 'Compare invoicing, scheduling, and payment collection tools. Find the right software for your business.',
    category: 'Software Comparison',
    readTime: '10 min',
    slug: 'best-hvac-management-software',
  },
  {
    title: 'How to Get HVAC Clients to Pay Faster',
    excerpt: 'Practical tactics for accelerating cash flow and building better payment habits with your customer base.',
    category: 'Payments',
    readTime: '7 min',
    slug: 'get-hvac-clients-pay-faster',
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            HVAC Business Resources
          </h1>
          <p className="text-lg text-white/80">
            Free guides to help small HVAC contractors grow faster, manage better, and get paid on time.
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid gap-8">
          {resources.map((resource) => (
            <article key={resource.slug} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    {resource.category}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{resource.readTime} read</span>
              </div>
              <Link href={`/resources/blog/${resource.slug}`}>
                <h2 className="text-2xl font-bold text-navy hover:text-blue-600 transition-colors mb-2">
                  {resource.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{resource.excerpt}</p>
              <Link
                href={`/resources/blog/${resource.slug}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-50 py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to streamline your HVAC business?
          </h2>
          <p className="text-gray-600 mb-8">
            Frostburn automates invoicing, scheduling, and payment collection so you can focus on the work.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Free Trial →
          </Link>
        </div>
      </div>
    </div>
  )
}
