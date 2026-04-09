/**
 * Variant D -- "Geometric Chevron Card"
 *
 * Architectural / envelope aesthetic: sharp 90-degree corners with a
 * diagonal chamfer at top-left, L-shaped sectionColor border, diamond
 * (45-degree rotated) answer chips with notch indicator, and angular
 * metadata badges.  Fully self-contained -- no cross-variant imports.
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
// Inline SVG icons (12 px)
// ---------------------------------------------------------------------------

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function AlertIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="14" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function CrossIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function DashIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

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
// Answer option config
// ---------------------------------------------------------------------------

const ANSWER_OPTIONS: {
  value: AnswerValue
  label: string
  Icon: React.FC<{ size?: number }>
}[] = [
  { value: 'yes', label: 'Sim', Icon: CheckIcon },
  { value: 'partial', label: 'Parcial', Icon: AlertIcon },
  { value: 'no', label: 'Nao', Icon: CrossIcon },
  { value: 'na', label: 'N/A', Icon: DashIcon },
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

export function EvalQuestionCardD({
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
  const lBorderColor = hasAnswer ? answerColor : sectionColor

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="relative bg-white"
      style={{
        clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)',
        borderLeft: `3px solid ${lBorderColor}`,
        borderTop: `3px solid ${lBorderColor}`,
        borderRight: '1.5px solid #E5E7EB',
        borderBottom: '1.5px solid #E5E7EB',
        transition: 'border-color 300ms ease',
      }}
    >
      {/* Triangle index badge at chamfered corner */}
      <div
        className="absolute top-0 left-0 z-10"
        style={{
          width: 24,
          height: 24,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          background: `linear-gradient(135deg, ${sectionColor} 0%, ${sectionColor}80 100%)`,
        }}
      >
        <span
          className="absolute text-white font-bold leading-none"
          style={{
            fontSize: '10px',
            top: 2,
            left: 3,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Card body */}
      <div className="pl-5 pr-4 pt-5 pb-3">
        {/* Question text */}
        <p className="text-sm font-semibold text-gray-800 leading-tight tracking-tight mb-2">
          {question.text}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-2 mb-4">
          {/* Weight badge -- angular left edge */}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium"
            style={{
              clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%)',
              paddingLeft: 10,
            }}
          >
            <ScaleIcon /> Peso: {question.weight}
          </span>

          {/* Required badge -- angular left edge */}
          {question.requiredYesForAdvance && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold"
              style={{
                clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%)',
                paddingLeft: 10,
              }}
            >
              <LockIcon /> Obrigatório
            </span>
          )}
        </div>

        {/* Diamond answer selector */}
        <div className="flex justify-center gap-3 py-4 mb-3">
          {ANSWER_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]
            const Icon = opt.Icon

            return (
              <div key={opt.value} className="relative flex flex-col items-center">
                {/* Diamond outer */}
                <motion.button
                  onClick={() => onAnswer(opt.value)}
                  whileHover={{ y: -1 }}
                  animate={
                    isSelected
                      ? { scale: [1, 1.15, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isSelected
                      ? { type: 'spring', stiffness: 400, damping: 15, duration: 0.2 }
                      : { duration: 0.15 }
                  }
                  className="cursor-pointer flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    transform: 'rotate(45deg)',
                    background: isSelected ? optColor : '#F9FAFB',
                    border: isSelected
                      ? `1.5px solid ${optColor}`
                      : '1.5px solid #E5E7EB',
                    color: isSelected ? '#FFFFFF' : '#9CA3AF',
                    boxShadow: isSelected
                      ? `0 4px 12px ${optColor}30`
                      : 'none',
                    transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
                  }}
                >
                  {/* Inner content counter-rotated */}
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{ transform: 'rotate(-45deg)' }}
                  >
                    <Icon size={12} />
                    <span
                      className="font-extrabold uppercase tracking-wider mt-0.5 leading-none"
                      style={{ fontSize: '8px' }}
                    >
                      {opt.label}
                    </span>
                  </div>
                </motion.button>

                {/* Notch triangle below selected diamond */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.15 }}
                    className="mt-1"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${optColor}`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Justification */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-3"
            >
              <div
                className="bg-gray-50 p-3"
                style={{
                  borderLeft: `2px solid ${answerColor}`,
                  borderRadius: 0,
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
                    borderRadius: 0,
                    '--tw-ring-color': answerColor,
                  } as React.CSSProperties}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
        <div
          style={{ borderRadius: 0 }}
          className={cn(
            'border border-dashed',
            hasAnswer ? 'border-gray-300' : 'border-gray-200',
          )}
        >
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
