import Link from 'next/link'
import { Logo } from '@/components/logo'

export const metadata = { title: 'Privacy Policy — Frostburn' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-5">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/">
            <Logo className="h-8" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-bold text-navy mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated August 24, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy [&_h2]:mb-2 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_li]:mt-1">
          <section>
            <p>
              Frostburn (&quot;we,&quot; &quot;us&quot;) is operated by Julian Tristan. This policy explains
              what we collect, why, and how it&apos;s handled when you use frostburn.io (the
              &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2>1. Information we collect</h2>
            <p>
              <strong>Account information</strong> — your name, email, company name, and password, when you
              sign up.
            </p>
            <p>
              <strong>Business data you enter</strong> — your customers&apos; names and contact details,
              equipment records, job and service history, quotes, agreements, and invoices. This is your
              data; we store it on your behalf to operate the Service.
            </p>
            <p>
              <strong>Payment information</strong> — handled entirely by Stripe, our payment processor. We
              never see or store your card number.
            </p>
            <p>
              <strong>Usage data</strong> — basic technical logs (e.g. request timestamps, error logs)
              needed to run and troubleshoot the Service.
            </p>
          </section>

          <section>
            <h2>2. How we use it</h2>
            <ul className="list-disc pl-5">
              <li>To provide, maintain, and improve the Service</li>
              <li>To process payments and manage your subscription</li>
              <li>To send transactional email — welcome messages, invoice reminders, and your morning briefing</li>
              <li>To respond to support requests</li>
              <li>To answer questions you ask the in-app AI Assistant, using your own account&apos;s data as context</li>
            </ul>
            <p>We do not sell your data, or your customers&apos; data, to anyone.</p>
          </section>

          <section>
            <h2>3. Third parties we share data with</h2>
            <p>We use a small number of subprocessors to run Frostburn. Each only sees what it needs to do its job:</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Supabase</strong> — hosts our database and handles authentication. Your account and
                business data lives here.
              </li>
              <li>
                <strong>Stripe</strong> — processes subscription payments.
              </li>
              <li>
                <strong>Resend</strong> — delivers transactional email on our behalf.
              </li>
              <li>
                <strong>Anthropic</strong> — powers the in-app AI Assistant. When you ask it a question, a
                snapshot of your account&apos;s relevant data (e.g. overdue invoices, upcoming renewals,
                today&apos;s jobs) is sent to Anthropic&apos;s API to generate the answer. It is not used to
                train Anthropic&apos;s models.
              </li>
              <li>
                <strong>Vercel</strong> — hosts the application itself.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Data retention</h2>
            <p>
              We keep your data for as long as your account is active. If you close your account, we delete
              or anonymize your data within a reasonable period, except where we&apos;re required to retain
              records (e.g. billing history) for legal or accounting purposes.
            </p>
          </section>

          <section>
            <h2>5. Security</h2>
            <p>
              Your data is stored in a database with row-level security, meaning each Frostburn account can
              only access its own records — never another company&apos;s. Data is encrypted in transit.
            </p>
          </section>

          <section>
            <h2>6. Your rights</h2>
            <p>
              You can access, correct, export, or delete your account&apos;s data at any time from within
              the Service, or by emailing us at the address below. If you&apos;re in a jurisdiction with
              additional data protection rights (e.g. GDPR, CCPA), we&apos;ll honor requests consistent with
              those laws.
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              We use essential cookies to keep you signed in and to protect against cross-site request
              forgery. We don&apos;t use third-party advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2>8. Children</h2>
            <p>The Service is intended for business use and is not directed at children under 16.</p>
          </section>

          <section>
            <h2>9. Changes to this policy</h2>
            <p>
              If we make material changes, we&apos;ll notify you by email or through the Service before
              they take effect.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              Questions about this policy or your data? Email{' '}
              <a href="mailto:j_tristan@me.com" className="text-ice hover:underline">
                j_tristan@me.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
