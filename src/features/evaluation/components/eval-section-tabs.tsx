/**
 * Variant C: "Pill Tabs" -- horizontal colored pills to switch between
 * sections. Only 1 section visible at a time with crossfade animation.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EvalQuestionCard } from './eval-question-card'
import { evalSectionStagger, evalQuestionItem } from '@/design-system/animations'
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

interface EvalSectionTabsProps {
  sections: SectionDef[]
  allQuestions: Question[]
  answers: Record<string, QuestionState>
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

const statusDotColor = {
  complete: 'bg-green-500',
  partial: 'bg-yellow-400',
  empty: 'bg-gray-300',
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalSectionTabs({
  sections,
  allQuestions,
  answers,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionRefs,
}: EvalSectionTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const activeSection = sections[activeIndex]
  if (!activeSection) return null

  const answeredCount = activeSection.questions.filter(
    (q) => answers[q.id]?.answer,
  ).length

  function handlePillClick(newIdx: number) {
    if (newIdx === activeIndex) return
    setDirection(newIdx > activeIndex ? 1 : -1)
    setActiveIndex(newIdx)
  }

  return (
    <div>
      {/* ----------------------------------------------------------------- */}
      {/* Pill Bar                                                          */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="rounded-2xl p-1.5 border border-white/60"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {sections.map((section, idx) => {
            const isActive = idx === activeIndex
            const status = getSectionStatus(answers, section.questions)

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePillClick(idx)}
                className={cn(
                  'relative flex-shrink-0 rounded-xl px-4 py-2.5 text-xs font-medium',
                  'transition-colors duration-150 cursor-pointer',
                  'flex flex-col items-center',
                  isActive
                    ? 'text-white font-bold'
                    : 'text-gray-500 bg-transparent hover:bg-gray-50/80',
                )}
              >
                {/* Animated background pill */}
                {isActive && (
                  <motion.div
                    layoutId="evalTabBg"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: section.color,
                      boxShadow: `0 4px 12px ${section.color}40`,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                {/* Label */}
                <span className="relative z-10 truncate max-w-[120px]">
                  {section.icon} {section.title}
                </span>

                {/* Status dot */}
                <span
                  className={cn(
                    'relative z-10 w-1.5 h-1.5 rounded-full mx-auto mt-1',
                    statusDotColor[status],
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Content Area                                                      */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              ref={sectionRefs[activeIndex]}
              className="rounded-2xl border border-white/60 overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* Top accent gradient bar */}
              <div
                className="h-[3px]"
                style={{
                  background: `linear-gradient(90deg, ${activeSection.colorDark}, ${activeSection.color}, ${activeSection.colorLight})`,
                }}
              />

              {/* Section header */}
              <div className="flex items-center justify-between p-5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {activeSection.icon} {activeSection.title}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {activeSection.questions.length}{' '}
                    {activeSection.questions.length === 1
                      ? 'pergunta'
                      : 'perguntas'}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium tabular-nums">
                  {answeredCount}/{activeSection.questions.length}
                </span>
              </div>

              {/* Questions */}
              <motion.div
                variants={evalSectionStagger}
                initial="initial"
                animate="animate"
                className="space-y-3 px-5 pb-5"
              >
                {activeSection.questions.map((question) => {
                  const globalIndex = allQuestions.indexOf(question)
                  return (
                    <motion.div key={question.id} variants={evalQuestionItem}>
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
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
