import { getCurrentAccount } from '@/lib/account'
import { DashboardNav } from '@/components/dashboard/nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { account } = await getCurrentAccount()

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="print:hidden">
        <DashboardNav accountName={account.name} />
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8 print:p-0 print:max-w-none">{children}</main>
    </div>
  )
}
