import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'
import { groups } from '@/mocks/data'

interface V6SplitPanelProps {
  evaluation: Evaluation | null
  tab: 'summary' | 'answers' | 'team'
  onTabChange: (t: 'summary' | 'answers' | 'team') => void
}

export function V6SplitPanel({ evaluation, tab, onTabChange }: V6SplitPanelProps) {
  if (!evaluation) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div>
          <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
              <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700">Nenhum item selecionado</p>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            ↑↓ ou j/k para navegar · Enter para abrir
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ maxHeight: 'calc(100vh - 260px)' }}>
      {/* Header */}
      <V6Header ev={evaluation} />

      {/* Tabs */}
      <div className="flex-none flex items-center gap-1 px-5 border-b border-gray-100">
        {(['summary', 'answers', 'team'] as const).map((t, idx) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={cn(
              'relative py-3 px-3 text-xs font-semibold transition cursor-pointer',
              tab === t ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {t === 'summary' ? 'Summary' : t === 'answers' ? 'Answers' : 'Team'}
              <kbd className="px-1 py-0.5 rounded text-[9px] font-mono bg-gray-100 text-gray-500">{idx + 1}</kbd>
            </span>
            {tab === t && (
              <motion.div
                layoutId="v6tab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900"
              />
            )}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="p-5"
          >
            {tab === 'summary' && <TabSummary ev={evaluation} />}
            {tab === 'answers' && <TabAnswers ev={evaluation} />}
            {tab === 'team' && <TabTeam ev={evaluation} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer shortcuts */}
      <V6ShortcutLegend />
    </div>
  )
}

function V6Header({ ev }: { ev: Evaluation }) {
  return (
    <div className="flex-none bg-gradient-to-b from-gray-50 to-white px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <span className={cn(
          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono',
          ev.type === 'audit' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700',
        )}>
          {ev.type === 'audit' ? 'AUDIT' : 'F-UP'}
        </span>
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
          seq.{ev.sequenceAtTime} · rev.{ev.checklistRevision}
        </span>
      </div>
      <h2 className="text-xl font-black text-gray-900 tracking-tight">{ev.groupName}</h2>
      <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
        {ev.managementName} / {ev.areaName} · {new Date(ev.date).toLocaleDateString('pt-BR')}
      </p>
    </div>
  )
}

function TabSummary({ ev }: { ev: Evaluation }) {
  const goal = resolveGoalPct(ev) ?? 0
  const met = ev.score >= goal
  const scoreColor = met ? '#10B981' : '#EF4444'

  return (
    <div className="space-y-5">
      {/* Score ring */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            <circle
              cx="45"
              cy="45"
              r="36"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(Math.min(ev.score, 100) / 100) * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black tabular-nums" style={{ color: scoreColor }}>{ev.score}%</span>
            <span className="text-[9px] text-gray-400 uppercase">/{goal}%</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-mono">Veredicto</p>
          <p className={cn('text-lg font-black mt-1', met ? 'text-emerald-600' : 'text-rose-600')}>
            {ev.type === 'audit' && ev.advancedSequence ? 'Avançou' : met ? 'Meta atingida' : 'Abaixo da meta'}
          </p>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Aplicador" value={ev.applicantName} mono />
        <StatBox label="Presentes" value={`${ev.presentMembers.length} pessoas`} />
        <StatBox label="Tipo" value={ev.type === 'audit' ? 'Auditoria' : 'Follow-up'} />
        <StatBox label="Sequência" value={`${ev.sequenceAtTime}`} mono />
      </div>
    </div>
  )
}

function StatBox({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-mono">{label}</p>
      <p className={cn('text-xs mt-1 text-gray-800 font-semibold', mono && 'font-mono tabular-nums')}>{value}</p>
    </div>
  )
}

function TabAnswers({ ev }: { ev: Evaluation }) {
  const [showOnlyProblems, setShowOnlyProblems] = useState(false)
  const filtered = showOnlyProblems ? ev.answers.filter((a) => a.answer !== 'yes') : ev.answers

  if (ev.answers.length === 0) {
    return <p className="text-sm text-gray-400 italic">Sem respostas registradas.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-500 font-mono">
          {filtered.length} de {ev.answers.length} · {ev.answers.filter((a) => a.answer !== 'yes').length} problemas
        </p>
        <button
          onClick={() => setShowOnlyProblems((x) => !x)}
          className={cn(
            'text-[10px] font-mono px-2 py-1 rounded border cursor-pointer transition',
            showOnlyProblems
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50',
          )}
        >
          {showOnlyProblems ? '● problemas' : '○ ver todas'}
        </button>
      </div>
      <div className="space-y-1.5">
        {filtered.map((a, i) => {
          const colors = {
            yes: 'bg-emerald-500',
            partial: 'bg-amber-500',
            no: 'bg-rose-500',
            na: 'bg-gray-300',
          }
          return (
            <div key={a.questionId} className="flex items-start gap-2 p-2 rounded hover:bg-gray-50">
              <span className="text-[10px] font-mono text-gray-300 tabular-nums flex-shrink-0 mt-0.5 w-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', colors[a.answer])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700">{a.questionText}</p>
                {a.justification && (
                  <p className="text-[10px] text-gray-500 italic mt-0.5">"{a.justification}"</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TabTeam({ ev }: { ev: Evaluation }) {
  const group = groups.find((g) => g.id === ev.groupId)
  const all = group?.team ?? []

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-mono mb-2">
          Presentes ({ev.presentMembers.length})
        </p>
        <div className="space-y-1">
          {ev.presentMembers.map((name) => (
            <div key={name} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <span className="text-xs text-gray-700 font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {all.length > ev.presentMembers.length && (
        <div>
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-mono mb-2">
            Ausentes ({all.length - ev.presentMembers.length})
          </p>
          <div className="space-y-1">
            {all.filter((m) => !ev.presentMembers.includes(m.name)).map((m) => (
              <div key={m.id} className="flex items-center gap-2 p-1.5 rounded opacity-60">
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <span className="text-xs text-gray-500">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function V6ShortcutLegend() {
  return (
    <div className="flex-none border-t border-gray-100 px-5 py-2.5 bg-gray-50/60">
      <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 flex-wrap">
        <Shortcut keys={['↑', '↓']} label="navigate" />
        <Shortcut keys={['j', 'k']} label="vim-nav" />
        <Shortcut keys={['1', '2', '3']} label="tabs" />
        <Shortcut keys={['Esc']} label="close" />
      </div>
    </div>
  )
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="inline-flex items-center gap-1">
      {keys.map((k, i) => (
        <kbd key={i} className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600 tabular-nums">{k}</kbd>
      ))}
      <span className="ml-0.5 text-gray-400">{label}</span>
    </div>
  )
}
