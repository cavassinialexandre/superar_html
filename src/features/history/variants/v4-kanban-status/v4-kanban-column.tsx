import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import { V4KanbanCard } from './v4-kanban-card'

interface V4KanbanColumnProps {
  title: string
  caption: string
  evaluations: Evaluation[]
  accent: string
  accentLight: string
  bgTint: string
  selectedId: string
  onSelect: (id: string) => void
  delay: number
}

export function V4KanbanColumn({
  title,
  caption,
  evaluations,
  accent,
  accentLight,
  bgTint,
  selectedId,
  onSelect,
  delay,
}: V4KanbanColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm min-w-[300px] md:min-w-0"
    >
      {/* Header */}
      <div className="relative px-4 py-4 border-b" style={{ borderColor: `${accent}20`, background: bgTint }}>
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accentLight} 100%)` }}
        />
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">{title}</h3>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">{caption}</p>
          </div>
          <span
            className="inline-flex items-center justify-center min-w-[30px] h-7 px-2 rounded-full text-xs font-black tabular-nums text-white"
            style={{ background: accent }}
          >
            {evaluations.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div
        className={cn(
          'flex-1 p-3 overflow-y-auto max-h-[70vh] space-y-3',
          evaluations.length === 0 && 'flex items-center justify-center',
        )}
        style={{ background: '#FAFBFC' }}
      >
        {evaluations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-white border-2 border-dashed flex items-center justify-center mb-3" style={{ borderColor: `${accent}40` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 italic">Nenhuma avaliação nesta coluna</p>
          </div>
        ) : (
          evaluations.map((ev, idx) => (
            <V4KanbanCard
              key={ev.id}
              ev={ev}
              index={idx}
              selectedId={selectedId}
              onSelect={onSelect}
              statusColor={accent}
              statusLight={accentLight}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}
