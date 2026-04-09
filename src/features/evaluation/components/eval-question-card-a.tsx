/**
 * Variant A — "Gradient Ribbon Card"
 *
 * Left-edge gradient ribbon, floating index badge, vertical pill-stack
 * answer selector with radio indicators, weight bar, and pentagonal
 * required ribbon.  Fully self-contained — no cross-variant imports.
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
// Inline SVG icons (16 px default)
// ---------------------------------------------------------------------------

function CheckCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertTriangleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function XCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function MinusCircleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Answer option config
// ---------------------------------------------------------------------------

const ANSWER_OPTIONS: {
  value: AnswerValue
  label: string
  Icon: React.FC<{ size?: number }>
}[] = [
  { value: 'yes', label: 'Sim', Icon: CheckCircleIcon },
  { value: 'partial', label: 'Parcial', Icon: AlertTriangleIcon },
  { value: 'no', label: 'Não', Icon: XCircleIcon },
  { value: 'na', label: 'N/A', Icon: MinusCircleIcon },
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

export function EvalQuestionCardA({
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
  const weightClamped = Math.max(0, Math.min(question.weight, 10))

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: hasAnswer
          ? `linear-gradient(135deg, white 0%, ${sectionColor}05 100%)`
          : 'white',
        boxShadow: hasAnswer
          ? `0 4px 20px ${sectionColor}12`
          : 'none',
      }}
    >
      {/* Left gradient ribbon */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[4px]"
        style={{
          background: `linear-gradient(180deg, ${sectionColor}CC 0%, ${sectionColor} 100%)`,
        }}
      />

      {/* Floating index badge */}
      <div
        className="absolute -top-1 -left-1 z-10 w-7 h-7 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${sectionColor} 0%, ${sectionColor}CC 100%)`,
          boxShadow: `0 2px 8px ${sectionColor}25`,
        }}
      >
        <span className="text-white text-[10px] font-bold tabular-nums leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Card body */}
      <div className="pl-5 pr-4 pt-4 pb-3">
        {/* Question text */}
        <p className="text-sm font-semibold text-gray-800 leading-relaxed pl-6 mb-2">
          {question.text}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-3 pl-6 mb-3">
          {/* Weight bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-gray-400">Peso {question.weight}</span>
            <div className="w-12 h-[3px] rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(weightClamped / 10) * 100}%`,
                  backgroundColor: sectionColor,
                }}
              />
            </div>
          </div>

          {/* Required ribbon */}
          {question.requiredYesForAdvance && (
            <span
              className="text-[8px] font-bold text-white px-2 py-0.5"
              style={{
                backgroundColor: '#F59E0B',
                clipPath: 'polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)',
              }}
            >
              Obrigatório
            </span>
          )}
        </div>

        {/* Vertical pill-stack answer selector */}
        <div className="flex flex-col gap-1.5 mb-3">
          {ANSWER_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]
            const Icon = opt.Icon

            return (
              <motion.button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex items-center rounded-full border px-4 py-2 h-10 cursor-pointer transition-colors duration-150',
                  isSelected
                    ? 'border-current'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300',
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${optColor}10`,
                        borderColor: optColor,
                        color: optColor,
                      }
                    : undefined
                }
              >
                {/* Icon */}
                <motion.div
                  animate={{ scale: isSelected ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Icon size={16} />
                </motion.div>

                {/* Label (centered) */}
                <span className="flex-1 text-center text-xs font-bold">
                  {opt.label}
                </span>

                {/* Radio circle */}
                <div
                  className="w-3 h-3 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    borderColor: isSelected ? optColor : '#D1D5DB',
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: optColor }}
                    />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Justification */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-lg p-3 mb-3"
                style={{
                  borderLeft: `2px dashed ${answerColor}`,
                  backgroundColor: `${answerColor}05`,
                }}
              >
                <Label>Justificativa (obrigatória)</Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[60px]"
                  style={{
                    '--tw-ring-color': answerColor,
                  } as React.CSSProperties}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <div className="bg-gray-50 p-2 rounded-lg">
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
