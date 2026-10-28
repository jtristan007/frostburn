// Inlined (not <img src>) so the wordmark uses Bebas Neue from the page --
// an SVG loaded via <img> can't see the page's fonts, which silently falls
// back to a wider system font and clips the wordmark's last letter. The face
// itself is self-hosted by next/font in app/layout.tsx (--font-logo).
export function Logo({ className = 'h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 120" role="img" aria-label="Frostburn" className={className}>
      <defs>
        <linearGradient id="badgeFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D1530" />
          <stop offset="100%" stopColor="#05091A" />
        </linearGradient>
        <filter id="iceGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <g id="logoArm">
          <line x1="0" y1="0" x2="0" y2="-37" strokeWidth="3.5" />
          <line x1="-12" y1="-19" x2="12" y2="-19" strokeWidth="2.5" />
          <line x1="-7" y1="-29" x2="7" y2="-29" strokeWidth="2" />
        </g>
      </defs>

      <rect width="500" height="120" fill="#05091A" />
      <rect x="4" y="4" width="112" height="112" rx="22" fill="url(#badgeFill)" />
      <rect x="4" y="4" width="112" height="112" rx="22" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.55" />
      <rect x="7" y="7" width="106" height="106" rx="19" fill="none" stroke="#38BDF8" strokeWidth="0.4" opacity="0.18" />

      <g transform="translate(60,60)" stroke="#38BDF8" strokeLinecap="round" fill="none" filter="url(#iceGlow)">
        <use href="#logoArm" />
        <use href="#logoArm" transform="rotate(60)" />
        <use href="#logoArm" transform="rotate(120)" />
        <use href="#logoArm" transform="rotate(180)" />
        <use href="#logoArm" transform="rotate(240)" />
        <use href="#logoArm" transform="rotate(300)" />
        <circle r="5.5" fill="#F59E0B" stroke="none" />
      </g>

      <text
        x="130"
        y="79"
        style={{ fontFamily: "var(--font-logo), 'Arial Narrow', sans-serif" }}
        fontSize="60"
        letterSpacing="1"
      >
        <tspan fill="#FFFFFF">FROST</tspan>
        <tspan fill="#F59E0B">BURN</tspan>
      </text>
    </svg>
  )
}
