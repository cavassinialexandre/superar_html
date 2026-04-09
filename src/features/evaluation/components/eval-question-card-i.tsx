/**
 * Variant I -- "Node Connector Card"
 *
 * Connected Cards timeline.  Branch connectors, left border.  Cards are
 * nodes in a connected network.  Progress-bar-segment answer selector,
 * connecting dots, sub-node justification with vertical connector line.
 * Fully self-contained -- no cross-variant imports.
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
// Answer options
// ---------------------------------------------------------------------------

const ANSWER_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'Sim' },
  { value: 'partial', label: 'Parcial' },
  { value: 'no', label: 'N\u00e3o' },
  { value: 'na', label: 'N/A' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAnswerColor(answer: AnswerValue | null | undefined): string {
  return answer ? ANSWER_COLORS[answer] : '#A3ADAC'
}

function getAnswerBgTint(answer: AnswerValue | null | undefined): string {
  if (!answer) return 'transparent'
  return `${ANSWER_COLORS[answer]}04`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardI({
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="relative rounded-lg"
      style={{
        backgroundColor: hasAnswer ? getAnswerBgTint(state?.answer) : 'white',
        border: '1px solid #E5E7EB',
        borderLeft: `3px solid ${sectionColor}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Connecting dot at left-center of card */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
          style={{
            backgroundColor: sectionColor,
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          <span className="text-white text-[9px] font-bold leading-none tabular-nums">
            {index + 1}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="pl-7 pr-4 pt-3.5 pb-3">
        {/* Question text */}
        <p className="text-[13px] font-medium text-gray-700 leading-snug mb-2">
          {question.text}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-gray-400 font-mono">
            [W:{question.weight}]
          </span>
          {question.requiredYesForAdvance && (
            <span className="text-[10px] text-amber-600 font-mono font-bold">
              [REQ]
            </span>
          )}
        </div>

        {/* Answer Selector: Progress Bar Segments */}
        <div
          className="h-10 rounded-lg overflow-hidden flex mb-3"
          style={{ gap: '1px', backgroundColor: 'white' }}
        >
          {ANSWER_OPTIONS.map((opt, segIndex) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]

            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                className="relative flex-1 flex items-center justify-center cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: isSelected ? optColor : '#F3F4F6',
                  color: isSelected ? 'white' : '#9CA3AF',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#E5E7EB'
                    e.currentTarget.style.color = '#6B7280'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F3F4F6'
                    e.currentTarget.style.color = '#9CA3AF'
                  }
                }}
              >
                {/* Fill animation behind */}
                {isSelected && (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: optColor }}
                  />
                )}

                {/* Triangle pointer above selected segment */}
                {isSelected && (
                  <div
                    className="absolute"
                    style={{
                      top: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: `6px solid ${optColor}`,
                    }}
                  />
                )}

                {/* Label */}
                <span className="relative z-10 text-[10px] font-bold select-none">
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Justification -- sub-node with vertical connector */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* Vertical connector line */}
              <div
                style={{
                  width: '1px',
                  height: '16px',
                  backgroundColor: answerColor,
                  marginLeft: '12px',
                }}
              />

              {/* Justification container */}
              <div className="pl-4">
                <div className="bg-gray-50 rounded-md p-2.5 border border-gray-200">
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
              </div>

              {/* Attachments -- compact sub-node */}
              <div
                style={{
                  width: '1px',
                  height: '8px',
                  backgroundColor: answerColor,
                  marginLeft: '12px',
                  opacity: 0.5,
                }}
              />
              <div className="pl-4 pb-1">
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

        {/* Attachments when no justification needed */}
        {!needsJustification && (
          <div className="pt-1">
            <AttachmentZone
              files={state?.attachments || []}
              onAdd={onAddAttachments}
              onRemove={onRemoveAttachment}
              compact
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
