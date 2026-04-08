/**
 * HeroSection - V7/V10 "Dual" layout
 * Left accent sidebar with diamond pattern + wave watermark + glass card with step progress
 */

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { Group, GroupAnalytics } from '@/types'
import { cn } from '@/lib/cn'

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Audit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  FollowUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
}

// ============================================================================
// LEFT SIDEBAR - Diamond pattern
// ============================================================================

function DiamondPattern() {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 22
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 4; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({ x: col * spacing + offset + 10, y: row * spacing + 10, size: 5, opacity: 0.04 + Math.random() * 0.025 })
    }
  }
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 360" preserveAspectRatio="xMidYMid slice" fill="none">
      {diamonds.map((d, i) => (
        <rect key={i} x={d.x - d.size / 2} y={d.y - d.size / 2} width={d.size} height={d.size}
          transform={`rotate(45 ${d.x} ${d.y})`} fill="white" opacity={d.opacity} />
      ))}
    </svg>
  )
}

// ============================================================================
// WAVE WATERMARK
// ============================================================================

function WaveWatermark() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <linearGradient id="v6wg1" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#1E7A73" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#3AA39C" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#96D4D0" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="v6wg2" x1="0" y1="0.5" x2="1" y2="0">
          <stop offset="0%" stopColor="#3AA39C" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#1E7A73" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d="M-50 280 C100 220, 250 340, 400 260 S650 180, 800 240 S950 320, 1000 260" stroke="url(#v6wg1)" strokeWidth="1.5" />
      <path d="M-50 310 C120 250, 280 370, 430 290 S690 210, 840 270 S990 350, 1060 290" stroke="url(#v6wg2)" strokeWidth="0.8" />
      <path d="M0 400 L0 320 C140 260, 290 370, 440 300 S700 230, 860 280 S1010 350, 900 310 L900 400 Z" fill="url(#v6wg1)" opacity="0.25" />
      <circle cx="220" cy="290" r="2.5" fill="#1E7A73" opacity="0.05" />
      <circle cx="450" cy="270" r="3" fill="#3AA39C" opacity="0.04" />
      <circle cx="680" cy="235" r="2" fill="#1E7A73" opacity="0.06" />
      <circle cx="820" cy="260" r="3" fill="#96D4D0" opacity="0.04" />
    </svg>
  )
}

// ============================================================================
// TYPE CONFIG
// ============================================================================

function getTypeConfig(typeName: string) {
  const lower = typeName.toLowerCase()
  if (lower.includes('5s')) return {
    abbrev: '5S', color: 'text-amber-300',
    gradient: 'from-amber-500 to-orange-500',
    badgeText: 'text-amber-700', badgeBorder: 'border-amber-200/60',
    glowColor: 'rgba(245,158,11,0.08)',
  }
  if (lower.includes('admin')) return {
    abbrev: 'AD', color: 'text-blue-300',
    gradient: 'from-blue-500 to-indigo-500',
    badgeText: 'text-blue-700', badgeBorder: 'border-blue-200/60',
    glowColor: 'rgba(59,130,246,0.08)',
  }
  return {
    abbrev: 'OP', color: 'text-primary-200',
    gradient: 'from-primary-500 to-primary-300',
    badgeText: 'text-primary-700', badgeBorder: 'border-primary-200/60',
    glowColor: 'rgba(30,122,115,0.08)',
  }
}

// ============================================================================
// PILL STEP PROGRESS
// ============================================================================

