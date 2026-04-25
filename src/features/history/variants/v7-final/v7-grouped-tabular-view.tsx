import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import type { GroupedByMonth } from '../../shared/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'
import { StatusTooltip } from '../../shared/components/status-tooltip'

// ---------------------------------------------------------------------------
// Status resolution
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
// Status badge icons (mesmo padrão V10)
// ---------------------------------------------------------------------------

function BadgeIconTrophy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1" />
    </svg>
  )
}

function BadgeIconFlag() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <line x1="6" y1="3" x2="6" y2="22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M6 4 C6 4 10 6 14 4 C17 2.5 19 4.5 19 4.5 L19 11 C19 11 17 8.5 14 10.5 C10 12.5 6 10.5 6 10.5 Z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BadgeIconArrowDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke="#fff" strokeWidth="2.5" />
      <polyline points="17 18 23 18 23 12" stroke="#fff" strokeWidth="2.5" />
    </svg>
  )
}

function StatusBadgeIcon({ ev }: { ev: Evaluation }) {
  const goal = resolveGoalPct(ev) ?? 0
  if (ev.type === 'audit' && ev.advancedSequence === true) return <BadgeIconTrophy />
  if (ev.score >= goal) return <BadgeIconFlag />
  return <BadgeIconArrowDown />
}

// ---------------------------------------------------------------------------
// Diamond pattern on strip
// ---------------------------------------------------------------------------

function DiamondPatternStrip() {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 16
  for (let row = 0; row < 5; row++) {
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
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 70" preserveAspectRatio="xMidYMid slice" fill="none">
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
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.04 }}
      whileHover={{ scale: 1.06 }}
    >
      <div
        className="w-7 h-7 rotate-45 rounded-[6px] flex items-center justify-center opacity-85"
        style={{
          background: `linear-gradient(180deg, ${main} 0%, ${light} 100%)`,
          boxShadow: `0 4px 12px ${main}20`,
        }}
      >
        <div className="-rotate-45">
          <StatusBadgeIcon ev={ev} />
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Type pill
// ---------------------------------------------------------------------------

function TypePill({ type }: { type: Evaluation['type'] }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex-shrink-0 whitespace-nowrap opacity-65"
      style={{ backgroundColor: '#71717A' }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {type === 'audit' ? (
          <>
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </>
        ) : (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
          </>
        )}
      </svg>
      {type === 'audit' ? 'Auditoria' : 'Follow-up'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Gradient strip tabular (always left, com sequence number)
// ---------------------------------------------------------------------------

function GradientStripTabular({ ev }: { ev: Evaluation }) {
  const { main, light } = getStatusColor(ev)
  return (
    <div
      className="relative w-[36px] flex-shrink-0 rounded-l-xl flex items-center justify-center overflow-hidden opacity-85"
      style={{ background: `linear-gradient(180deg, ${main} 0%, ${light} 100%)` }}
    >
      <DiamondPatternStrip />
      <span className="relative z-10 text-sm font-bold text-white tabular-nums">
        {ev.sequenceAtTime}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Grid: Data | Tipo | Grupo (+ tipo + gerência/área) | Aplicador | Nota | Meta
// ---------------------------------------------------------------------------

const COL_GRID = 'grid-cols-[74px_100px_1fr_140px_90px_76px]'

// ---------------------------------------------------------------------------
// Main — grouped tabular view (eixo à esquerda, cards à direita)
// ---------------------------------------------------------------------------

interface V7GroupedTabularViewProps {
  grouped: GroupedByMonth[]
  selectedId: string
  onSelect: (id: string) => void
}

export function V7GroupedTabularView({ grouped, selectedId, onSelect }: V7GroupedTabularViewProps) {
  if (grouped.length === 0) return null

  // Flatten com labels de mês intercalados (mesmo padrão da V1 Timeline)
  const flat: Array<
    | { kind: 'month'; monthLabel: string; key: string }
    | { kind: 'event'; ev: Evaluation; globalIndex: number; isLast: boolean }
  > = []
  const totalEvents = grouped.reduce((acc, g) => acc + g.items.length, 0)
  let gi = 0
  grouped.forEach((m) => {
    flat.push({ kind: 'month', monthLabel: m.monthLabel, key: `mh-${m.monthKey}` })
    m.items.forEach((ev) => {
      flat.push({ kind: 'event', ev, globalIndex: gi, isLast: gi === totalEvents - 1 })
      gi++
    })
  })

  return (
    <div>
      {flat.map((item) => {
        if (item.kind === 'month') {
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex items-center justify-center my-4"
            >
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="relative bg-gradient-to-br from-white to-gray-50 px-4 py-1 rounded-full border border-gray-200 text-[10px] font-bold tracking-widest uppercase text-gray-500 shadow-sm">
                {item.monthLabel}
              </span>
            </motion.div>
          )
        }

        const { ev, globalIndex, isLast } = item
        const isSelected = ev.id === selectedId
        const goal = resolveGoalPct(ev) ?? 0
        const scoreColor = getScoreVsGoalColor(ev.score, goal)
        const d = new Date(ev.date)
        const day = d.getDate().toString().padStart(2, '0')
        const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        const monthAbbr = monthNames[d.getMonth()]

        return (
          <div key={ev.id} className="flex">
            {/* Axis à esquerda */}
            <div className="w-[40px] flex-shrink-0 flex flex-col items-center py-1">
              {globalIndex > 0 ? (
                <div className="w-px flex-1" style={{ background: '#E2E8F0' }} />
              ) : (
                <div className="flex-1" />
              )}
              <StatusTooltip ev={ev}>
                <TimelineNode ev={ev} index={globalIndex} />
              </StatusTooltip>
              {!isLast ? (
                <div className="w-px flex-1" style={{ background: '#E2E8F0' }} />
              ) : (
                <div className="flex-1" />
              )}
            </div>

            {/* Card à direita */}
            <div className="flex-1 ml-2 py-1">
              <button
                onClick={() => onSelect(ev.id)}
                className={cn(
                  'w-full text-left bg-white rounded-xl border overflow-hidden flex cursor-pointer',
                  'hover:shadow-md hover:border-gray-200/80 transition-all duration-200',
                  isSelected ? 'border-primary-400 ring-2 ring-primary-400/30 shadow-md' : 'border-gray-200',
                )}
              >
                <GradientStripTabular ev={ev} />
                <div className={cn('flex-1 grid gap-3 items-center px-4 py-3 min-w-0', COL_GRID)}>
                  {/* Data */}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600 tabular-nums leading-none">{day}</span>
                    <span className="text-[9px] text-gray-400 mt-0.5 uppercase">{monthAbbr}</span>
                  </div>

                  {/* Tipo */}
                  <div>
                    <TypePill type={ev.type} />
                  </div>

                  {/* Grupo + tipo + gerência/área */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{ev.groupName}</p>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{ev.groupTypeName}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {ev.managementName} · {ev.areaName}
                    </p>
                  </div>

                  {/* Aplicador */}
                  <div className="min-w-0">
                    <span className="text-xs text-gray-600 truncate block">{ev.applicantName}</span>
                  </div>

                  {/* Nota */}
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-medium leading-none">
                      Nota
                    </span>
                    <span
                      className="text-sm font-semibold tabular-nums leading-none mt-1"
                      style={{ color: scoreColor }}
                    >
                      {ev.score}%
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-medium leading-none">
                      Meta
                    </span>
                    <span className="text-xs font-medium text-gray-600 tabular-nums leading-none mt-1">
                      {goal}%
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
