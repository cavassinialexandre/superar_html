import { useEffect, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { HistoryKPIs } from '../../shared/types'
import { getScoreColor } from '@/design-system/tokens'

function AnimatedNumber({ value, decimals = 0, suffix = '', prefix = '' }: { value: number; decimals?: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const mv = useMotionValue(0)
  useEffect(() => {
    const unsub = mv.on('change', (v) => setDisplay(decimals > 0 ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v)))
    animate(mv, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1] })
    return () => unsub()
  }, [value, mv, decimals])
  return <span className="tabular-nums">{prefix}{display.toFixed(decimals)}{suffix}</span>
}

const Icons = {
  Total: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  ),
  Mix: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 0 20" />
      <path d="M12 2a10 10 0 0 0 0 20" strokeDasharray="3 3" />
    </svg>
  ),
  Trend: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Flag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
}

interface KPICardProps {
  label: string
  value: number
  suffix?: string
  decimals?: number
  icon: React.ReactNode
  accent: string
  accentDark: string
  subtitle?: React.ReactNode
  delay?: number
}

function KPICard({ label, value, suffix = '', decimals = 0, icon, accent, accentDark, subtitle, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${accentDark} 0%, ${accent} 100%)` }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">{label}</p>
            <div className="mt-2 font-heading text-3xl font-black tracking-tight" style={{ color: accentDark }}>
              <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
            </div>
            {subtitle && <div className="mt-2 text-xs text-gray-500">{subtitle}</div>}
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${accentDark} 0%, ${accent} 100%)` }}
          >
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface V1KPIStripProps {
  kpis: HistoryKPIs
}

export function V1KPIStrip({ kpis }: V1KPIStripProps) {
  const scoreColor = getScoreColor(kpis.avgScore)
  const auditPct = kpis.total > 0 ? Math.round((kpis.auditCount / kpis.total) * 100) : 0

  const trendChar = kpis.trend.direction === 'up' ? '↗' : kpis.trend.direction === 'down' ? '↘' : '→'
  const trendColor = kpis.trend.direction === 'up' ? 'text-green-600' : kpis.trend.direction === 'down' ? 'text-rose-500' : 'text-gray-400'

  return (
    <div className={cn('grid gap-4', 'grid-cols-2 lg:grid-cols-4')}>
      <KPICard
        label="Total de avaliações"
        value={kpis.total}
        icon={<Icons.Total />}
        accent="#3AA39C"
        accentDark="#155F59"
        subtitle={
          <span>
            <span className="font-semibold text-gray-700">{kpis.belowGoalCount}</span> abaixo da meta
          </span>
        }
        delay={0}
      />
      <KPICard
        label="Mix auditoria/followup"
        value={auditPct}
        suffix="%"
        icon={<Icons.Mix />}
        accent="#A78BFA"
        accentDark="#6D28D9"
        subtitle={
          <span>
            <span className="font-semibold text-gray-700">{kpis.auditCount}</span> auditorias ·{' '}
            <span className="font-semibold text-gray-700">{kpis.followupCount}</span> follow-ups
          </span>
        }
        delay={0.06}
      />
      <KPICard
        label="Score médio"
        value={kpis.avgScore}
        suffix="%"
        decimals={1}
        icon={<Icons.Trend />}
        accent={scoreColor}
        accentDark={scoreColor}
        subtitle={
          <span className={cn('inline-flex items-center gap-1 font-semibold', trendColor)}>
            <span>{trendChar}</span>
            <span className="tabular-nums">{Math.abs(kpis.trend.avgScoreDelta).toFixed(1)}pp</span>
            <span className="text-gray-400 font-normal">vs período anterior</span>
          </span>
        }
        delay={0.12}
      />
      <KPICard
        label="Taxa de avanço"
        value={kpis.advanceRate}
        suffix="%"
        decimals={0}
        icon={<Icons.Flag />}
        accent="#10B981"
        accentDark="#047857"
        subtitle={
          <span>
            Entre <span className="font-semibold text-gray-700">{kpis.auditCount}</span> auditorias
          </span>
        }
        delay={0.18}
      />
    </div>
  )
}
