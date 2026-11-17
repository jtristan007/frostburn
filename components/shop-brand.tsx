import { Logo } from '@/components/logo'

// The header on customer-facing pages (/pay, /quote, /portal): the shop's own
// logo if they uploaded one (Settings > Branding), otherwise their name, so
// customers see who billed them rather than the software they use.
export function ShopBrand({ companyName, logoUrl }: { companyName: string | null; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={companyName ?? 'Company logo'}
        className="inline-block h-16 sm:h-20 w-auto max-w-[260px] object-contain"
      />
    )
  }
  if (companyName) {
    return <p className="text-xl font-bold text-navy break-words">{companyName}</p>
  }
  return <Logo className="h-9 inline-block" />
}

// Small credit under customer-facing pages once the shop's brand is on top.
export function PoweredByFrostburn() {
  return (
    <p className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
      Powered by <Logo className="h-4 inline-block" />
    </p>
  )
}
