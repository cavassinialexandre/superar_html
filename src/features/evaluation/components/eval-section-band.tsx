/**
 * Section Band — Floating Band + Depth layout for question groups.
 *
 * Each section renders a gradient header band with a collapsible
 * list of EvalQuestionCardH1 cards beneath it.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WideDiamondPattern } from './eval-watermarks'
import { EvalQuestionCardH1 } from './eval-question-card-h1'
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

export interface SectionDef {
  title: string
  color: string
  colorDark: string
  colorLight: string
  icon: string
  questions: Question[]
}

interface EvalSectionBandProps {
  sections: SectionDef[]
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onComment?: (questionId: string, text: string) => void
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
): { answered: number; total: number; percent: number } {
  const total = questions.length
  let answered = 0
  for (const q of questions) {
    if (answers[q.id]?.answer) answered++
  }
  return { answered, total, percent: total > 0 ? (answered / total) * 100 : 0 }
}

// ---------------------------------------------------------------------------
// Section Icons (19px inline SVGs)
// ---------------------------------------------------------------------------

function getSectionIcon(_icon: string, color = 'white'): React.ReactNode {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 48 48"
      fill={color}
      stroke={color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M34.994,43.999c-.52,0-1.028-.203-1.411-.586l-5.408-5.417h-9.104c-.553,0-1-.448-1-1s.447-1,1-1h9.52c.266,0,.521,.105,.708,.293l5.7,5.71,.002-5.003c0-.552,.447-1,1-1h4c1.654,0,3-1.346,3-3V14.996c0-1.068-.574-2.062-1.498-2.593-.479-.275-.645-.887-.369-1.366,.276-.479,.885-.643,1.365-.369,1.543,.887,2.502,2.545,2.502,4.327v18c0,2.757-2.243,5-5,5h-3v4c0,.812-.485,1.538-1.237,1.849-.249,.104-.511,.154-.769,.154Z" />
      <path d="M13.002,37.999c-.258,0-.519-.05-.768-.153-.75-.311-1.234-1.036-1.234-1.848v-3.998h-3c-2.757,0-5-2.243-5-5V9c0-2.757,2.243-5,5-5h26c2.757,0,5,2.243,5,5V27c0,2.757-2.243,5-5,5h-14.174l-5.412,5.412c-.384,.383-.893,.587-1.412,.587ZM8,6c-1.654,0-3,1.346-3,3V27c0,1.654,1.346,3,3,3h4c.553,0,1,.448,1,1v4.998l5.705-5.705c.188-.188,.441-.293,.707-.293h14.588c1.654,0,3-1.346,3-3V9c0-1.654-1.346-3-3-3H8Z" />
      <path d="M21,22c-.553,0-1-.448-1-1v-.77c0-1.453,.825-2.775,2.208-3.536,.985-.545,1.479-1.669,1.227-2.795-.204-.891-.942-1.63-1.837-1.834-.709-.163-1.421-.031-2.003,.369-.578,.397-.966,1.02-1.064,1.708-.079,.546-.573,.929-1.133,.848-.546-.079-.926-.585-.848-1.132,.179-1.24,.875-2.36,1.912-3.072,1.048-.719,2.322-.955,3.58-.671,1.653,.378,2.966,1.69,3.343,3.343,.45,2.004-.438,4.006-2.21,4.987-.736,.405-1.175,1.072-1.175,1.785v.77c0,.552-.447,1-1,1Z" />
      <circle cx="21" cy="25" r="1.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Progress Ring (36px SVG)
// ---------------------------------------------------------------------------

function BandProgressRing({
  answered,
  total,
  size = 36,
}: {
  answered: number
  total: number
  size?: number
}) {
  const sw = 3
  const center = size / 2
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const progress = total > 0 ? answered / total : 0
  const offset = circ * (1 - progress)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="white"
        strokeWidth={sw}
        opacity={0.2}
      />
      <motion.circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="white"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        opacity={0.85}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={size * 0.28}
        fontWeight="bold"
      >
        {answered}
      </text>
    </svg>
  )
}

// ===========================================================================
// Section renderer — Floating Band + Depth
// ===========================================================================

function SectionBand({
  section,
  allQuestions,
  answers,
  sectionRef,
  onAnswer,
  onJustification,
  onComment,
  onAddAttachments,
  onRemoveAttachment,
}: {
  section: SectionDef
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRef: React.RefObject<HTMLDivElement | null>
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onComment?: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const { answered, total, percent } = sectionProgress(answers, section.questions)
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="scroll-mt-24"
    >
      {/* Floating Band Header */}
      <div
        className="relative overflow-hidden flex items-center px-5 gap-4 h-[56px] rounded-xl mx-1"
        style={{
          background: `linear-gradient(135deg, ${section.colorDark} 0%, ${section.color} 60%, ${section.colorLight} 100%)`,
          boxShadow: `0 8px 24px ${section.color}25, 0 2px 8px rgba(0,0,0,0.06)`,
        }}
      >
        <WideDiamondPattern fill="white" />
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          {getSectionIcon(section.icon)}
        </div>
        <div className="flex flex-col min-w-0 relative z-10">
          <span className="text-sm font-bold text-white truncate">{section.title}</span>
          <span className="text-[10px] text-white/50">{total} perguntas</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="max-w-[80px] w-[80px] h-1.5 rounded-full bg-white/20 overflow-hidden hidden sm:block">
            <motion.div
              className="h-full rounded-full bg-white/80"
              initial={{ width: '0%' }}
              animate={{ width: percent + '%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <BandProgressRing answered={answered} total={total} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center flex-shrink-0 cursor-pointer text-white/70 hover:text-white transition-colors"
            aria-label={expanded ? 'Recolher grupo' : 'Expandir grupo'}
          >
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: expanded ? 0 : -180 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Question cards — collapsible */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="h-3" />
            <motion.div
              variants={evalSectionStagger}
              initial="initial"
              animate="animate"
              className="space-y-3 mx-1"
            >
              {section.questions.map((question) => {
                const globalIndex = allQuestions.indexOf(question)
                return (
                  <motion.div key={question.id} variants={evalQuestionItem}>
                    <EvalQuestionCardH1
                      question={question}
                      index={globalIndex}
                      state={answers[question.id]}
                      sectionColor={section.color}
                      sectionColorDark={section.colorDark}
                      sectionColorLight={section.colorLight}
                      onAnswer={(v) => onAnswer(question.id, v)}
                      onJustification={(t) => onJustification(question.id, t)}
                      onComment={(t) => onComment?.(question.id, t)}
                      onAddAttachments={(f) => onAddAttachments(question.id, f)}
                      onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
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
}

// ===========================================================================
// Exported component
// ===========================================================================

export function EvalSectionBand({
  sections,
  allQuestions,
  answers,
  onAnswer,
  onJustification,
  onComment,
  onAddAttachments,
  onRemoveAttachment,
  sectionRefs,
}: EvalSectionBandProps) {
  return (
    <motion.div
      variants={evalStaggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {sections.map((section, idx) => (
        <SectionBand
          key={section.title}
          section={section}
          allQuestions={allQuestions}
          answers={answers}
          sectionRef={sectionRefs[idx]}
          onAnswer={onAnswer}
          onJustification={onJustification}
          onComment={onComment}
          onAddAttachments={onAddAttachments}
          onRemoveAttachment={onRemoveAttachment}
        />
      ))}
    </motion.div>
  )
}
