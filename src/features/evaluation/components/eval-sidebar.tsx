/**
 * Glassmorphism sticky sidebar with score gauge, progress,
 * team presence, eligibility criteria, and quick navigation.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui'
import { ProgressBar } from '@/components/ui/progress-bar'
import { CircularScoreGauge } from '@/components/data-display/circular-score-gauge'
import { CheckIcon, XIcon, CheckCircleIcon } from '@/assets/icons'
import { EvalClipboardWatermark } from './eval-watermarks'
import { getScoreColor } from '@/design-system/tokens'
import type { TeamMember, EvaluationType } from '@/types'

interface SectionNavItem {
  title: string
  color: string
  answeredCount: number
  totalCount: number
  status: 'complete' | 'partial' | 'empty'
}

interface EvalSidebarProps {
  score: number
  meta: number
  progress: number
  answeredCount: number
  totalQuestions: number
  presentMembers: string[]
  teamMembers: TeamMember[]
  evalType: EvaluationType
  eligibility: { eligible: boolean; reasons: string[] }
  sections: SectionNavItem[]
  canFinalize: boolean
  onScrollToSection: (index: number) => void
  onFinalize: () => void
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusDotColor(status: 'complete' | 'partial' | 'empty'): string {
  switch (status) {
    case 'complete': return 'bg-green-500'
    case 'partial': return 'bg-yellow-400'
    case 'empty': return 'bg-gray-300'
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalSidebar({
  score,
  meta,
  progress,
  answeredCount,
  totalQuestions,
  presentMembers,
  teamMembers,
  evalType,
  eligibility,
  sections,
  canFinalize,
  onScrollToSection,
  onFinalize,
  className,
}: EvalSidebarProps) {
  const scoreOk = score >= meta
  const mandatoryOk = !eligibility.reasons.some((r) => r.toLowerCase().includes('obrigator'))
  const criteriaRows = evalType === 'audit'
    ? [
        { label: 'Nota >= Meta', ok: scoreOk },
        { label: 'Perguntas obrigatórias', ok: mandatoryOk },
        { label: 'Pode avançar', ok: eligibility.eligible },
      ]
    : []

  return (
    <div className={className}>
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div
          className="relative overflow-hidden rounded-2xl border border-white/60"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px rgba(30,122,115,0.10), 0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] z-10"
            style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }}
          />

          {/* Background watermark */}
          <EvalClipboardWatermark />

          <div className="relative z-10 p-5 pt-6">
            {/* Score gauge with glow */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <div
                  className="absolute inset-4 rounded-full blur-xl opacity-15"
                  style={{ background: getScoreColor(score) }}
                />
                <CircularScoreGauge score={score} meta={meta} size="lg" showMeta />
              </div>
              <p className="text-xs text-gray-400 font-medium mt-2">Nota Atual</p>
            </div>

            {/* Completion progress */}
            <div className="mt-4">
              <ProgressBar value={progress} variant="gradient" size="md" />
              <p className="text-xs text-gray-500 text-center mt-1.5 tabular-nums">
                {answeredCount} de {totalQuestions} perguntas
              </p>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

            {/* Team present */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Equipe Presente</p>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold transition-all',
                        isPresent
                          ? 'bg-primary-100 text-primary-700 ring-2 ring-green-400/50'
                          : 'bg-gray-100 text-gray-300 opacity-40',
                      )}
                    >
                      {member.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 tabular-nums">
                {presentMembers.length}/{teamMembers.length} presentes
              </p>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

            {/* Eligibility criteria (audit only) */}
            {evalType === 'audit' && (
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Critérios de Avanço</p>
                  <div className="space-y-1.5">
                    {criteriaRows.map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors',
                          row.ok ? 'bg-green-50/50' : 'bg-rose-50/50',
                        )}
                      >
                        <span className={row.ok ? 'text-gray-600' : 'text-gray-500'}>{row.label}</span>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center',
                            row.ok ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-500',
                          )}
                        >
                          {row.ok ? <CheckIcon size={12} /> : <XIcon size={12} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
              </>
            )}

            {/* Quick navigation */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Navegação Rápida</p>
              <div className="space-y-1">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-white/50 hover:shadow-xs transition-all cursor-pointer text-left"
                  >
                    <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', statusDotColor(sec.status))} />
                    <span className="flex-1 truncate">{sec.title}</span>
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      {sec.answeredCount}/{sec.totalCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

            {/* Finalize button */}
            <Button
              variant="premium"
              className="w-full"
              disabled={!canFinalize}
              onClick={onFinalize}
              size="lg"
            >
              <CheckCircleIcon size={18} />
              Finalizar Avaliação
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
