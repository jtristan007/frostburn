const selectClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'

export function CustomerSelect({
  customers,
  defaultValue,
}: {
  customers: { id: string; name: string }[]
  defaultValue?: string
}) {
  return (
    <select id="customer_id" name="customer_id" required defaultValue={defaultValue ?? ''} className={selectClass}>
      <option value="" disabled>
        Select a customer…
      </option>
      {customers.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
