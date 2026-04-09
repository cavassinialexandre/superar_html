/**
 * Variant J -- "Zigzag Directional Card"
 *
 * Alternating left/right directional cards.  Asymmetric border-radius,
 * directional shadows, horizontal slide-toggle answer selector with
 * spring-animated thumb, directional metadata placement, and directional
 * slide entrance for justification.  Fully self-contained -- no
 * cross-variant imports.
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Label, Textarea } from '@/components/ui'
import { AttachmentZone } from '@/components/ui/attachment-zone'
import type { AnswerValue, Question } from '@/types'

// ---------------------------------------------------------------------------
// Shared contract
// ---------------------------------------------------------------------------

interface QuestionState {
  answer: AnswerValue | null
  justification: string
  attachments: File[]
}

interface EvalQuestionCardProps {
  question: Question
  index: number
  state: QuestionState | undefined
  onAnswer: (value: AnswerValue) => void
  onJustification: (text: string) => void
  onAddAttachments: (files: File[]) => void
  onRemoveAttachment: (index: number) => void
  sectionColor?: string
}

// ---------------------------------------------------------------------------
// Answer color map
// ---------------------------------------------------------------------------

const ANSWER_COLORS: Record<AnswerValue, string> = {
  yes: '#00A650',
  partial: '#DDDD03',
  no: '#CE3C5A',
  na: '#A3ADAC',
}

// ---------------------------------------------------------------------------
// Answer options
// ---------------------------------------------------------------------------

const ANSWER_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'Sim' },
  { value: 'partial', label: 'Parcial' },
  { value: 'no', label: 'N\u00e3o' },
  { value: 'na', label: 'N/A' },
]

// ---------------------------------------------------------------------------
// Position mapping for slide thumb (percentage offset from left)
// ---------------------------------------------------------------------------

const POSITION_MAP: Record<AnswerValue, number> = {
  yes: 0,
  partial: 25,
  no: 50,
  na: 75,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAnswerColor(answer: AnswerValue | null | undefined): string {
  return answer ? ANSWER_COLORS[answer] : '#A3ADAC'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardJ({
  question,
  index,
  state,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionColor = '#6366F1',
}: EvalQuestionCardProps) {
  const isEven = index % 2 === 0
  const hasAnswer = !!state?.answer
  const answerColor = getAnswerColor(state?.answer)
  const needsJustification = state?.answer === 'no' || state?.answer === 'partial'
  const [hasHadAnswer, setHasHadAnswer] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Track whether we have ever had an answer (for initial pop vs slide)
  useEffect(() => {
    if (hasAnswer && !hasHadAnswer) {
      setHasHadAnswer(true)
    }
  }, [hasAnswer, hasHadAnswer])

  // Directional border-radius
  const borderRadius = isEven
    ? '2px 12px 12px 2px'
    : '12px 2px 2px 12px'

  // Directional shadow
  const boxShadow = isEven
    ? '2px 4px 12px rgba(0,0,0,0.06)'
    : '-2px 4px 12px rgba(0,0,0,0.06)'

  // Directional gradient overlay on answer
  const backgroundImage = hasAnswer
    ? isEven
      ? `linear-gradient(90deg, transparent 80%, ${answerColor}05 100%)`
      : `linear-gradient(270deg, transparent 80%, ${answerColor}05 100%)`
    : 'none'

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -16 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="relative"
      style={{
        borderRadius,
        boxShadow,
        border: '1px solid #E5E7EB',
        borderTop: `3px solid ${sectionColor}`,
        background: 'white',
        backgroundImage,
      }}
    >
      {/* Card body */}
      <div className="px-4 pt-3.5 pb-3">
        {/* Header row: number + metadata */}
        <div
          className={cn(
            'flex items-start gap-2 mb-2',
            isEven ? 'flex-row' : 'flex-row-reverse',
          )}
        >
          {/* Directional number badge */}
          <div
            className={cn(
              'flex items-center gap-1 shrink-0',
              !isEven && 'flex-row-reverse',
            )}
          >
            <span
              className="text-[10px] font-bold rounded-md px-2 py-0.5"
              style={{
                backgroundColor: `${sectionColor}10`,
                color: sectionColor,
              }}
            >
              {isEven ? (
                <>
                  {String(index + 1).padStart(2, '0')}
                  <span className="ml-1 opacity-60">&gt;</span>
                </>
              ) : (
                <>
                  <span className="mr-1 opacity-60">&lt;</span>
                  {String(index + 1).padStart(2, '0')}
                </>
              )}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Metadata (opposite side to number) */}
          <div
            className={cn(
              'flex items-center gap-2 shrink-0',
              isEven ? 'flex-row' : 'flex-row-reverse',
            )}
          >
            <span className="text-[10px] text-gray-400 font-medium">
              Peso {question.weight}
            </span>
            {question.requiredYesForAdvance && (
              <span className="text-[9px] text-amber-700 font-bold">
                &bull; Obrigat\u00f3rio
              </span>
            )}
          </div>
        </div>

        {/* Question text */}
        <p className="text-sm font-medium text-gray-800 leading-snug text-left mb-3">
          {question.text}
        </p>

        {/* Answer Selector: Horizontal Slide Toggle */}
        <div className="relative mb-3" ref={trackRef}>
          <div
            className="relative rounded-full h-9 w-full"
            style={{
              backgroundColor: '#F3F4F6',
              border: hasAnswer ? `1px solid ${answerColor}20` : '1px solid transparent',
              transition: 'border-color 200ms',
            }}
          >
            {/* Position labels along the track */}
            {ANSWER_OPTIONS.map((opt, optIndex) => {
              const isSelected = state?.answer === opt.value
              const leftPercent = optIndex * 25 + 12.5

              return (
                <button
                  key={opt.value}
                  onClick={() => onAnswer(opt.value)}
                  className="absolute top-0 h-full flex items-center justify-center cursor-pointer z-10"
                  style={{
                    left: `${leftPercent}%`,
                    transform: 'translateX(-50%)',
                    width: '25%',
                  }}
                >
                  <span
                    className={cn(
                      'text-[9px] font-bold transition-opacity duration-200 select-none',
                      isSelected ? 'opacity-0' : 'text-gray-400',
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              )
            })}

            {/* Sliding thumb */}
            <AnimatePresence>
              {hasAnswer && state?.answer && (
                <motion.div
                  initial={
                    !hasHadAnswer
                      ? { scale: 0, opacity: 0, left: `${POSITION_MAP[state.answer]}%` }
                      : { left: `${POSITION_MAP[state.answer]}%` }
                  }
                  animate={
                    !hasHadAnswer
                      ? {
                          scale: [0, 1.1, 1],
                          opacity: [0, 1, 1],
                          left: `${POSITION_MAP[state.answer]}%`,
                        }
                      : { scale: 1, opacity: 1, left: `${POSITION_MAP[state.answer]}%` }
                  }
                  transition={
                    hasHadAnswer
                      ? { type: 'spring', stiffness: 400, damping: 30 }
                      : { duration: 0.3, ease: 'easeOut' }
                  }
                  className="absolute top-0 h-full rounded-full flex items-center justify-center"
                  style={{
                    width: '25%',
                    backgroundColor: answerColor,
                    zIndex: 5,
                  }}
                >
                  <span className="text-xs font-bold text-white select-none">
                    {ANSWER_OPTIONS.find((o) => o.value === state.answer)?.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Justification -- directional slide entrance */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, x: isEven ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isEven ? -10 : 10 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-2"
            >
              <div
                className="rounded-lg p-3"
                style={{
                  backgroundColor: `${answerColor}05`,
                  borderTop: `1px solid ${answerColor}15`,
                }}
              >
                <Label className="text-[11px] text-gray-500 mb-1">
                  Justificativa (obrigat\u00f3ria)
                </Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[56px] text-[12px]"
                  style={{
                    '--tw-ring-color': answerColor,
                  } as React.CSSProperties}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <div className={cn('pt-1', isEven ? 'text-left' : 'text-right')}>
          <AttachmentZone
            files={state?.attachments || []}
            onAdd={onAddAttachments}
            onRemove={onRemoveAttachment}
            compact
          />
        </div>
      </div>
    </motion.div>
  )
}
