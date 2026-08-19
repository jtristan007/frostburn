import { getCurrentAccount } from '@/lib/account'
import { DashboardNav } from '@/components/dashboard/nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { account } = await getCurrentAccount()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav accountName={account.name} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
