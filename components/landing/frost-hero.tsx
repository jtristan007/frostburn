'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'

// Isotherm contour lines -- a slow-drifting thermal-map motif behind the
// hero, unique to an HVAC brand (nobody else in this category would reach
// for a temperature-contour visual).
function useIsotherms(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let t = 0
    let raf = 0

    function resize() {
      const dpr = window.devicePixelRatio || 1
      w = canvas!.width = window.innerWidth * dpr
      h = canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const lines = 7
    function draw() {
      const dpr = window.devicePixelRatio || 1
      ctx!.clearRect(0, 0, w, h)
      for (let i = 0; i < lines; i++) {
        const baseY = (h / (lines + 1)) * (i + 1)
        const amp = 40 * dpr + i * 6
        const speed = 0.00035 + i * 0.00004
        const phase = t * speed + i * 1.3
        const heat = i / lines
        const r = Math.round(56 + heat * 190)
        const g = Math.round(189 - heat * 40)
        const b = Math.round(248 - heat * 120)

        ctx!.beginPath()
        for (let x = 0; x <= w; x += 14) {
          const y =
            baseY +
            Math.sin(x * 0.0022 + phase) * amp +
            Math.sin(x * 0.0009 - phase * 1.7) * amp * 0.5
          if (x === 0) ctx!.moveTo(x, y)
          else ctx!.lineTo(x, y)
        }
        ctx!.strokeStyle = `rgba(${r},${g},${b},${0.1 + heat * 0.05})`
        ctx!.lineWidth = 1.1 * dpr
        ctx!.stroke()
      }
      if (!reduceMotion) {
        t += 16
        raf = requestAnimationFrame(draw)
      }
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [canvasRef])
}

// Tiny ice-crystal particles drifting up from the cursor.
function useFrostTrail(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    function resize() {
      const dpr = window.devicePixelRatio || 1
      w = canvas!.width = window.innerWidth * dpr
      h = canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number }
    let particles: Particle[] = []
    let last = { x: -1, y: -1 }

    function onMove(e: PointerEvent) {
      const dpr = window.devicePixelRatio || 1
      const x = e.clientX * dpr
      const y = e.clientY * dpr
      const dist = Math.hypot(x - last.x, y - last.y)
      if (dist > 10 || last.x < 0) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vy: -0.25 - Math.random() * 0.35,
            vx: (Math.random() - 0.5) * 0.4,
            life: 1,
            size: 1.4 + Math.random() * 2.2,
          })
        }
        last = { x, y }
      }
      if (particles.length > 160) particles.splice(0, particles.length - 160)
    }
    window.addEventListener('pointermove', onMove)

    let raf = 0
    function loop() {
      const dpr = window.devicePixelRatio || 1
      ctx!.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.x += p.vx * dpr
        p.y += p.vy * dpr
        p.life -= 0.012
        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.globalAlpha = Math.max(p.life, 0)
        ctx!.strokeStyle = '#bae6fd'
        ctx!.lineWidth = 1
        const s = p.size * dpr
        ctx!.beginPath()
        for (let a = 0; a < 6; a++) {
          const ang = (Math.PI / 3) * a
          ctx!.moveTo(0, 0)
          ctx!.lineTo(Math.cos(ang) * s, Math.sin(ang) * s)
        }
        ctx!.stroke()
        ctx!.restore()
      })
      particles = particles.filter((p) => p.life > 0)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [canvasRef])
}

