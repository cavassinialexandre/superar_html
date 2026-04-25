import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import type { GroupedByMonth } from '../../shared/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'
import { StatusTooltip } from '../../shared/components/status-tooltip'

// ---------------------------------------------------------------------------
// Status resolution helpers
// ---------------------------------------------------------------------------

function getStatusColor(ev: Evaluation): { main: string; light: string } {
  const goal = resolveGoalPct(ev) ?? 0
  if (ev.type === 'audit' && ev.advancedSequence === true) return { main: '#10B981', light: '#34D399' }
  if (ev.score >= goal) return { main: '#14B8A6', light: '#2DD4BF' }
  return { main: '#EF4444', light: '#F87171' }
}

function getScoreVsGoalColor(score: number, goal: number): string {
  return score >= goal ? '#10B981' : '#EF4444'
}

// ---------------------------------------------------------------------------
// Status badge icon
// ---------------------------------------------------------------------------

function StatusIcon({ ev, light = true }: { ev: Evaluation; light?: boolean }) {
  const c = light ? '#fff' : '#10B981'
  const goal = resolveGoalPct(ev) ?? 0
  if (ev.type === 'audit' && ev.advancedSequence === true) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1" />
      </svg>
    )
  }
  if (ev.score >= goal) {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      </svg>
    )
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Diamond pattern on strips
// ---------------------------------------------------------------------------

