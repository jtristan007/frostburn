export function KpiTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent ? 'text-red-600' : 'text-navy'}`}>{value}</p>
    </div>
  )
}
