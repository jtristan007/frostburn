import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingHeader, MarketingFooter } from '@/components/landing/marketing-chrome'
import { TEMPLATES } from '@/components/landing/template-page'

const TITLE = 'Free HVAC Templates: Invoice, Estimate, Maintenance Agreement & More | Frostburn'
const DESCRIPTION =
  'Free printable templates for HVAC and air conditioning contractors: invoice, estimate, maintenance agreement, tune-up checklist and late payment reminder emails. Fill in online, save as PDF.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/templates' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

export default function TemplatesIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: TEMPLATES.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: `https://frostburn.io/templates/${t.slug}`,
    })),
  }

  return (
    <div className="min-h-screen" style={{ background: '#05070f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <MarketingHeader />
      <main>
        <section className="max-w-4xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-10 text-center">
          <p className="font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3">
            Free HVAC templates
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight">
            Free templates for HVAC and air conditioning shops.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-mist max-w-2xl mx-auto">
            The paperwork every heating and cooling business needs. Fill them in right in your browser, then save as a
            PDF or print. Free, no sign-up.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-20">
          <div className="grid sm:grid-cols-2 gap-5">
            {TEMPLATES.map((t) => (
              <Link
                key={t.slug}
                href={`/templates/${t.slug}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-ice/40 transition-colors"
              >
                <h2 className="text-white font-semibold text-lg">{t.name} →</h2>
                <p className="mt-2 text-sm text-mist leading-relaxed">{t.blurb}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-ice/30 bg-ice/[0.06] p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              Rather not do paperwork at all?
            </h2>
            <p className="mt-3 text-mist max-w-2xl mx-auto">
              Frostburn sends invoices with online card payments, chases overdue invoices automatically and keeps every
              customer’s equipment history, built only for HVAC shops.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Try it free →
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
