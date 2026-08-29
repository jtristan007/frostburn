import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { JobCompletionForm } from '@/components/dashboard/job-completion-form'

export default async function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, account } = await getCurrentAccount()

  const { data: job } = await supabase
    .from('jobs')
    .select('id, job_type, status, customers(name)')
    .eq('id', id)
    .maybeSingle()

  if (!job) notFound()
  if (job.status === 'complete' || job.status === 'cancelled') redirect('/dashboard/jobs')

  const customerName = (job.customers as unknown as { name: string } | null)?.name ?? 'No customer'

  return (
    <div className="max-w-lg">
      <Link href="/dashboard/jobs" className="text-sm text-gray-400 hover:text-navy">
        ← Back to jobs
      </Link>
      <h1 className="text-2xl font-bold text-navy mt-2 mb-1">Complete job</h1>
      <p className="text-sm text-gray-400 mb-6 capitalize">
        {customerName} — {job.job_type}
      </p>

      <JobCompletionForm jobId={id} accountId={account.id} />
    </div>
  )
}
