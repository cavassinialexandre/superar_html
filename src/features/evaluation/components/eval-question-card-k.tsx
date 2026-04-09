/**
 * Variant K -- "Micro Data Row"
 *
 * Ultra-compact single-row card that looks like a data table row, not a card.
 * Everything on one line: index, question text (truncated), weight superscript,
 * required asterisk, and tiny radio dot selectors. Justification expands as a
 * slim second row when needed.  Fully self-contained -- no cross-variant imports.
 */

import { useRef } from 'react'
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
// Radio dot options -- abbreviated labels
// ---------------------------------------------------------------------------

const RADIO_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 'yes', label: 'S' },
  { value: 'partial', label: 'P' },
  { value: 'no', label: 'N' },
  { value: 'na', label: 'NA' },
]

// ---------------------------------------------------------------------------
// Inline tiny "+" icon for the compact attachment trigger
// ---------------------------------------------------------------------------

function PlusIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAnswerColor(answer: AnswerValue | null | undefined): string {
  return answer ? ANSWER_COLORS[answer] : 'transparent'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardK({
  question,
  index,
  state,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: EvalQuestionCardProps) {
  const hasAnswer = !!state?.answer
  const answerColor = getAnswerColor(state?.answer)
  const needsJustification = state?.answer === 'no' || state?.answer === 'partial'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const attachmentCount = state?.attachments?.length ?? 0

  return (
    <div
      className={cn(
        'rounded-md border bg-white transition-colors',
        hasAnswer ? 'border-gray-200' : 'border-gray-200 hover:border-gray-300',
      )}
      style={{
        borderLeftWidth: hasAnswer ? 2 : 1,
        borderLeftColor: hasAnswer ? answerColor : undefined,
      }}
    >
      {/* Row 1 -- the single data row */}
      <div className="flex items-center gap-2 py-2 px-3">
        {/* Number prefix */}
        <span className="text-[11px] font-bold text-gray-500 tabular-nums flex-shrink-0">
          {index + 1}.
        </span>

        {/* Question text -- truncated to single line */}
        <span
          className="text-[12px] font-medium text-gray-700 leading-tight truncate flex-1 min-w-0"
          title={question.text}
        >
          {question.text}
        </span>

        {/* Weight superscript */}
        <span className="text-[8px] text-gray-400 flex-shrink-0 leading-none" style={{ verticalAlign: 'super' }}>
          <sup>{question.weight}</sup>
        </span>

        {/* Required asterisk */}
        {question.requiredYesForAdvance && (
          <span className="text-rose-500 text-[10px] flex-shrink-0 leading-none">*</span>
        )}

        {/* Separator */}
        <div className="w-px h-4 bg-gray-200 flex-shrink-0 mx-1" />

        {/* Tiny radio dots */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {RADIO_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAnswer(opt.value)}
                className="inline-flex items-center gap-1 cursor-pointer group"
                aria-label={opt.label}
              >
                {/* Radio circle */}
                <span
                  className={cn(
                    'w-2.5 h-2.5 rounded-full border transition-colors',
                    isSelected ? 'border-current' : 'border-gray-300 group-hover:border-gray-400',
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: optColor,
                          boxShadow: `inset 0 0 0 3px ${optColor}`,
                        }
                      : undefined
                  }
                />
                {/* Abbreviated label */}
                <span
                  className={cn(
                    'text-[10px] font-medium select-none transition-colors',
                    isSelected ? 'text-gray-700' : 'text-gray-500',
                  )}
                >
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Compact attachment trigger */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-5 h-5 inline-flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Anexar arquivo"
          >
            <PlusIcon size={12} />
          </button>
          {attachmentCount > 0 && (
            <span className="text-[9px] text-gray-400 whitespace-nowrap">
              ({attachmentCount} {attachmentCount === 1 ? 'anexo' : 'anexos'})
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (files.length > 0) onAddAttachments(files)
              e.target.value = ''
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Row 2 -- justification + attachments (conditional) */}
      <AnimatePresence>
        {needsJustification && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2">
              <div className="flex items-start gap-2">
                <Label className="text-[9px] text-gray-400 pt-1.5 flex-shrink-0 whitespace-nowrap">
                  Justificativa:
                </Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[40px] text-[12px] bg-transparent border-0 border-b border-gray-200 rounded-none shadow-none focus:ring-0 focus:border-gray-300 resize-none py-1 px-0"
                />
              </div>

              {/* Inline attachment zone when justification is open and files exist */}
              {attachmentCount > 0 && (
                <div className="mt-1.5 pl-[74px]">
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
        )}
      </AnimatePresence>
    </div>
  )
}
