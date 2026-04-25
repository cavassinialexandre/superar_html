import { motion } from 'framer-motion'
import { GroupsIcon, BarChartIcon, CheckCircleIcon, TrendUpIcon, TrendDownIcon } from '@/assets/icons'
import { cinematic } from './cinematic-tokens'

interface KPI {
  id: string
  label: string
  value: number
  suffix?: string
  delta: number
  deltaUnit: string
  sparkline: number[]
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface Props {
  kpis: KPI[]
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const w = 110
  const h = 36
  const pad = 2
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (w - pad * 2) / (values.length - 1)

  const points = values.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (h - pad * 2) * (1 - (v - min) / range)
    return [x, y] as const
  })

  const pathLine = points
    .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(' ')

  const pathArea =
    pathLine + ` L ${points[points.length - 1][0]},${h - pad} L ${pad},${h - pad} Z`

  const lastX = points[points.length - 1][0]
  const lastY = points[points.length - 1][1]

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={pathArea}
        fill={`url(#spark-${color.replace('#', '')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      <motion.path
        d={pathLine}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={lastX}
        cy={lastY}
        r={2.6}
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
    </svg>
  )
}

function DeltaBadge({ delta, unit }: { delta: number; unit: string }) {
  const isPositive = delta >= 0
  const color = isPositive ? cinematic.accents.lime : cinematic.accents.rose
  const Icon = isPositive ? TrendUpIcon : TrendDownIcon
  return (
    <div className="flex items-center gap-1" style={{ color }}>
      <Icon size={12} />
      <span
        className="font-semibold tabular-nums"
        style={{ fontFamily: cinematic.font.mono, fontSize: 11 }}
      >
        {isPositive ? '+' : ''}
        {delta}
        {unit}
      </span>
    </div>
  )
}

function KpiCard({ kpi, index }: { kpi: KPI; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 + index * 0.06 }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      className="group relative overflow-hidden"
    >
      <div
        className="relative bg-white rounded-2xl p-5 transition-shadow duration-300"
        style={{
          border: `1px solid ${cinematic.body.cardBorder}`,
          boxShadow: cinematic.shadow.kpiCard,
        }}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: cinematic.body.accentBar }}
        />

        <div className="flex items-start justify-between gap-3 mb-3.5">
          <span
            className="uppercase tracking-[0.16em] font-semibold"
            style={{ fontSize: 10, color: cinematic.text.onLightSubtle }}
          >
            {kpi.label}
          </span>
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 32,
              height: 32,
              background: `linear-gradient(135deg, ${cinematic.accents.deepTeal}10 0%, ${cinematic.accents.mint}18 100%)`,
              color: cinematic.accents.teal,
            }}
          >
            <kpi.Icon size={16} />
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.06 }}
            className="font-bold leading-none tabular-nums"
            style={{
              fontFamily: cinematic.font.display,
              fontSize: 38,
              color: cinematic.text.onLight,
              letterSpacing: '-0.02em',
            }}
          >
            {kpi.value}
          </motion.span>
          {kpi.suffix && (
            <span
              className="font-semibold"
              style={{
                fontFamily: cinematic.font.display,
                fontSize: 18,
                color: cinematic.text.onLightMuted,
              }}
            >
              {kpi.suffix}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <DeltaBadge delta={kpi.delta} unit={kpi.deltaUnit} />
          <div className="opacity-90 group-hover:opacity-100 transition-opacity">
            <MiniSparkline values={kpi.sparkline} color={cinematic.accents.teal} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CinematicKpiGrid({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <KpiCard key={k.id} kpi={k} index={i} />
      ))}
    </div>
  )
}
