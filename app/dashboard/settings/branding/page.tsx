import { getCurrentAccount } from '@/lib/account'
import { BrandingForm } from '@/components/dashboard/branding-form'

export default async function BrandingPage() {
  const { account } = await getCurrentAccount()

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">Branding</h1>
      <p className="text-sm text-gray-400 mb-6">Your logo appears on every invoice your customers see.</p>
      <BrandingForm currentLogoUrl={account.logo_url} />
    </div>
  )
}
