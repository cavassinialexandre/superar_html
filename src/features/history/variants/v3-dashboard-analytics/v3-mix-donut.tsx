import { motion } from 'framer-motion'
import type { HistoryKPIs } from '../../shared/types'

interface V3MixDonutProps {
  kpis: HistoryKPIs
  onFilterAudit?: () => void
  onFilterFollowup?: () => void
}

export function V3MixDonut({ kpis, onFilterAudit, onFilterFollowup }: V3MixDonutProps) {
  const total = kpis.total
  const auditPct = total > 0 ? (kpis.auditCount / total) * 100 : 0
  const followupPct = total > 0 ? (kpis.followupCount / total) * 100 : 0

  const size = 140
  const sw = 20
  const r = (size - sw) / 2
  const circumference = 2 * Math.PI * r

  const auditDash = (auditPct / 100) * circumference
  const followupDash = (followupPct / 100) * circumference

  return (
    <motion.div
      className="relative h-full rounded-2xl bg-white border border-gray-200 p-5 overflow-hidden shadow-sm flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-pink-400 to-rose-400" />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 0 1 0 20" />
            <path d="M12 2a10 10 0 0 0 0 20" strokeDasharray="3 3" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">Mix</h3>
          <p className="text-[11px] text-gray-400">Auditoria / Follow-up</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-2">
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={sw} />

            {/* Auditoria */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth={sw}
              strokeLinecap="butt"
              strokeDasharray={`${auditDash} ${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Follow-up */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#EC4899"
              strokeWidth={sw}
              strokeLinecap="butt"
              strokeDasharray={`${followupDash} ${circumference}`}
              strokeDashoffset={-auditDash}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: -auditDash }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-800 tabular-nums">{total}</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Total</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={onFilterAudit}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-purple-50 transition cursor-pointer text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Auditoria</p>
            <p className="text-xs font-bold text-gray-800 tabular-nums">{kpis.auditCount} · {Math.round(auditPct)}%</p>
          </div>
        </button>
        <button
          onClick={onFilterFollowup}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-pink-50 transition cursor-pointer text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Follow-up</p>
            <p className="text-xs font-bold text-gray-800 tabular-nums">{kpis.followupCount} · {Math.round(followupPct)}%</p>
          </div>
        </button>
      </div>
    </motion.div>
  )
}
