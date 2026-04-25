import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

interface V3SparklineTableProps {
  evaluations: Evaluation[]
  selectedId: string
  onSelect: (id: string) => void
}

interface GroupSummary {
  groupId: string
  groupName: string
  groupTypeName: string
  managementName: string
  evaluations: Evaluation[]
  lastScore: number
  lastDate: string
  trend: 'up' | 'down' | 'flat'
  lastEval: Evaluation
}

function buildGroupSummaries(evaluations: Evaluation[]): GroupSummary[] {
  const byGroup = new Map<string, Evaluation[]>()
  for (const ev of evaluations) {
    const arr = byGroup.get(ev.groupId) ?? []
    arr.push(ev)
    byGroup.set(ev.groupId, arr)
  }

  return Array.from(byGroup.values())
    .map((list) => {
      const sorted = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const last = sorted[0]
      const prev = sorted[1]
      let trend: 'up' | 'down' | 'flat' = 'flat'
      if (prev) {
        const diff = last.score - prev.score
        if (Math.abs(diff) < 2) trend = 'flat'
        else if (diff > 0) trend = 'up'
        else trend = 'down'
      }
      return {
        groupId: last.groupId,
        groupName: last.groupName,
        groupTypeName: last.groupTypeName,
        managementName: last.managementName,
        evaluations: sorted.reverse(), // ascending para sparkline
        lastScore: last.score,
        lastDate: last.date,
        trend,
        lastEval: last,
      }
    })
    .sort((a, b) => b.lastScore - a.lastScore)
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 88
  const H = 26
  if (data.length < 2) {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
        {data.length === 1 && (
          <circle cx={W / 2} cy={H / 2} r={2.5} fill={color} />
        )}
      </svg>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 4) - 2
    return `${x},${y}`
  })

  const d = `M ${points.join(' L ')}`
  const area = `M 0,${H} L ${points.join(' L ')} L ${W},${H} Z`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sparkGrad-${color.replace('#', '')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={W} cy={H - ((data[data.length - 1] - min) / range) * (H - 4) - 2} r="2.5" fill={color} />
    </svg>
  )
}

function getScoreColor(score: number, goal: number): string {
  return score >= goal ? '#10B981' : score >= goal - 10 ? '#F59E0B' : '#EF4444'
}

export function V3SparklineTable({ evaluations, selectedId, onSelect }: V3SparklineTableProps) {
  const summaries = buildGroupSummaries(evaluations)

  if (summaries.length === 0) return null

  return (
    <motion.div
      className="relative h-full rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 via-cyan-400 to-emerald-400" />

      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-emerald-400 flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Grupos por performance</h3>
            <p className="text-[11px] text-gray-400">Último score + tendência inline</p>
          </div>
        </div>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
              <th className="text-left px-4 py-2 font-semibold">Grupo</th>
              <th className="text-left px-3 py-2 font-semibold hidden md:table-cell">Tendência</th>
              <th className="text-right px-3 py-2 font-semibold">Nota</th>
              <th className="text-right px-4 py-2 font-semibold">Última</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => {
              const goal = resolveGoalPct(s.lastEval) ?? 0
              const color = getScoreColor(s.lastScore, goal)
              const isSelected = s.lastEval.id === selectedId
              const trendIcon = s.trend === 'up' ? '↗' : s.trend === 'down' ? '↘' : '→'
              const trendClass = s.trend === 'up' ? 'text-emerald-600' : s.trend === 'down' ? 'text-rose-500' : 'text-gray-400'

              return (
                <tr
                  key={s.groupId}
                  onClick={() => onSelect(s.lastEval.id)}
                  className={cn(
                    'border-b border-gray-50 cursor-pointer transition group',
                    isSelected ? 'bg-indigo-50/60' : 'hover:bg-gray-50',
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition">
                      {s.groupName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {s.managementName} · {s.evaluations.length} avaliação{s.evaluations.length > 1 ? 'es' : ''}
                    </p>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Sparkline data={s.evaluations.map((e) => e.score)} color={color} />
                      <span className={cn('text-xs font-bold', trendClass)}>{trendIcon}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-black tabular-nums" style={{ color }}>{s.lastScore}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[11px] text-gray-500 tabular-nums">
                      {new Date(s.lastDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
