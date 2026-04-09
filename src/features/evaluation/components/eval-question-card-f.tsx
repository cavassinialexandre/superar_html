/**
 * Variant F -- "Zebra Stripe Row"
 *
 * Borderless, seamless full-width row that melts into its parent band.
 * Even/odd zebra striping, inline text-only answer chips (no icons),
 * inline number prefix merged with question text, and minimalist
 * bottom-border-only textarea.  Fully self-contained -- no cross-variant
 * imports.
 */

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
// Answer option config (no icons -- text-only chips)
// ---------------------------------------------------------------------------

const ANSWER_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'Sim' },
  { value: 'partial', label: 'Parcial' },
  { value: 'no', label: 'Nao' },
  { value: 'na', label: 'N/A' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAnswerColor(answer: AnswerValue | null | undefined): string {
  return answer ? ANSWER_COLORS[answer] : '#A3ADAC'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardF({
  question,
  index,
  state,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionColor = '#6366F1',
}: EvalQuestionCardProps) {
  const hasAnswer = !!state?.answer
  const answerColor = getAnswerColor(state?.answer)
  const needsJustification = state?.answer === 'no' || state?.answer === 'partial'
  const isOdd = index % 2 !== 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full"
      style={{
        padding: '16px',
        paddingLeft: hasAnswer ? 20 : 16,
        borderBottom: `1px solid ${sectionColor}14`,
        borderLeft: hasAnswer ? `3px solid ${answerColor}` : '3px solid transparent',
        background: isOdd ? `${sectionColor}06` : 'transparent',
        transition: 'padding-left 200ms ease, border-left-color 200ms ease',
      }}
    >
      {/* Top row: question text + metadata + answer chips */}
      <div className="flex items-start gap-3">
        {/* Question text with inline number prefix */}
        <p className="flex-1 text-sm font-medium text-gray-700 leading-snug min-w-0">
          <span
            className="text-xs font-bold tabular-nums mr-1"
            style={{ color: sectionColor }}
          >
            {index + 1}.
          </span>
          {question.text}
        </p>

        {/* Right side: metadata + answer chips */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Metadata (compact) */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
              P:{question.weight}
            </span>
            {question.requiredYesForAdvance && (
              <span className="text-[9px] text-amber-600 font-bold whitespace-nowrap">
                *Obrigatorio
              </span>
            )}
          </div>

          {/* Inline text chips */}
          <div className="flex items-center gap-1.5">
            {ANSWER_OPTIONS.map((opt) => {
              const isSelected = state?.answer === opt.value
              const optColor = ANSWER_COLORS[opt.value]

              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => onAnswer(opt.value)}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-all duration-150 inline-flex items-center gap-1',
                    isSelected
                      ? 'text-white'
                      : 'bg-transparent border border-gray-200 text-gray-400 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-500',
                  )}
                  style={
                    isSelected
                      ? {
                          backgroundColor: optColor,
                          borderColor: optColor,
                          border: `1px solid ${optColor}`,
                        }
                      : undefined
                  }
                >
                  {/* Tiny white dot before text when selected */}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="inline-block w-1 h-1 rounded-full bg-white flex-shrink-0"
                    />
                  )}
                  {opt.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Justification */}
      <AnimatePresence>
        {needsJustification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3">
              <Label className="text-[10px] text-gray-400 mb-1">
                Justificativa
              </Label>
              <Textarea
                placeholder="Informe o motivo..."
                value={state?.justification || ''}
                onChange={(e) => onJustification(e.target.value)}
                error={needsJustification && !state?.justification}
                className="min-h-[48px] bg-transparent border-0 border-b border-gray-300 rounded-none shadow-none focus:border-gray-500 focus:ring-0 px-0"
                style={{
                  '--tw-ring-color': answerColor,
                } as React.CSSProperties}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments */}
      <AnimatePresence>
        {(hasAnswer || (state?.attachments && state.attachments.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-2">
              <AttachmentZone
                files={state?.attachments || []}
                onAdd={onAddAttachments}
                onRemove={onRemoveAttachment}
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
