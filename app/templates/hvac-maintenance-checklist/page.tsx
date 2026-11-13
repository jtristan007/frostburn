import type { Metadata } from 'next'
import { TemplatePage, Sheet, Field } from '@/components/landing/template-page'
import { TIER_PRICES } from '@/lib/stripe/plans'

const TITLE = 'Free HVAC Maintenance Checklist (Printable Tune-Up Checklist) | Frostburn'
const DESCRIPTION =
  'Free printable HVAC maintenance checklist for AC, furnace and heat pump tune-ups, with the readings to record: temperature split, amp draw, capacitor, pressures, gas pressure and CO. Save as PDF.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates/hvac-maintenance-checklist' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/templates/hvac-maintenance-checklist' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: 'Every visit',
    items: [
      'Check / replace air filter (note size)',
      'Check thermostat operation and settings',
      'Inspect and tighten electrical connections',
      'Inspect condensate drain, trap and pan; flush drain line',
      'Check blower wheel, motor and belt (if any)',
      'Inspect accessible ductwork and connections for leaks',
    ],
  },
  {
    title: 'Cooling (AC / heat pump in cooling)',
    items: [
      'Clean outdoor condenser coil; clear debris around unit',
      'Inspect indoor evaporator coil',
      'Test capacitor(s) against rating',
      'Inspect contactor for pitting',
      'Measure compressor and condenser fan amp draw',
      'Check refrigerant pressures, superheat / subcooling',
      'Measure supply and return temperature (temperature split)',
      'Check for oil stains / signs of refrigerant leaks',
    ],
  },
  {
    title: 'Heating (gas furnace)',
    items: [
      'Inspect heat exchanger for cracks or corrosion',
      'Inspect and clean burners',
      'Clean flame sensor; check igniter',
      'Check gas pressure against manufacturer spec',
      'Test limit and safety switches',
      'Inspect inducer motor and pressure switch',
      'Inspect flue / venting for blockage and proper slope',
      'Test for carbon monoxide',
    ],
  },
  {
    title: 'Heat pump',
    items: [
      'Test defrost cycle',
      'Check reversing valve operation (heat and cool modes)',
      'Check auxiliary / emergency heat operation',
    ],
  },
]

const READINGS = [
  'Return air temp',
  'Supply air temp',
  'Temperature split',
  'Compressor amps',
  'Condenser fan amps',
  'Capacitor (µF, rated / measured)',
  'Suction / discharge pressure',
  'Superheat / subcooling',
  'Gas pressure (in. w.c.)',
  'CO reading (ppm)',
]

const templateDoc = (
  <Sheet>
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <div className="text-lg font-bold">
          <Field wide>Your Company Name</Field>
        </div>
        <div className="text-xl font-bold uppercase tracking-wide mt-1">HVAC Maintenance Checklist</div>
      </div>
      <div className="sm:text-right space-y-1">
        <div>
          Date: <Field>MM/DD/YYYY</Field>
        </div>
        <div>
          Technician: <Field>Name</Field>
        </div>
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 py-4 border-b border-slate-200">
      <div>
        Customer: <Field wide> </Field>
      </div>
      <div>
        Address: <Field wide> </Field>
      </div>
      <div>
        Equipment: <Field wide>Make / model</Field>
      </div>
      <div>
        Serial #: <Field wide> </Field>
      </div>
    </div>

    {GROUPS.map((g) => (
      <div key={g.title} className="py-3 border-b border-slate-200 break-inside-avoid">
        <div className="font-semibold mb-2">{g.title}</div>
        <ul className="space-y-1.5">
          {g.items.map((it) => (
            <li key={it} className="flex gap-2 items-start">
              <span className="inline-block w-4 h-4 mt-0.5 border border-slate-500 rounded-sm flex-none" />
              <span className="flex-1">{it}</span>
              <span className="hidden sm:inline">
                <Field>notes</Field>
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}

    <div className="py-3 border-b border-slate-200 break-inside-avoid">
      <div className="font-semibold mb-2">Readings</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {READINGS.map((r) => (
          <div key={r} className="flex justify-between gap-2">
            <span>{r}</span>
            <Field> </Field>
          </div>
        ))}
      </div>
    </div>

    <div className="pt-4">
      <div className="font-semibold mb-1">Recommendations for the customer</div>
      <Field wide>Repairs recommended, parts nearing end of life, next visit date</Field>
    </div>
  </Sheet>
)

export default function HvacMaintenanceChecklistPage() {
  return (
    <TemplatePage
      slug="hvac-maintenance-checklist"
      eyebrow="Free HVAC maintenance checklist"
      title="Free HVAC maintenance checklist for every tune-up."
      intro="A one-page tune-up checklist for air conditioners, gas furnaces and heat pumps, with space for the readings that matter. Print a stack for the truck or save a filled-in copy as a PDF for the customer."
      document={templateDoc}
      howTo={[
        {
          t: 'Add your company name',
          d: 'Tap the field at the top and type your company name so every printed copy is branded.',
        },
        {
          t: 'Print a stack for the truck',
          d: 'Click “Save as PDF / Print” and print blank copies, or fill one in on a tablet during the visit.',
        },
        {
          t: 'Record the readings',
          d: 'Write down the numbers, not just ticks. Readings over time show a failing part before it fails.',
        },
        {
          t: 'Leave a copy with the customer',
          d: 'A completed checklist shows the customer what they paid for, and it is the best way to sell the repair you recommended.',
        },
      ]}
      tips={{
        heading: 'Getting more out of every tune-up',
        items: [
          {
            t: 'Follow the manufacturer’s specs',
            d: 'This checklist covers common items. Always use the equipment manufacturer’s procedures and specifications for the unit in front of you.',
          },
          {
            t: 'Keep the history',
            d: 'Comparing this year’s amp draw or temperature split with last year’s is how you spot a problem early.',
          },
          {
            t: 'Recommend, don’t pressure',
            d: 'Note what is wearing out and when it should be looked at again. Customers trust techs who show their readings.',
          },
          {
            t: 'Book the next visit before you leave',
            d: 'Maintenance customers who are booked for the next season are far more likely to stay with you.',
          },
        ],
      }}
      ctaHeading="Keep every customer’s equipment history in one place."
      ctaPoints={[
        'Unit type, model, serial, install date, warranty expiry and filter due date on every customer',
        'Maintenance agreement tracking so no tune-up is missed (Growth plan)',
        'Scheduling and a morning briefing with today’s jobs',
        'Invoices with online card payments and automatic overdue reminders',
        `Flat $${TIER_PRICES.starter}/month for 1–5 techs`,
      ]}
      faqs={[
        {
          q: 'What is included in an HVAC tune-up?',
          a: 'A typical tune-up includes checking the filter and thermostat, inspecting electrical connections, cleaning coils, testing capacitors, measuring amp draw and refrigerant pressures, checking the condensate drain and, for furnaces, inspecting burners, the heat exchanger, venting and safety controls.',
        },
        {
          q: 'How often should HVAC maintenance be done?',
          a: 'Most manufacturers and contractors recommend a cooling tune-up in spring and a heating tune-up in fall, so twice a year for a system that heats and cools. Check the manufacturer’s recommendation for the specific equipment.',
        },
        {
          q: 'Can I use this checklist for commercial units?',
          a: 'It is written for residential split systems, furnaces and heat pumps. Commercial rooftop units have additional items, so add them to your copy.',
        },
        {
          q: 'Is this checklist free?',
          a: 'Yes. Print as many copies as you need. No sign-up needed.',
        },
      ]}
    />
  )
}
