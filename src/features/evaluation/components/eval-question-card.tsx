/**
 * Premium question card with top gradient accent bar,
 * styled number badge, and animated justification/attachments.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Label, Textarea } from '@/components/ui'
import { AttachmentZone } from '@/components/ui/attachment-zone'
import { EvalAnswerSelector } from './eval-answer-selector'
import { evalQuestionItem } from '@/design-system/animations'
import type { AnswerValue, Question } from '@/types'

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
  /** Section color for visual integration (badge + left border when answered) */
  sectionColor?: string
}

// ---------------------------------------------------------------------------
// Gradient helpers
// ---------------------------------------------------------------------------

function answerGradient(answer: AnswerValue | null | undefined): string {
  switch (answer) {
    case 'yes':
      return 'linear-gradient(90deg, #00A650 0%, #34D478 50%, #6DE8A0 100%)'
    case 'partial':
      return 'linear-gradient(90deg, #DDDD03 0%, #EADA0A 50%, #F5E633 100%)'
    case 'no':
      return 'linear-gradient(90deg, #CE3C5A 0%, #F06A88 50%, #FCC8D2 100%)'
    case 'na':
      return 'linear-gradient(90deg, #A3ADAC 0%, #CDD4D3 50%, #E4E8E8 100%)'
    default:
      return 'linear-gradient(90deg, #E4E8E8 0%, #CDD4D3 50%, #E4E8E8 100%)'
  }
}

// ---------------------------------------------------------------------------
// Inline icons
// ---------------------------------------------------------------------------

function ScaleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22V8" />
      <path d="m3 8 9-5 9 5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCard({
  question,
  index,
  state,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionColor,
}: EvalQuestionCardProps) {
  const hasAnswer = !!state?.answer
  const needsJustification = state?.answer === 'no' || state?.answer === 'partial'

  return (
    <motion.div
      variants={evalQuestionItem}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-white',
        'transition-all duration-200',
        hasAnswer
          ? 'border-gray-200 shadow-xs'
          : 'border-gray-100 shadow-none hover:border-gray-200 hover:shadow-xs',
      )}
      style={hasAnswer && sectionColor ? { borderLeftWidth: 3, borderLeftColor: sectionColor } : undefined}
    >
      {/* Top accent gradient bar */}
      <div
        className="h-[3px]"
        style={{ background: answerGradient(state?.answer) }}
      />

      <div className="p-4">
        {/* Question header: number + text + badges */}
        <div className="flex items-start gap-3 mb-3">
          {/* Number badge */}
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold tabular-nums',
              !hasAnswer && 'bg-gray-100 text-gray-400',
              hasAnswer && !sectionColor && 'bg-primary-50 text-primary-700',
            )}
            style={hasAnswer && sectionColor ? { backgroundColor: `${sectionColor}15`, color: sectionColor } : undefined}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-relaxed">
              {question.text}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {/* Weight badge */}
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-50 rounded-md px-1.5 py-0.5">
                <ScaleIcon /> Peso: {question.weight}
              </span>
              {/* Required badge */}
              {question.requiredYesForAdvance && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-full px-2 py-0.5">
                  <LockIcon /> Obrigatório
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Answer selector */}
        <div className="mb-2">
          <EvalAnswerSelector
            value={state?.answer ?? null}
            onChange={onAnswer}
          />
        </div>

        {/* Justification (conditional, animated) */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                <Label>Justificativa (obrigatória)</Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[60px]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachment zone */}
        <div className="mt-2">
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
