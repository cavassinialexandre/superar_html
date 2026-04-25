import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Badge } from '@/components/ui/badge'
import type { Evaluation } from '@/types'
import type { HistoryDrawerTab } from '../../shared/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'
import { groups } from '@/mocks/data'
import { V7ContextNarrative } from './v7-context-narrative'

interface V7DetailDrawerProps {
  evaluation: Evaluation | null
  activeTab: HistoryDrawerTab
  onClose: () => void
  onTabChange: (tab: HistoryDrawerTab) => void
}

export function V7DetailDrawer({ evaluation, activeTab, onClose, onTabChange }: V7DetailDrawerProps) {
  const open = evaluation !== null

  // Keyboard: Esc + tabs numéricas (1-4)
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (inInput) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === '1') {
        e.preventDefault()
        onTabChange('context')
      } else if (e.key === '2') {
        e.preventDefault()
        onTabChange('summary')
      } else if (e.key === '3') {
        e.preventDefault()
        onTabChange('answers')
      } else if (e.key === '4') {
        e.preventDefault()
        onTabChange('attendance')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, onTabChange])

  const headerIcon = (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )

  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      title={evaluation?.groupName ?? ''}
      subtitle={evaluation ? `${evaluation.managementName} · ${evaluation.areaName}` : ''}
      size="lg"
      headerIcon={headerIcon}
    >
      {evaluation && (
        <>
          {/* Tabs sub-header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3">
            <div className="inline-flex p-0.5 bg-gray-100 rounded-lg gap-0.5">
              <TabButton active={activeTab === 'context'} onClick={() => onTabChange('context')} hint="1">Contexto</TabButton>
              <TabButton active={activeTab === 'summary'} onClick={() => onTabChange('summary')} hint="2">Resumo</TabButton>
              <TabButton active={activeTab === 'answers'} onClick={() => onTabChange('answers')} hint="3">Respostas</TabButton>
              <TabButton active={activeTab === 'attendance'} onClick={() => onTabChange('attendance')} hint="4">Presentes</TabButton>
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {activeTab === 'context' && <V7ContextNarrative ev={evaluation} />}
              {activeTab === 'summary' && <TabSummary ev={evaluation} />}
              {activeTab === 'answers' && <TabAnswers ev={evaluation} />}
              {activeTab === 'attendance' && <TabAttendance ev={evaluation} />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </SlideOverDrawer>
  )
}

function TabButton({
  active,
  onClick,
  children,
  hint,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  hint?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer',
        active ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700',
      )}
    >
      {children}
      {hint && <span className="text-[9px] font-mono text-gray-400 bg-gray-100 px-1 rounded hidden sm:inline">{hint}</span>}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Tab: Summary — UI idêntica ao V1
// ---------------------------------------------------------------------------

function TabSummary({ ev }: { ev: Evaluation }) {
  const goal = resolveGoalPct(ev) ?? 0
  const met = ev.score >= goal
  const scoreColor = met ? '#10B981' : '#EF4444'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <ScoreRing score={ev.score} goal={goal} color={scoreColor} />
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Resultado</p>
          {ev.type === 'audit' ? (
            ev.advancedSequence ? (
              <div className="mt-2">
                <p className="text-xl font-black text-green-600">Avançou para seq. {ev.sequenceAtTime + 1}</p>
                <p className="text-sm text-gray-500 mt-1">Meta {goal}% atingida e critérios obrigatórios cumpridos.</p>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-xl font-black text-gray-700">Manteve na sequência {ev.sequenceAtTime}</p>
                <p className="text-sm text-gray-500 mt-1">Aguardando condições para avanço.</p>
              </div>
            )
          ) : (
            <div className="mt-2">
              <p className="text-xl font-black text-primary-700">Follow-up concluído</p>
              <p className="text-sm text-gray-500 mt-1">Acompanhamento em sequência {ev.sequenceAtTime}.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Tipo">
          <Badge variant={ev.type === 'audit' ? 'primary' : 'info'}>
            {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'}
          </Badge>
        </KPI>
        <KPI label="Data">
          <span className="text-sm font-semibold text-gray-800">
            {new Date(ev.date).toLocaleDateString('pt-BR')}
          </span>
        </KPI>
        <KPI label="Sequência">
          <span className="text-sm font-semibold text-gray-800 tabular-nums">Passo {ev.sequenceAtTime}</span>
        </KPI>
        <KPI label="Revisão">
          <Badge>Rev. {ev.checklistRevision}</Badge>
        </KPI>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KPI label="Score obtido">
          <span className="text-xl font-black tabular-nums" style={{ color: scoreColor }}>{ev.score}%</span>
        </KPI>
        <KPI label="Meta da sequência">
          <span className="text-xl font-black text-gray-700 tabular-nums">{goal}%</span>
        </KPI>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Aplicador</p>
        <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
            {getInitials(ev.applicantName)}
          </div>
          <span className="text-sm font-medium text-gray-800">{ev.applicantName}</span>
        </div>
      </div>
    </div>
  )
}

function ScoreRing({ score, goal, color }: { score: number; goal: number; color: string }) {
  const size = 120
  const sw = 10
  const center = size / 2
  const r = (size - sw) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(score, 100) / 100)

  const goalAngle = (goal / 100) * 360 - 90
  const goalRad = (goalAngle * Math.PI) / 180
  const markerR = r + sw / 2 + 3
  const markerInnerR = r - sw / 2 - 3
  const mx1 = center + markerInnerR * Math.cos(goalRad)
  const my1 = center + markerInnerR * Math.sin(goalRad)
  const mx2 = center + markerR * Math.cos(goalRad)
  const my2 = center + markerR * Math.sin(goalRad)

  return (
    <div className="relative flex-shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={r} fill="none" stroke="#F1F5F9" strokeWidth={sw} />
        <motion.circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <line x1={mx1} y1={my1} x2={mx2} y2={my2} stroke="#64748B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tabular-nums" style={{ color }}>{score}%</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Meta {goal}%</span>
      </div>
    </div>
  )
}

function KPI({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
      <p className="text-[9px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

// ---------------------------------------------------------------------------
// Tab: Answers — UI idêntica ao V1
// ---------------------------------------------------------------------------

function TabAnswers({ ev }: { ev: Evaluation }) {
  if (ev.answers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Nenhuma resposta registrada nesta avaliação.</p>
        <p className="text-xs text-gray-400 mt-2">Respostas individuais são preservadas apenas para auditorias realizadas após a versão 3.0.</p>
      </div>
    )
  }

  const problems = ev.answers.filter((a) => a.answer !== 'yes').length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-800">{ev.answers.length}</span> respostas ·{' '}
          <span className="font-bold text-amber-600">{problems}</span> problemas
        </p>
      </div>
      <div className="space-y-2">
        {ev.answers.map((a, i) => (
          <div key={a.questionId} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-gray-300 mt-0.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{a.questionText}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      a.answer === 'yes' ? 'success'
                        : a.answer === 'partial' ? 'warning'
                          : a.answer === 'no' ? 'error' : 'default'
                    }
                  >
                    {a.answer === 'yes' ? 'Sim' : a.answer === 'partial' ? 'Parcial' : a.answer === 'no' ? 'Não' : 'N/A'}
                  </Badge>
                  <span className="text-[10px] text-gray-400">Peso {a.weight}</span>
                  {a.requiredYesForAdvance && (
                    <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                      Obrig. Sim
                    </Badge>
                  )}
                </div>
                {a.justification && (
                  <p className="text-xs text-gray-500 mt-2 italic">"{a.justification}"</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Attendance — UI idêntica ao V1
// ---------------------------------------------------------------------------

function TabAttendance({ ev }: { ev: Evaluation }) {
  const group = groups.find((g) => g.id === ev.groupId)
  const allTeam = group?.team ?? []

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3">
          Presentes na avaliação
          <span className="ml-2 text-gray-500 font-bold tabular-nums">{ev.presentMembers.length}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {ev.presentMembers.map((name) => (
            <div
              key={name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700"
            >
              <div className="w-6 h-6 rounded-full bg-primary-700 text-white text-[10px] font-bold flex items-center justify-center">
                {getInitials(name)}
              </div>
              <span className="text-xs font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {ev.otherPeople && (
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Outros participantes</p>
          <p className="text-sm text-gray-700">{ev.otherPeople}</p>
        </div>
      )}

      {group && allTeam.length > ev.presentMembers.length && (
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3">
            Ausentes no momento da avaliação
          </p>
          <div className="flex flex-wrap gap-2">
            {allTeam
              .filter((m) => !ev.presentMembers.includes(m.name))
              .map((m) => (
                <div
                  key={m.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold flex items-center justify-center">
                    {getInitials(m.name)}
                  </div>
                  <span className="text-xs">{m.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
