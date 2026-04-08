/**
 * HistoryCardV10 - "Dual View"
 * Combines V9 (centered timeline) and V8 (tabular) with a view toggle.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import type { HistoryEntry } from '@/types'
import {
  TYPE_COLORS,
  TYPE_LABELS,
  getScoreColor,
  formatPts,
  parseDate,
} from './history-utils'

// ============================================================================
// PROPS
// ============================================================================

interface HistoryCardProps {
  events: HistoryEntry[]
}

type ViewMode = 'timeline' | 'tabular'

// ============================================================================
// STATUS COLOR RESOLVER
// ============================================================================

function getStatusColor(event: HistoryEntry): string {
  if (event.sequenceAdvanced === true) return '#10B981'
  if (event.goalMet === true) return '#60A5FA'
  return '#EF4444'
}

function getStatusColorLight(event: HistoryEntry): string {
  if (event.sequenceAdvanced === true) return '#34D399'
  if (event.goalMet === true) return '#14B8A6'
  return '#F87171'
}

// ============================================================================
// SCORE COLOR
// ============================================================================

function getScoreVsGoalColor(score: number, goalPct?: number): string {
  if (goalPct == null) return getScoreColor(score)
  return score >= goalPct ? '#10B981' : '#EF4444'
}

// ============================================================================
// STATUS BADGE ICONS
// ============================================================================

function BadgeIconTrophy({ light }: { light?: boolean }) {
  const c = light ? '#fff' : '#10B981'
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 7H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3h1" />
      <path d="M17 7h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3h-1" />
    </svg>
  )
}

function BadgeIconFlag({ light }: { light?: boolean }) {
  const c = light ? '#fff' : '#14B8A6'
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="6" y1="3" x2="6" y2="22" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M6 4 C6 4 10 6 14 4 C17 2.5 19 4.5 19 4.5 L19 11 C19 11 17 8.5 14 10.5 C10 12.5 6 10.5 6 10.5 Z"
        fill={c}
        stroke={c}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BadgeIconArrowDown({ light }: { light?: boolean }) {
  const c = light ? '#fff' : '#EF4444'
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke={c} strokeWidth="2.5" />
      <polyline points="17 18 23 18 23 12" stroke={c} strokeWidth="2.5" />
    </svg>
  )
}

function StatusBadgeIcon({ event, light }: { event: HistoryEntry; light?: boolean }) {
  if (event.sequenceAdvanced === true) return <BadgeIconTrophy light={light} />
  if (event.goalMet === true) return <BadgeIconFlag light={light} />
  return <BadgeIconArrowDown light={light} />
}

// ============================================================================
// DIAMOND PATTERN — subtle rotated squares as background
// ============================================================================

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
        opacity: 0.10 + Math.random() * 0.06,
      })
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 50 70"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
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

// ============================================================================
// TIMELINE NODE — diamond with status icon
// ============================================================================

function TimelineNode({ event, index }: { event: HistoryEntry; index: number }) {
  const sc = getStatusColor(event)
  const scLight = getStatusColorLight(event)

  return (
    <motion.div
      className="flex-shrink-0"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.06 }}
      whileHover={{ scale: 1.06 }}
    >
      <div
        className="w-7 h-7 rotate-45 rounded-[6px] flex items-center justify-center opacity-85"
        style={{
          background: `linear-gradient(180deg, ${sc} 0%, ${scLight} 100%)`,
          boxShadow: `0 4px 12px ${sc}20`,
        }}
      >
        <div className="-rotate-45">
          <StatusBadgeIcon event={event} light />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// OTHER ICONS
// ============================================================================

function GradientClockIcon() {
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </div>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function TypeIcon({ type }: { type: HistoryEntry['type'] }) {
  const common = { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (type) {
    case 'audit':
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    case 'followup':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
        </svg>
      )
    default:
      return null
  }
}

const V10_TYPE_COLORS: Partial<Record<HistoryEntry['type'], string>> = {
  audit: '#71717A',
  followup: '#71717A',
}

function TypePill({ type }: { type: HistoryEntry['type'] }) {
  const color = V10_TYPE_COLORS[type] ?? TYPE_COLORS[type]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex-shrink-0 whitespace-nowrap opacity-65"
      style={{ backgroundColor: color }}
    >
      <TypeIcon type={type} />
      {TYPE_LABELS[type]}
    </span>
  )
}

// ============================================================================
// VIEW TOGGLE ICONS
// ============================================================================

function TimelineViewIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#1E7A73' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <rect x="3" y="4" width="7" height="5" rx="1" />
      <rect x="14" y="10" width="7" height="5" rx="1" />
      <rect x="3" y="17" width="7" height="5" rx="1" />
    </svg>
  )
}

function TabularViewIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#1E7A73' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  )
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const cardLeftVariants = {
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const cardRightVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// ============================================================================
// GRADIENT STRIP — timeline view (left or right)
// ============================================================================

function GradientStripTimeline({ event, side }: { event: HistoryEntry; side: 'left' | 'right' }) {
  const sc = getStatusColor(event)
  const scLight = getStatusColorLight(event)

  return (
    <div
      className={cn(
        'relative w-[32px] flex-shrink-0 flex items-center justify-center overflow-hidden opacity-85',
        side === 'left' ? 'rounded-l-xl order-first' : 'rounded-r-xl order-last',
      )}
      style={{
        background: `linear-gradient(180deg, ${sc} 0%, ${scLight} 100%)`,
      }}
    >
      <DiamondPatternStrip />
      {event.sequenceNumber != null ? (
        <span className="relative z-10 text-sm font-bold text-white tabular-nums">
          {event.sequenceNumber}
        </span>
      ) : (
        <span className="relative z-10 text-[10px] text-white/60">&mdash;</span>
      )}
    </div>
  )
}

// ============================================================================
// GRADIENT STRIP — tabular view (always left)
// ============================================================================

function GradientStripTabular({ event }: { event: HistoryEntry }) {
  const sc = getStatusColor(event)
  const scLight = getStatusColorLight(event)

  return (
    <div
      className="relative w-[36px] flex-shrink-0 rounded-l-xl flex items-center justify-center overflow-hidden opacity-85"
      style={{
        background: `linear-gradient(180deg, ${sc} 0%, ${scLight} 100%)`,
      }}
    >
      <DiamondPatternStrip />
      {event.sequenceNumber != null ? (
        <span className="relative z-10 text-sm font-bold text-white tabular-nums">
          {event.sequenceNumber}
        </span>
      ) : (
        <span className="relative z-10 text-[10px] text-white/60">&mdash;</span>
      )}
    </div>
  )
}

// ============================================================================
// SCORE PROGRESS BAR (timeline view)
// ============================================================================

function ScoreProgressBar({ score, goalPct }: { score: number; goalPct: number }) {
  const met = score >= goalPct
  const barColor = met ? '#10B981' : '#EF4444'
  const barBg = met ? '#D1FAE5' : '#FEE2E2'

  return (
    <div className="w-full">
      <div className="w-full h-[6px] rounded-full overflow-hidden" style={{ background: barBg }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(score, 100)}%`,
            background: barColor,
          }}
        />
      </div>
      <div className="relative w-full h-0">
        <div
          className="absolute -top-[6px] w-[2px] h-[6px] rounded-full"
          style={{
            left: `${Math.min(goalPct, 100)}%`,
            background: '#64748B',
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  )
}

// ============================================================================
// CARD CONTENT — timeline view (compact, half-width)
// ============================================================================

function TimelineCardContent({ event, side }: { event: HistoryEntry; side: 'left' | 'right' }) {
  const hasScore = event.score != null
  const scoreColor = hasScore ? getScoreVsGoalColor(event.score!, event.goalPct) : undefined

  return (
    <div className="flex-1 flex flex-col px-4 py-5">
      {/* Top row: Type + Auditor */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <TypePill type={event.type} />
        {event.appliedBy && (
          <div className="flex flex-col gap-0.5 items-end min-w-0">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-medium">Auditor</span>
            <span className="text-xs text-gray-600 truncate max-w-full">
              {event.appliedBy}
            </span>
          </div>
        )}
      </div>

      {/* Middle row: Nota + Meta */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {hasScore && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-medium">Nota</span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-base font-bold tabular-nums leading-none"
                style={{ color: scoreColor }}
              >
                {event.score}%
              </span>
              {event.scorePts != null && event.scoreMaxPts != null && (
                <span className="text-[9px] text-gray-400 tabular-nums">
                  {formatPts(event.scorePts, event.scoreMaxPts)}
                </span>
              )}
            </div>
          </div>
        )}

        {event.goalPct != null && (
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[8px] uppercase tracking-wider text-gray-400 font-medium">Meta</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-gray-600 tabular-nums leading-none">
                {event.goalPct}%
              </span>
              {event.goalPts != null && event.scoreMaxPts != null && (
                <span className="text-[9px] text-gray-400 tabular-nums">
                  {formatPts(event.goalPts, event.scoreMaxPts)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Progress bar */}
      {hasScore && event.goalPct != null && (
        <ScoreProgressBar score={event.score!} goalPct={event.goalPct} />
      )}
    </div>
  )
}

// ============================================================================
// TIMELINE DATE LABEL — elegant date below the node
// ============================================================================

function TimelineDateLabel({ event }: { event: HistoryEntry }) {
  const date = parseDate(event.date)
  return (
    <div className="flex flex-col items-center mt-2">
      <span className="text-[11px] font-medium text-gray-600 tabular-nums leading-none">
        {date.day}
      </span>
      <span className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">
        {date.month}
      </span>
    </div>
  )
}

// ============================================================================
// TIMELINE VIEW (V9 style)
// ============================================================================

function TimelineView({ events, selectedYear }: { events: HistoryEntry[]; selectedYear: number }) {
  if (events.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-gray-400">Nenhuma avaliacao registrada em {selectedYear}</p>
      </div>
    )
  }

  return (
    <div key={`timeline-${selectedYear}`} className="relative">
      {events.map((event, index) => {
        const isLast = index === events.length - 1
        const isLeft = index % 2 === 0

        return (
          <div key={event.id} className="flex items-stretch py-3">
            {/* Left card area */}
            <div className="flex-1 flex justify-end py-1 pr-2">
              {isLeft && (
                <div className="w-full max-w-[400px]">
                  <div
                    className={cn(
                      'bg-white rounded-xl border border-gray-200 overflow-hidden',
                      'hover:shadow-md hover:border-gray-200/80',
                      'transition-all duration-200',
                      'flex',
                    )}
                  >
                    <TimelineCardContent event={event} side="left" />
                    <GradientStripTimeline event={event} side="right" />
                  </div>
                </div>
              )}
            </div>

            {/* Center timeline axis */}
            <div className="w-[56px] flex-shrink-0 flex flex-col items-center">
              {index > 0 ? (
                <div className="w-px flex-1" style={{ background: '#E2E8F0' }} />
              ) : (
                <div className="flex-1" />
              )}
              <TimelineNode event={event} index={index} />
              <TimelineDateLabel event={event} />
              {!isLast ? (
                <div className="w-px flex-1 mt-1" style={{ background: '#E2E8F0' }} />
              ) : (
                <div className="flex-1" />
              )}
            </div>

            {/* Right card area */}
            <div className="flex-1 flex justify-start py-1 pl-2">
              {!isLeft && (
                <div className="w-full max-w-[400px]">
                  <div
                    className={cn(
                      'bg-white rounded-xl border border-gray-200 overflow-hidden',
                      'hover:shadow-md hover:border-gray-200/80',
                      'transition-all duration-200',
                      'flex',
                    )}
                  >
                    <GradientStripTimeline event={event} side="left" />
                    <TimelineCardContent event={event} side="right" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// TABULAR VIEW (V8 style)
// ============================================================================

const COL_GRID = 'grid-cols-[50px_88px_1fr_100px_86px]'

function TabularView({ events, selectedYear }: { events: HistoryEntry[]; selectedYear: number }) {
  if (events.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-gray-400">Nenhuma avaliacao registrada em {selectedYear}</p>
      </div>
    )
  }

  return (
    <>
      {/* Column headers */}
      <div className="flex mb-2">
        <div className="w-[40px] flex-shrink-0" />
        <div className="w-2 flex-shrink-0" />
        <div className="w-[36px] flex-shrink-0" />
        <div className={cn('flex-1 grid gap-3 items-center px-4', COL_GRID)}>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Data</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Tipo</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Auditor</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Nota</span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Meta</span>
        </div>
      </div>

      <div key={`tabular-${selectedYear}`}>
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          const hasScore = event.score != null
          const scoreColor = hasScore ? getScoreVsGoalColor(event.score!, event.goalPct) : undefined
          const date = parseDate(event.date)

          return (
            <div key={event.id} className="flex">
              {/* Timeline axis */}
              <div className="w-[40px] flex-shrink-0 flex flex-col items-center py-1">
                {index > 0 ? (
                  <div className="w-px flex-1" style={{ background: '#E2E8F0' }} />
                ) : (
                  <div className="flex-1" />
                )}
                <TimelineNode event={event} index={index} />
                {!isLast ? (
                  <div className="w-px flex-1" style={{ background: '#E2E8F0' }} />
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              {/* Card */}
              <div
                className="flex-1 ml-2 py-1"
              >
                <div
                  className={cn(
                    'bg-white rounded-xl border border-gray-200 overflow-hidden',
                    'hover:shadow-md hover:border-gray-200/80',
                    'transition-all duration-200',
                    'flex',
                  )}
                >
                  <GradientStripTabular event={event} />
                  <div className={cn('flex-1 grid gap-3 items-center px-4 py-3', COL_GRID)}>
                    {/* Data */}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-600 tabular-nums leading-none">
                        {date.day}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-0.5 uppercase">
                        {date.month}
                      </span>
                    </div>

                    {/* Tipo */}
                    <div>
                      <TypePill type={event.type} />
                    </div>

                    {/* Auditor */}
                    <div className="min-w-0">
                      {event.appliedBy ? (
                        <span className="text-xs text-gray-600 truncate block">
                          {event.appliedBy}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-300">&mdash;</span>
                      )}
                    </div>

                    {/* Nota */}
                    <div>
                      {hasScore ? (
                        <div className="flex flex-col">
                          <span
                            className="text-sm font-semibold tabular-nums leading-none"
                            style={{ color: scoreColor }}
                          >
                            {event.score}%
                          </span>
                          {event.scorePts != null && event.scoreMaxPts != null && (
                            <span className="text-[9px] text-gray-400 mt-0.5 tabular-nums">
                              {formatPts(event.scorePts, event.scoreMaxPts)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300">&mdash;</span>
                      )}
                    </div>

                    {/* Meta */}
                    <div>
                      {event.goalPct != null ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-600 tabular-nums leading-none">
                            {event.goalPct}%
                          </span>
                          {event.goalPts != null && event.scoreMaxPts != null && (
                            <span className="text-[9px] text-gray-400 mt-0.5 tabular-nums">
                              {formatPts(event.goalPts, event.scoreMaxPts)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300">&mdash;</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HistoryCardV10({ events }: HistoryCardProps) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')

  const availableYears = Array.from(
    new Set(
      events
        .filter((e) => e.type === 'audit' || e.type === 'followup')
        .map((e) => new Date(e.date).getFullYear()),
    ),
  ).sort((a, b) => b - a)

  if (!availableYears.includes(currentYear)) {
    availableYears.unshift(currentYear)
  }

  const evaluationEvents = events.filter((e) => {
    if (e.type !== 'audit' && e.type !== 'followup') return false
    return new Date(e.date).getFullYear() === selectedYear
  })

  return (
    <Card className="relative overflow-hidden" padding="none">
      {/* Top accent gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }}
      />

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-primary-500/[0.03]">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1" />
          <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="relative p-5 sm:p-6">
        {/* Header + View toggle + Year selector */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <GradientClockIcon />
            <div>
              <h3 className="font-medium text-gray-800">Historico</h3>
              <p className="text-xs text-gray-400 mt-0.5">Registro de avaliacoes e marcos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              <button
                onClick={() => setViewMode('timeline')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                  viewMode === 'timeline'
                    ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <TimelineViewIcon active={viewMode === 'timeline'} />
                Timeline
              </button>
              <button
                onClick={() => setViewMode('tabular')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                  viewMode === 'tabular'
                    ? 'bg-white text-primary-700 shadow-sm border border-gray-200'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <TabularViewIcon active={viewMode === 'tabular'} />
                Tabular
              </button>
            </div>

            {/* Year selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={cn(
                  'appearance-none cursor-pointer',
                  'pl-3 pr-8 py-1.5 rounded-lg',
                  'text-sm font-medium text-primary-700 tabular-nums',
                  'bg-primary-50 border border-primary-200',
                  'hover:bg-primary-100 hover:border-primary-300',
                  'focus:outline-none focus:ring-2 focus:ring-primary-300',
                  'transition-all duration-150',
                )}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary-500">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Content — animated view switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {viewMode === 'timeline' ? (
              <TimelineView events={evaluationEvents} selectedYear={selectedYear} />
            ) : (
              <TabularView events={evaluationEvents} selectedYear={selectedYear} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}
