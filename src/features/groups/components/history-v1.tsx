/**
 * HistoryCardV1 - "Liquid Glass Timeline"
 * Frosted glass nodes with backdrop-blur, glassmorphic cards.
 * Only audit/followup. Score green >= goal, red < goal.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import type { HistoryEntry } from '@/types'
import {
  TYPE_COLORS,
  TYPE_LABELS,
  getScoreColor,
  computeDeltas,
  formatPts,
  parseDate,
} from './history-utils'

// ============================================================================
// PROPS
// ============================================================================

interface HistoryCardProps {
  events: HistoryEntry[]
}

// ============================================================================
// STATUS COLOR RESOLVER
// ============================================================================

function getStatusColor(event: HistoryEntry): string {
  if (event.sequenceAdvanced === true) return '#10B981'
  if (event.goalMet === true) return '#F59E0B'
  return '#EF4444'
}

function getStatusGlow(event: HistoryEntry): string {
  if (event.sequenceAdvanced === true) return 'rgba(16,185,129,0.15)'
  if (event.goalMet === true) return 'rgba(245,158,11,0.15)'
  return 'rgba(239,68,68,0.15)'
}

function getScoreVsGoalColor(score: number, goalPct?: number): string {
  if (goalPct == null) return getScoreColor(score)
  return score >= goalPct ? '#10B981' : '#EF4444'
}

// ============================================================================
// STATUS BADGE ICONS
// ============================================================================

function BadgeIconArrowUp() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" stroke="#10B981" strokeWidth="3" />
      <polyline points="6 11 12 5 18 11" stroke="#10B981" strokeWidth="3" />
    </svg>
  )
}

function BadgeIconFlag() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <line x1="6" y1="3" x2="6" y2="22" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M6 4 C6 4 10 6 14 4 C17 2.5 19 4.5 19 4.5 L19 11 C19 11 17 8.5 14 10.5 C10 12.5 6 10.5 6 10.5 Z"
        fill="#F59E0B"
        stroke="#F59E0B"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BadgeIconArrowDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" stroke="#EF4444" strokeWidth="3" />
      <polyline points="6 13 12 19 18 13" stroke="#EF4444" strokeWidth="3" />
    </svg>
  )
}

function StatusBadgeIcon({ event }: { event: HistoryEntry }) {
  if (event.sequenceAdvanced === true) return <BadgeIconArrowUp />
  if (event.goalMet === true) return <BadgeIconFlag />
  return <BadgeIconArrowDown />
}

// ============================================================================
// ICONS
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

function TypePill({ type }: { type: HistoryEntry['type'] }) {
  const color = TYPE_COLORS[type]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex-shrink-0 whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      <TypeIcon type={type} />
      {TYPE_LABELS[type]}
    </span>
  )
}

// ============================================================================
// GLASS TIMELINE NODE
// ============================================================================

function GlassTimelineNode({ event, index }: { event: HistoryEntry; index: number }) {
  const date = parseDate(event.date)
  const statusColor = getStatusColor(event)
  const statusGlow = getStatusGlow(event)

  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22, delay: index * 0.08 }}
      whileHover={{ scale: 1.06 }}
    >
      <div
        className="w-[46px] h-[46px] rounded-full flex flex-col items-center justify-center relative z-10"
        style={{
          background: 'rgba(255,255,255,0.50)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.60)',
          boxShadow: `0 0 0 2.5px ${statusColor}, 0 0 20px ${statusGlow}, 0 4px 12px rgba(0,0,0,0.06)`,
        }}
      >
        <span className="text-[16px] font-semibold text-gray-800 leading-none tabular-nums -mt-0.5">
          {date.day}
        </span>
        <span className="text-[7px] uppercase tracking-widest text-gray-400 font-normal leading-none mt-0.5">
          {date.month}
        </span>
      </div>

      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: index * 0.08 + 0.15 }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.70)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1.5px solid ${statusColor}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <StatusBadgeIcon event={event} />
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// GLASS CONNECTOR
// ============================================================================

function GlassConnector({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div
      className="w-[1.5px] flex-1 mx-auto my-3 rounded-full"
      style={{
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
        filter: 'blur(0.5px)',
        minHeight: '16px',
      }}
    />
  )
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

// ============================================================================
// COLUMN GRID
// ============================================================================

const COL_GRID = 'grid-cols-[88px_44px_1fr_100px_86px]'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HistoryCardV1({ events }: HistoryCardProps) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

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
  const deltas = computeDeltas(evaluationEvents)

  return (
    <Card className="relative overflow-hidden" padding="none">
      {/* Top accent gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }}
      />

      {/* Mesh gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 15% 15%, rgba(30,122,115,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 85%, rgba(3,105,161,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 70%)
          `,
        }}
      />

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <svg
          width="120" height="120" viewBox="0 0 24 24" fill="none"
          className="text-primary-500/[0.03]"
          style={{ animation: 'v1spin 60s linear infinite' }}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1" />
          <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
        </svg>
      </div>

      <style>{`@keyframes v1spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div className="relative p-5 sm:p-6">
        {/* Header + Year selector */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <GradientClockIcon />
            <div>
              <h3 className="font-medium text-gray-800">Historico</h3>
              <p className="text-xs text-gray-400 mt-0.5">Linha do tempo de avaliacoes</p>
            </div>
          </div>

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

        {/* Column headers */}
        <div className="flex mb-3">
          <div className="flex-shrink-0" style={{ width: 62 }} />
          <div className={cn('flex-1 grid gap-3 items-center px-5', COL_GRID)}>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Tipo</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Seq.</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Auditor</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Nota</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Meta</span>
          </div>
        </div>

        {/* Timeline + glass cards */}
        {evaluationEvents.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">Nenhuma avaliacao registrada em {selectedYear}</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={selectedYear}
          >
            {evaluationEvents.map((event, index) => {
              const isLast = index === evaluationEvents.length - 1
              const hasScore = event.score != null
              const scoreColor = hasScore ? getScoreVsGoalColor(event.score!, event.goalPct) : undefined
              const typeColor = TYPE_COLORS[event.type]
              const delta = deltas[index]
              const currentStatusColor = getStatusColor(event)
              const nextStatusColor = !isLast ? getStatusColor(evaluationEvents[index + 1]) : currentStatusColor

              return (
                <div key={event.id} className="flex">
                  {/* Timeline axis */}
                  <div className="flex-shrink-0 flex flex-col items-center mr-3" style={{ width: 50 }}>
                    <GlassTimelineNode event={event} index={index} />
                    {!isLast && (
                      <GlassConnector fromColor={currentStatusColor} toColor={nextStatusColor} />
                    )}
                  </div>

                  {/* Glassmorphic card */}
                  <motion.div
                    className="flex-1 pb-3"
                    variants={cardVariants}
                  >
                    <div
                      className="rounded-2xl px-5 py-4 transition-all duration-200 hover:shadow-lg"
                      style={{
                        background: 'rgba(255,255,255,0.65)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.50)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 4px 16px rgba(0,0,0,0.05)',
                        borderLeft: `3px solid ${currentStatusColor}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.80)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.65)'
                      }}
                    >
                      <div className={cn('grid gap-3 items-center', COL_GRID)}>
                        {/* Tipo */}
                        <div>
                          <TypePill type={event.type} />
                        </div>

                        {/* Seq. */}
                        <div>
                          {event.sequenceNumber != null ? (
                            <span
                              className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-medium tabular-nums"
                              style={{ color: typeColor, backgroundColor: `${typeColor}12` }}
                            >
                              {event.sequenceNumber}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-300">&mdash;</span>
                          )}
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
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="text-sm font-semibold tabular-nums leading-none"
                                  style={{ color: scoreColor }}
                                >
                                  {event.score}%
                                </span>
                                {delta != null && delta !== 0 && (
                                  <span
                                    className={cn(
                                      'text-[9px] font-medium tabular-nums',
                                      delta > 0 ? 'text-green-500' : 'text-red-400',
                                    )}
                                  >
                                    {delta > 0 ? '+' : ''}{delta}
                                  </span>
                                )}
                              </div>
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
                  </motion.div>
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </Card>
  )
}
