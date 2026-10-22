import type { SupabaseClient } from '@supabase/supabase-js'

// US street-address geocoding through the U.S. Census Bureau geocoder:
// free, no API key, public-domain data. Frostburn is US-only for now, which
// is exactly what this covers. Returns 'no-match' when the Census has no
// match for the address, and null on timeout or error (worth retrying).

const CENSUS_URL = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress'

export function addressLine(address: string | null, city: string | null): string | null {
  const street = address?.trim()
  if (!street) return null
  const town = city?.trim()
  // Skip the city when the street field already holds a full address.
  return town && !street.toLowerCase().includes(town.toLowerCase()) ? `${street}, ${town}` : street
}

export async function geocodeUS(oneLine: string): Promise<{ lat: number; lng: number } | 'no-match' | null> {
  const url = `${CENSUS_URL}?${new URLSearchParams({ address: oneLine, benchmark: 'Public_AR_Current', format: 'json' })}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000), cache: 'no-store' })
    if (!res.ok) return null
    const json = (await res.json()) as {
      result?: { addressMatches?: { coordinates?: { x?: number; y?: number } }[] }
    }
    const matches = json.result?.addressMatches
    if (!Array.isArray(matches)) return null
    const c = matches[0]?.coordinates
    if (typeof c?.x !== 'number' || typeof c?.y !== 'number') return 'no-match'
    return { lat: c.y, lng: c.x }
  } catch {
    return null
  }
}

type GeoCustomer = {
  id: string
  address: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  geocoded_address: string | null
}

const MAX_LOOKUPS_PER_RUN = 25

// Splits customers into ones with saved coordinates for their current
// address and ones that still need a lookup (new or edited address). Pure,
// no network: the page renders from `coords` immediately.
export function partitionByCoordinates(customers: GeoCustomer[]) {
  const coords = new Map<string, { lat: number; lng: number }>()
  const pending: { id: string; line: string }[] = []
  for (const c of customers) {
    const line = addressLine(c.address, c.city)
    if (!line) continue
    if (c.geocoded_address === line) {
      if (c.latitude != null && c.longitude != null) coords.set(c.id, { lat: c.latitude, lng: c.longitude })
    } else if (!pending.some((p) => p.id === c.id)) {
      pending.push({ id: c.id, line })
    }
  }
  return { coords, pending }
}

// Looks up and saves coordinates for `pending`. Meant to run inside
// next/server `after()` so it never delays a page. Uses the service-role
// client because request cookies aren't available there; the ids must come
// from a query the caller already ran through their own RLS-scoped client.
// An address with no match is saved with null coordinates so it isn't
// retried on every load; a timeout or error saves nothing. Never throws.
export async function geocodePending(admin: SupabaseClient, pending: { id: string; line: string }[]) {
  await Promise.all(
    pending.slice(0, MAX_LOOKUPS_PER_RUN).map(async ({ id, line }) => {
      const hit = await geocodeUS(line)
      if (hit === null) return
      const at = hit === 'no-match' ? null : hit
      try {
        await admin
          .from('customers')
          .update({ latitude: at?.lat ?? null, longitude: at?.lng ?? null, geocoded_address: line })
          .eq('id', id)
      } catch {
        // Next load retries.
      }
    })
  )
}
