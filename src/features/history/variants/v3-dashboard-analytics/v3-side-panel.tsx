import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { XIcon } from '@/assets/icons'
import type { Evaluation } from '@/types'
import { Badge } from '@/components/ui/badge'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

interface V3SidePanelProps {
  evaluation: Evaluation | null
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  neighbors: { prev?: Evaluation; next?: Evaluation }
}

export function V3SidePanel({ evaluation, onClose, onNavigate, neighbors }: V3SidePanelProps) {
  return (
    <AnimatePresence>
      {evaluation && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col"
        >
          <SidePanelContent
            ev={evaluation}
            onClose={onClose}
            onNavigate={onNavigate}
            neighbors={neighbors}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SidePanelContent({
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
  const met = ev.score >= goal
  const scoreColor = met ? '#10B981' : '#EF4444'

  return (
    <>
      {/* Header */}
      <div className="flex-none relative bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 p-5 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

        <div className="relative flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-indigo-200 font-semibold">
              {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'} · Passo {ev.sequenceAtTime}
            </p>
            <h3 className="text-lg font-bold mt-1 truncate">{ev.groupName}</h3>
            <p className="text-xs text-indigo-200 mt-0.5 truncate">{ev.managementName} · {ev.areaName}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 cursor-pointer flex-shrink-0"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="relative mt-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-indigo-200 font-semibold">Score</p>
            <p className="text-3xl font-black tabular-nums" style={{ color: met ? '#6EE7B7' : '#FCA5A5' }}>{ev.score}%</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-indigo-200 font-semibold">Meta</p>
            <p className="text-2xl font-bold tabular-nums text-white/90">{goal}%</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <Section label="Aplicador">
          <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
              {getInitials(ev.applicantName)}
            </div>
            <span className="text-sm font-medium text-gray-800">{ev.applicantName}</span>
          </div>
        </Section>

        <Section label="Data da avaliação">
          <p className="text-sm font-medium text-gray-700">
            {new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </Section>

        {ev.type === 'audit' && (
          <Section label="Decisão de avanço">
            {ev.advancedSequence ? (
              <Badge variant="success" dot>Avançou para sequência {ev.sequenceAtTime + 1}</Badge>
            ) : (
              <Badge variant="default">Mantido na sequência {ev.sequenceAtTime}</Badge>
            )}
          </Section>
        )}

        <Section label="Revisão do checklist">
          <Badge>Revisão {ev.checklistRevision}</Badge>
        </Section>

        <Section label={`Presentes (${ev.presentMembers.length})`}>
          <div className="flex flex-wrap gap-1.5">
            {ev.presentMembers.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-700"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold flex items-center justify-center">
                  {getInitials(name)}
                </div>
                {name}
              </span>
            ))}
          </div>
        </Section>

        {ev.answers.length > 0 && (
          <Section label={`Respostas (${ev.answers.length})`}>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {ev.answers.slice(0, 8).map((a, i) => (
                <div key={a.questionId} className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-gray-300 tabular-nums mt-0.5">{String(i + 1).padStart(2, '0')}</span>
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
              {ev.answers.length > 8 && (
                <p className="text-[11px] text-gray-400 text-center py-2">+ {ev.answers.length - 8} respostas</p>
              )}
            </div>
          </Section>
        )}
      </div>

      {/* Footer — navigation */}
      <div className="flex-none px-5 py-3 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 flex items-center justify-between">
        <button
          onClick={() => onNavigate('prev')}
          disabled={!neighbors.prev}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer',
            neighbors.prev ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed',
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Anterior
        </button>

        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
          ← → navegar
        </div>

        <button
          onClick={() => onNavigate('next')}
          disabled={!neighbors.next}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer',
            neighbors.next ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed',
          )}
        >
          Próximo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}
