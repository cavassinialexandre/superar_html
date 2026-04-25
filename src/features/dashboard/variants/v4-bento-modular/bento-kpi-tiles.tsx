import { motion } from 'framer-motion'
import {
  GroupsIcon,
  BarChartIcon,
  CheckCircleIcon,
  TrendUpIcon,
  TrendDownIcon,
} from '@/assets/icons'
import { bento, bentoTileBase } from './bento-tokens'

interface KPI {
  id: string
  label: string
  value: number
  suffix?: string
  delta: number
  deltaUnit: string
  sparkline: number[]
  Icon: React.ComponentType<{ size?: number; className?: string }>
  accent: string
  soft: string
}

interface Props {
  kpis: KPI[]
}

function CompactSparkline({ values, color }: { values: number[]; color: string }) {
  const w = 70
  const h = 24
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
  const pathLine = points.map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`)).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <motion.path
        d={pathLine}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={2} fill={color} />
    </svg>
  )
}

function KpiTile({ kpi, index }: { kpi: KPI; index: number }) {
  const isPositive = kpi.delta >= 0
  const deltaColor = isPositive ? '#5EA448' : '#CE3C5A'
  const DeltaIcon = isPositive ? TrendUpIcon : TrendDownIcon
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.06 + index * 0.05 }}
      whileHover={{
        y: -4,
        boxShadow: bento.surface.tileShadowHover,
        transition: { duration: 0.25 },
      }}
      className="relative p-4 md:p-5 group cursor-pointer"
      style={bentoTileBase}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="px-2 py-0.5 rounded-full uppercase tracking-[0.14em] font-semibold"
          style={{
            background: kpi.soft,
            color: kpi.accent,
            fontSize: 9.5,
            fontFamily: bento.font.mono,
          }}
        >
          {kpi.label}
        </span>
        <span
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 28,
            height: 28,
            background: kpi.soft,
            color: kpi.accent,
          }}
        >
          <kpi.Icon size={14} />
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span
          className="font-bold leading-none tabular-nums"
          style={{
            fontFamily: bento.font.display,
            fontSize: 36,
            color: bento.surface.text,
            letterSpacing: '-0.025em',
          }}
        >
          {kpi.value}
        </span>
        {kpi.suffix && (
          <span
            className="font-semibold"
            style={{
              fontFamily: bento.font.display,
              fontSize: 16,
              color: bento.surface.textMuted,
            }}
          >
            {kpi.suffix}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1" style={{ color: deltaColor }}>
          <DeltaIcon size={11} />
          <span
            className="font-semibold tabular-nums"
            style={{ fontFamily: bento.font.mono, fontSize: 10.5 }}
          >
            {isPositive ? '+' : ''}
            {kpi.delta}
            {kpi.deltaUnit}
          </span>
        </div>
        <CompactSparkline values={kpi.sparkline} color={kpi.accent} />
      </div>
    </motion.div>
  )
}

export function BentoKpiTiles({ kpis }: Props) {
  return (
    <>
      {kpis.map((k, i) => (
        <KpiTile key={k.id} kpi={k} index={i} />
      ))}
    </>
  )
}
