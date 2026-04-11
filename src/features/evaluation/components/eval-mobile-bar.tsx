/**
 * Mobile-only components: glassmorphism bottom bar, FAB with pulsing ring,
 * and bottom sheet with sidebar content.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui'
import { ProgressBar } from '@/components/ui/progress-bar'
import { CircularScoreGauge } from '@/components/data-display/circular-score-gauge'
import { CheckIcon, XIcon, CheckCircleIcon } from '@/assets/icons'
import { getScoreColor } from '@/design-system/tokens'
import type { EvaluationType } from '@/types'

interface SectionNavItem {
  title: string
  color: string
  answeredCount: number
  totalCount: number
  status: 'complete' | 'partial' | 'empty'
}

interface EvalMobileBarProps {
  score: number
  meta: number
  progress: number
  answeredCount: number
  totalQuestions: number
  evalType: EvaluationType
  eligibility: { eligible: boolean; reasons: string[] }
  sections: SectionNavItem[]
  canFinalize: boolean
  sidebarOpen: boolean
  onOpenSidebar: () => void
  onCloseSidebar: () => void
  onScrollToSection: (index: number) => void
  onFinalize: () => void
}

function statusDotColor(status: 'complete' | 'partial' | 'empty'): string {
  switch (status) {
    case 'complete': return 'bg-green-500'
    case 'partial': return 'bg-yellow-400'
    case 'empty': return 'bg-gray-300'
  }
}

export function EvalMobileBar({
  score,
  meta,
  progress,
  answeredCount,
  totalQuestions,
  evalType,
  eligibility,
  sections,
  canFinalize,
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  onScrollToSection,
  onFinalize,
}: EvalMobileBarProps) {
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
    <>
      {/* ============================================================
          BOTTOM BAR (glassmorphism)
      ============================================================ */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 16px rgba(16,55,52,0.08)',
          borderTop: '1px solid rgba(228, 232, 232, 0.5)',
        }}
      >
        <div className="flex items-center justify-between px-4 h-16 max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <CircularScoreGauge score={score} meta={meta} size="sm" showMeta={false} />
            <div>
              <p className="text-xs font-semibold text-gray-800 tabular-nums">
                {Math.round(score)}%
              </p>
              <p className="text-[10px] text-gray-400">
                {answeredCount}/{totalQuestions}
              </p>
            </div>
          </div>
          <Button
            disabled={!canFinalize}
            onClick={onFinalize}
            size="sm"
          >
            Finalizar
          </Button>
        </div>
      </div>

      {/* ============================================================
          FAB with pulsing ring
      ============================================================ */}
      <button
        onClick={onOpenSidebar}
        className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-primary-800 text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-primary-900 transition-colors active:scale-95 relative"
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary-400/40"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="font-heading font-bold text-sm tabular-nums relative z-10">
          {Math.round(score)}%
        </span>
      </button>

      {/* ============================================================
          BOTTOM SHEET
      ============================================================ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
              onClick={onCloseSidebar}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl max-h-[70vh] overflow-y-auto p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1.5 rounded-full bg-gray-300/60" />
              </div>

              {/* Score gauge */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <div
                    className="absolute inset-4 rounded-full blur-xl opacity-15"
                    style={{ background: getScoreColor(score) }}
                  />
                  <CircularScoreGauge score={score} meta={meta} size="lg" showMeta />
                </div>
                <p className="text-xs text-gray-400 font-medium mt-2">Nota Atual</p>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <ProgressBar value={progress} variant="gradient" size="md" />
                <p className="text-xs text-gray-500 text-center mt-1.5 tabular-nums">
                  {answeredCount} de {totalQuestions} perguntas
                </p>
              </div>

              {/* Eligibility (audit only) */}
              {evalType === 'audit' && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
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
                </>
              )}

              {/* Quick Nav */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Navegação Rápida</p>
                <div className="space-y-1">
                  {sections.map((sec, idx) => (
                    <button
                      key={sec.title}
                      onClick={() => {
                        onScrollToSection(idx)
                        onCloseSidebar()
                      }}
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

              {/* Finalize */}
              <div className="mt-4">
                <Button
                  variant="premium"
                  className="w-full"
                  disabled={!canFinalize}
                  onClick={() => {
                    onCloseSidebar()
                    onFinalize()
                  }}
                  size="lg"
                >
                  <CheckCircleIcon size={18} />
                  Finalizar Avaliação
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for bottom bar */}
      <div className="lg:hidden h-20" />
    </>
  )
}
