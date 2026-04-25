import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

function getStatusColor(ev: Evaluation): { main: string; light: string } {
  const goal = resolveGoalPct(ev) ?? 0
  if (ev.type === 'audit' && ev.advancedSequence === true) return { main: '#10B981', light: '#34D399' }
  if (ev.score >= goal) return { main: '#14B8A6', light: '#2DD4BF' }
  return { main: '#EF4444', light: '#F87171' }
}

function getScoreColor(score: number, goal: number): string {
  return score >= goal ? '#10B981' : '#EF4444'
}

function DiamondPatternStrip() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 60" preserveAspectRatio="xMidYMid slice" fill="none">
      {Array.from({ length: 12 }, (_, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x = col * 16 + (row % 2 === 0 ? 4 : 12)
        const y = row * 16 + 6
        return <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" transform={`rotate(45 ${x} ${y})`} fill="white" opacity={0.13} />
      })}
    </svg>
  )
}

function TypePill({ type }: { type: Evaluation['type'] }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white opacity-75 whitespace-nowrap"
      style={{ backgroundColor: '#71717A' }}
    >
      {type === 'audit' ? 'Auditoria' : 'Follow-up'}
    </span>
  )
}

interface V1TabularViewProps {
  evaluations: Evaluation[]
  selectedId: string
  onSelect: (id: string) => void
  density?: 'compact' | 'cozy'
}

export function V1TabularView({ evaluations, selectedId, onSelect, density = 'cozy' }: V1TabularViewProps) {
  const padY = density === 'compact' ? 'py-2' : 'py-3'

  return (
    <div className="space-y-1.5">
      {/* Headers */}
      <div className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
        <div className="w-[36px] flex-shrink-0" />
        <div className="w-[72px]">Data</div>
        <div className="w-[100px]">Tipo</div>
        <div className="flex-1 min-w-0">Grupo</div>
        <div className="w-[140px] hidden lg:block">Aplicador</div>
        <div className="w-[90px] text-right">Nota</div>
        <div className="w-[70px] text-right">Meta</div>
        <div className="w-[70px] hidden md:block">Avanço</div>
        <div className="w-[16px]" />
      </div>

      {evaluations.map((ev, idx) => {
        const goal = resolveGoalPct(ev) ?? 0
        const { main, light } = getStatusColor(ev)
        const scoreColor = getScoreColor(ev.score, goal)
        const isSelected = ev.id === selectedId

        const d = new Date(ev.date)
        const day = d.getDate().toString().padStart(2, '0')
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        const month = months[d.getMonth()]

        return (
          <motion.button
            key={ev.id}
            onClick={() => onSelect(ev.id)}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.02 }}
            className={cn(
              'w-full text-left flex items-stretch gap-0 rounded-xl border bg-white overflow-hidden transition-all cursor-pointer',
              'hover:shadow-md hover:-translate-y-px',
              isSelected ? 'border-primary-400 ring-2 ring-primary-400/30 shadow-md' : 'border-gray-200',
            )}
          >
            {/* Strip */}
            <div
              className="relative w-[36px] flex-shrink-0 flex items-center justify-center overflow-hidden opacity-90"
              style={{ background: `linear-gradient(180deg, ${main} 0%, ${light} 100%)` }}
            >
              <DiamondPatternStrip />
              <span className="relative z-10 text-sm font-black text-white tabular-nums">{ev.sequenceAtTime}</span>
            </div>

            {/* Row content */}
            <div className={cn('flex-1 flex items-center gap-3 px-4', padY)}>
              <div className="w-[72px] flex flex-col">
                <span className="text-xs font-bold text-gray-700 tabular-nums leading-none">{day}</span>
                <span className="text-[9px] text-gray-400 uppercase mt-0.5">{month}</span>
              </div>

              <div className="w-[100px]">
                <TypePill type={ev.type} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{ev.groupName}</p>
                <p className="text-[10px] text-gray-400 truncate">{ev.managementName} · {ev.areaName}</p>
              </div>

              <div className="w-[140px] hidden lg:block min-w-0">
                <span className="text-xs text-gray-600 truncate block">{ev.applicantName}</span>
              </div>

              <div className="w-[90px] text-right">
                <span className="text-sm font-bold tabular-nums leading-none" style={{ color: scoreColor }}>
                  {ev.score}%
                </span>
              </div>

              <div className="w-[70px] text-right">
                <span className="text-xs font-semibold text-gray-500 tabular-nums">{goal}%</span>
              </div>

              <div className="w-[70px] hidden md:flex items-center">
                {ev.type === 'audit' ? (
                  ev.advancedSequence ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Avançou
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400">Manteve</span>
                  )
                ) : (
                  <span className="text-[10px] text-gray-300">—</span>
                )}
              </div>

              <div className="w-[16px] text-gray-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
