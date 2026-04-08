/**
 * Variant E: "Stepper Wizard + Accordion"
 *
 * Full layout combining a horizontal stepper bar at the top with
 * enhanced glassmorphism accordion sections below. Clicking a step
 * scrolls to the corresponding section and expands it.
 */

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EvalStepperBar } from './eval-stepper-bar'
import { EvalQuestionCard } from './eval-question-card'
import {
  evalStaggerContainer,
  staggerItem,
  evalSectionStagger,
  evalQuestionItem,
} from '@/design-system/animations'
import type { AnswerValue, Question } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuestionState {
  answer: AnswerValue | null
  justification: string
  attachments: File[]
}

interface SectionDef {
  title: string
  color: string
  colorDark: string
  colorLight: string
  icon: string
  questions: Question[]
}

interface EvalSectionStepperProps {
  sections: SectionDef[]
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  expandedSections: Set<number>
  onToggleSection: (index: number) => void
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
  sectionRefs: React.RefObject<HTMLDivElement | null>[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSectionStatus(
  answers: Record<string, { answer: AnswerValue | null }>,
  questions: Question[],
): 'complete' | 'partial' | 'empty' {
  let answered = 0
  for (const q of questions) {
    if (answers[q.id]?.answer) answered++
  }
  if (answered === 0) return 'empty'
  if (answered === questions.length) return 'complete'
  return 'partial'
}

function getAnsweredCount(
  answers: Record<string, { answer: AnswerValue | null }>,
  questions: Question[],
): number {
  let count = 0
  for (const q of questions) {
    if (answers[q.id]?.answer) count++
  }
  return count
}

// ---------------------------------------------------------------------------
// Inline icons for the accordion header
// ---------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Step circle (small 32px version for accordion headers)
// ---------------------------------------------------------------------------

function HeaderStepCircle({
  index,
  status,
  color,
}: {
  index: number
  status: 'complete' | 'partial' | 'empty'
  color: string
}) {
  if (status === 'complete') {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white"
        style={{
          background: '#22c55e',
          boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
        }}
      >
        <CheckIcon />
      </div>
    )
  }

  if (status === 'partial') {
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white"
        style={{
          borderWidth: '2.5px',
          borderStyle: 'solid',
          borderColor: color,
          color: color,
        }}
      >
        <span className="text-xs font-semibold tabular-nums">{index + 1}</span>
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border-2 border-gray-200 text-gray-400">
      <span className="text-xs font-semibold tabular-nums">{index + 1}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalSectionStepper({
  sections,
  allQuestions,
  answers,
  expandedSections,
  onToggleSection,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionRefs,
}: EvalSectionStepperProps) {
  // ---- Build section info for the stepper bar ----
  const sectionInfoList = sections.map((section) => {
    const answeredCount = getAnsweredCount(answers, section.questions)
    return {
      title: section.title,
      color: section.color,
      colorDark: section.colorDark,
      answeredCount,
      totalCount: section.questions.length,
      status: getSectionStatus(answers, section.questions),
    }
  })

  // ---- Step click: scroll to section + expand it (collapse others) ----
  const handleStepClick = useCallback(
    (index: number) => {
      // Expand the clicked section and collapse all others
      for (let i = 0; i < sections.length; i++) {
        if (i === index && !expandedSections.has(i)) {
          onToggleSection(i)
        } else if (i !== index && expandedSections.has(i)) {
          onToggleSection(i)
        }
      }

      // Scroll to the section ref
      const ref = sectionRefs[index]
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [sections.length, expandedSections, onToggleSection, sectionRefs],
  )

  return (
    <motion.div
      variants={evalStaggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {/* ---- Stepper bar at top ---- */}
      <motion.div variants={staggerItem}>
        <EvalStepperBar
          sections={sectionInfoList}
          onStepClick={handleStepClick}
        />
      </motion.div>

      {/* ---- Enhanced accordion sections ---- */}
      {sections.map((section, sectionIndex) => {
        const status = getSectionStatus(answers, section.questions)
        const answeredCount = getAnsweredCount(answers, section.questions)
        const progressPercent =
          section.questions.length > 0
            ? (answeredCount / section.questions.length) * 100
            : 0
        const isExpanded = expandedSections.has(sectionIndex)

        return (
          <motion.div
            key={sectionIndex}
            variants={staggerItem}
            ref={sectionRefs[sectionIndex]}
            className="scroll-mt-24"
          >
            {/* ---- Section Header (glassmorphism) ---- */}
            <motion.button
              type="button"
              onClick={() => onToggleSection(sectionIndex)}
              className={cn(
                'w-full relative overflow-hidden rounded-xl px-5 py-4 cursor-pointer',
                'border transition-all duration-200 flex items-center justify-between',
                isExpanded
                  ? 'border-gray-200 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm',
              )}
              style={{
                background: 'rgba(255,255,255,0.80)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              {/* Thick left accent border (8px) */}
              <div
                className="absolute left-0 top-0 bottom-0 w-2 rounded-l-xl"
                style={{ background: section.color }}
              />

              {/* Left content */}
              <div className="flex items-center gap-3 pl-2">
                <HeaderStepCircle
                  index={sectionIndex}
                  status={status}
                  color={section.color}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 text-left">
                    {section.title}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {section.questions.length}{' '}
                    {section.questions.length === 1 ? 'pergunta' : 'perguntas'}
                  </span>
                </div>
              </div>

              {/* Right content */}
              <div className="flex items-center gap-3">
                {/* Mini progress bar (60px) */}
                <div className="w-[60px] h-1.5 rounded-full bg-gray-200 overflow-hidden hidden sm:block">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: section.color }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>

                {/* Counter */}
                <span className="text-xs text-gray-400 font-medium tabular-nums">
                  {answeredCount}/{section.questions.length}
                </span>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="text-gray-400" />
                </motion.div>
              </div>
            </motion.button>

            {/* ---- Section Content (animated expand/collapse) ---- */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    variants={evalSectionStagger}
                    initial="initial"
                    animate="animate"
                    className="space-y-3 pt-4 pb-2 px-1"
                  >
                    {section.questions.map((question) => {
                      const globalIndex = allQuestions.indexOf(question)
                      return (
                        <motion.div
                          key={question.id}
                          variants={evalQuestionItem}
                        >
                          <EvalQuestionCard
                            question={question}
                            index={globalIndex}
                            state={answers[question.id]}
                            onAnswer={(v) => onAnswer(question.id, v)}
                            onJustification={(t) =>
                              onJustification(question.id, t)
                            }
                            onAddAttachments={(f) =>
                              onAddAttachments(question.id, f)
                            }
                            onRemoveAttachment={(i) =>
                              onRemoveAttachment(question.id, i)
                            }
                          />
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
