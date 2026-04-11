/**
 * Shared SVG watermark patterns for the evaluation page.
 * Mirrors the visual language from hero-section.tsx (groups detail).
 */

// ============================================================================
// DIAMOND PATTERN — rotated squares grid
// ============================================================================

export function EvalDiamondPattern() {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 28
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 30; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({
        x: col * spacing + offset + 14,
        y: row * spacing + 14,
        size: 6,
        opacity: 0.03 + Math.random() * 0.03,
      })
    }
  }
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 200"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {diamonds.map((d, i) => (
        <rect
          key={i}
          x={d.x - d.size / 2}
          y={d.y - d.size / 2}
          width={d.size}
          height={d.size}
          transform={`rotate(45 ${d.x} ${d.y})`}
          fill="white"
          opacity={d.opacity}
        />
      ))}
    </svg>
  )
}

// ============================================================================
// WAVE WATERMARK — bezier curves with gradient strokes
// ============================================================================

export function EvalWaveWatermark() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="evalWG1" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#1E7A73" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#3AA39C" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#96D4D0" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="evalWG2" x1="0" y1="0.5" x2="1" y2="0">
          <stop offset="0%" stopColor="#3AA39C" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#1E7A73" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path
        d="M-50 200 C150 140, 300 260, 500 180 S750 100, 950 160 S1150 240, 1250 180"
        stroke="url(#evalWG1)"
        strokeWidth="1.2"
      />
      <path
        d="M-50 230 C170 170, 340 290, 540 210 S790 130, 990 190 S1190 270, 1300 210"
        stroke="url(#evalWG2)"
        strokeWidth="0.7"
      />
      <path
        d="M0 300 L0 240 C180 180, 360 290, 540 220 S800 150, 980 200 S1160 270, 1200 230 L1200 300 Z"
        fill="url(#evalWG1)"
        opacity="0.2"
      />
      <circle cx="280" cy="210" r="2.5" fill="#1E7A73" opacity="0.04" />
      <circle cx="560" cy="190" r="3" fill="#3AA39C" opacity="0.03" />
      <circle cx="840" cy="155" r="2" fill="#1E7A73" opacity="0.05" />
      <circle cx="1020" cy="180" r="3" fill="#96D4D0" opacity="0.03" />
    </svg>
  )
}

// ============================================================================
// CLIPBOARD WATERMARK — icon for sidebar
// ============================================================================

export function EvalClipboardWatermark() {
  return (
    <svg
      className="absolute -bottom-4 -right-4 pointer-events-none"
      width="140"
      height="140"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'rgba(30, 122, 115, 0.03)' }}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  )
}

// ============================================================================
// COLORED DIAMOND PATTERN — parametric color for section sidebars/bands
// ============================================================================

export function ColoredDiamondPattern({ fill = 'white' }: { fill?: string }) {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 18
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 6; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({
        x: col * spacing + offset + 9,
        y: row * spacing + 9,
        size: 4.5,
        opacity: 0.04 + Math.random() * 0.03,
      })
    }
  }
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 200"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {diamonds.map((d, i) => (
        <rect
          key={i}
          x={d.x - d.size / 2}
          y={d.y - d.size / 2}
          width={d.size}
          height={d.size}
          transform={`rotate(45 ${d.x} ${d.y})`}
          fill={fill}
          opacity={d.opacity}
        />
      ))}
    </svg>
  )
}

// ============================================================================
// WIDE COLORED DIAMOND PATTERN — for full-width band headers
// ============================================================================

export function WideDiamondPattern({ fill = 'white' }: { fill?: string }) {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 22
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 40; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({
        x: col * spacing + offset + 11,
        y: row * spacing + 11,
        size: 5,
        opacity: 0.04 + Math.random() * 0.03,
      })
    }
  }
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 900 80"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {diamonds.map((d, i) => (
        <rect
          key={i}
          x={d.x - d.size / 2}
          y={d.y - d.size / 2}
          width={d.size}
          height={d.size}
          transform={`rotate(45 ${d.x} ${d.y})`}
          fill={fill}
          opacity={d.opacity}
        />
      ))}
    </svg>
  )
}

// ============================================================================
// CHECKLIST WATERMARK — icon for section backgrounds
// ============================================================================

export function EvalChecklistWatermark() {
  return (
    <svg
      className="absolute -bottom-2 -right-2 pointer-events-none"
      width="120"
      height="120"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'rgba(30, 122, 115, 0.04)' }}
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12l2 2 4-4" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  )
}
