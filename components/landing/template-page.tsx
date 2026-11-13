import Link from 'next/link'
import type { ReactNode } from 'react'
import { MarketingHeader, MarketingFooter } from '@/components/landing/marketing-chrome'
import { PrintButton } from '@/components/landing/template-tools'
import { TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

// Shared layout for the free template pages under /templates. Each page
// supplies the template document itself plus its copy. The document sits in
// a `.print-doc` sheet: globals.css prints only that sheet, so "Save as PDF"
// gives a clean one-document PDF. Every Frostburn claim on these pages must
// match what the app actually does.

export type Item = { t: string; d: string }
export type Faq = { q: string; a: string }

export const TEMPLATES = [
  {
    slug: 'hvac-invoice-template',
    name: 'HVAC invoice template',
    blurb: 'Printable invoice with equipment, parts and labor lines, payment terms and warranty note.',
  },
  {
    slug: 'hvac-estimate-template',
    name: 'HVAC estimate template',
    blurb: 'Good / better / best options, scope of work and a customer sign-off line.',
  },
  {
    slug: 'hvac-maintenance-agreement-template',
    name: 'HVAC maintenance agreement template',
    blurb: 'Two-visit service plan contract: what’s covered, member benefits, renewal and cancellation.',
  },
  {
    slug: 'hvac-maintenance-checklist',
    name: 'HVAC maintenance checklist',
    blurb: 'Cooling, heating and heat pump tune-up checklist with readings to record.',
  },
  {
    slug: 'hvac-late-payment-reminder',
    name: 'Late payment reminder emails',
    blurb: 'Four ready-to-send reminders for overdue HVAC invoices, from friendly to final notice.',
  },
] as const

export type TemplateSlug = (typeof TEMPLATES)[number]['slug']

const eyebrowCls = 'font-mono text-[11px] font-medium text-ice uppercase tracking-[0.14em] mb-3'
const h2 = 'text-2xl sm:text-3xl font-display font-bold text-white'

// A fill-in field: tap/click to type, prints as text on a dotted line.
export function Field({ children, wide, size }: { children?: ReactNode; wide?: boolean; size?: string }) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      className={`inline-block align-bottom border-b border-dotted border-slate-400 outline-none focus:bg-sky-50 px-0.5 ${
        size ?? (wide ? 'min-w-[12rem] max-w-full' : 'min-w-[6rem]')
      } text-slate-500 focus:text-slate-900`}
    >
      {children}
    </span>
  )
}

