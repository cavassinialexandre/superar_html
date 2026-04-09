/**
 * Variant H3 -- "Tab Pills"
 *
 * Same elevated float card as H for question text, number badge, metadata,
 * answer selector, and justification. Replaces the compact AttachmentZone
 * with two pill-shaped tabs ("Comentario" / "Anexo") that toggle content
 * panels. Clicking the active pill closes the panel (null state).
 * Fully self-contained -- no cross-variant imports.
 */

import { useState } from 'react'
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
  comment: string
  attachments: File[]
}

interface EvalQuestionCardProps {
  question: Question
  index: number
  state: QuestionState | undefined
  onAnswer: (value: AnswerValue) => void
  onJustification: (text: string) => void
  onComment: (text: string) => void
  onAddAttachments: (files: File[]) => void
  onRemoveAttachment: (index: number) => void
  sectionColor?: string
  sectionColorDark?: string
  sectionColorLight?: string
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
// Inline SVG icons (18 px default for FABs)
// ---------------------------------------------------------------------------

function CheckCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertTriangleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function XCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function MinusCircleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function CommentIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function PaperclipIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
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
  { value: 'no', label: 'Nao', Icon: XCircleIcon },
  { value: 'na', label: 'N/A', Icon: MinusCircleIcon },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAnswerColor(answer: AnswerValue | null | undefined): string {
  return answer ? ANSWER_COLORS[answer] : '#A3ADAC'
}

// ---------------------------------------------------------------------------
// Ring pulse animation on selection
// ---------------------------------------------------------------------------

function RingPulse({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0.4 }}
      animate={{ scale: 2, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        border: `2px solid ${color}`,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Tab type
// ---------------------------------------------------------------------------

type TabValue = 'comment' | 'attachment' | null

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardH3({
  question,
  index,
  state,
  onAnswer,
  onJustification,
  onComment,
  onAddAttachments,
  onRemoveAttachment,
  sectionColor = '#6366F1',
  sectionColorDark,
  sectionColorLight,
}: EvalQuestionCardProps) {
  const hasAnswer = !!state?.answer
  const answerColor = getAnswerColor(state?.answer)
  const needsJustification = state?.answer === 'no' || state?.answer === 'partial'

  // Track the answer that just triggered a ring pulse
  const [pulsingAnswer, setPulsingAnswer] = useState<AnswerValue | null>(null)

  // Tab pills state
  const [activeTab, setActiveTab] = useState<TabValue>(null)

  function handleAnswer(value: AnswerValue) {
    setPulsingAnswer(value)
    onAnswer(value)
  }

  function handleTabClick(tab: 'comment' | 'attachment') {
    setActiveTab((prev) => (prev === tab ? null : tab))
  }

  const hasComment = !!(state?.comment && state.comment.trim().length > 0)
  const attachmentCount = state?.attachments?.length || 0

  const shadowLayer3 = hasAnswer
    ? `0 12px 24px ${answerColor}10`
    : `0 12px 24px ${sectionColor}06`

  const hoverShadowLayer3 = hasAnswer
    ? `0 16px 32px ${answerColor}18`
    : `0 16px 32px ${sectionColor}10`

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative"
    >
      {/* Decorative shadow plate behind */}
      <div
        className="absolute -z-10 rounded-2xl"
        style={{
          top: 4,
          left: 6,
          right: 6,
          bottom: -4,
          backgroundColor: `${sectionColor}06`,
        }}
      />

      {/* Main card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="relative rounded-2xl bg-white p-4"
        style={{
          border: '1px solid #F3F4F6',
          boxShadow: `0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.03), ${shadowLayer3}`,
        }}
        onHoverStart={(e) => {
          const el = (e as unknown as { target: HTMLElement }).target?.closest?.('.rounded-2xl') as HTMLElement | null
          if (el) el.style.boxShadow = `0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.03), ${hoverShadowLayer3}`
        }}
        onHoverEnd={(e) => {
          const el = (e as unknown as { target: HTMLElement }).target?.closest?.('.rounded-2xl') as HTMLElement | null
          if (el) el.style.boxShadow = `0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.03), ${shadowLayer3}`
        }}
      >
        {/* Header row: number badge + question text + metadata top-right */}
        <div className="flex items-start gap-3 mb-4">
          {/* Number badge -- always shows number with section gradient */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${sectionColorDark || sectionColor} 0%, ${sectionColor} 60%, ${sectionColorLight || sectionColor} 100%)`,
              boxShadow: `0 2px 6px ${sectionColor}30`,
            }}
          >
            <span className="text-[10px] font-bold tabular-nums leading-none text-white">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Question text */}
          <p className="flex-1 text-sm font-medium text-gray-800 leading-relaxed min-w-0">
            {question.text}
          </p>

          {/* Peso + Obrigatorio -- top-right corner */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="inline-flex items-center bg-white rounded-lg px-2 py-1"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <span className="text-[10px] text-gray-500">
                Peso {question.weight}
              </span>
            </div>

            {question.requiredYesForAdvance && (
              <div
                className="inline-flex items-center bg-amber-50 rounded-lg px-1.5 py-1"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <span className="text-[9px] font-bold text-amber-700">
                  Requisito Minimo
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Answer selector -- elegant rounded rectangles */}
        <div className="flex justify-center py-2 mb-3">
        <div className="grid grid-cols-4 gap-2.5 w-full max-w-[400px]">
          {ANSWER_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]
            const Icon = opt.Icon
            const isPulsing = pulsingAnswer === opt.value && isSelected

            return (
              <motion.button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isSelected && isPulsing
                    ? { y: [0, -6, 0] }
                    : { y: 0 }
                }
                transition={
                  isSelected && isPulsing
                    ? { type: 'spring', stiffness: 400, damping: 15 }
                    : { type: 'spring', stiffness: 400, damping: 25 }
                }
                onAnimationComplete={() => {
                  if (isPulsing) setPulsingAnswer(null)
                }}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors duration-150',
                  isSelected
                    ? 'text-white'
                    : 'bg-white border border-gray-200 text-gray-400',
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: optColor,
                        borderColor: optColor,
                        boxShadow: `0 4px 14px ${optColor}30`,
                      }
                    : {
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      }
                }
              >
                <Icon size={15} />
                <span
                  className={cn(
                    'text-[11px] select-none',
                    isSelected ? 'font-semibold' : 'font-medium text-gray-500',
                  )}
                  style={isSelected ? { color: 'white' } : undefined}
                >
                  {opt.label}
                </span>
              </motion.button>
            )
          })}
        </div>
        </div>

        {/* Justification sub-card */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="overflow-hidden"
            >
              <div
                className="bg-white rounded-xl p-3 mb-3"
                style={{
                  border: '1px solid #F3F4F6',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <Label>Justificativa (obrigatoria)</Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[60px] bg-gray-50 rounded-lg"
                  style={{
                    '--tw-ring-color': answerColor,
                  } as React.CSSProperties}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------------------------------------------- */}
        {/* H3: Tab Pills for Comment / Attachment                            */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col items-center">
          {/* Pill tabs row */}
          <div className="flex items-center justify-center gap-2 relative">
            {/* Comment pill */}
            <button
              type="button"
              onClick={() => handleTabClick('comment')}
              className={cn(
                'relative rounded-full px-4 py-1.5 text-[11px] font-medium transition-colors duration-150 flex items-center gap-1.5',
                activeTab === 'comment'
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300',
              )}
              style={
                activeTab === 'comment'
                  ? { backgroundColor: sectionColor, borderColor: sectionColor }
                  : undefined
              }
            >
              {activeTab === 'comment' && (
                <motion.div
                  layoutId="h3-tab-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: sectionColor }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <CommentIcon size={11} />
                Comentario
                {hasComment && activeTab !== 'comment' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sectionColor }}
                  />
                )}
              </span>
            </button>

            {/* Attachment pill */}
            <button
              type="button"
              onClick={() => handleTabClick('attachment')}
              className={cn(
                'relative rounded-full px-4 py-1.5 text-[11px] font-medium transition-colors duration-150 flex items-center gap-1.5',
                activeTab === 'attachment'
                  ? 'text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300',
              )}
              style={
                activeTab === 'attachment'
                  ? { backgroundColor: sectionColor, borderColor: sectionColor }
                  : undefined
              }
            >
              {activeTab === 'attachment' && (
                <motion.div
                  layoutId="h3-tab-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: sectionColor }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <PaperclipIcon size={11} />
                Anexo
                {attachmentCount > 0 && activeTab !== 'attachment' && (
                  <span
                    className="inline-flex items-center justify-center min-w-[16px] h-4 rounded-full px-1 text-[9px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: sectionColor }}
                  >
                    {attachmentCount}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Tab content panel */}
          <AnimatePresence mode="wait">
            {activeTab === 'comment' && (
              <motion.div
                key="tab-comment"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="w-full overflow-hidden"
              >
                <div className="pt-3">
                  <Textarea
                    placeholder="Adicione um comentario..."
                    value={state?.comment || ''}
                    onChange={(e) => onComment(e.target.value)}
                    className="min-h-[60px] bg-gray-50 rounded-lg text-sm"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'attachment' && (
              <motion.div
                key="tab-attachment"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="w-full overflow-hidden"
              >
                <div className="pt-3">
                  <AttachmentZone
                    files={state?.attachments || []}
                    onAdd={onAddAttachments}
                    onRemove={onRemoveAttachment}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
