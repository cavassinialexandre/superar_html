import { ecards } from './editorial-cards-tokens'

interface KPI {
  id: string
  titleStart?: string
  titleSerif: string
  value: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface Props {
  kpis: KPI[]
}

const ACCENT = {
  solid: '#103734',
  deep: '#155F59',
}

function KpiCard({ kpi }: { kpi: KPI }) {
  const gradId = `kpi-target-${kpi.id}`
  return (
    <div
      className="relative px-5 py-5 overflow-hidden"
      style={{
        background: ecards.card.bg,
        border: `1px solid ${ecards.card.border}`,
        borderRadius: ecards.card.radius,
        boxShadow: ecards.card.shadow,
      }}
    >
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ top: 14, right: 14, width: 72, height: 72 }}
      >
        <svg
          width="72"
          height="72"
          viewBox="0 0 100 100"
          fill="none"
          className="absolute inset-0"
          style={{ opacity: 0.08 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={ACCENT.solid} />
              <stop offset="100%" stopColor={ACCENT.deep} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" stroke={`url(#${gradId})`} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="32" stroke={`url(#${gradId})`} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="20" stroke={`url(#${gradId})`} strokeWidth="0.8" />
          <path
            d="M20 50 L80 50 M50 20 L50 80"
            stroke={`url(#${gradId})`}
            strokeWidth="0.6"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: ACCENT.solid, opacity: 0.12 }}
        >
          <kpi.Icon size={18} />
        </span>
      </div>

      <div className="relative pr-24">
        <h3
          className="font-bold leading-tight mb-3"
          style={{
            fontFamily: ecards.font.sans,
            fontSize: ecards.scale.h3,
            color: ecards.surface.ink,
            letterSpacing: '-0.01em',
          }}
        >
          {kpi.titleStart && <>{kpi.titleStart} </>}
          <span style={{ fontFamily: ecards.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
            {kpi.titleSerif}
          </span>
        </h3>

        <div
          className="leading-none tabular-nums"
          style={{
            fontFamily: ecards.font.sans,
            fontWeight: 700,
            fontSize: ecards.scale.bigNumber,
            color: ACCENT.solid,
            letterSpacing: '-0.025em',
          }}
        >
          {kpi.value}
        </div>
      </div>
    </div>
  )
}

export function EditorialCardsKpiGrid({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map((k) => (
        <KpiCard key={k.id} kpi={k} />
      ))}
    </div>
  )
}