function PillStepProgress({ current, max }: { current: number; max: number }) {
  const steps = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, index) => {
        const isCompleted = step < current
        const isCurrent = step === current

        return (
          <motion.div
            key={step}
            className={cn(
              'relative flex items-center justify-center rounded-full transition-all',
              isCompleted && 'h-7 w-7 bg-gradient-to-br from-green-400 to-green-500 text-white shadow-sm',
              isCurrent && 'h-8 px-3 bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md',
              !isCompleted && !isCurrent && 'h-7 w-7 bg-white/60 text-gray-400 border border-gray-200'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
          >
            {isCompleted ? <Icons.Check /> : <span className={cn('text-[11px] font-bold', isCurrent && 'text-xs')}>{step}</span>}
            {isCurrent && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary-400/40"
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.div>
        )
      })}
      <span className="ml-2 text-xs font-medium text-gray-400">Passo {current}/{max}</span>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface HeroSectionProps {
  group: Group
  analytics: GroupAnalytics
  onAudit: () => void
  onFollowup: () => void
}

export function HeroSection({ group, analytics, onAudit, onFollowup }: HeroSectionProps) {
  const typeConfig = getTypeConfig(group.groupTypeName)
  const progressPercent = Math.round((group.currentSequence / group.maxSequence) * 100)

  return (
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex">
        {/* LEFT ACCENT SIDEBAR */}
        <div
          className="relative w-32 flex-shrink-0 flex flex-col items-center justify-between py-6 hidden sm:flex"
          style={{ background: 'linear-gradient(180deg, #155F59 0%, #1E7A73 40%, #3AA39C 100%)' }}
        >
          <DiamondPattern />

          {/* Type abbreviation */}
          <motion.div className="relative z-10 flex flex-col items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <span className={cn('text-3xl font-black leading-none tracking-tight', typeConfig.color)}>
              {typeConfig.abbrev}
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-white/50 font-medium">Tipo</span>
          </motion.div>

          {/* Progress Ring */}
          <motion.div className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {(() => {
              const size = 88
              const sw = 7
              const center = size / 2
              const radius = (size - sw) / 2
              const circumference = 2 * Math.PI * radius
              const progress = group.maxSequence > 0 ? group.currentSequence / group.maxSequence : 0
              const dashOffset = circumference * (1 - progress)

              const ticks = Array.from({ length: group.maxSequence }, (_, i) => {
                const angle = (360 / group.maxSequence) * i - 90
                const rad = (angle * Math.PI) / 180
                const innerR = radius - sw / 2 - 3
                const outerR = radius + sw / 2 + 3
                return {
                  x1: center + innerR * Math.cos(rad),
                  y1: center + innerR * Math.sin(rad),
                  x2: center + outerR * Math.cos(rad),
                  y2: center + outerR * Math.sin(rad),
                  completed: i + 1 <= group.currentSequence,
                }
              })

              return (
                <div className="relative">
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                      <linearGradient id="v6RingGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#96D4D0" stopOpacity="0.7" />
                      </linearGradient>
                      <filter id="v6RingShadow">
                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="0.2" />
                      </filter>
                    </defs>

                    <circle cx={center} cy={center} r={radius} fill="none" stroke="white" strokeWidth={sw} opacity="0.12" strokeLinecap="round" />

                    <motion.circle cx={center} cy={center} r={radius} fill="none"
                      stroke="url(#v6RingGrad)" strokeWidth={sw} strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                      transform={`rotate(-90 ${center} ${center})`}
                      filter="url(#v6RingShadow)" />

                    {ticks.map((tick, i) => (
                      <motion.line key={i}
                        x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2}
                        stroke={tick.completed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)'}
                        strokeWidth="1.5" strokeLinecap="round"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * i + 0.6 }} />
                    ))}
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white leading-none">{group.currentSequence}</span>
                    <span className="text-[8px] text-white/50 font-medium mt-0.5">de {group.maxSequence}</span>
                  </div>
                </div>
              )
            })()}
          </motion.div>

          {/* Progress bar + percentage */}
          <motion.div className="relative z-10 flex flex-col items-center gap-1.5 w-full px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/15">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.85))' }}
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }} />
            </div>
            <span className="text-sm font-black text-white/90 leading-none">{progressPercent}%</span>
          </motion.div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 relative min-w-0 bg-gradient-to-br from-white via-white to-primary-50/30 overflow-hidden">
          <WaveWatermark />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left: Identity */}
              <div className="flex-1 min-w-0">
                <motion.div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                  <span>{group.managementName}</span>
                  <span className="text-gray-300/50 mx-0.5">/</span>
                  <span>{group.areaName}</span>
                </motion.div>

                <motion.h1 className="text-4xl font-black text-gray-800 tracking-tight leading-tight mb-4"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                  {group.name}
                </motion.h1>

                <motion.div className="flex flex-wrap items-center gap-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.25 }}>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Ultima nota</span>
                    <span className="text-sm font-bold text-gray-800">{group.lastAuditScore ?? '—'}% <span className="text-gray-400 font-medium">({group.lastAuditScore ?? 0} pts)</span></span>
                  </div>
                  <div className="w-px h-7 bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Meta</span>
                    <span className="text-sm font-bold text-primary-600">{analytics.nextSequenceGoal}% <span className="text-gray-400 font-medium">({analytics.nextSequenceGoal} pts)</span></span>
                  </div>
                </motion.div>
              </div>

              {/* Right: Glass card with step progress + actions */}
              <motion.div className="flex-shrink-0 lg:max-w-[300px] w-full lg:w-auto"
                initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}>

                <div className="hidden lg:block relative rounded-2xl border border-white/60 p-5 overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.70)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: `0 8px 32px ${typeConfig.glowColor}, 0 1px 3px rgba(0,0,0,0.04)`,
                  }}>

                  {/* Type badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm', typeConfig.gradient)}>
                      <span className="text-sm font-black text-white">{typeConfig.abbrev}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Tipo</p>
                      <p className={cn('text-sm font-bold', typeConfig.badgeText)}>{group.groupTypeName}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <PillStepProgress current={group.currentSequence} max={group.maxSequence} />
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                  <div className="flex flex-col gap-2">
                    <Button size="md" onClick={onAudit} leftIcon={<Icons.Audit />} className="w-full shadow-md shadow-primary-500/15">
                      Iniciar Auditoria
                    </Button>
                    <Button variant="secondary" size="md" onClick={onFollowup} leftIcon={<Icons.FollowUp />} className="w-full">
                      Aplicar Follow-up
                    </Button>
                  </div>
                </div>

                <div className="flex lg:hidden items-center justify-center gap-3">
                  <Button variant="secondary" size="md" onClick={onFollowup} leftIcon={<Icons.FollowUp />}>
                    Follow-up
                  </Button>
                  <Button size="md" onClick={onAudit} leftIcon={<Icons.Audit />} className="shadow-md shadow-primary-500/15">
                    Auditoria
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
