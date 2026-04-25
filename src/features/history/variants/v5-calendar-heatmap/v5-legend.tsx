import { motion } from 'framer-motion'

interface V5LegendProps {
  total: number
  daysActive: number
  avgScore: number
}

export function V5Legend({ total, daysActive, avgScore }: V5LegendProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-4 grid grid-cols-3 gap-3"
    >
      <Stat label="Dias ativos" value={daysActive.toString()} accent="#0284C7" />
      <Stat label="Avaliações" value={total.toString()} accent="#0EA5E9" />
      <Stat label="Média geral" value={`${avgScore.toFixed(0)}%`} accent="#0891B2" />
    </motion.div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">{label}</p>
      <p className="text-xl font-black tabular-nums mt-1" style={{ color: accent }}>{value}</p>
    </div>
  )
}
