/**
 * Mini Hero Section Variants (A-E)
 *
 * A — Gradient Sidebar (improved)
 * B — Top Gradient Bar + Color Flow
 * C — Glassmorphism Card with Accent
 * D — Envelope / L-Shape Accent
 * E — Vertical Color Spine + Branches
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ColoredDiamondPattern, WideDiamondPattern } from './eval-watermarks'
import { EvalQuestionCardA } from './eval-question-card-a'
import { EvalQuestionCardB } from './eval-question-card-b'
import { EvalQuestionCardC } from './eval-question-card-c'
import { EvalQuestionCardD } from './eval-question-card-d'
import { EvalQuestionCardE } from './eval-question-card-e'
import {
  evalStaggerContainer,
  staggerItem,
  evalSectionStagger,
  evalQuestionItem,
} from '@/design-system/animations'
import type { AnswerValue, Question } from '@/types'

// ---------------------------------------------------------------------------
// Interfaces
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

type HeroVariant = 'A' | 'B' | 'C' | 'D' | 'E'

interface EvalSectionHeroProps {
  variant?: HeroVariant
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
// Shared: Mini progress ring (SVG)
// ---------------------------------------------------------------------------

function MiniProgressRing({
  answered,
  total,
  size = 40,
  strokeWidth = 3.5,
  strokeColor = 'white',
  trackOpacity = 0.15,
  textColor = 'white',
}: {
  answered: number
  total: number
  size?: number
  strokeWidth?: number
  strokeColor?: string
  trackOpacity?: number
  textColor?: string
}) {
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? answered / total : 0
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={trackOpacity}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text
          x={center}
          y={center + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={size * 0.3}
          fontWeight="700"
        >
          {answered}
        </text>
      </svg>
      <span
        className="text-[9px] font-medium leading-none"
        style={{ color: `${textColor}80` }}
      >
        de {total}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared: Section icons (inline SVGs, 16px)
// ---------------------------------------------------------------------------

function getSectionIcon(_icon: string, color = 'currentColor') {
  // Unified question-group icon (chat bubble with question mark)
  // fill + stroke combo + bigger size for better visibility on gradient backgrounds
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
// Shared: Question list renderer
// ---------------------------------------------------------------------------

// QuestionList removed — each variant now renders its own card component inline

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function countAnswered(
  answers: Record<string, QuestionState>,
  questions: Question[],
): number {
  return questions.filter((q) => answers[q.id]?.answer).length
}

// ===========================================================================
// VARIANT A — Gradient Sidebar (improved)
// ===========================================================================

function VariantA({
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
  const { title, color, colorDark, colorLight, icon, questions } = section
  const answered = countAnswered(answers, questions)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
    >
      {/* Mobile: top gradient bar */}
      <div
        className="h-1 sm:hidden"
        style={{ background: `linear-gradient(90deg, ${colorDark}, ${color}, ${colorLight})` }}
      />

      <div className="flex">
        {/* Left gradient sidebar (desktop) */}
        <div
          className="hidden sm:flex relative w-14 sm:w-16 flex-shrink-0 flex-col items-center justify-center"
          style={{ background: `linear-gradient(180deg, ${colorDark} 0%, ${color} 40%, ${colorLight} 100%)` }}
        >
          <ColoredDiamondPattern />
          <div className="relative z-10">
            <MiniProgressRing answered={answered} total={questions.length} />
          </div>
        </div>

        {/* Content area */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ background: `linear-gradient(to bottom right, #ffffff, ${colorLight}08)` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                {getSectionIcon(icon, color)}
              </div>
              <span className="text-sm font-bold" style={{ color: colorDark }}>
                {title}
              </span>
            </div>
            <span
              className="text-[10px] rounded-full px-2.5 py-0.5 font-medium"
              style={{ backgroundColor: `${colorLight}25`, color: colorDark }}
            >
              {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}
            </span>
          </div>

          {/* Questions */}
          <div className="px-4 pb-4">
            <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
              {questions.map((question) => {
                const globalIndex = allQuestions.indexOf(question)
                return (
                  <motion.div key={question.id} variants={evalQuestionItem}>
                    <EvalQuestionCardA
                      question={question}
                      index={globalIndex}
                      state={answers[question.id]}
                      sectionColor={color}
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
    </motion.div>
  )
}

// ===========================================================================
// VARIANT B — Top Gradient Bar + Color Flow
// ===========================================================================

function VariantB({
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
  const { title, color, colorDark, colorLight, icon, questions } = section
  const answered = countAnswered(answers, questions)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="scroll-mt-24 rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Top gradient bar */}
      <div
        className="relative overflow-hidden flex items-center px-4 gap-3 h-[44px]"
        style={{ background: `linear-gradient(135deg, ${colorDark} 0%, ${color} 60%, ${colorLight} 100%)` }}
      >
        <WideDiamondPattern fill="white" />
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          {getSectionIcon(icon, 'white')}
        </div>
        <span className="text-sm font-bold text-white relative z-10 truncate">{title}</span>
        <div className="flex-1" />
        <span className="text-[10px] text-white/60 relative z-10 flex-shrink-0">
          {answered}/{questions.length}
        </span>
        <div className="relative z-10 flex-shrink-0">
          <MiniProgressRing answered={answered} total={questions.length} size={32} strokeWidth={3} />
        </div>
      </div>

      {/* Body with continuous left border */}
      <div
        className="bg-white rounded-b-2xl border border-t-0 border-gray-200 p-4 pl-5"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
          {questions.map((question) => {
            const globalIndex = allQuestions.indexOf(question)
            return (
              <motion.div key={question.id} variants={evalQuestionItem}>
                <EvalQuestionCardB
                  question={question}
                  index={globalIndex}
                  state={answers[question.id]}
                  sectionColor={color}
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
// VARIANT C — Glassmorphism Card with Accent
// ===========================================================================

function VariantC({
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
  const { title, color, colorDark, colorLight, icon, questions } = section
  const answered = countAnswered(answers, questions)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="scroll-mt-24 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: `4px solid ${color}`,
        border: `1px solid rgba(255,255,255,0.6)`,
        borderLeftWidth: 4,
        borderLeftColor: color,
        boxShadow: `0 4px 24px ${color}08, 0 1px 3px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}12` }}
            >
              {getSectionIcon(icon, color)}
            </div>
            <div>
              <span className="text-sm font-bold" style={{ color: colorDark }}>
                {title}
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {answered} de {questions.length} respondidas
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <MiniProgressRing
              answered={answered}
              total={questions.length}
              size={36}
              strokeWidth={3}
              strokeColor={color}
              trackOpacity={0.12}
              textColor={colorDark}
            />
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="mx-4 my-3">
        <div
          className="h-px"
          style={{ background: `linear-gradient(90deg, ${color}30, ${colorLight}15, transparent)` }}
        />
      </div>

      {/* Body with subtle tint */}
      <div
        className="px-4 pb-4"
        style={{ background: `linear-gradient(to bottom, ${colorLight}05, transparent)` }}
      >
        <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
          {questions.map((question) => {
            const globalIndex = allQuestions.indexOf(question)
            return (
              <motion.div key={question.id} variants={evalQuestionItem}>
                <EvalQuestionCardC
                  question={question}
                  index={globalIndex}
                  state={answers[question.id]}
                  sectionColor={color}
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
// VARIANT D — Envelope / L-Shape Accent
// ===========================================================================

function VariantD({
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
  const { title, color, colorDark, colorLight, icon, questions } = section
  const answered = countAnswered(answers, questions)
  const percent = questions.length > 0 ? (answered / questions.length) * 100 : 0

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="scroll-mt-24 rounded-2xl overflow-hidden"
      style={{
        border: `1.5px solid ${color}20`,
        borderLeftWidth: 4,
        borderLeftColor: color,
      }}
    >
      {/* Top gradient accent bar */}
      <div
        className="h-[4px]"
        style={{ background: `linear-gradient(90deg, ${colorDark}, ${color}, ${colorLight})` }}
      />

      {/* Header */}
      <div className="bg-white p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}10` }}
            >
              {getSectionIcon(icon, color)}
            </div>
            <div>
              <span className="text-sm font-bold" style={{ color: colorDark }}>
                {title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-16 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: `${colorLight}20` }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <span
                  className="text-[10px] font-medium tabular-nums"
                  style={{ color: `${colorDark}99` }}
                >
                  {answered}/{questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Body — slightly inset */}
      <div className="bg-white p-4 pl-5">
        <motion.div variants={evalSectionStagger} initial="initial" animate="animate" className="space-y-3">
          {questions.map((question) => {
            const globalIndex = allQuestions.indexOf(question)
            return (
              <motion.div key={question.id} variants={evalQuestionItem}>
                <EvalQuestionCardD
                  question={question}
                  index={globalIndex}
                  state={answers[question.id]}
                  sectionColor={color}
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
// VARIANT E — Vertical Color Spine + Branches
// ===========================================================================

function VariantE({
  section,
  sectionIndex,
  allQuestions,
  answers,
  sectionRef,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
}: {
  section: SectionDef
  sectionIndex: number
  allQuestions: Question[]
  answers: Record<string, QuestionState>
  sectionRef: React.RefObject<HTMLDivElement | null>
  onAnswer: (questionId: string, value: AnswerValue) => void
  onJustification: (questionId: string, text: string) => void
  onAddAttachments: (questionId: string, files: File[]) => void
  onRemoveAttachment: (questionId: string, index: number) => void
}) {
  const { title, color, colorDark, colorLight, icon, questions } = section
  const answered = countAnswered(answers, questions)

  return (
    <motion.div
      ref={sectionRef}
      variants={staggerItem}
      className="scroll-mt-24 relative"
    >
      {/* Vertical color spine */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] rounded-full"
        style={{ background: `linear-gradient(180deg, ${colorDark}, ${color} 40%, ${colorLight})` }}
      />

      {/* Header — connected to spine */}
      <div className="ml-[18px]">
        <div
          className="rounded-r-xl rounded-l-none border border-l-0 border-gray-200 bg-white p-3 px-4 flex items-center gap-3"
          style={{ boxShadow: `0 2px 8px ${color}08` }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}12` }}
          >
            {getSectionIcon(icon, color)}
          </div>
          <span className="text-sm font-bold flex-1 truncate" style={{ color: colorDark }}>
            {title}
          </span>
          <span
            className="text-[10px] font-medium tabular-nums rounded-full px-2 py-0.5 flex-shrink-0"
            style={{ backgroundColor: `${colorLight}20`, color: colorDark }}
          >
            {answered}/{questions.length}
          </span>
        </div>
      </div>

      {/* Branch connector from spine to header */}
      <div
        className="absolute left-[6px] top-[20px] w-[12px] h-[2px]"
        style={{ backgroundColor: color }}
      />

      {/* Questions — each with branch connector */}
      <div className="ml-[18px] mt-3 space-y-3 pb-4">
        <motion.div
          variants={evalSectionStagger}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {questions.map((question, qIdx) => {
            const globalIndex = allQuestions.indexOf(question)
            return (
              <motion.div key={question.id} variants={evalQuestionItem} className="relative">
                {/* Branch connector */}
                <div
                  className="absolute -left-[12px] top-[20px] w-[12px] h-[2px]"
                  style={{ backgroundColor: `${color}60` }}
                />
                {/* Dot on spine */}
                <div
                  className="absolute -left-[15px] top-[17px] w-[6px] h-[6px] rounded-full border-2 bg-white"
                  style={{ borderColor: color }}
                />
                <EvalQuestionCardE
                  question={question}
                  index={globalIndex}
                  state={answers[question.id]}
                  sectionColor={color}
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
// Exported component — delegates to variant
// ===========================================================================

export function EvalSectionHero({
  variant = 'A',
  sections,
  allQuestions,
  answers,
  onAnswer,
  onJustification,
  onAddAttachments,
  onRemoveAttachment,
  sectionRefs,
}: EvalSectionHeroProps) {
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
          case 'A':
            return <VariantA key={key} section={section} sectionRef={ref} {...sharedProps} />
          case 'B':
            return <VariantB key={key} section={section} sectionRef={ref} {...sharedProps} />
          case 'C':
            return <VariantC key={key} section={section} sectionRef={ref} {...sharedProps} />
          case 'D':
            return <VariantD key={key} section={section} sectionRef={ref} {...sharedProps} />
          case 'E':
            return <VariantE key={key} section={section} sectionIndex={idx} sectionRef={ref} {...sharedProps} />
          default:
            return <VariantA key={key} section={section} sectionRef={ref} {...sharedProps} />
        }
      })}
    </motion.div>
  )
}
