import type { SupabaseClient } from '@supabase/supabase-js'
import type { Country } from '@/lib/money'

// Street-address geocoding for the dispatch map, for both of Frostburn's
// markets:
//
// - US: the U.S. Census Bureau geocoder first (free, no key, public-domain
//   data, no rate limit worth worrying about), then OpenStreetMap's
//   Nominatim for anything the Census can't match.
// - Canada: Nominatim only -- the Census geocoder knows nothing north of the
//   border, which is why Canadian customers never got a pin before.
//
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/)
// asks for an identifying User-Agent and at most one request per second, so
// its lookups run one at a time with a gap between them and a small cap per
// run. Only house-level matches are accepted: a city- or street-level hit
// would drop the pin in the wrong place, which is worse than no pin.
//
// Each lookup returns coordinates, 'no-match' when the address genuinely
// wasn't found, or null on a timeout/error (worth retrying on a later load).

type Hit = { lat: number; lng: number }
type Lookup = Hit | 'no-match' | null

const CENSUS_URL = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'Frostburn/1.0 (https://frostburn.io; info@frostburn.io)'
const NOMINATIM_GAP_MS = 1100
// Nominatim place_rank 30 = a specific house/building.
const HOUSE_RANK = 30

export function addressLine(address: string | null, city: string | null): string | null {
  const street = address?.trim()
  if (!street) return null
  const town = city?.trim()
  // Skip the city when the street field already holds a full address.
  return town && !street.toLowerCase().includes(town.toLowerCase()) ? `${street}, ${town}` : street
}

export async function geocodeUS(oneLine: string): Promise<Lookup> {
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

const STREET_TYPES: Record<string, string> = {
  ave: 'Avenue',
  av: 'Avenue',
  st: 'Street',
  rd: 'Road',
  dr: 'Drive',
  blvd: 'Boulevard',
  cres: 'Crescent',
  cr: 'Crescent',
  ct: 'Court',
  pl: 'Place',
  hwy: 'Highway',
  ln: 'Lane',
  pkwy: 'Parkway',
  cir: 'Circle',
  trl: 'Trail',
  terr: 'Terrace',
}

// A second spelling to try when the address as typed doesn't match: street
// types spelled out and, in Canada, ordinals dropped -- OpenStreetMap has
// Surrey's "32nd Ave" as "32 Avenue", and Canadian numbered streets are
// mostly mapped that way. (US numbered streets keep their "32nd".)
export function alternateSpelling(oneLine: string, country: Country): string | null {
  let alt = oneLine.replace(/\b([A-Za-z]+)\b\.?/g, (word, w: string) => STREET_TYPES[w.toLowerCase()] ?? word)
  if (country === 'CA') alt = alt.replace(/\b(\d+)(st|nd|rd|th)\b/gi, '$1')
  return alt !== oneLine ? alt : null
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function nominatim(oneLine: string, country: Country): Promise<Lookup> {
  const url = `${NOMINATIM_URL}?${new URLSearchParams({
    q: oneLine,
    countrycodes: country === 'CA' ? 'ca' : 'us',
    format: 'jsonv2',
    limit: '1',
  })}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = (await res.json()) as { lat?: string; lon?: string; place_rank?: number }[]
    if (!Array.isArray(json)) return null
    const top = json[0]
    if (!top || (top.place_rank ?? 0) < HOUSE_RANK) return 'no-match'
    const lat = Number(top.lat)
    const lng = Number(top.lon)
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : 'no-match'
  } catch {
    return null
  }
}

// Nominatim, then once more with the alternate spelling if that differs.
// Waits out the rate-limit gap before every request, so callers can simply
// call this in a loop.
async function geocodeOSM(oneLine: string, country: Country): Promise<Lookup> {
  await sleep(NOMINATIM_GAP_MS)
  const first = await nominatim(oneLine, country)
  if (first !== 'no-match') return first
  const alt = alternateSpelling(oneLine, country)
  if (!alt) return first
  await sleep(NOMINATIM_GAP_MS)
  return nominatim(alt, country)
}

type GeoCustomer = {
  id: string
  address: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  geocoded_address: string | null
}

const MAX_CENSUS_PER_RUN = 25
// Each Nominatim lookup can take two requests at ~1 req/s, so keep the
// background run short; anything left over is picked up on the next load.
const MAX_OSM_PER_RUN = 8

// Splits customers into ones with saved coordinates for their current
// address and ones that still need a lookup (new or edited address). Pure,
// no network: the page renders from `coords` immediately.
export function partitionByCoordinates(customers: GeoCustomer[]) {
  const coords = new Map<string, Hit>()
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

// Looks up and saves coordinates for `pending` (in priority order). Meant to
// run inside next/server `after()` so it never delays a page. Uses the
// service-role client because request cookies aren't available there; the
// ids must come from a query the caller already ran through their own
// RLS-scoped client. An address with no match is saved with null
// coordinates so it isn't retried on every load; a timeout or error saves
// nothing. Never throws.
export async function geocodePending(
  admin: SupabaseClient,
  pending: { id: string; line: string }[],
  country: Country
) {
  const save = async (id: string, line: string, at: Hit | null) => {
    try {
      await admin
        .from('customers')
        .update({ latitude: at?.lat ?? null, longitude: at?.lng ?? null, geocoded_address: line })
        .eq('id', id)
    } catch {
      // Next load retries.
    }
  }

  let forOSM = pending
  if (country === 'US') {
    // Census in parallel first; only its misses go on to Nominatim.
    const batch = pending.slice(0, MAX_CENSUS_PER_RUN)
    const results = await Promise.all(batch.map(async (p) => ({ p, hit: await geocodeUS(p.line) })))
    forOSM = []
    for (const { p, hit } of results) {
      if (hit === null) continue
      if (hit === 'no-match') forOSM.push(p)
      else await save(p.id, p.line, hit)
    }
  }

  for (const { id, line } of forOSM.slice(0, MAX_OSM_PER_RUN)) {
    const hit = await geocodeOSM(line, country)
    if (hit === null) continue
    await save(id, line, hit === 'no-match' ? null : hit)
  }
}

// Where to point an empty map: the middle of the shop's own customers
// (median, so one far-off address doesn't drag it), or null when none have
// been placed yet.
export function customerCenter(points: { latitude: number | null; longitude: number | null }[]): Hit | null {
  const lats: number[] = []
  const lngs: number[] = []
  for (const p of points) {
    if (p.latitude == null || p.longitude == null) continue
    lats.push(p.latitude)
    lngs.push(p.longitude)
  }
  if (!lats.length) return null
  const median = (xs: number[]) => {
    const s = xs.slice().sort((a, b) => a - b)
    const m = s.length >> 1
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
  }
  return { lat: median(lats), lng: median(lngs) }
}
