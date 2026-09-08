import Link from 'next/link'
import { CustomerImportWizard } from '@/components/dashboard/customer-import-wizard'

export default function ImportCustomersPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/customers" className="text-sm text-gray-400 hover:text-navy">
          Customers
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-navy">Import from CSV</h1>
      </div>
      <CustomerImportWizard />
    </div>
  )
}
