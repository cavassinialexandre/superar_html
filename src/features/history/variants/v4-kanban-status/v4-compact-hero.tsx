import { motion } from 'framer-motion'
import type { StatusBuckets } from '../../shared/types'

interface V4CompactHeroProps {
  buckets: StatusBuckets
}

export function V4CompactHero({ buckets }: V4CompactHeroProps) {
  const total = buckets.avancou.length + buckets.meta.length + buckets.abaixo.length

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 p-5 shadow-sm"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-bold">V4 · Kanban por Status</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900">
            {total} avaliações · triagem por resultado
          </h2>
          <p className="text-sm text-gray-500 mt-1">Organize por decisão de avanço, meta e desempenho.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusPill label="Avançaram" count={buckets.avancou.length} accent="#10B981" bg="#D1FAE5" />
          <StatusPill label="Meta" count={buckets.meta.length} accent="#14B8A6" bg="#CCFBF1" />
          <StatusPill label="Abaixo" count={buckets.abaixo.length} accent="#EF4444" bg="#FEE2E2" />
        </div>
      </div>
    </motion.div>
  )
}

function StatusPill({ label, count, accent, bg }: { label: string; count: number; accent: string; bg: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
      style={{ background: bg, color: accent }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
      <span className="tabular-nums">{count}</span>
      <span className="opacity-80">{label}</span>
    </div>
  )
}
