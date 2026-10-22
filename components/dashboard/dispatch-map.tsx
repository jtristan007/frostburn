'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as MlMap, Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Today's jobs on a map. Pin color = where the job stands today; the number
// is the stop's order in its technician's day. Picking a technician draws
// their route in stop order. Tiles: OpenFreeMap (free, no key, OSM data).

export type MapStatus = 'scheduled' | 'dispatched' | 'en_route' | 'arrived' | 'done'

export type MapJob = {
  id: string
  lat: number
  lng: number
  time: string
  customer: string
  address: string
  jobType: string
  techId: string
  techName: string
  status: MapStatus
  stop: number
}

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

export const STATUS_META: Record<MapStatus, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: '#94a3b8' },
  dispatched: { label: 'Dispatched', color: '#0284c7' },
  en_route: { label: 'En route', color: '#f59e0b' },
  arrived: { label: 'Arrived', color: '#10b981' },
  done: { label: 'Done', color: '#cbd5e1' },
}

const ROUTE_SOURCE = 'tech-route'

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

// Built with textContent only: customer names and addresses are user data.
function popupContent(job: MapJob) {
  const root = el('div', 'min-w-[200px] font-sans')
  const top = el('div', 'flex items-center justify-between gap-3')
  top.append(el('span', 'text-xs font-mono text-gray-500', job.time))
  const pill = el('span', 'text-[11px] font-semibold px-2 py-0.5 rounded-full', STATUS_META[job.status].label)
  pill.style.background = `${STATUS_META[job.status].color}22`
  pill.style.color = job.status === 'done' ? '#64748b' : STATUS_META[job.status].color
  top.append(pill)
  root.append(top)
  root.append(el('div', 'mt-1 text-sm font-semibold text-navy', job.customer))
  if (job.address) root.append(el('div', 'text-xs text-gray-500', job.address))
  root.append(el('div', 'mt-1 text-xs text-gray-600 capitalize', `${job.jobType} · ${job.techName}`))
  const link = el('a', 'mt-2 inline-block text-xs font-semibold text-sky-600 hover:text-navy', 'Open job →')
  link.setAttribute('href', `/dashboard/jobs/${job.id}/edit`)
  root.append(link)
  return root
}

function pinElement(job: MapJob) {
  const pin = el('button', 'dispatch-pin', String(job.stop))
  pin.setAttribute('type', 'button')
  pin.setAttribute('aria-label', `Stop ${job.stop}: ${job.customer}, ${STATUS_META[job.status].label}`)
  Object.assign(pin.style, {
    width: '30px',
    height: '30px',
    borderRadius: '9999px',
    background: STATUS_META[job.status].color,
    color: job.status === 'done' ? '#475569' : '#fff',
    border: '2px solid #fff',
    boxShadow: '0 2px 6px rgba(5,9,26,.35)',
    font: '700 12px/26px Inter, system-ui, sans-serif',
    textAlign: 'center',
    cursor: 'pointer',
  })
  return pin
}

export function DispatchMap({ jobs, unplaced }: { jobs: MapJob[]; unplaced: number }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MlMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [tech, setTech] = useState<string>('all')

  const techs = useMemo(() => {
    const seen = new Map<string, string>()
    for (const j of jobs) seen.set(j.techId, j.techName)
    return Array.from(seen, ([id, name]) => ({ id, name }))
  }, [jobs])

  const visible = useMemo(() => (tech === 'all' ? jobs : jobs.filter((j) => j.techId === tech)), [jobs, tech])

  // Create the map once.
  useEffect(() => {
    let cancelled = false
    let map: MlMap | null = null
    ;(async () => {
      try {
        const maplibre = await import('maplibre-gl')
        if (cancelled || !boxRef.current) return
        map = new maplibre.Map({
          container: boxRef.current,
          style: STYLE_URL,
          center: [-98.5, 39.8],
          zoom: 3,
          attributionControl: { compact: true },
          cooperativeGestures: true,
        })
        map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right')
        map.on('load', () => {
          if (cancelled) return
          // Compact attribution starts expanded; collapse it so it doesn't cover pins (the (i) button reopens it).
          boxRef.current?.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
          mapRef.current = map
          setReady(true)
        })
        map.on('error', (e) => {
          if (!map?.loaded() && (e as { error?: { status?: number } }).error?.status) setFailed(true)
        })
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      map?.remove()
      mapRef.current = null
    }
  }, [])

  // Redraw pins, route and framing whenever the selection changes.
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    let cancelled = false
    ;(async () => {
      const maplibre = await import('maplibre-gl')
      if (cancelled) return

      markersRef.current.forEach((m) => m.remove())
      markersRef.current = visible
        // Later stops first so earlier stop numbers sit on top.
        .slice()
        .sort((a, b) => b.stop - a.stop)
        .map((job) =>
          new maplibre.Marker({ element: pinElement(job) })
            .setLngLat([job.lng, job.lat])
            .setPopup(new maplibre.Popup({ offset: 18, closeButton: false, maxWidth: '260px' }).setDOMContent(popupContent(job)))
            .addTo(map)
        )

      const route =
        tech === 'all'
          ? []
          : visible
              .slice()
              .sort((a, b) => a.stop - b.stop)
              .map((j) => [j.lng, j.lat])
      const data = {
        type: 'Feature' as const,
        properties: {},
        geometry: { type: 'LineString' as const, coordinates: route },
      }
      const source = map.getSource(ROUTE_SOURCE) as { setData?: (d: typeof data) => void } | undefined
      if (source?.setData) {
        source.setData(data)
      } else {
        map.addSource(ROUTE_SOURCE, { type: 'geojson', data })
        map.addLayer({
          id: ROUTE_SOURCE,
          type: 'line',
          source: ROUTE_SOURCE,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#05091a', 'line-width': 3, 'line-opacity': 0.55, 'line-dasharray': [2, 1.5] },
        })
      }

      if (visible.length === 1) {
        map.easeTo({ center: [visible[0].lng, visible[0].lat], zoom: 13, duration: 600 })
      } else if (visible.length > 1) {
        const bounds = new maplibre.LngLatBounds()
        visible.forEach((j) => bounds.extend([j.lng, j.lat]))
        map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 600 })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [ready, visible, tech])

  const counts = useMemo(() => {
    const c: Partial<Record<MapStatus, number>> = {}
    for (const j of visible) c[j.status] = (c[j.status] ?? 0) + 1
    return c
  }, [visible])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today on the map</p>
          <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            {(Object.keys(STATUS_META) as MapStatus[]).map((s) => (
              <li key={s} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full ring-1 ring-black/5" style={{ background: STATUS_META[s].color }} aria-hidden />
                {STATUS_META[s].label}
                <span className="font-semibold text-navy">{counts[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        {techs.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Show technician">
            {[{ id: 'all', name: 'All techs' }, ...techs].map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tech === t.id}
                onClick={() => setTech(t.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  tech === t.id ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative h-[320px] sm:h-[420px] bg-slate-100">
        {/* maplibre's CSS sets position:relative on the container, so size it explicitly. */}
        <div ref={boxRef} className="h-full w-full" />
        {failed && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            The map couldn’t load right now. Your jobs are listed below.
          </p>
        )}
      </div>

      {(unplaced > 0 || tech !== 'all') && (
        <p className="px-5 py-2.5 text-xs text-gray-500 border-t border-gray-100">
          {tech !== 'all' && 'Dashed line shows the route in stop order. '}
          {unplaced > 0 &&
            `${unplaced} job${unplaced === 1 ? '' : 's'} not on the map. Add a full street address (with city and state) to the customer to place it.`}
        </p>
      )}
    </div>
  )
}
