import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from '@/assets/icons'
import type { Evaluation } from '@/types'
import { resolveGoalPct, classifyByStatus } from '../../shared/utils/evaluation-adapter'
import { Badge } from '@/components/ui/badge'

interface V4DetailModalProps {
  evaluation: Evaluation | null
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  neighbors: { prev?: Evaluation; next?: Evaluation }
}

export function V4DetailModal({ evaluation, onClose, onNavigate, neighbors }: V4DetailModalProps) {
  return (
    <AnimatePresence>
      {evaluation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <ModalContent ev={evaluation} onClose={onClose} onNavigate={onNavigate} neighbors={neighbors} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ModalContent({
  ev,
  onClose,
  onNavigate,
  neighbors,
}: {
  ev: Evaluation
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  neighbors: { prev?: Evaluation; next?: Evaluation }
}) {
  const goal = resolveGoalPct(ev) ?? 0
  const buckets = classifyByStatus([ev])
  const inBucket = buckets.avancou.length ? 'avancou' : buckets.meta.length ? 'meta' : 'abaixo'

  const accent =
    inBucket === 'avancou' ? '#10B981' :
      inBucket === 'meta' ? '#14B8A6' : '#EF4444'
  const accentLight =
    inBucket === 'avancou' ? '#34D399' :
      inBucket === 'meta' ? '#2DD4BF' : '#F87171'

  return (
    <>
      {/* Header */}
      <div className="flex-none p-5 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accentLight} 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-80">
              {inBucket === 'avancou' ? 'Avançou' : inBucket === 'meta' ? 'Meta atingida' : 'Abaixo da meta'}
            </p>
            <h2 className="text-2xl font-black mt-1 truncate">{ev.groupName}</h2>
            <p className="text-sm opacity-90 mt-0.5">{ev.managementName} · {ev.areaName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
          >
            <XIcon size={18} />
          </button>
        </div>
      </div>

      {/* Body: 3 columns */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Col 1: Resumo */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Resumo</p>
            <div className="mt-3 space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Score</p>
                <p className="text-4xl font-black mt-1 tabular-nums" style={{ color: accent }}>{ev.score}%</p>
                <p className="text-xs text-gray-500 mt-1">Meta: <span className="font-bold text-gray-800 tabular-nums">{goal}%</span></p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Tipo</p>
                <Badge variant={ev.type === 'audit' ? 'primary' : 'info'}>
                  {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'}
                </Badge>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Passo</p>
                <p className="text-sm font-semibold text-gray-800 tabular-nums">Sequência {ev.sequenceAtTime}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Data</p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Aplicador</p>
                <p className="text-sm font-semibold text-gray-800">{ev.applicantName}</p>
              </div>
            </div>
          </div>

          {/* Col 2: Respostas */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Respostas</p>
            {ev.answers.length === 0 ? (
              <p className="mt-3 text-sm text-gray-400 italic">Sem respostas detalhadas registradas.</p>
            ) : (
              <div className="mt-3 space-y-2 max-h-[480px] overflow-y-auto pr-2">
                {ev.answers.slice(0, 20).map((a, i) => (
                  <div key={a.questionId} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-gray-300 mt-0.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 line-clamp-2">{a.questionText}</p>
                        <Badge
                          className="mt-1"
                          variant={a.answer === 'yes' ? 'success' : a.answer === 'partial' ? 'warning' : a.answer === 'no' ? 'error' : 'default'}
                        >
                          {a.answer === 'yes' ? 'Sim' : a.answer === 'partial' ? 'Parcial' : a.answer === 'no' ? 'Não' : 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Col 3: Presentes */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Presentes ({ev.presentMembers.length})</p>
            <div className="mt-3 flex flex-col gap-2">
              {ev.presentMembers.map((name) => (
                <div
                  key={name}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">
                    {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <span className="text-xs font-medium text-gray-800">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none px-6 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <button
          onClick={() => onNavigate('prev')}
          disabled={!neighbors.prev}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            neighbors.prev ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300'
          }`}
        >
          ← Anterior
        </button>
        <span className="text-[10px] text-gray-400">← → para navegar · Esc para fechar</span>
        <button
          onClick={() => onNavigate('next')}
          disabled={!neighbors.next}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            neighbors.next ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300'
          }`}
        >
          Próximo →
        </button>
      </div>
    </>
  )
}
