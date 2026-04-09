/**
 * Timeline Section Variants (I-K)
 *
 * I — Connected Cards (branch connectors + left border integration)
 * J — Alternating Zigzag (center timeline, cards left/right)
 * K — Compact Data-Dense (minimal nodes, tight spacing)
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EvalQuestionCardI } from './eval-question-card-i'
import { EvalQuestionCardJ } from './eval-question-card-j'
import { EvalQuestionCardK } from './eval-question-card-k'
import {
  evalSectionStagger,
  evalQuestionItem,
  timelineNodeEntrance,
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

type TimelineVariant = 'I' | 'J' | 'K'

interface EvalSectionTimelineProps {
  variant?: TimelineVariant
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

function sectionProgress(
  answers: Record<string, QuestionState>,
  questions: Question[],
): { answered: number; total: number; ratio: number } {
  const total = questions.length
  let answered = 0
  for (const q of questions) {
    if (answers[q.id]?.answer) answered++
  }
  return { answered, total, ratio: total > 0 ? answered / total : 0 }
}

function isComplete(answers: Record<string, QuestionState>, questions: Question[]): boolean {
  return questions.length > 0 && questions.every((q) => answers[q.id]?.answer)
}

function isPartial(answers: Record<string, QuestionState>, questions: Question[]): boolean {
  const { answered, total } = sectionProgress(answers, questions)
  return answered > 0 && answered < total
}

// ---------------------------------------------------------------------------
// Mini Donut Ring
// ---------------------------------------------------------------------------

function MiniDonutRing({ progress, color, size = 24 }: { progress: number; color: string; size?: number }) {
  const sw = 3
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E8E8" strokeWidth={sw} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - progress) }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Check Icon
// ---------------------------------------------------------------------------

function CheckIcon12({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

// ===========================================================================
// VARIANT I — Connected Cards
// ===========================================================================

function VariantI({
  sections,
  allQuestions,
  answers,
  sectionRefs,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  sections: SectionDef[]
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRefs: React.RefObject<HTMLDivElement | null>[]
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const totalQuestions = allQuestions.length
  const totalAnswered = allQuestions.filter((q) => answers[q.id]?.answer).length
  const overallProgress = totalQuestions > 0 ? totalAnswered / totalQuestions : 0
  const firstIncomplete = sections.findIndex((s) => !isComplete(answers, s.questions))
  const firstColor = sections[0]?.color ?? '#6B7280'
  const lastColor = sections[sections.length - 1]?.color ?? '#6B7280'

  return (
    <div className="relative">
      {/* Background line */}
      <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gray-200" />
      {/* Animated fill line */}
      <motion.div
        className="absolute left-[15px] top-0 bottom-0 w-[2px] origin-top"
        style={{ background: `linear-gradient(to bottom, ${firstColor}, ${lastColor})` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: overallProgress }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />

      {sections.map((section, idx) => {
        const { answered, total, ratio } = sectionProgress(answers, section.questions)
        const complete = isComplete(answers, section.questions)
        const partial = isPartial(answers, section.questions)
        const isPulsing = idx === firstIncomplete

        return (
          <div key={idx} ref={sectionRefs[idx]} className="relative scroll-mt-24 pb-6">
            {/* Node + branch + card container */}
            <div className="flex items-start">
              {/* Node */}
              <div className="relative flex-shrink-0">
                {isPulsing && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ borderColor: section.color, borderWidth: 2 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <motion.div
                  variants={timelineNodeEntrance}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: idx * 0.12 }}
                  className={cn(
                    'w-8 h-8 rounded-full border-[3px] z-10 relative flex items-center justify-center',
                    complete && 'text-white',
                    !complete && !partial && 'bg-gray-100 border-gray-200 text-gray-400',
                  )}
                  style={
                    complete
                      ? { backgroundColor: section.color, borderColor: section.color, boxShadow: `0 0 10px ${section.color}30` }
                      : partial
                        ? { backgroundColor: '#FFF', borderColor: section.color }
                        : undefined
                  }
                >
                  {complete ? <CheckIcon12 /> : partial ? <MiniDonutRing progress={ratio} color={section.color} size={20} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </motion.div>
              </div>

              {/* Branch connector */}
              <div className="self-center h-[2px] w-3 flex-shrink-0" style={{ backgroundColor: section.color }} />

              {/* Card container with left border */}
              <div
                className="flex-1 min-w-0 rounded-xl border border-gray-200 overflow-hidden"
                style={{ borderLeft: `3px solid ${section.color}` }}
              >
                {/* Section header inside card */}
                <div
                  className="px-4 py-2.5 flex items-center justify-between"
                  style={{ backgroundColor: `${section.colorLight}08` }}
                >
                  <span
                    className="text-xs font-bold rounded-full px-2.5 py-0.5"
                    style={{ backgroundColor: `${section.color}12`, color: section.colorDark }}
                  >
                    {section.title}
                  </span>
                  <span className="text-[10px] text-gray-400 tabular-nums font-medium">
                    {answered}/{total}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ backgroundColor: `${section.color}10` }} />

                {/* Questions */}
                <div className="p-3 space-y-3">
                  <motion.div
                    variants={evalSectionStagger}
                    initial="initial"
                    animate="animate"
                    className="space-y-3"
                  >
                    {section.questions.map((question) => {
                      const globalIndex = allQuestions.indexOf(question)
                      return (
                        <motion.div key={question.id} variants={evalQuestionItem}>
                          <EvalQuestionCardI
                            question={question}
                            index={globalIndex}
                            state={answers[question.id]}
                            sectionColor={section.color}
                            onAnswer={(v) => onAnswer(question.id, v)}
                            onJustification={(t) => onJustification(question.id, t)}
                            onAddAttachments={(f) => onAddAttachments(question.id, f)}
                            onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                          />
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===========================================================================
// VARIANT J — Alternating Zigzag
// ===========================================================================

function VariantJ({
  sections,
  allQuestions,
  answers,
  sectionRefs,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  sections: SectionDef[]
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRefs: React.RefObject<HTMLDivElement | null>[]
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const totalQuestions = allQuestions.length
  const totalAnswered = allQuestions.filter((q) => answers[q.id]?.answer).length
  const overallProgress = totalQuestions > 0 ? totalAnswered / totalQuestions : 0
  const firstIncomplete = sections.findIndex((s) => !isComplete(answers, s.questions))
  const firstColor = sections[0]?.color ?? '#6B7280'
  const lastColor = sections[sections.length - 1]?.color ?? '#6B7280'

  return (
    <div className="relative">
      {/* Center timeline (desktop) / Left timeline (mobile) */}
      {/* Desktop: center */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200" />
      <motion.div
        className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] origin-top"
        style={{ background: `linear-gradient(to bottom, ${firstColor}, ${lastColor})` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: overallProgress }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />
      {/* Mobile: left */}
      <div className="md:hidden absolute left-[15px] top-0 bottom-0 w-[2px] bg-gray-200" />
      <motion.div
        className="md:hidden absolute left-[15px] top-0 bottom-0 w-[2px] origin-top"
        style={{ background: `linear-gradient(to bottom, ${firstColor}, ${lastColor})` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: overallProgress }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />

      {sections.map((section, idx) => {
        const { answered, total, ratio } = sectionProgress(answers, section.questions)
        const complete = isComplete(answers, section.questions)
        const partial = isPartial(answers, section.questions)
        const isPulsing = idx === firstIncomplete
        const isLeft = idx % 2 === 0 // Even: card left, node right. Odd: card right, node left

        return (
          <div key={idx} ref={sectionRefs[idx]} className="relative scroll-mt-24 pb-8">
            {/* ---- MOBILE layout (always left-aligned) ---- */}
            <div className="md:hidden flex items-start">
              <div className="relative flex-shrink-0">
                {isPulsing && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ borderColor: section.color, borderWidth: 2 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <motion.div
                  variants={timelineNodeEntrance}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: idx * 0.12 }}
                  className={cn(
                    'w-8 h-8 rounded-full border-[3px] z-10 relative flex items-center justify-center',
                    complete && 'text-white',
                    !complete && !partial && 'bg-gray-100 border-gray-200 text-gray-400',
                  )}
                  style={
                    complete
                      ? { backgroundColor: section.color, borderColor: section.color }
                      : partial
                        ? { backgroundColor: '#FFF', borderColor: section.color }
                        : undefined
                  }
                >
                  {complete ? <CheckIcon12 /> : partial ? <MiniDonutRing progress={ratio} color={section.color} size={20} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </motion.div>
              </div>
              <div className="h-[2px] w-3 self-center flex-shrink-0" style={{ backgroundColor: section.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold mb-2 block" style={{ color: section.colorDark }}>{section.title}</span>
                <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
                  {section.questions.map((question) => {
                    const globalIndex = allQuestions.indexOf(question)
                    return (
                      <motion.div key={question.id} variants={evalQuestionItem}>
                        <EvalQuestionCardJ
                          question={question}
                          index={globalIndex}
                          state={answers[question.id]}
                          sectionColor={section.color}
                          onAnswer={(v) => onAnswer(question.id, v)}
                          onJustification={(t) => onJustification(question.id, t)}
                          onAddAttachments={(f) => onAddAttachments(question.id, f)}
                          onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                        />
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </div>

            {/* ---- DESKTOP zigzag layout ---- */}
            <div className="hidden md:flex items-start">
              {/* Left side (card or spacer) */}
              <div className={cn('w-[calc(50%-24px)]', isLeft ? '' : 'invisible')}>
                {isLeft && (
                  <div
                    className="rounded-xl border border-gray-200 overflow-hidden"
                    style={{ borderTop: `3px solid ${section.color}` }}
                  >
                    <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: `${section.colorLight}06` }}>
                      <span className="text-xs font-bold" style={{ color: section.colorDark }}>{section.title}</span>
                      <span className="text-[10px] text-gray-400 tabular-nums">{answered}/{total}</span>
                    </div>
                    <div className="p-3 space-y-3">
                      <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
                        {section.questions.map((question) => {
                          const globalIndex = allQuestions.indexOf(question)
                          return (
                            <motion.div key={question.id} variants={evalQuestionItem}>
                              <EvalQuestionCardJ
                                question={question}
                                index={globalIndex}
                                state={answers[question.id]}
                                sectionColor={section.color}
                                onAnswer={(v) => onAnswer(question.id, v)}
                                onJustification={(t) => onJustification(question.id, t)}
                                onAddAttachments={(f) => onAddAttachments(question.id, f)}
                                onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                              />
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>

              {/* Center: branch + node + branch */}
              <div className="flex items-center flex-shrink-0 w-12 justify-center self-start mt-3">
                <div className="h-[2px] w-3" style={{ backgroundColor: isLeft ? section.color : 'transparent' }} />
                <div className="relative">
                  {isPulsing && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ borderColor: section.color, borderWidth: 2 }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <motion.div
                    variants={timelineNodeEntrance}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: idx * 0.12 }}
                    className={cn(
                      'w-9 h-9 rounded-full border-[3px] z-10 relative flex items-center justify-center',
                      complete && 'text-white',
                      !complete && !partial && 'bg-gray-100 border-gray-200 text-gray-400',
                    )}
                    style={
                      complete
                        ? { backgroundColor: section.color, borderColor: section.color, boxShadow: `0 0 10px ${section.color}30` }
                        : partial
                          ? { backgroundColor: '#FFF', borderColor: section.color }
                          : undefined
                    }
                  >
                    {complete ? <CheckIcon12 /> : partial ? <MiniDonutRing progress={ratio} color={section.color} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                  </motion.div>
                </div>
                <div className="h-[2px] w-3" style={{ backgroundColor: !isLeft ? section.color : 'transparent' }} />
              </div>

              {/* Right side (card or spacer) */}
              <div className={cn('w-[calc(50%-24px)]', !isLeft ? '' : 'invisible')}>
                {!isLeft && (
                  <div
                    className="rounded-xl border border-gray-200 overflow-hidden"
                    style={{ borderTop: `3px solid ${section.color}` }}
                  >
                    <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: `${section.colorLight}06` }}>
                      <span className="text-xs font-bold" style={{ color: section.colorDark }}>{section.title}</span>
                      <span className="text-[10px] text-gray-400 tabular-nums">{answered}/{total}</span>
                    </div>
                    <div className="p-3 space-y-3">
                      <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
                        {section.questions.map((question) => {
                          const globalIndex = allQuestions.indexOf(question)
                          return (
                            <motion.div key={question.id} variants={evalQuestionItem}>
                              <EvalQuestionCardJ
                                question={question}
                                index={globalIndex}
                                state={answers[question.id]}
                                sectionColor={section.color}
                                onAnswer={(v) => onAnswer(question.id, v)}
                                onJustification={(t) => onJustification(question.id, t)}
                                onAddAttachments={(f) => onAddAttachments(question.id, f)}
                                onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                              />
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===========================================================================
// VARIANT K — Compact Data-Dense
// ===========================================================================

function VariantK({
  sections,
  allQuestions,
  answers,
  sectionRefs,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  sections: SectionDef[]
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRefs: React.RefObject<HTMLDivElement | null>[]
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const firstIncomplete = sections.findIndex((s) => !isComplete(answers, s.questions))

  return (
    <div className="relative">
      {sections.map((section, idx) => {
        const { answered, total, ratio } = sectionProgress(answers, section.questions)
        const complete = isComplete(answers, section.questions)
        const partial = isPartial(answers, section.questions)
        const isPulsing = idx === firstIncomplete
        const percent = total > 0 ? (answered / total) * 100 : 0

        return (
          <div key={idx} ref={sectionRefs[idx]} className="relative scroll-mt-24">
            {/* Section header row: node + title + progress inline */}
            <div className="flex items-center gap-2.5 mb-2">
              {/* Compact node */}
              <div className="relative flex-shrink-0">
                {isPulsing && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ borderColor: section.color, borderWidth: 1.5 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <motion.div
                  variants={timelineNodeEntrance}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 z-10 relative flex items-center justify-center',
                    complete && 'text-white',
                    !complete && !partial && 'bg-gray-100 border-gray-200',
                  )}
                  style={
                    complete
                      ? { backgroundColor: section.color, borderColor: section.color }
                      : partial
                        ? { backgroundColor: '#FFF', borderColor: section.color }
                        : undefined
                  }
                >
                  {complete ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : partial ? (
                    <MiniDonutRing progress={ratio} color={section.color} size={16} />
                  ) : (
                    <span className="text-[8px] font-bold text-gray-400">{idx + 1}</span>
                  )}
                </motion.div>
              </div>

              {/* Section title pill */}
              <span
                className="text-xs font-bold rounded-full px-3 py-1"
                style={{ backgroundColor: `${section.color}10`, color: section.colorDark }}
              >
                {section.title}
              </span>

              {/* Inline progress bar */}
              <div
                className="w-14 h-1 rounded-full overflow-hidden flex-shrink-0"
                style={{ backgroundColor: `${section.colorLight}20` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: section.color }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {/* Counter */}
              <span className="text-[10px] text-gray-400 tabular-nums font-medium">
                {answered}/{total}
              </span>
            </div>

            {/* Questions — compact, left line continuous */}
            <div
              className="ml-[11px] pl-5 pb-5"
              style={{ borderLeft: `1.5px solid ${section.color}20` }}
            >
              <motion.div
                variants={evalSectionStagger}
                initial="initial"
                animate="animate"
                className="space-y-2"
              >
                {section.questions.map((question) => {
                  const globalIndex = allQuestions.indexOf(question)
                  return (
                    <motion.div key={question.id} variants={evalQuestionItem}>
                      <EvalQuestionCardK
                        question={question}
                        index={globalIndex}
                        state={answers[question.id]}
                        sectionColor={section.color}
                        onAnswer={(v) => onAnswer(question.id, v)}
                        onJustification={(t) => onJustification(question.id, t)}
                        onAddAttachments={(f) => onAddAttachments(question.id, f)}
                        onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===========================================================================
// Exported component
// ===========================================================================

export function EvalSectionTimeline({
  variant = 'I',
  sections,
  allQuestions,
  answers,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionRefs,
}: EvalSectionTimelineProps) {
  const sharedProps = {
    sections,
    allQuestions,
    answers,
    sectionRefs,
    onAnswer,
    onJustification,
    onAddAttachments,
    onRemoveAttachment,
  }

  switch (variant) {
    case 'I':
      return <VariantI {...sharedProps} />
    case 'J':
      return <VariantJ {...sharedProps} />
    case 'K':
      return <VariantK {...sharedProps} />
    default:
      return <VariantI {...sharedProps} />
  }
}
