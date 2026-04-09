/**
 * Variant E -- "Organic Leaf Card"
 *
 * Asymmetric rounding (sharp left, rounded right), toggle-switch answer
 * selector with radio-like exclusivity, seed-shaped index badge with twig
 * connector, leaf-shaped weight badge, and organic growth animations.
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
// Inline SVG icons (12 px default)
// ---------------------------------------------------------------------------

function CheckCircleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertTriangleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function XCircleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function MinusCircleIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Decorative leaf ornament (top-right corner)
// ---------------------------------------------------------------------------

function LeafOrnament({ color }: { color: string }) {
  return (
    <svg
      width={8}
      height={8}
      viewBox="0 0 8 8"
      className="absolute top-2 right-2"
      style={{ opacity: 0.15 }}
    >
      <path
        d="M0 8C0 8 0 0 4 0C8 0 8 4 8 4C8 4 8 8 4 8C0 8 0 8 0 8Z"
        fill={color}
      />
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
// Toggle Switch sub-component
// ---------------------------------------------------------------------------

interface ToggleSwitchRowProps {
  label: string
  icon: React.ReactNode
  isActive: boolean
  activeColor: string
  onClick: () => void
}

function AnswerToggleRow({ label, icon, isActive, activeColor, onClick }: ToggleSwitchRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full py-1.5 cursor-pointer transition-all duration-200',
        isActive ? 'pl-2' : 'pl-0',
      )}
      style={{
        borderLeft: isActive ? `2px solid ${activeColor}` : '2px solid transparent',
      }}
    >
      {/* Left: icon + label */}
      <div className="flex items-center gap-2">
        <span
          className="flex-shrink-0 transition-colors duration-200"
          style={{ color: isActive ? activeColor : '#9CA3AF' }}
        >
          {icon}
        </span>
        <span
          className={cn(
            'text-xs font-medium transition-colors duration-200',
            isActive ? 'text-gray-800' : 'text-gray-600',
          )}
        >
          {label}
        </span>
      </div>

      {/* Right: toggle track + thumb */}
      <div
        className="relative flex-shrink-0 rounded-full transition-colors duration-200"
        style={{
          width: 36,
          height: 20,
          backgroundColor: isActive ? activeColor : '#E5E7EB',
        }}
      >
        <motion.div
          className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: isActive ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalQuestionCardE({
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
      initial={{ opacity: 0, x: -12, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative"
      style={{
        borderRadius: '4px 16px 16px 4px',
        border: '1px solid #E5E7EB',
        borderLeft: 'none',
        background: hasAnswer
          ? `linear-gradient(160deg, white 0%, ${sectionColor}04 40%, white 100%)`
          : 'white',
        boxShadow: hasAnswer
          ? '0 1px 3px rgba(0,0,0,0.06)'
          : '0 1px 2px rgba(0,0,0,0.04)',
        transition: 'box-shadow 200ms ease, background 300ms ease',
      }}
      whileHover={{
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* Decorative leaf ornament */}
      <LeafOrnament color={sectionColor} />

      {/* Seed index badge with twig connector */}
      <div className="absolute top-3 left-0 flex items-center">
        {/* Twig bar */}
        <div
          className="h-[2px] w-[6px]"
          style={{ backgroundColor: `${sectionColor}30` }}
        />
        {/* Seed shape */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 26,
            height: 22,
            borderRadius: '50%',
            backgroundColor: `${sectionColor}1F`,
          }}
        >
          <span
            className="text-[10px] font-bold tabular-nums leading-none"
            style={{ color: sectionColor }}
          >
            {index + 1}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="pl-10 pr-4 pt-3 pb-3">
        {/* Question text */}
        <p className="text-sm font-medium text-gray-700 leading-relaxed mb-2">
          {question.text}
        </p>

        {/* Metadata row */}
        <div className="flex items-center gap-2 mb-3">
          {/* Leaf-shaped weight badge */}
          <span
            className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-medium"
            style={{
              borderRadius: '50% 0 50% 0',
              backgroundColor: `${sectionColor}10`,
              color: sectionColor,
            }}
          >
            Peso {question.weight}
          </span>

          {/* Required pill */}
          {question.requiredYesForAdvance && (
            <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-medium px-2 py-0.5">
              Obrigatorio
            </span>
          )}
        </div>

        {/* Toggle Switch Answer Selector */}
        <div className="flex flex-col gap-2 mb-3">
          {ANSWER_OPTIONS.map((opt) => {
            const isSelected = state?.answer === opt.value
            const optColor = ANSWER_COLORS[opt.value]
            const Icon = opt.Icon

            return (
              <AnswerToggleRow
                key={opt.value}
                label={opt.label}
                icon={<Icon size={12} />}
                isActive={isSelected}
                activeColor={optColor}
                onClick={() => onAnswer(opt.value)}
              />
            )
          })}
        </div>

        {/* Justification */}
        <AnimatePresence>
          {needsJustification && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div
                className="p-3 mb-3"
                style={{
                  borderLeft: `2px solid ${answerColor}`,
                  borderRadius: '0 8px 8px 0',
                  backgroundColor: `${answerColor}03`,
                }}
              >
                <Label>Justificativa (obrigatoria)</Label>
                <Textarea
                  placeholder="Informe o motivo..."
                  value={state?.justification || ''}
                  onChange={(e) => onJustification(e.target.value)}
                  error={needsJustification && !state?.justification}
                  className="min-h-[60px] rounded-lg"
                  style={{
                    '--tw-ring-color': answerColor,
                  } as React.CSSProperties}
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
