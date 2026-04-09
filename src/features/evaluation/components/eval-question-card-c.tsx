/**
 * Variant C -- "Frosted Glass Card"
 *
 * Glassmorphism aesthetic: translucent card with backdrop blur, frosted
 * pill answer selector, circular frosted index badge, and ethereal glow
 * transitions.  Fully self-contained -- no cross-variant imports.
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
// Inline SVG icons (14 px)
// ---------------------------------------------------------------------------

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function AlertIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function CrossIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function DashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
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

export function EvalQuestionCardC({
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
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="relative rounded-2xl"
      style={{
        background: hasAnswer
          ? 'rgba(255,255,255,0.7)'
          : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: hasAnswer
          ? `0 4px 24px ${answerColor}12, 0 1px 3px rgba(0,0,0,0.03), inset 0 0 30px ${answerColor}05`
          : `0 4px 24px ${sectionColor}08, 0 1px 3px rgba(0,0,0,0.03)`,
        transition: 'background 300ms ease, box-shadow 300ms ease',
      }}
    >
      <div className="p-4">
        {/* Header: index badge + question text + metadata */}
        <div className="flex items-start gap-3 mb-3">
          {/* Circular frosted index badge */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.8)',
              color: sectionColor,
              boxShadow: hasAnswer
                ? `0 0 0 2px ${answerColor}40`
                : 'none',
              transition: 'box-shadow 300ms ease',
            }}
          >
            <span className="text-xs font-bold tabular-nums leading-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Question text */}
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: 'rgba(31,41,55,0.9)' }}
            >
              {question.text}
            </p>

            {/* Metadata chips */}
            <div className="flex items-center gap-2 mt-1.5">
              {/* Weight chip */}
              <span
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-gray-500"
                style={{
                  background: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              >
                <ScaleIcon /> Peso: {question.weight}
              </span>

              {/* Required chip */}
              {question.requiredYesForAdvance && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold text-amber-700"
                  style={{
                    background: 'rgba(245,158,11,0.1)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    borderRadius: '4px',
                  }}
                >
                  <LockIcon /> Obrigatório
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Answer selector: glass floating pills */}
        <div
          className="rounded-xl p-2 flex gap-2 mb-3"
          style={{
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          {ANSWER_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]
            const Icon = opt.Icon

            return (
              <motion.button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                whileHover={{ y: -2, background: 'rgba(255,255,255,0.7)' }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isSelected
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={
                  isSelected
                    ? { type: 'spring', stiffness: 400, damping: 15, duration: 0.25 }
                    : { duration: 0.15 }
                }
                className={cn(
                  'flex-1 flex flex-col items-center rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-200',
                )}
                style={{
                  background: isSelected
                    ? `${optColor}20`
                    : 'rgba(255,255,255,0.5)',
                  backdropFilter: isSelected ? 'blur(8px)' : 'blur(4px)',
                  WebkitBackdropFilter: isSelected ? 'blur(8px)' : 'blur(4px)',
                  border: isSelected
                    ? `1px solid ${optColor}40`
                    : '1px solid rgba(255,255,255,0.8)',
                  color: isSelected ? optColor : '#9CA3AF',
                  boxShadow: isSelected
                    ? `0 0 20px ${optColor}20, inset 0 0 12px ${optColor}08`
                    : 'none',
                }}
              >
                <Icon size={14} />
                <span className="text-[10px] font-bold mt-1 leading-none">
                  {opt.label}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Justification */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-3"
            >
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <Label>Justificativa (obrigatória)</Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[60px] bg-transparent"
                  style={{
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid rgba(209,213,219,0.5)',
                    borderRadius: 0,
                    ...(hasAnswer ? { '--tw-ring-color': answerColor } as React.CSSProperties : {}),
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments */}
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
