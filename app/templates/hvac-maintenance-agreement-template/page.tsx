import type { Metadata } from 'next'
import { TemplatePage, Sheet, CompanyBlock, Field } from '@/components/landing/template-page'
import { TIER_PRICES } from '@/lib/stripe/plans'

const TITLE = 'Free HVAC Maintenance Agreement Template (Service Plan Contract) | Frostburn'
const DESCRIPTION =
  'Free HVAC maintenance agreement template for residential service plans: two tune-ups a year, member benefits, price, renewal and cancellation terms, signatures. Fill in online and save as PDF.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates/hvac-maintenance-agreement-template' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://frostburn.io/templates/hvac-maintenance-agreement-template',
  },
  twitter: { title: TITLE, description: DESCRIPTION },
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-slate-200">
      <div className="font-semibold mb-1">
        {n}. {title}
      </div>
      <div className="space-y-1 text-slate-800">{children}</div>
    </div>
  )
}

const templateDoc = (
  <Sheet>
    <CompanyBlock docLabel="Maintenance Agreement" docNumberLabel="Agreement #" />

    <div className="grid sm:grid-cols-2 gap-4 py-5 border-b border-slate-200">
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Customer</div>
        <div><Field wide>Customer name</Field></div>
        <div><Field wide>Service address</Field></div>
        <div><Field wide>Phone / email</Field></div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Plan</div>
        <div>
          Plan name: <Field>e.g. Comfort Club</Field>
        </div>
        <div>
          Start date: <Field>MM/DD/YYYY</Field>
        </div>
        <div>
          Term: <Field>12 months</Field>
        </div>
        <div>
          Systems covered: <Field wide>e.g. 1 AC + 1 furnace</Field>
        </div>
      </div>
    </div>

    <Section n={1} title="Scheduled maintenance visits">
      <div>
        <Field wide>Spring cooling tune-up</Field> and <Field wide>fall heating tune-up</Field> per covered system,
        each following our written maintenance checklist.
      </div>
    </Section>

    <Section n={2} title="Member benefits">
      <div>☐ Priority scheduling ahead of non-members</div>
      <div>
        ☐ <Field>__%</Field> discount on repair parts and labor
      </div>
      <div>
        ☐ Reduced or waived diagnostic fee: <Field wide> </Field>
      </div>
      <div>
        ☐ Other: <Field wide> </Field>
      </div>
    </Section>

    <Section n={3} title="Price and payment">
      <div>
        $<Field> </Field> per year, or $<Field> </Field> per month, payable by <Field wide>card on file / invoice</Field>.
      </div>
    </Section>

    <Section n={4} title="Not covered">
      <div>
        Repairs, replacement parts, refrigerant, filters (unless stated), ductwork, and damage from misuse, power
        surges, floods or lack of access are not included and will be quoted separately. <Field wide>Add or remove items</Field>
      </div>
    </Section>

    <Section n={5} title="Renewal and cancellation">
      <div>
        This agreement <Field>renews / does not renew</Field> automatically at the end of the term.{' '}
        <Field wide>We will remind you before it renews.</Field> Either party may cancel with{' '}
        <Field>30 days</Field> written notice. <Field wide>Refund terms for unused visits</Field>.
      </div>
    </Section>

    <Section n={6} title="Access">
      <div>
        The customer agrees to provide safe access to the equipment for scheduled visits. Missed appointments may be
        rescheduled once at no charge.
      </div>
    </Section>

    <div className="pt-6 grid sm:grid-cols-2 gap-6">
      <div>
        <div className="border-b border-slate-400 h-8" />
        <div className="text-xs text-slate-500 mt-1">Customer signature &amp; date</div>
      </div>
      <div>
        <div className="border-b border-slate-400 h-8" />
        <div className="text-xs text-slate-500 mt-1">Company representative &amp; date</div>
      </div>
    </div>
  </Sheet>
)

export default function HvacMaintenanceAgreementTemplatePage() {
  return (
    <TemplatePage
      slug="hvac-maintenance-agreement-template"
      eyebrow="Free HVAC maintenance agreement template"
      title="Free HVAC maintenance agreement template for your service plan."
      intro="Recurring maintenance plans smooth out the slow seasons. This template covers the visits, member benefits, price, what’s not covered, renewal and cancellation, and signatures. Edit it to match your plan."
      document={templateDoc}
      howTo={[
        {
          t: 'Name your plan and set the term',
          d: 'Give the plan a name customers remember, the start date and how long it runs. Twelve months with two visits is the most common setup.',
        },
        {
          t: 'Pick your member benefits',
          d: 'Tick the benefits you actually offer and fill in the numbers. Only promise what your team can deliver in peak season.',
        },
        {
          t: 'Set the price and renewal terms',
          d: 'Choose annual or monthly pricing and say clearly whether the plan renews automatically and how to cancel.',
        },
        {
          t: 'Save, sign and keep a copy',
          d: 'Save it as a PDF and email it, or print two copies so you and the customer each keep a signed one.',
        },
      ]}
      tips={{
        heading: 'Before you sell your first plan',
        items: [
          {
            t: 'Check your state’s rules',
            d: 'Some states have rules for automatically renewing contracts and service agreements, such as reminder notices before renewal. This template is a starting point, not legal advice; have it reviewed for your state.',
          },
          {
            t: 'Track every visit that’s due',
            d: 'A plan only works if both visits actually happen. Keep a list of members and when each tune-up is due.',
          },
          {
            t: 'Use a written checklist',
            d: 'Members should get the same thorough visit every time. Our free maintenance checklist is a good base.',
          },
          {
            t: 'Make renewal easy',
            d: 'Remind members before the plan renews. It keeps trust high and cancellations low.',
          },
        ],
      }}
      ctaHeading="Keep track of every maintenance agreement automatically."
      ctaPoints={[
        'See who’s on a plan, what’s due and what each agreement is worth over the year (Growth plan)',
        'Filter and warranty alerts before customers call someone else (Growth plan)',
        'Equipment history saved on every customer',
        'Invoices with online card payments and automatic overdue reminders on every plan',
        `Starter $${TIER_PRICES.starter}/month for 1–5 techs; Growth $${TIER_PRICES.growth}/month for 6–15 techs`,
      ]}
      faqs={[
        {
          q: 'What should an HVAC maintenance agreement include?',
          a: 'The customer and service address, which systems are covered, how many visits and what each includes, member benefits, the price and how it is paid, what is not covered, the term, renewal and cancellation terms, and signatures.',
        },
        {
          q: 'How much should I charge for an HVAC maintenance plan?',
          a: 'It depends on your market, labor cost and how many systems are covered. Work out what two visits cost you in time and travel, add the value of your member discounts, and price above that.',
        },
        {
          q: 'Is this a legally binding contract?',
          a: 'It is a sample to help you write your own. Laws on service contracts and automatic renewal vary by state, so have your final version reviewed before you use it. This page is not legal advice.',
        },
        {
          q: 'Is the template free?',
          a: 'Yes. Fill it in on this page and save it as a PDF or print it. No sign-up needed.',
        },
      ]}
    />
  )
}
