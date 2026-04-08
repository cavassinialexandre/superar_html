/**
 * Color Band Section Variants (F-H)
 *
 * F — Seamless Merge (no gap between band and body)
 * G — Split Asymmetric Band (left gradient + right info panel)
 * H — Floating Band + Depth (detached band with shadow layers)
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { WideDiamondPattern } from './eval-watermarks'
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

type BandVariant = 'F' | 'G' | 'H'

interface EvalSectionBandProps {
  variant?: BandVariant
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
): { answered: number; total: number; percent: number } {
  const total = questions.length
  let answered = 0
  for (const q of questions) {
    if (answers[q.id]?.answer) answered++
  }
  return { answered, total, percent: total > 0 ? (answered / total) * 100 : 0 }
}

// ---------------------------------------------------------------------------
// Section Icons (16px inline SVGs)
// ---------------------------------------------------------------------------

function getSectionIcon(icon: string, color = 'white'): React.ReactNode {
  const props = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (icon) {
    case 'broom':
      return (
        <svg {...props}>
          <path d="M19.07 4.93a10 10 0 0 0-16 8.36L7 17.23V21h10v-3.77l3.93-3.94a10 10 0 0 0-1.86-8.36" />
          <path d="M7 21h10" />
          <path d="M12 7v6" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...props}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    case 'users':
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...props}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l2 2" />
        </svg>
      )
  }
}

// ---------------------------------------------------------------------------
// Progress Ring (36px SVG)
// ---------------------------------------------------------------------------

function BandProgressRing({
  answered,
  total,
  strokeColor = 'white',
  textColor = 'white',
  trackOpacity = 0.2,
  size = 36,
}: {
  answered: number
  total: number
  strokeColor?: string
  textColor?: string
  trackOpacity?: number
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
        stroke={strokeColor}
        strokeWidth={sw}
        opacity={trackOpacity}
      />
      <motion.circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={strokeColor}
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
        fill={textColor}
        fontSize={size * 0.28}
        fontWeight="bold"
      >
        {answered}
      </text>
    </svg>
  )
}

// ===========================================================================
// VARIANT F — Seamless Merge
// ===========================================================================

function VariantF({
  section,
  allQuestions,
  answers,
  sectionRef,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  section: SectionDef
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRef: React.RefObject<HTMLDivElement | null>
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const { answered, total, percent } = sectionProgress(answers, section.questions)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="rounded-2xl overflow-hidden shadow-sm scroll-mt-24 border border-gray-200"
    >
      {/* Band Header */}
      <div
        className="relative overflow-hidden flex items-center px-5 gap-4 h-[52px] sm:h-[60px]"
        style={{
          background: `linear-gradient(135deg, ${section.colorDark} 0%, ${section.color} 60%, ${section.colorLight} 100%)`,
        }}
      >
        <WideDiamondPattern fill="white" />
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {getSectionIcon(section.icon)}
        </div>
        <div className="flex flex-col min-w-0 relative z-10">
          <span className="text-sm sm:text-base font-bold text-white truncate">{section.title}</span>
          <span className="text-[10px] text-white/60">{total} perguntas</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="max-w-[100px] w-[100px] h-1.5 rounded-full bg-white/20 overflow-hidden hidden sm:block">
            <motion.div
              className="h-full rounded-full bg-white/80"
              initial={{ width: '0%' }}
              animate={{ width: percent + '%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <BandProgressRing answered={answered} total={total} />
        </div>
      </div>

      {/* Seamless body — no border-top, no gap */}
      <div className="bg-white px-5 py-3">
        <motion.div
          variants={evalSectionStagger}
          initial="initial"
          animate="animate"
        >
          {section.questions.map((question, qIdx) => {
            const globalIndex = allQuestions.indexOf(question)
            const isEven = qIdx % 2 === 0
            return (
              <motion.div key={question.id} variants={evalQuestionItem}>
                {/* Subtle divider between questions */}
                {qIdx > 0 && (
                  <div
                    className="h-px my-3 mx-2"
                    style={{ backgroundColor: `${section.colorLight}12` }}
                  />
                )}
                <div
                  className="rounded-xl p-0.5"
                  style={{
                    backgroundColor: isEven ? `${section.colorLight}05` : 'transparent',
                  }}
                >
                  <EvalQuestionCard
                    question={question}
                    index={globalIndex}
                    state={answers[question.id]}
                    sectionColor={section.color}
                    onAnswer={(v) => onAnswer(question.id, v)}
                    onJustification={(t) => onJustification(question.id, t)}
                    onAddAttachments={(f) => onAddAttachments(question.id, f)}
                    onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ===========================================================================
// VARIANT G — Split Asymmetric Band
// ===========================================================================

function VariantG({
  section,
  allQuestions,
  answers,
  sectionRef,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  section: SectionDef
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRef: React.RefObject<HTMLDivElement | null>
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const { answered, total, percent } = sectionProgress(answers, section.questions)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="rounded-2xl overflow-hidden shadow-sm scroll-mt-24"
    >
      {/* Split Header: gradient left + white right */}
      <div className="flex">
        {/* Left: gradient area */}
        <div
          className="relative overflow-hidden flex items-center px-5 gap-3 h-[60px] flex-1 min-w-0 rounded-tl-2xl"
          style={{
            background: `linear-gradient(135deg, ${section.colorDark} 0%, ${section.color} 60%, ${section.colorLight} 100%)`,
          }}
        >
          <WideDiamondPattern fill="white" />
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {getSectionIcon(section.icon)}
          </div>
          <span className="text-sm font-bold text-white relative z-10 truncate">{section.title}</span>
        </div>

        {/* Right: white info panel */}
        <div
          className="w-[120px] sm:w-[140px] flex-shrink-0 flex flex-col items-center justify-center gap-1 bg-white border-b border-gray-200 rounded-tr-2xl"
          style={{ borderLeft: `1px solid ${section.colorLight}30` }}
        >
          <BandProgressRing
            answered={answered}
            total={total}
            strokeColor={section.color}
            textColor={section.colorDark}
            trackOpacity={0.12}
            size={40}
          />
          <span
            className="text-[10px] font-medium tabular-nums"
            style={{ color: `${section.colorDark}90` }}
          >
            {answered}/{total}
          </span>
        </div>
      </div>

      {/* Body with left accent per card */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl p-4 space-y-3">
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
                <EvalQuestionCard
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
    </motion.div>
  )
}

// ===========================================================================
// VARIANT H — Floating Band + Depth
// ===========================================================================

function VariantH({
  section,
  allQuestions,
  answers,
  sectionRef,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  section: SectionDef
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRef: React.RefObject<HTMLDivElement | null>
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const { answered, total, percent } = sectionProgress(answers, section.questions)

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
        </div>
      </div>

      {/* Gap between floating elements */}
      <div className="h-2" />

      {/* Floating Body */}
      <div
        className="mx-1 rounded-xl border border-gray-200 bg-white p-4"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        <motion.div
          variants={evalSectionStagger}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {section.questions.map((question) => {
            const globalIndex = allQuestions.indexOf(question)
            return (
              <motion.div
                key={question.id}
                variants={evalQuestionItem}
                className="flex items-start gap-2"
              >
                {/* Color dot indicator */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-5"
                  style={{ backgroundColor: section.color }}
                />
                <div className="flex-1 min-w-0">
                  <EvalQuestionCard
                    question={question}
                    index={globalIndex}
                    state={answers[question.id]}
                    sectionColor={section.color}
                    onAnswer={(v) => onAnswer(question.id, v)}
                    onJustification={(t) => onJustification(question.id, t)}
                    onAddAttachments={(f) => onAddAttachments(question.id, f)}
                    onRemoveAttachment={(i) => onRemoveAttachment(question.id, i)}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ===========================================================================
// Exported component
// ===========================================================================

export function EvalSectionBand({
  variant = 'F',
  sections,
  allQuestions,
  answers,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionRefs,
}: EvalSectionBandProps) {
  const sharedProps = {
    allQuestions,
    answers,
    onAnswer,
    onJustification,
    onAddAttachments,
    onRemoveAttachment,
  }

  return (
    <motion.div
      variants={evalStaggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {sections.map((section, idx) => {
        const key = `${section.title}-${variant}`
        const ref = sectionRefs[idx]

        switch (variant) {
          case 'F':
            return <VariantF key={key} section={section} sectionRef={ref} {...sharedProps} />
          case 'G':
            return <VariantG key={key} section={section} sectionRef={ref} {...sharedProps} />
          case 'H':
            return <VariantH key={key} section={section} sectionRef={ref} {...sharedProps} />
          default:
            return <VariantF key={key} section={section} sectionRef={ref} {...sharedProps} />
        }
      })}
    </motion.div>
  )
}