export function FrostHero() {
  const isothermsRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useIsotherms(isothermsRef)
  useFrostTrail(trailRef)

  // Wipe-the-frost cursor reveal.
  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    const hint = hintRef.current
    if (!stage || !ring) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    let hinted = false

    function onMove(e: PointerEvent) {
      document.documentElement.style.setProperty('--frost-mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--frost-my', e.clientY + 'px')
      ring!.style.opacity = '1'
      if (!hinted) {
        hinted = true
        if (hint) hint.style.opacity = '0'
      }
    }
    function onLeave() {
      ring!.style.opacity = '0'
    }
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // 3D tilt on the dashboard preview card.
  useEffect(() => {
    const wrap = wrapRef.current
    const card = cardRef.current
    if (!wrap || !card) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    function onMove(e: PointerEvent) {
      const r = card!.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      card!.style.transform = `perspective(1200px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) translateZ(6px)`
      card!.style.boxShadow = `${(-px * 30).toFixed(0)}px ${(20 - py * 20).toFixed(0)}px 70px -20px rgba(0,0,0,0.65)`
    }
    function onLeave() {
      card!.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
      card!.style.boxShadow = ''
    }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={stageRef} className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-40"
        style={{
          background:
            'linear-gradient(90deg, #05070f 0%, #05070f 30%, rgba(5,7,15,0.55) 44%, rgba(5,7,15,0.15) 62%, transparent 80%), radial-gradient(ellipse 700px 600px at 88% 92%, rgba(245,158,11,0.14), transparent 55%), url(/frost-bg.jpg) center right / cover no-repeat, #05070f',
        }}
      />
      <div
        id="frostOverlay"
        className="absolute inset-0 -z-30"
        style={{
          backdropFilter: 'blur(22px) brightness(0.48) saturate(0.35)',
          WebkitBackdropFilter: 'blur(22px) brightness(0.48) saturate(0.35)',
          background: 'rgba(5,7,15,0.25)',
          maskImage:
            'radial-gradient(circle 170px at var(--frost-mx, -400px) var(--frost-my, -400px), transparent 0%, transparent 62%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(circle 170px at var(--frost-mx, -400px) var(--frost-my, -400px), transparent 0%, transparent 62%, black 100%)',
        }}
      />
      <canvas ref={isothermsRef} className="absolute inset-0 -z-20" style={{ opacity: 0.22, mixBlendMode: 'screen' }} />
      <canvas ref={trailRef} className="fixed inset-0 z-40 pointer-events-none" />
      <div
        ref={ringRef}
        className="fixed z-30 pointer-events-none rounded-full opacity-0 transition-opacity duration-300"
        style={{
          width: 340,
          height: 340,
          border: '1px solid rgba(186,230,253,0.35)',
          left: 'var(--frost-mx, -400px)',
          top: 'var(--frost-my, -400px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <header className="relative border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-9" />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p
            className="rise inline-flex items-center gap-2 text-[11.5px] font-mono uppercase tracking-[0.14em] text-ice-dim px-3.5 py-1.5 rounded-full border border-ice/30"
            style={{ animationDelay: '0.05s', background: 'rgba(56,189,248,0.06)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ice shadow-[0_0_8px_2px_rgba(56,189,248,0.7)]" />
            Built for small HVAC operators
          </p>
          <h1
            className="rise mt-6 font-display font-bold tracking-tight text-white text-5xl leading-[1.02]"
            style={{ animationDelay: '0.18s' }}
          >
            HVAC software
            <br />
            that runs your <span className="frost-text">business.</span>
          </h1>
          <p className="rise mt-6 text-lg text-mist max-w-xl" style={{ animationDelay: '0.32s' }}>
            While you&apos;re under a crawlspace, Frostburn is chasing your unpaid invoices,
            tracking maintenance agreements, and keeping your schedule straight — automatically.
          </p>
          <div className="rise mt-9 flex items-center gap-4" style={{ animationDelay: '0.46s' }}>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-ice text-navy px-6 py-3 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Start Free Today →
            </Link>
            <a href="#pricing" className="text-sm font-semibold text-white px-5 py-3 rounded-lg border border-white/15">
              See how it works
            </a>
          </div>
          <div
            className="rise mt-12 flex gap-9 pt-6 border-t border-white/10"
            style={{ animationDelay: '0.6s' }}
          >
            {[
              ['20 min', 'to fully set up'],
              ['$0', 'setup fee'],
              ['Any device', 'no install'],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-mono text-lg text-white">{num}</div>
                <div className="text-xs text-mist mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={wrapRef} className="rise relative" style={{ perspective: 1200, animationDelay: '0.5s' }}>
          <div
            ref={cardRef}
            className="relative rounded-[20px] overflow-hidden border border-white/10 transition-transform duration-150 ease-out"
            style={{
              background: 'linear-gradient(165deg, rgba(16,26,48,0.75), rgba(5,7,15,0.85))',
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex items-center gap-1.5 px-4.5 py-3 border-b border-white/10 font-mono text-[11px] text-mist">
              <span className="w-2 h-2 rounded-full bg-red-400/70" />
              <span className="w-2 h-2 rounded-full bg-amber-400/70" />
              <span className="w-2 h-2 rounded-full bg-green-400/70" />
              <span className="ml-3">app.frostburn.io/dashboard</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-300">Good morning, Mike 👋</span>
                <span className="text-[11px] font-mono text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" />
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {[
                  ['$3,240', 'Revenue at risk'],
                  ['63', 'Active clients'],
                  ['4', 'Jobs today'],
                ].map(([v, l]) => (
                  <div key={l} className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5">
                    <div className="font-mono text-lg text-white">{v}</div>
                    <div className="text-[10.5px] text-mist mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-mist mb-2.5">
                This morning, automatically
              </div>
              {[
                '2 overdue reminders sent',
                'New client welcomed',
                'Morning briefing delivered',
              ].map((a) => (
                <div key={a} className="text-[13px] text-[#d6e4f5] flex items-center gap-2.5 py-1">
                  <span className="text-ice">✓</span> {a}
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute -bottom-6 -left-6 bg-navy-mid rounded-2xl shadow-2xl p-4 w-64 hidden sm:block border border-white/10"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber">●</span>
              <span className="text-xs font-semibold text-white">Reminder sent</span>
              <span className="text-[10px] text-mist ml-auto font-mono">Just now</span>
            </div>
            <p className="text-xs text-mist">
              Johnson Family — Invoice #1082 follow-up delivered automatically.
            </p>
          </div>
        </div>
      </section>

      <p
        ref={hintRef}
        className="relative text-center font-mono text-[10.5px] uppercase tracking-[0.1em] text-mist opacity-70 transition-opacity duration-500 pb-6"
      >
        Move your cursor to clear the frost
      </p>
    </div>
  )
}
