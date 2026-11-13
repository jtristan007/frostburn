import type { Metadata } from 'next'
import { TemplatePage, Sheet, CompanyBlock, LineItems, Totals, Field } from '@/components/landing/template-page'
import { TIER_PRICES } from '@/lib/stripe/plans'

const TITLE = 'Free HVAC Invoice Template (Printable & PDF) | Frostburn'
const DESCRIPTION =
  'Free printable HVAC and air conditioning invoice template. Fill it in online, save as PDF and send. Includes equipment details, parts and labor lines, payment terms and warranty note.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates/hvac-invoice-template' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://frostburn.io/templates/hvac-invoice-template' },
  twitter: { title: TITLE, description: DESCRIPTION },
}

const templateDoc = (
  <Sheet>
    <CompanyBlock docLabel="Invoice" docNumberLabel="Invoice #" />

    <div className="grid sm:grid-cols-3 gap-4 py-5 border-b border-slate-200">
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Bill to</div>
        <div><Field wide>Customer name</Field></div>
        <div><Field wide>Billing address</Field></div>
        <div><Field wide>Phone / email</Field></div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Service address</div>
        <div><Field wide>Same as billing, or job address</Field></div>
        <div className="mt-2">
          Service date: <Field>MM/DD/YYYY</Field>
        </div>
        <div>
          Technician: <Field>Name</Field>
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Payment due</div>
        <div>
          Due date: <Field>MM/DD/YYYY</Field>
        </div>
        <div>
          Terms: <Field>Due on receipt / Net 15</Field>
        </div>
      </div>
    </div>

    <div className="py-5 border-b border-slate-200">
      <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Equipment serviced</div>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
        <div>
          Unit type: <Field>AC / furnace / heat pump</Field>
        </div>
        <div>
          Make &amp; model: <Field wide> </Field>
        </div>
        <div>
          Serial #: <Field wide> </Field>
        </div>
        <div>
          Install date / age: <Field> </Field>
        </div>
      </div>
      <div className="mt-3">
        Work performed: <Field wide>Describe the problem found and the fix</Field>
      </div>
    </div>

    <div className="py-5">
      <LineItems
        rows={[
          'Diagnostic / service call',
          'Labor (hours)',
          'Part: e.g. run capacitor',
          'Part: e.g. contactor',
          'Refrigerant (lbs, type)',
          '',
        ]}
      />
      <Totals lines={['Subtotal', 'Tax', 'Total due']} />
    </div>

    <div className="grid sm:grid-cols-2 gap-5 pt-5 border-t border-slate-200 text-[12px] sm:text-[13px] break-inside-avoid">
      <div>
        <div className="font-semibold mb-1">How to pay</div>
        <Field wide>Card, check payable to Your Company, or pay online at…</Field>
        <div className="mt-2 text-slate-600">
          Payments not received by the due date may be subject to <Field>a late fee, if stated in your terms</Field>.
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1">Warranty</div>
        <Field wide>Parts: manufacturer warranty. Labor: 90 days on work performed.</Field>
      </div>
    </div>

    <p className="mt-6 text-center font-semibold">Thank you for your business!</p>
  </Sheet>
)

export default function HvacInvoiceTemplatePage() {
  return (
    <TemplatePage
      slug="hvac-invoice-template"
      eyebrow="Free HVAC invoice template"
      title="Free HVAC invoice template you can fill in and save as a PDF."
      intro="A clean invoice built for heating and air conditioning work: equipment details, parts and labor lines, payment terms and a warranty note. Fill it in right on this page, then save it as a PDF or print it."
      document={templateDoc}
      howTo={[
        {
          t: 'Add your company details',
          d: 'Tap the underlined fields at the top and type your company name, phone, email and license number. Your state may require the license number on invoices.',
        },
        {
          t: 'Fill in the customer and the job',
          d: 'Add who you are billing, the service address, the equipment you worked on and what you did. Model and serial numbers save time on the next call.',
        },
        {
          t: 'List parts and labor',
          d: 'One line per part or labor charge, with quantity and rate. Add tax if your state taxes HVAC parts or labor.',
        },
        {
          t: 'Save as PDF and send',
          d: 'Click “Save as PDF / Print”, choose “Save as PDF” as the printer, then email the file or print a copy for the customer.',
        },
      ]}
      tips={{
        heading: 'What every HVAC invoice should include',
        items: [
          {
            t: 'A due date, not just a date',
            d: 'A specific due date gives the customer a deadline. “Due on receipt” is easy to put off.',
          },
          {
            t: 'Equipment details',
            d: 'Unit type, make, model and serial number make warranty claims and the next service visit much easier.',
          },
          {
            t: 'Separate parts and labor',
            d: 'Customers question one big number. Itemized parts and labor lines answer most “why so much?” calls before they happen.',
          },
          {
            t: 'An easy way to pay',
            d: 'The more ways a customer can pay, the sooner you are paid. A card payment link beats waiting for a check.',
          },
        ],
      }}
      ctaHeading="Stop filling in invoices by hand."
      ctaPoints={[
        'Create invoices in seconds, tied to the customer and the job',
        'Customers pay by card from a secure link on every invoice',
        'Automatic reminder emails go out when an invoice is overdue',
        'Equipment history saved on every customer for the next visit',
        `Flat $${TIER_PRICES.starter}/month for 1–5 techs`,
      ]}
      faqs={[
        {
          q: 'Is this HVAC invoice template really free?',
          a: 'Yes. Fill it in on this page and save or print as many invoices as you like. No sign-up needed.',
        },
        {
          q: 'How do I save the invoice as a PDF?',
          a: 'Click “Save as PDF / Print”. In the print window, choose “Save as PDF” (or “Microsoft Print to PDF” on Windows) as the printer. On iPhone, use Share → Print, then pinch out on the preview to save it as a PDF.',
        },
        {
          q: 'What should an HVAC invoice include?',
          a: 'Your company name and contact details, license number, invoice number and date, a due date, the customer and service address, the equipment worked on, itemized parts and labor, tax, the total due, how to pay and your warranty terms.',
        },
        {
          q: 'Can I use this template for air conditioning and furnace work?',
          a: 'Yes. It works for AC repair, furnace and heat pump service, installs and maintenance visits. Change the line items to match the job.',
        },
      ]}
    />
  )
}
