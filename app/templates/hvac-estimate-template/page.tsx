import type { Metadata } from 'next'
import { TemplatePage, Sheet, CompanyBlock, Field } from '@/components/landing/template-page'
import { TIER_PRICES } from '@/lib/stripe/plans'

const TITLE = 'Free HVAC Estimate Template with Good/Better/Best Options | Frostburn'
const DESCRIPTION =
  'Free printable HVAC and air conditioning estimate (quote) template with good / better / best options, scope of work, terms and a customer signature line. Fill in online and save as PDF.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates/hvac-estimate-template' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/templates/hvac-estimate-template' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

const OPTIONS = [
  { name: 'Good', hint: 'e.g. repair / standard-efficiency replacement' },
  { name: 'Better', hint: 'e.g. higher-efficiency system, longer labor warranty' },
  { name: 'Best', hint: 'e.g. variable-speed system, smart thermostat, extended warranty' },
]

const templateDoc = (
  <Sheet>
    <CompanyBlock docLabel="Estimate" docNumberLabel="Estimate #" />

    <div className="grid sm:grid-cols-2 gap-4 py-5 border-b border-slate-200">
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Prepared for</div>
        <div><Field wide>Customer name</Field></div>
        <div><Field wide>Job address</Field></div>
        <div><Field wide>Phone / email</Field></div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Estimate details</div>
        <div>
          Prepared by: <Field>Name</Field>
        </div>
        <div>
          Valid until: <Field>MM/DD/YYYY (e.g. 30 days)</Field>
        </div>
      </div>
    </div>

    <div className="py-5 border-b border-slate-200">
      <div className="text-xs font-semibold uppercase text-slate-500 mb-2">What we found</div>
      <Field wide>Current equipment, its age and condition, and the problem the customer called about</Field>
      <div className="text-xs font-semibold uppercase text-slate-500 mt-4 mb-2">Scope of work</div>
      <Field wide>
        What’s included: removal and disposal, equipment, line set, pad, thermostat, permits, start-up and testing
      </Field>
    </div>

    <div className="py-5 border-b border-slate-200">
      <div className="text-xs font-semibold uppercase text-slate-500 mb-3">Your options</div>
      <div className="grid sm:grid-cols-3 gap-3">
        {OPTIONS.map((o) => (
          <div key={o.name} className="rounded-md border border-slate-300 p-3">
            <div className="font-bold text-base">{o.name}</div>
            <div className="mt-1 text-slate-600">
              <Field wide>{o.hint}</Field>
            </div>
            <div className="mt-2">
              Equipment: <Field> </Field>
            </div>
            <div>
              Warranty: <Field> </Field>
            </div>
            <div className="mt-2 font-semibold">
              Price: $<Field> </Field>
            </div>
            <div className="mt-2 text-[12px]">☐ I choose this option</div>
          </div>
        ))}
      </div>
    </div>

    <div className="py-5 border-b border-slate-200 text-[12px] sm:text-[13px] space-y-2">
      <div className="font-semibold">Terms</div>
      <div>
        Deposit: <Field>e.g. 30% to schedule</Field> · Balance due: <Field>on completion</Field>
      </div>
      <div>
        This estimate is based on the conditions found on the date above. Additional work found once the job starts
        (for example hidden duct or electrical problems) will be quoted before it is done.
      </div>
      <div>
        Financing: <Field wide>Available / not available</Field>
      </div>
    </div>

    <div className="pt-6 grid sm:grid-cols-2 gap-6">
      <div>
        <div className="border-b border-slate-400 h-8" />
        <div className="text-xs text-slate-500 mt-1">Customer signature</div>
      </div>
      <div>
        <div className="border-b border-slate-400 h-8" />
        <div className="text-xs text-slate-500 mt-1">Date</div>
      </div>
    </div>
  </Sheet>
)

export default function HvacEstimateTemplatePage() {
  return (
    <TemplatePage
      slug="hvac-estimate-template"
      eyebrow="Free HVAC estimate template"
      title="Free HVAC estimate template with good, better and best options."
      intro="Give customers a clear choice instead of one take-it-or-leave-it number. This estimate template covers what you found, the scope of work, three priced options, terms and a signature line."
      document={templateDoc}
      howTo={[
        {
          t: 'Describe what you found',
          d: 'Note the existing equipment, its age and the problem. It shows the customer you looked, and it protects you if conditions change.',
        },
        {
          t: 'Spell out the scope',
          d: 'List what’s included: removal, equipment, materials, permits, start-up. Anything not listed becomes a debate later.',
        },
        {
          t: 'Price three options',
          d: 'Fill in a good, better and best option. Leave one blank if it doesn’t apply to the job.',
        },
        {
          t: 'Save as PDF and get it signed',
          d: 'Save it as a PDF and email it, or print it and have the customer tick an option and sign on the spot.',
        },
      ]}
      tips={{
        heading: 'Estimates that close',
        items: [
          {
            t: 'Always give options',
            d: 'With three options, the question becomes “which one?” instead of “yes or no?”.',
          },
          {
            t: 'Put an expiry date on it',
            d: 'Equipment prices change. A “valid until” date protects your margin and gives the customer a reason to decide.',
          },
          {
            t: 'Follow up within two days',
            d: 'Most estimates that never close were never followed up. A quick call or text the next day helps.',
          },
          {
            t: 'Get the deposit terms in writing',
            d: 'State the deposit and when the balance is due before the job starts, not after.',
          },
        ],
      }}
      ctaHeading="Send estimates customers can approve online."
      ctaPoints={[
        'Build quotes from your own pricing book in a few clicks',
        'Send the quote as a link; the customer approves or declines it online',
        'Turn the job into an invoice and get paid by card online',
        'Automatic reminders when an invoice goes overdue',
        `Flat $${TIER_PRICES.starter}/month for 1–5 techs`,
      ]}
      faqs={[
        {
          q: 'What is the difference between an HVAC estimate and a quote?',
          a: 'People use the words interchangeably. In practice an estimate is an approximate price that can change, while a quote is a firm price for a defined scope. Whichever you call it, write down the scope and how long the price is valid.',
        },
        {
          q: 'Why use good, better and best options?',
          a: 'Giving three options lets the customer choose based on budget and priorities instead of a single yes or no, and many choose the middle option.',
        },
        {
          q: 'How long should an HVAC estimate be valid?',
          a: 'Many contractors use 15 to 30 days because equipment and refrigerant prices change. Pick what suits your suppliers and write it on the estimate.',
        },
        {
          q: 'Is this estimate template free?',
          a: 'Yes. Fill it in on this page and save it as a PDF or print it. No sign-up needed.',
        },
      ]}
    />
  )
}
