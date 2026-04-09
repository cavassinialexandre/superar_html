/**
 * Premium hero section for the evaluation page.
 * Left accent sidebar with diamond pattern + wave watermark + glass card.
 * Mirrors the visual language from groups detail hero-section.tsx.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui'
import { SequenceProgress } from '@/components/data-display/sequence-progress'
import { EvalWaveWatermark } from './eval-watermarks'
import { EvalAttendancePanel } from './eval-attendance-panel'
import { evalGlassCard } from '@/design-system/animations'
import { getScoreColor } from '@/design-system/tokens'
import type { Group, EvaluationType, TeamMember } from '@/types'

interface EvalHeroSectionProps {
  group: Group
  evalType: EvaluationType
  userName: string
  score: number
  meta: number
  answeredCount: number
  totalQuestions: number
  presentMembers: string[]
  otherPeople: string
  evaluationDate: string
  onToggleMember: (name: string) => void
  onSetOtherPeople: (value: string) => void
  onSetEvaluationDate: (value: string) => void
}

// ---------------------------------------------------------------------------
// Eval type config
// ---------------------------------------------------------------------------

function getEvalTypeConfig(evalType: EvaluationType) {
  if (evalType === 'audit') {
    return {
      label: 'Auditoria',
      badgeVariant: 'primary' as const,
    }
  }
  return {
    label: 'Follow-Up',
    badgeVariant: 'info' as const,
  }
}

// ---------------------------------------------------------------------------
// Check icon for pills
// ---------------------------------------------------------------------------

function CheckSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Pill Step Progress (reused from hero-section.tsx pattern)
// ---------------------------------------------------------------------------

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
              !isCompleted && !isCurrent && 'h-7 w-7 bg-white/60 text-gray-400 border border-gray-200',
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
          >
            {isCompleted ? <CheckSmall /> : <span className={cn('text-[11px] font-bold', isCurrent && 'text-xs')}>{step}</span>}
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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function EvalHeroSection({
  group,
  evalType,
  userName,
  score,
  meta,
  answeredCount,
  totalQuestions,
  presentMembers,
  otherPeople,
  evaluationDate,
  onToggleMember,
  onSetOtherPeople,
  onSetEvaluationDate,
}: EvalHeroSectionProps) {
  const typeConfig = getEvalTypeConfig(evalType)
  const scoreColor = getScoreColor(score)

  return (
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative min-w-0 bg-gradient-to-br from-white via-white to-primary-50/30 overflow-hidden">
        <EvalWaveWatermark />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: Identity */}
            <div className="flex-1 min-w-0">
              <motion.div
                className="flex items-center gap-1.5 text-sm text-gray-400 mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span>{group.managementName}</span>
                <span className="text-gray-300/50 mx-0.5">/</span>
                <span>{group.areaName}</span>
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight leading-tight mb-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {group.name}
              </motion.h1>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Badge variant={typeConfig.badgeVariant} className="text-xs">
                  {typeConfig.label}
                </Badge>
                <div className="w-px h-5 bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Meta</span>
                  <span className="text-sm font-bold text-primary-600">{meta}%</span>
                </div>
                <div className="w-px h-5 bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Aplicador</span>
                  <span className="text-sm font-medium text-gray-700">{userName}</span>
                </div>
                <div className="w-px h-5 bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Data</span>
                  <input
                    type="date"
                    value={evaluationDate}
                    onChange={(e) => onSetEvaluationDate(e.target.value)}
                    className="text-sm font-medium text-gray-600 bg-transparent border-none outline-none cursor-pointer p-0 -ml-0.5"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right: Glass card (desktop) */}
            <motion.div
              className="flex-shrink-0 lg:max-w-[280px] w-full lg:w-auto hidden lg:block"
              variants={evalGlassCard}
              initial="initial"
              animate="animate"
            >
              <div
                className="relative rounded-2xl border border-white/60 p-5 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.70)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 8px 32px rgba(30,122,115,0.08), 0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Type badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-300 flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-black text-white tracking-tight">
                      {evalType === 'audit' ? 'AU' : 'FU'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Tipo</p>
                    <p className="text-sm font-bold text-primary-700">{group.groupTypeName}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <PillStepProgress current={group.currentSequence} max={group.maxSequence} />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

                {/* Score summary */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <span className="text-2xl font-black tabular-nums" style={{ color: scoreColor }}>
                      {Math.round(score)}%
                    </span>
                    <p className="text-[9px] text-gray-400 font-medium">Nota Atual</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <span className="text-2xl font-black text-primary-600 tabular-nums">{meta}%</span>
                    <p className="text-[9px] text-gray-400 font-medium">Meta</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Gradient divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

          {/* Attendance panel */}
          <EvalAttendancePanel
            members={group.team}
            presentMembers={presentMembers}
            otherPeople={otherPeople}
            onToggleMember={onToggleMember}
            onSetOtherPeople={onSetOtherPeople}
          />
        </div>
      </div>
    </motion.div>
  )
}
