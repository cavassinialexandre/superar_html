import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { XIcon } from '@/assets/icons'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

interface V5DayDetailPanelProps {
  dayKey: string | null
  evaluations: Evaluation[]
  onClose: () => void
  onSelectEvaluation: (id: string) => void
  selectedEvalId: string
}

export function V5DayDetailPanel({ dayKey, evaluations, onClose, onSelectEvaluation, selectedEvalId }: V5DayDetailPanelProps) {
  return (
    <AnimatePresence>
      {dayKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-white border border-sky-200 shadow-md overflow-hidden"
        >
          {(() => {
            const [y, m, d] = dayKey.split('-').map(Number)
            const date = new Date(y, m - 1, d)
            const dateStr = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
            const avg = evaluations.length > 0
              ? evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length
              : 0

            return (
              <>
                {/* Header */}
                <div className="bg-gradient-to-br from-sky-50 to-white border-b border-sky-100 px-5 py-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-sky-700 font-bold">Dia selecionado</p>
                    <h3 className="text-lg font-black text-gray-800 mt-0.5 capitalize">{dateStr}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="tabular-nums font-bold text-gray-700">{evaluations.length}</span> avaliação{evaluations.length > 1 ? 'es' : ''}
                      {evaluations.length > 0 && (
                        <>
                          {' '}· média <span className="tabular-nums font-bold text-sky-700">{avg.toFixed(0)}%</span>
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <XIcon size={16} />
                  </button>
                </div>

                {/* List */}
                {evaluations.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-400 italic">Nenhuma avaliação neste dia.</p>
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    {evaluations.map((ev) => (
                      <DayEvalCard
                        key={ev.id}
                        ev={ev}
                        isSelected={ev.id === selectedEvalId}
                        onClick={() => onSelectEvaluation(ev.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DayEvalCard({ ev, isSelected, onClick }: { ev: Evaluation; isSelected: boolean; onClick: () => void }) {
  const goal = resolveGoalPct(ev) ?? 0
  const met = ev.score >= goal
  const advanced = ev.type === 'audit' && ev.advancedSequence === true

  const color = advanced ? '#10B981' : met ? '#14B8A6' : '#EF4444'
  const status = advanced ? 'Avançou' : met ? 'Meta' : 'Abaixo'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-xl border bg-white flex items-center gap-3 transition cursor-pointer',
        isSelected ? 'border-sky-400 ring-2 ring-sky-400/30 shadow-sm' : 'border-gray-200 hover:bg-gray-50',
      )}
    >
      {/* Mini score ring */}
      <div className="relative flex-shrink-0" style={{ width: 44, height: 44 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#F1F5F9" strokeWidth="4" />
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(Math.min(ev.score, 100) / 100) * 2 * Math.PI * 18} ${2 * Math.PI * 18}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black tabular-nums" style={{ color }}>{ev.score}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-gray-800 truncate">{ev.groupName}</p>
          <span
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0"
            style={{ background: `${color}15`, color }}
          >
            {status}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'} · passo {ev.sequenceAtTime} · {ev.applicantName}
        </p>
      </div>
    </button>
  )
}
