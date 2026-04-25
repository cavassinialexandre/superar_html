import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { HistoryKPIs } from '../../shared/types'

interface V3KPIStackProps {
  kpis: HistoryKPIs
}

interface StackCardProps {
  label: string
  value: string
  delta?: { value: string; direction: 'up' | 'down' | 'flat' }
  color: string
  delay: number
}

function StackCard({ label, value, delta, color, delay }: StackCardProps) {
  const dirColor = delta?.direction === 'up' ? 'text-emerald-600' : delta?.direction === 'down' ? 'text-rose-500' : 'text-gray-400'
  const arrow = delta?.direction === 'up' ? '↗' : delta?.direction === 'down' ? '↘' : '→'

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="relative rounded-xl bg-white border border-gray-200 p-3.5 overflow-hidden hover:shadow-sm transition group"
    >
      <div className="absolute top-0 bottom-0 left-0 w-[3px]" style={{ background: color }} />
      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xl font-black text-gray-800 tabular-nums">{value}</span>
        {delta && (
          <span className={cn('text-[11px] font-semibold inline-flex items-center gap-0.5', dirColor)}>
            <span>{arrow}</span>
            <span className="tabular-nums">{delta.value}</span>
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function V3KPIStack({ kpis }: V3KPIStackProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <StackCard
        label="Score médio"
        value={`${kpis.avgScore.toFixed(1)}%`}
        delta={{
          value: `${Math.abs(kpis.trend.avgScoreDelta).toFixed(1)}pp`,
          direction: kpis.trend.direction,
        }}
        color="#6366F1"
        delay={0}
      />
      <StackCard
        label="Taxa de avanço"
        value={`${Math.round(kpis.advanceRate)}%`}
        color="#10B981"
        delay={0.05}
      />
      <StackCard
        label="Abaixo da meta"
        value={kpis.belowGoalCount.toString()}
        color="#EF4444"
        delay={0.1}
      />
      <StackCard
        label="Total"
        value={kpis.total.toString()}
        color="#0EA5E9"
        delay={0.15}
      />
    </div>
  )
}
