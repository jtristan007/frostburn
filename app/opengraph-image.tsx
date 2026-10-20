import { ImageResponse } from 'next/og'

export const alt = 'Frostburn — Run your HVAC company without hiring an office admin'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #05091a 0%, #0d1530 60%, #0b2540 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>
          <span style={{ color: '#ffffff' }}>FROST</span>
          <span style={{ color: '#f5a623' }}>BURN</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Run your HVAC company without hiring an office admin.
          </div>
          <div style={{ fontSize: 30, color: '#94a3b8', marginTop: 28, maxWidth: 960 }}>
            Scheduling, maintenance agreements and automatic overdue-invoice reminders for 1–5 tech shops.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#38bdf8' }}>
          frostburn.io · 30-day free trial · No credit card
        </div>
      </div>
    ),
    size
  )
}
