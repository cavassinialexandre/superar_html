import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

interface V4KanbanCardProps {
  ev: Evaluation
  index: number
  selectedId: string
  onSelect: (id: string) => void
  statusColor: string
  statusLight: string
}

export function V4KanbanCard({ ev, index, selectedId, onSelect, statusColor, statusLight }: V4KanbanCardProps) {
  const goal = resolveGoalPct(ev) ?? 0
  const isSelected = ev.id === selectedId
  const scoreColor = ev.score >= goal ? '#10B981' : '#EF4444'

  const d = new Date(ev.date)

  return (
    <motion.button
      onClick={() => onSelect(ev.id)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className={cn(
        'w-full text-left relative rounded-xl bg-white border overflow-hidden transition-all cursor-pointer group',
        'shadow-sm hover:shadow-md',
        isSelected ? 'ring-2 shadow-md' : 'border-gray-200',
      )}
      style={{ borderColor: isSelected ? statusColor : undefined }}
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${statusColor} 0%, ${statusLight} 100%)` }}
      />

      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{ev.groupName}</p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{ev.managementName}</p>
          </div>
          <span
            className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-[10px] font-black text-white tabular-nums flex-shrink-0"
            style={{ background: statusColor }}
          >
            {ev.sequenceAtTime}
          </span>
        </div>

        {/* Score + meta */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tabular-nums leading-none" style={{ color: scoreColor }}>
              {ev.score}%
            </span>
          </div>
          <span className="text-[10px] text-gray-400 tabular-nums">
            meta <span className="font-semibold text-gray-500">{goal}%</span>
          </span>
        </div>

        {/* Progress */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(ev.score, 100)}%`, background: scoreColor }}
          />
        </div>

        {/* Meta row */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 flex-shrink-0">
              {ev.applicantName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <span className="truncate">{ev.applicantName.split(' ')[0]}</span>
          </div>
          <span className="tabular-nums flex-shrink-0">{d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        </div>

        {/* Type */}
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold',
              ev.type === 'audit' ? 'bg-emerald-50 text-emerald-700' : 'bg-teal-50 text-teal-700',
            )}
          >
            {ev.type === 'audit' ? 'AUD' : 'F-UP'}
          </span>
          {ev.advancedSequence && (
            <span className="text-[10px] text-emerald-600 font-semibold">↗ avançou</span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