export function TemplatePage(p: {
  slug: TemplateSlug
  eyebrow: string
  title: string
  intro: string
  printable?: boolean
  document: ReactNode
  howTo: Item[]
  tips?: { heading: string; items: Item[] }
  ctaHeading: string
  ctaPoints: string[]
  faqs: Faq[]
}) {
  const printable = p.printable ?? true
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: p.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Frostburn', item: 'https://frostburn.io' },
        { '@type': 'ListItem', position: 2, name: 'Free HVAC templates', item: 'https://frostburn.io/templates' },
        {
          '@type': 'ListItem',
          position: 3,
          name: TEMPLATES.find((t) => t.slug === p.slug)!.name,
          item: `https://frostburn.io/templates/${p.slug}`,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#05070f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="print:hidden">
        <MarketingHeader />
      </div>

      <main>
        <section className="max-w-4xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-10 text-center print:hidden">
          <nav aria-label="Breadcrumb" className="text-xs text-mist mb-6">
            <Link href="/templates" className="hover:text-white">
              Free HVAC templates
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">{TEMPLATES.find((t) => t.slug === p.slug)!.name}</span>
          </nav>
          <p className={eyebrowCls}>{p.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight">{p.title}</h1>
          <p className="mt-5 text-base sm:text-lg text-mist max-w-2xl mx-auto">{p.intro}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {printable && <PrintButton />}
            <a
              href="#template"
              className="font-semibold bg-white/10 text-white border border-white/15 px-5 py-3 rounded-lg hover:bg-white/15 transition-colors"
            >
              {printable ? 'See the template ↓' : 'See the templates ↓'}
            </a>
          </div>
          <p className="mt-4 text-xs text-mist">
            Free · No sign-up · {printable ? 'Tap any underlined field to fill it in before saving' : 'Copy, paste, send'}
          </p>
        </section>

        <section id="template" className="px-3 sm:px-6 pb-16 scroll-mt-6 print:p-0">
          <div className="max-w-3xl mx-auto">{p.document}</div>
          {printable && (
            <div className="max-w-3xl mx-auto mt-6 flex justify-center print:hidden">
              <PrintButton />
            </div>
          )}
        </section>

        <div className="print:hidden">
          <section className="border-t border-white/10 py-16">
            <div className="max-w-4xl mx-auto px-5 sm:px-6">
              <p className={eyebrowCls}>How to use it</p>
              <h2 className={h2}>Fill it in, save it, send it.</h2>
              <ol className="mt-8 space-y-5">
                {p.howTo.map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <span className="flex-none w-8 h-8 rounded-full bg-ice/15 text-ice font-mono font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-white font-semibold">{s.t}</h3>
                      <p className="mt-1 text-sm text-mist leading-relaxed">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {p.tips && (
            <section className="border-t border-white/10 py-16">
              <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <p className={eyebrowCls}>Tips</p>
                <h2 className={h2}>{p.tips.heading}</h2>
                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                  {p.tips.items.map((t) => (
                    <div key={t.t} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <h3 className="text-white font-semibold">{t.t}</h3>
                      <p className="mt-2 text-sm text-mist leading-relaxed">{t.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-white/10 py-16">
            <div className="max-w-4xl mx-auto px-5 sm:px-6">
              <div className="rounded-2xl border border-ice/30 bg-ice/[0.06] p-6 sm:p-10">
                <p className={eyebrowCls}>Skip the paperwork</p>
                <h2 className={h2}>{p.ctaHeading}</h2>
                <ul className="mt-6 space-y-3">
                  {p.ctaPoints.map((pt) => (
                    <li key={pt} className="flex gap-3 text-gray-200 text-sm sm:text-base">
                      <span className="text-ice">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="text-center font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
                  >
                    Try Frostburn free for {TRIAL_PERIOD_DAYS} days →
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-center font-semibold bg-white/10 text-white border border-white/15 px-6 py-3 rounded-lg hover:bg-white/15 transition-colors"
                  >
                    See pricing
                  </Link>
                </div>
                <p className="mt-3 text-xs text-mist">No credit card required · Built only for HVAC shops</p>
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 py-16">
            <div className="max-w-4xl mx-auto px-5 sm:px-6">
              <p className={eyebrowCls}>Questions</p>
              <h2 className={h2}>Frequently asked</h2>
              <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                {p.faqs.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="cursor-pointer list-none flex justify-between gap-4 text-white font-medium">
                      {f.q}
                      <span className="text-ice transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm text-mist leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 py-16">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
              <p className={eyebrowCls}>More free templates</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {TEMPLATES.filter((t) => t.slug !== p.slug).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/templates/${t.slug}`}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-ice/40 transition-colors"
                  >
                    <h3 className="text-white font-semibold">{t.name} →</h3>
                    <p className="mt-1 text-sm text-mist">{t.blurb}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <MarketingFooter />
        </div>
      </main>
    </div>
  )
}

// The white "paper" every printable template sits on.
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="print-doc bg-white text-slate-900 rounded-lg shadow-2xl p-5 sm:p-10 text-[13px] sm:text-sm leading-relaxed print:shadow-none print:rounded-none print:p-0">
      {children}
    </div>
  )
}

// Company header block shared by invoice, estimate and agreement.
export function CompanyBlock({ docLabel, docNumberLabel }: { docLabel: string; docNumberLabel: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="space-y-1">
        <div className="text-lg font-bold text-slate-900">
          <Field wide>Your Company Name</Field>
        </div>
        <div><Field wide>Street address, City, State ZIP</Field></div>
        <div>
          Phone: <Field>(555) 555-5555</Field>
        </div>
        <div>
          Email: <Field wide>office@yourcompany.com</Field>
        </div>
        <div>
          License #: <Field>Your license #</Field>
        </div>
      </div>
      <div className="sm:text-right space-y-1">
        <div className="text-2xl font-bold tracking-wide text-slate-900 uppercase">{docLabel}</div>
        <div>
          {docNumberLabel}: <Field>1001</Field>
        </div>
        <div>
          Date: <Field>MM/DD/YYYY</Field>
        </div>
      </div>
    </div>
  )
}

// Line-items table. Fixed column widths so all four columns fit on a phone
// (390px) without sideways scrolling.
export function LineItems({ rows }: { rows: string[] }) {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <colgroup>
        <col className="w-[46%]" />
        <col className="w-[12%]" />
        <col className="w-[20%]" />
        <col className="w-[22%]" />
      </colgroup>
      <thead>
        <tr className="bg-slate-100 text-slate-700">
          <th className="p-1.5 sm:p-2 font-semibold">Description</th>
          <th className="p-1.5 sm:p-2 font-semibold text-right">Qty</th>
          <th className="p-1.5 sm:p-2 font-semibold text-right">Rate</th>
          <th className="p-1.5 sm:p-2 font-semibold text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-slate-200">
            <td className="p-1.5 sm:p-2">
              <Field size="block w-full min-h-[1.5em]">{r}</Field>
            </td>
            <td className="p-1.5 sm:p-2 text-right">
              <Field size="block w-full min-h-[1.5em]"> </Field>
            </td>
            <td className="p-1.5 sm:p-2 text-right">
              <Field size="block w-full min-h-[1.5em]"> </Field>
            </td>
            <td className="p-1.5 sm:p-2 text-right">
              <Field size="block w-full min-h-[1.5em]"> </Field>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Totals({ lines }: { lines: string[] }) {
  return (
    <div className="mt-4 flex justify-end">
      <table className="text-right">
        <tbody>
          {lines.map((l, i) => (
            <tr key={l} className={i === lines.length - 1 ? 'font-bold text-base border-t border-slate-300' : ''}>
              <td className="pr-4 py-1">{l}</td>
              <td className="py-1">
                $<Field size="min-w-[5rem]"> </Field>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
