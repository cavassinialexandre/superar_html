import { motion } from 'framer-motion'
import type { HistoryKPIs } from '../../shared/types'

interface V2StatsLedgerProps {
  kpis: HistoryKPIs
}

export function V2StatsLedger({ kpis }: V2StatsLedgerProps) {
  return (
    <motion.div
      className="relative border-y border-[#D8C89A] py-8 md:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
        <LedgerItem
          label="Avaliações"
          value={kpis.total.toString().padStart(3, '0')}
          delay={0}
        />
        <LedgerItem
          label="Score médio"
          value={`${kpis.avgScore.toFixed(0)}%`}
          delta={kpis.trend}
          delay={0.1}
        />
        <LedgerItem
          label="Avanços"
          value={`${Math.round(kpis.advanceRate)}%`}
          delay={0.2}
        />
        <LedgerItem
          label="Follow-ups"
          value={kpis.followupCount.toString().padStart(2, '0')}
          delay={0.3}
        />
      </div>
    </motion.div>
  )
}

function LedgerItem({
  label,
  value,
  delta,
  delay,
}: {
  label: string
  value: string
  delta?: HistoryKPIs['trend']
  delay: number
}) {
  const arrow = delta?.direction === 'up' ? '↗' : delta?.direction === 'down' ? '↘' : delta?.direction === 'flat' ? '' : ''

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 + delay }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-[#8A7A4A] font-semibold"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-5xl md:text-6xl font-light text-[#0A0A0A] tabular-nums leading-none tracking-tight"
        style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }}
      >
        {value}
        {delta && (
          <span
            className="ml-2 text-xl align-middle"
            style={{ color: delta.direction === 'up' ? '#538C4E' : delta.direction === 'down' ? '#9F3A3A' : '#8A7A4A' }}
          >
            {arrow}
          </span>
        )}
      </p>
    </motion.div>
  )
}
