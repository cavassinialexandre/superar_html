/**
 * Premium section accordion with glassmorphism header, colored accent border,
 * animated status indicators, and mini progress bar.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, CheckIcon } from '@/assets/icons'
import { evalSectionStagger } from '@/design-system/animations'
import { EvalQuestionCard } from './eval-question-card'
import type { AnswerValue, Question } from '@/types'

interface QuestionState {
  answer: AnswerValue | null
  justification: string
  attachments: File[]
}

export interface SectionDef {
  title: string
  color: string
  questions: Question[]
}

interface EvalSectionAccordionProps {
  section: SectionDef
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  isExpanded: boolean
  onToggle: () => void
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SectionStatus = 'complete' | 'partial' | 'empty'

function getSectionStatus(
  answers: Record<string, { answer: AnswerValue | null }>,
  questions: Question[],
): SectionStatus {
  let answered = 0
  for (const q of questions) {
    if (answers[q.id]?.answer) answered++
  }
  if (answered === 0) return 'empty'
  if (answered === questions.length) return 'complete'
  return 'partial'
}

// ---------------------------------------------------------------------------
// Status indicator
// ---------------------------------------------------------------------------

function StatusIndicator({ status }: { status: SectionStatus }) {
  if (status === 'complete') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0"
      >
        <CheckIcon size={13} className="text-green-600" />
      </motion.div>
    )
  }
  if (status === 'partial') {
    return (
      <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full bg-yellow-400"
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalSectionAccordion({
  section,
  allQuestions,
  answers,
  isExpanded,
  onToggle,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  scrollRef,
}: EvalSectionAccordionProps) {
  const { title, color, questions } = section
  const answeredCount = questions.filter((q) => answers[q.id]?.answer).length
  const status = getSectionStatus(answers, questions)
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  return (
    <div ref={scrollRef} className="scroll-mt-24">
      {/* ---- Section Header ---- */}
      <motion.button
        onClick={onToggle}
        className={cn(
          'w-full relative overflow-hidden rounded-xl px-5 py-4 cursor-pointer',
          'border transition-all duration-200 flex items-center justify-between',
          isExpanded
            ? 'bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm'
            : 'bg-gray-50/80 backdrop-blur-sm border-gray-100 hover:bg-gray-100/80 hover:border-gray-200',
        )}
      >
        {/* Left accent border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
          style={{ background: color }}
        />

        {/* Left content */}
        <div className="flex items-center gap-3">
          <StatusIndicator status={status} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 text-left">
              {title}
            </span>
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}
            </span>
          </div>
        </div>

        {/* Right content */}
        <div className="flex items-center gap-3">
          {/* Mini progress bar */}
          <div className="w-15 h-1.5 rounded-full bg-gray-200 overflow-hidden hidden sm:block">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium tabular-nums">
            {answeredCount}/{questions.length}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDownIcon
              size={16}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </motion.div>
        </div>
      </motion.button>

      {/* ---- Section Content ---- */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <motion.div
              variants={evalSectionStagger}
              initial="initial"
              animate="animate"
              className="space-y-3 pt-4 pb-2 px-1"
            >
              {questions.map((question) => {
                const globalIndex = allQuestions.indexOf(question)
                return (
                  <EvalQuestionCard
                    key={question.id}
                    question={question}
                    index={globalIndex}
                    state={answers[question.id]}
                    onAnswer={(v) => onAnswer(question.id, v)}
                    onJustification={(t) => onJustification(question.id, t)}
                    onAddAttachments={(f) => onAddAttachments(question.id, f)}
                    onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                  />
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
