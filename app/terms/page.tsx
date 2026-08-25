import Link from 'next/link'
import { Logo } from '@/components/logo'

export const metadata = { title: 'Terms of Service — Frostburn' }

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-navy mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated August 24, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy [&_h2]:mb-2 [&_p+p]:mt-3">
          <section>
            <h2>1. Who we are</h2>
            <p>
              Frostburn (&quot;Frostburn,&quot; &quot;we,&quot; &quot;us&quot;) is operated by Julian Tristan, a sole
              proprietor. These Terms govern your access to and use of the Frostburn software (the
              &quot;Service&quot;), available at frostburn.io.
            </p>
          </section>

          <section>
            <h2>2. Acceptance of these Terms</h2>
            <p>
              By creating an account or otherwise using the Service, you agree to these Terms. If you are
              using the Service on behalf of a company, you represent that you have the authority to bind
              that company, and &quot;you&quot; refers to that company.
            </p>
          </section>

          <section>
            <h2>3. The Service</h2>
            <p>
              Frostburn is software for HVAC service businesses to manage pricing, customers, equipment
              history, maintenance agreements, jobs, invoicing, and related business operations, including
              an AI assistant that answers questions about your own account data.
            </p>
          </section>

          <section>
            <h2>4. Accounts</h2>
            <p>
              You must provide accurate information when creating an account and keep your login
              credentials confidential. You are responsible for all activity that occurs under your
              account. Tell us immediately at the contact below if you suspect unauthorized use.
            </p>
          </section>

          <section>
            <h2>5. Subscriptions, fees, and billing</h2>
            <p>
              Paid plans are billed in advance on a recurring monthly basis through our payment processor,
              Stripe. Prices are as displayed at signup or in your account settings. We may offer a free
              trial period; if you don&apos;t cancel before it ends, billing begins automatically at the
              price shown for your selected plan.
            </p>
            <p>
              You can cancel at any time from your account&apos;s billing settings. Cancellation takes
              effect at the end of the current billing period; we do not provide partial-period refunds
              except where required by law.
            </p>
          </section>

          <section>
            <h2>6. Your data</h2>
            <p>
              You own the data you enter into Frostburn, including your customer records, job history, and
              invoices. We access it only to operate, maintain, and support the Service, or as described in
              our{' '}
              <Link href="/privacy" className="text-ice hover:underline">
                Privacy Policy
              </Link>
              . You&apos;re responsible for the accuracy of the data you enter and for having the right to
              store your own customers&apos; information in the Service.
            </p>
          </section>

          <section>
            <h2>7. Acceptable use</h2>
            <p>
              Don&apos;t use the Service to break the law, infringe anyone&apos;s rights, transmit malware,
              attempt to gain unauthorized access to our systems, or interfere with the Service&apos;s
              normal operation.
            </p>
          </section>

          <section>
            <h2>8. Termination</h2>
            <p>
              You may stop using the Service and cancel your account at any time. We may suspend or
              terminate your account if you materially breach these Terms and don&apos;t fix it within a
              reasonable time after we notify you, or immediately if required to prevent harm to us, other
              users, or the Service.
            </p>
          </section>

          <section>
            <h2>9. Disclaimers</h2>
            <p>
              The Service is provided &quot;as is,&quot; without warranties of any kind, express or
              implied, including merchantability, fitness for a particular purpose, and non-infringement.
              We don&apos;t guarantee the Service will be uninterrupted, error-free, or fully secure.
            </p>
          </section>

          <section>
            <h2>10. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Frostburn and Julian Tristan will not be liable for
              any indirect, incidental, special, consequential, or punitive damages, or for lost profits or
              revenue, arising from your use of the Service. Our total liability for any claim relating to
              the Service is limited to the amount you paid us in the 12 months before the claim arose.
            </p>
          </section>

          <section>
            <h2>11. Governing law</h2>
            <p>
              For customers located in Canada, these Terms are governed by the laws of the Province of
              British Columbia and the federal laws of Canada applicable there. For customers located in
              the United States, these Terms are governed by the laws of the State of Texas. In each case,
              without regard to conflict-of-law rules.
            </p>
          </section>

          <section>
            <h2>12. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. If we make material changes, we&apos;ll notify
              you by email or through the Service. Continuing to use the Service after changes take effect
              means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2>13. Contact</h2>
            <p>
              Questions about these Terms? Email{' '}
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
