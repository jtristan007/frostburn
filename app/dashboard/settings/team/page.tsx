import { getCurrentAccount } from '@/lib/account'
import { InviteForm } from '@/components/dashboard/invite-form'
import { removeTeammate } from '@/app/actions/team'
import { TIER_TECH_LIMITS, type Tier } from '@/lib/stripe/plans'

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  technician: 'Technician',
}

export default async function TeamPage() {
  const { supabase, account, user } = await getCurrentAccount()

  const { data: members } = await supabase
    .from('account_users')
    .select('user_id, role, full_name, created_at')
    .order('created_at', { ascending: true })

  const limit = account.tier ? TIER_TECH_LIMITS[account.tier as Tier] : 1
  const count = members?.length ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">Team</h1>
      <p className="text-sm text-gray-400 mb-6">
        {account.tier
          ? `${count} of ${limit === Infinity ? 'unlimited' : limit} team members on your ${account.tier} plan.`
          : 'Choose a plan to start inviting your team.'}
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <tbody>
            {(members ?? []).map((m) => (
              <tr key={m.user_id} className="border-b border-gray-50 last:border-0">
                <td className="px-6 py-3 text-navy font-medium">
                  {m.full_name ?? '—'} {m.user_id === user.id && <span className="text-gray-400 font-normal">(you)</span>}
                </td>
                <td className="px-6 py-3 text-gray-400">{ROLE_LABELS[m.role] ?? m.role}</td>
                <td className="px-6 py-3 text-right">
                  {m.role !== 'owner' && (
                    <form action={removeTeammate.bind(null, m.user_id)}>
                      <button type="submit" className="text-xs text-red-500 hover:text-red-600 font-medium">
                        Remove
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteForm />
    </div>
  )
}
