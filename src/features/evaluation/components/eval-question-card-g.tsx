/**
 * Variant G -- "Split Panel Card"
 *
 * Two-column layout with narrow left accent panel that expands on answer,
 * 2x2 grid of large icon tiles as answer selector, mini bar chart weight,
 * and left-bordered justification.  Fully self-contained -- no cross-variant imports.
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
// Inline SVG icons (20 px default for tiles)
// ---------------------------------------------------------------------------

function CheckCircleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertTriangleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function XCircleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function MinusCircleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function TinyCheckIcon() {
  return (
    <svg width={6} height={6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Answer icon lookup for the left panel
// ---------------------------------------------------------------------------

function AnswerPanelIcon({ answer, size = 18 }: { answer: AnswerValue; size?: number }) {
  switch (answer) {
    case 'yes':
      return <CheckCircleIcon size={size} />
    case 'partial':
      return <AlertTriangleIcon size={size} />
    case 'no':
      return <XCircleIcon size={size} />
    case 'na':
      return <MinusCircleIcon size={size} />
  }
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
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardG({
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

  // Track which answer just got selected for the rotation animation
  const [rotatingAnswer, setRotatingAnswer] = useState<AnswerValue | null>(null)

  function handleAnswer(value: AnswerValue) {
    setRotatingAnswer(value)
    onAnswer(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex rounded-xl overflow-hidden border border-gray-200"
      style={{
        boxShadow: hasAnswer
          ? '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Left accent panel */}
      <motion.div
        className="flex-shrink-0 flex flex-col items-center justify-center relative overflow-hidden"
        initial={false}
        animate={{
          width: hasAnswer ? 40 : 6,
          backgroundColor: hasAnswer ? answerColor : sectionColor,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {hasAnswer ? (
            /* Expanded: horizontal number + answer icon */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className="flex flex-col items-center justify-center gap-2 text-white"
            >
              <span className="text-xs font-bold tabular-nums leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <AnswerPanelIcon answer={state!.answer!} size={18} />
            </motion.div>
          ) : (
            /* Narrow: vertical rotated number */
            <motion.span
              key="narrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="text-[8px] font-bold text-white select-none"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right content panel */}
      <div className="flex-1 bg-white p-4 min-w-0">
        {/* Question text */}
        <p className="text-sm font-semibold text-gray-800 leading-snug mb-3">
          {question.text}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Weight: mini bar chart */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-gray-400 whitespace-nowrap">
              Peso {question.weight}
            </span>
            <div className="w-[60px] h-1 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(weightClamped / 10) * 100}%`,
                  backgroundColor: sectionColor,
                }}
              />
            </div>
          </div>

          {/* Required pill */}
          {question.requiredYesForAdvance && (
            <span className="bg-rose-50 text-rose-600 text-[9px] font-bold rounded-full px-2 py-0.5">
              Obrigatorio
            </span>
          )}
        </div>

        {/* 2x2 Answer Grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-3" style={{ maxWidth: 160 }}>
          {ANSWER_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]
            const Icon = opt.Icon
            const justSelected = rotatingAnswer === opt.value && isSelected

            return (
              <motion.button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                whileHover={{ scale: 1.03, backgroundColor: '#F9FAFB', borderColor: '#D1D5DB' }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'aspect-square rounded-lg flex flex-col items-center justify-center gap-1 relative cursor-pointer border transition-colors duration-150',
                  isSelected
                    ? 'border-current'
                    : 'bg-gray-50 border-gray-200 text-gray-400',
                )}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${optColor}10`,
                        borderColor: optColor,
                        color: optColor,
                        boxShadow: `inset 0 0 20px ${optColor}10`,
                      }
                    : undefined
                }
              >
                {/* Icon with rotation on selection */}
                <motion.div
                  animate={
                    justSelected
                      ? { rotate: [0, 360] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onAnimationComplete={() => {
                    if (justSelected) setRotatingAnswer(null)
                  }}
                >
                  <Icon size={20} />
                </motion.div>

                {/* Label */}
                <span className="text-[9px] font-bold select-none leading-none">
                  {opt.label}
                </span>

                {/* Checkmark badge at bottom-right */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute bottom-1 right-1 w-[14px] h-[14px] rounded-full bg-white flex items-center justify-center"
                      style={{
                        boxShadow: `0 1px 3px ${optColor}30`,
                        color: optColor,
                      }}
                    >
                      <TinyCheckIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        {/* Justification */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div
                className="bg-gray-50 rounded-lg p-3 mb-3"
                style={{ borderLeft: `2px solid ${answerColor}` }}
              >
                <Label>Justificativa (obrigatoria)</Label>
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

        {/* Attachments (compact, with thin divider) */}
        <div className="border-t border-gray-100 pt-2">
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
