/**
 * Variant B — "Flow Stripe Card"
 *
 * Right-edge color stripe that continues the section's top-bar flow,
 * iOS-style segmented-control answer selector with sliding indicator,
 * dot-grid weight display, and right-sliding justification panel.
 * Fully self-contained — no cross-variant imports.
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
// Segment config
// ---------------------------------------------------------------------------

const SEGMENTS: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'Sim' },
  { value: 'partial', label: 'Parcial' },
  { value: 'no', label: 'Não' },
  { value: 'na', label: 'N/A' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAnswerColor(answer: AnswerValue | null | undefined): string {
  return answer ? ANSWER_COLORS[answer] : '#A3ADAC'
}

function getSelectedIndex(answer: AnswerValue | null | undefined): number {
  if (!answer) return -1
  return SEGMENTS.findIndex((s) => s.value === answer)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardB({
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
  const selectedIdx = getSelectedIndex(state?.answer)
  const weightClamped = Math.max(0, Math.min(question.weight, 10))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="relative rounded-xl border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-sm"
      style={{
        background: `linear-gradient(90deg, white 85%, ${sectionColor}06 100%)`,
        boxShadow: hasAnswer ? undefined : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Right stripe */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[3px]"
        style={{
          background: hasAnswer
            ? `linear-gradient(180deg, ${answerColor} 0%, ${sectionColor} 100%)`
            : sectionColor,
        }}
      />

      <div className="p-4 pr-5">
        {/* Header: question text + index chip */}
        <div className="flex items-start gap-3 mb-3">
          <p className="flex-1 text-sm font-medium text-gray-700 leading-snug min-w-0">
            {question.text}
          </p>

          {/* Index chip (top-right) */}
          <span
            className="inline-flex items-center rounded-md px-2 h-6 flex-shrink-0 text-[10px] font-bold tabular-nums font-mono"
            style={{
              backgroundColor: `${sectionColor}10`,
              color: sectionColor,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Weight: dot grid */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-gray-400 mr-0.5">Peso</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: i < weightClamped ? sectionColor : '#E5E7EB',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Required indicator */}
          {question.requiredYesForAdvance && (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-600">
              <span
                className="w-1 h-1 flex-shrink-0"
                style={{ backgroundColor: '#E11D48' }}
              />
              Obrigatório
            </span>
          )}
        </div>

        {/* Segmented control (iOS-style) */}
        <div className="relative flex items-center h-[42px] rounded-full bg-gray-100 p-[3px] mb-3">
          {/* Sliding indicator */}
          <AnimatePresence>
            {selectedIdx >= 0 && (
              <motion.div
                className="absolute top-[3px] bottom-[3px] rounded-full"
                initial={false}
                animate={{
                  left: `calc(${(selectedIdx / 4) * 100}% + 3px)`,
                  width: 'calc(25% - 3px)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{
                  backgroundColor: answerColor,
                  boxShadow: `0 2px 8px ${answerColor}30`,
                }}
              />
            )}
          </AnimatePresence>

          {/* Segments */}
          {SEGMENTS.map((seg, segIdx) => {
            const isActive = state?.answer === seg.value

            return (
              <button
                key={seg.value}
                onClick={() => onAnswer(seg.value)}
                className={cn(
                  'relative z-10 flex-1 h-full rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150',
                  isActive ? 'text-white' : 'text-gray-400',
                )}
              >
                <span className="text-xs font-bold select-none">{seg.label}</span>
              </button>
            )
          })}
        </div>

        {/* Justification */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className="mb-3"
                style={{ borderRight: `2px solid ${answerColor}` }}
              >
                <div className="pr-3">
                  <Label>Justificativa (obrigatória)</Label>
                  <Textarea
                    placeholder="Informe o motivo..."
                    value={state?.justification || ''}
                    onChange={(e) => onJustification(e.target.value)}
                    error={needsJustification && !state?.justification}
                    className="min-h-[60px] rounded-lg border-gray-200"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments — compact inline pills */}
        <AttachmentZone
          files={state?.attachments || []}
          onAdd={onAddAttachments}
          onRemove={onRemoveAttachment}
          compact
        />
      </div>
    </motion.div>
  )
}