function DiamondPatternStrip() {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 16
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 3; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({
        x: col * spacing + offset + 4,
        y: row * spacing + 4,
        size: 5,
        opacity: 0.1 + Math.random() * 0.06,
      })
    }
  }
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 90" preserveAspectRatio="xMidYMid slice" fill="none">
      {diamonds.map((d, i) => (
        <rect
          key={i}
          x={d.x - d.size / 2}
          y={d.y - d.size / 2}
          width={d.size}
          height={d.size}
          transform={`rotate(45 ${d.x} ${d.y})`}
          fill="white"
          opacity={d.opacity}
        />
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Timeline node (diamond rotate-45)
// ---------------------------------------------------------------------------

function TimelineNode({ ev, index }: { ev: Evaluation; index: number }) {
  const { main, light } = getStatusColor(ev)
  return (
    <motion.div
      className="flex-shrink-0"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20, delay: index * 0.04 }}
      whileHover={{ scale: 1.08 }}
    >
      <div
        className="w-8 h-8 rotate-45 rounded-[7px] flex items-center justify-center opacity-90"
        style={{
          background: `linear-gradient(180deg, ${main} 0%, ${light} 100%)`,
          boxShadow: `0 4px 12px ${main}30`,
        }}
      >
        <div className="-rotate-45">
          <StatusIcon ev={ev} light />
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Gradient strip lateral
// ---------------------------------------------------------------------------

function GradientStrip({ ev, side }: { ev: Evaluation; side: 'left' | 'right' }) {
  const { main, light } = getStatusColor(ev)
  return (
    <div
      className={cn(
        'relative w-[36px] flex-shrink-0 flex items-center justify-center overflow-hidden opacity-90',
        side === 'left' ? 'rounded-l-xl order-first' : 'rounded-r-xl order-last',
      )}
      style={{ background: `linear-gradient(180deg, ${main} 0%, ${light} 100%)` }}
    >
      <DiamondPatternStrip />
      <span className="relative z-10 text-sm font-black text-white tabular-nums">
        {ev.sequenceAtTime}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Score progress bar
// ---------------------------------------------------------------------------

function ScoreProgressBar({ score, goal }: { score: number; goal: number }) {
  const met = score >= goal
  const barColor = met ? '#10B981' : '#EF4444'
  const barBg = met ? '#D1FAE5' : '#FEE2E2'
  return (
    <div className="w-full">
      <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: barBg }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(score, 100)}%`, background: barColor }} />
      </div>
      <div className="relative w-full h-0">
        <div
          className="absolute -top-[5px] w-[2px] h-[5px] rounded-full"
          style={{ left: `${Math.min(goal, 100)}%`, background: '#64748B', opacity: 0.5 }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Type pill
// ---------------------------------------------------------------------------

function TypePill({ type }: { type: Evaluation['type'] }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white opacity-75 whitespace-nowrap"
      style={{ backgroundColor: '#71717A' }}
    >
      {type === 'audit' ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
        </svg>
      )}
      {type === 'audit' ? 'Auditoria' : 'Follow-up'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Card content (timeline)
// ---------------------------------------------------------------------------

function TimelineCardContent({ ev, goal }: { ev: Evaluation; goal: number }) {
  const scoreColor = getScoreVsGoalColor(ev.score, goal)

  return (
    <div className="flex-1 flex flex-col px-4 py-4 min-w-0">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <TypePill type={ev.type} />
        <span className="text-xs text-gray-600 truncate max-w-[45%]">{ev.applicantName}</span>
      </div>

      {/* Grupo + tipo + gerência/área */}
      <div className="mb-2 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{ev.groupName}</p>
        <p className="text-[11px] text-gray-500 truncate mt-0.5">{ev.groupTypeName}</p>
        <p className="text-[10px] text-gray-400 truncate mt-0.5">{ev.managementName} · {ev.areaName}</p>
      </div>

      {/* Score + meta */}
      <div className="flex items-end justify-between gap-2 mb-2.5 mt-1">
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Nota</span>
          <span className="text-xl font-black tabular-nums leading-none" style={{ color: scoreColor }}>
            {ev.score}%
          </span>
        </div>
        <div className="flex flex-col items-end min-w-0">
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Meta</span>
          <span className="text-sm font-bold text-gray-600 tabular-nums leading-none">{goal}%</span>
        </div>
      </div>

      {/* Progress */}
      <ScoreProgressBar score={ev.score} goal={goal} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Date label
// ---------------------------------------------------------------------------

function DateLabel({ date }: { date: string }) {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const month = months[d.getMonth()]

  return (
    <div className="flex flex-col items-center mt-2">
      <span className="text-[12px] font-bold text-gray-700 tabular-nums leading-none">{day}</span>
      <span className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">{month}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Timeline View
// ---------------------------------------------------------------------------

interface V1TimelineViewProps {
  grouped: GroupedByMonth[]
  selectedId: string
  onSelect: (id: string) => void
}

export function V1TimelineView({ grouped, selectedId, onSelect }: V1TimelineViewProps) {
  if (grouped.length === 0) return null

  // Flatten com labels de mês
  const flat: Array<{ kind: 'month'; monthLabel: string; key: string } | { kind: 'event'; ev: Evaluation; globalIndex: number }> = []
  let globalIndex = 0
  grouped.forEach((m) => {
    flat.push({ kind: 'month', monthLabel: m.monthLabel, key: `mh-${m.monthKey}` })
    m.items.forEach((ev) => {
      flat.push({ kind: 'event', ev, globalIndex })
      globalIndex++
    })
  })

  return (
    <div className="relative">
      {/* Central axis line — fundo absoluto */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-200 to-transparent pointer-events-none" />

      {flat.map((item, idx) => {
        if (item.kind === 'month') {
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.02 }}
              className="relative z-10 flex items-center justify-center my-4"
            >
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="relative bg-gradient-to-br from-white to-gray-50 px-4 py-1 rounded-full border border-gray-200 text-[10px] font-bold tracking-widest uppercase text-gray-500 shadow-sm">
                {item.monthLabel}
              </span>
            </motion.div>
          )
        }

        const { ev, globalIndex: gi } = item
        const isLeft = gi % 2 === 0
        const goal = resolveGoalPct(ev) ?? 0
        const isSelected = ev.id === selectedId

        return (
          <div key={ev.id} className="relative flex items-stretch py-2">
            {/* Left card */}
            <div className="flex-1 flex justify-end py-1 pr-2">
              {isLeft && (
                <button
                  onClick={() => onSelect(ev.id)}
                  className={cn(
                    'w-full max-w-[420px] text-left bg-white rounded-xl border overflow-hidden transition-all duration-200 flex cursor-pointer',
                    'hover:shadow-md hover:-translate-y-0.5',
                    isSelected ? 'border-primary-400 ring-2 ring-primary-400/30 shadow-md' : 'border-gray-200',
                  )}
                >
                  <TimelineCardContent ev={ev} goal={goal} />
                  <GradientStrip ev={ev} side="right" />
                </button>
              )}
            </div>

            {/* Central axis */}
            <div className="w-[60px] flex-shrink-0 flex flex-col items-center">
              <div className="flex-1" />
              <StatusTooltip ev={ev}>
                <TimelineNode ev={ev} index={gi} />
              </StatusTooltip>
              <DateLabel date={ev.date} />
              <div className="flex-1" />
            </div>

            {/* Right card */}
            <div className="flex-1 flex justify-start py-1 pl-2">
              {!isLeft && (
                <button
                  onClick={() => onSelect(ev.id)}
                  className={cn(
                    'w-full max-w-[420px] text-left bg-white rounded-xl border overflow-hidden transition-all duration-200 flex cursor-pointer',
                    'hover:shadow-md hover:-translate-y-0.5',
                    isSelected ? 'border-primary-400 ring-2 ring-primary-400/30 shadow-md' : 'border-gray-200',
                  )}
                >
                  <GradientStrip ev={ev} side="left" />
                  <TimelineCardContent ev={ev} goal={goal} />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
