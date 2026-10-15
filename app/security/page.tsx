import Link from 'next/link'
import { Logo } from '@/components/logo'

export const metadata = { title: 'Security — Frostburn' }

export default function SecurityPage() {
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
        <h1 className="text-3xl font-bold text-navy mb-2">Security &amp; Data</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated September 7, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-600 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-navy [&_h2]:mb-2 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_li]:mt-1">
          <section>
            <p>
              Frostburn is an early-stage product. This page is a plain, accurate account of how your
              data is handled today — not a compliance checklist. As the product and customer base
              grow, this page will grow with it. For the legal version of all of this, see our{' '}
              <Link href="/privacy" className="text-ice hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2>Where your data lives</h2>
            <p>
              The application runs on Vercel. Your business data — customers, jobs, quotes, invoices,
              equipment records — is stored in a Postgres database hosted in the United States, run by
              our database provider, Supabase.
            </p>
          </section>

          <section>
            <h2>Tenant isolation</h2>
            <p>
              Every table in the database is protected by row-level security scoped to your account. In
              practice, this means the database itself refuses any query for another company&apos;s data —
              it&apos;s not just an application-layer check that could be bypassed by a bug elsewhere.
            </p>
          </section>

          <section>
            <h2>Encryption</h2>
            <p>
              All traffic to and from Frostburn is encrypted in transit (HTTPS/TLS). Data at rest in the
              database is encrypted by our infrastructure provider by default.
            </p>
          </section>

          <section>
            <h2>Payments</h2>
            <p>
              Payment processing is handled entirely by Stripe. Frostburn never sees or stores your card
              number, and your customers&apos; card details never touch our servers when they pay an
              invoice — Stripe handles that directly.
            </p>
          </section>

          <section>
            <h2>Backups</h2>
            <p>
              Automated daily backups of your data are maintained by Supabase. We don&apos;t currently
              publish a formal recovery-time target — if you need specifics for your own records, email
              us and we&apos;ll get you the details.
            </p>
          </section>

          <section>
            <h2>Team access</h2>
            <p>
              You can invite technicians and admins onto your account. Today, every invited team member
              has access to the same account data — we don&apos;t yet offer granular, per-role permission
              restrictions (e.g. limiting a technician to only their assigned jobs). If that matters for
              how you run your shop, tell us — it helps us prioritize it.
            </p>
          </section>

          <section>
            <h2>Exporting or deleting your data</h2>
            <p>
              You can view and correct most of your data directly in the app. For a full export or
              account deletion, email us — we handle these directly rather than through a self-service
              button today.
            </p>
          </section>

          <section>
            <h2>Cancellation</h2>
            <p>
              Cancel anytime from your billing settings. Cancellation takes effect at the end of your
              current billing period — see the{' '}
              <Link href="/terms" className="text-ice hover:underline">
                Terms of Service
              </Link>{' '}
              for the full policy.
            </p>
          </section>

          <section>
            <h2>Uptime</h2>
            <p>
              We don&apos;t yet run a public status page. If Frostburn is down or acting up, email us —
              you&apos;ll hear back from a person, not a ticket queue.
            </p>
          </section>

          <section>
            <h2>Who to contact</h2>
            <p>
              Security concerns, data requests, or anything else:{' '}
              <a href="mailto:j_tristan@me.com" className="text-ice hover:underline">
                j_tristan@me.com
              </a>
              . Frostburn is currently a small, hands-on operation — you&apos;ll be talking directly to the
              person who built it.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
