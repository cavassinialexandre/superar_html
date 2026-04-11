/**
 * Evaluation Page V2 — Premium orchestrator.
 * Delegates rendering to sub-components in ./components/.
 * Handles state, dynamic section grouping, and dialog logic.
 */

import { useState, useRef, useMemo, useCallback, createRef } from 'react'
import { motion } from 'framer-motion'
import { useEvaluationState } from '@/hooks/use-evaluation-state'
import { PageContainer } from '@/components/layout/app-shell'
import { AccessDeniedToast } from '@/components/ui/access-denied-toast'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { AdvanceDialog } from '@/components/ui/advance-dialog'
import { EvaluationResultModal } from '@/components/ui/evaluation-result-modal'
import { evalStaggerContainer, staggerItem } from '@/design-system/animations'
import type { AnswerValue, Question } from '@/types'

import {
  EvalHeroSection,
  EvalSidebarVariants,
  EvalMobileBar,
} from './components'
import { EvalSectionBand } from './components/eval-section-band'
import { EvalHeroVariants } from './components/eval-hero-variants'
import type { SectionDef } from './components'

// ---------------------------------------------------------------------------
// Section variant types
// ---------------------------------------------------------------------------


interface ExtendedSectionDef extends SectionDef {
  colorDark: string
  colorLight: string
  icon: string
}

// ---------------------------------------------------------------------------
// Section definitions (thematic grouping by question index)
// ---------------------------------------------------------------------------

const SECTION_DEFS = [
  { title: 'Organização e Limpeza', color: '#0D9488', colorDark: '#065652', colorLight: '#5EEAD4', icon: 'broom', range: [0, 8] as const },
  { title: 'Gestão Visual e Indicadores', color: '#6366F1', colorDark: '#3730A3', colorLight: '#A5B4FC', icon: 'chart', range: [8, 16] as const },
  { title: 'Participação e Melhoria', color: '#F59E0B', colorDark: '#B45309', colorLight: '#FCD34D', icon: 'users', range: [16, 23] as const },
  { title: 'Equipamentos e Anomalias', color: '#EF4444', colorDark: '#B91C1C', colorLight: '#FCA5A5', icon: 'wrench', range: [23, 30] as const },
]

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

/**
 * Compute section-level points breakdown matching the global `pointsBreakdown`
 * logic in use-evaluation-state.ts: NA reduces max, yes=weight, partial=weight*0.5.
 */
function computeSectionPoints(
  questions: Question[],
  answers: Record<string, { answer: AnswerValue | null }>,
  meta: number,
): { pointsEarned: number; pointsMax: number; pointsMeta: number; percentageOfMax: number; sectionScore: number } {
  let earned = 0
  let max = 0
  let scoreTotal = 0
  for (const q of questions) {
    const a = answers[q.id]?.answer
    if (a === 'na') continue // NA excluded entirely
    max += q.weight
    if (a === 'yes') earned += q.weight
    if (a === 'partial') earned += q.weight * 0.5
    // Score-style denominator: only answered questions (same logic as header NOTA)
    if (a) scoreTotal += q.weight
  }
  const pointsMeta = max * (meta / 100)
  const percentageOfMax = max > 0 ? (earned / max) * 100 : 0
  const sectionScore = scoreTotal > 0 ? (earned / scoreTotal) * 100 : 0
  return { pointsEarned: earned, pointsMax: max, pointsMeta, percentageOfMax, sectionScore }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvaluationPageV2() {
  const {
    group,
    questions,
    evalType,
    userName,
    answers,
    presentMembers,
    otherPeople,
    showResult,
    showAdvanceDialog,
    advanceDecision,
    answeredCount,
    totalQuestions,
    progress,
    score,
    pointsBreakdown,
    meta,
    eligibility,
    canFinalize,
    setAnswer,
    setJustification,
    setComment,
    addAttachments,
    removeAttachment,
    toggleMember,
    setOtherPeople,
    evaluationDate,
    setEvaluationDate,
    handleFinalize,
    handleAdvanceDecision,
    setShowResult,
    navigate,
    deniedMessage,
    dismissDenied,
  } = useEvaluationState()

  // ---- Local state --------------------------------------------------------
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ---- Thematic section grouping (by question index range) ----------------
  const sectionData = useMemo<SectionDef[]>(() => {
    return SECTION_DEFS.map((def) => ({
      title: def.title,
      color: def.color,
      questions: questions.slice(def.range[0], def.range[1]),
    }))
  }, [questions])

  // Extended section data with colorDark/colorLight/icon for new variants
  const extendedSectionData = useMemo<ExtendedSectionDef[]>(() => {
    return SECTION_DEFS.map((def) => ({
      title: def.title,
      color: def.color,
      colorDark: def.colorDark,
      colorLight: def.colorLight,
      icon: def.icon,
      questions: questions.slice(def.range[0], def.range[1]),
    }))
  }, [questions])

  // Expanded sections (all expanded by default)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    () => new Set(Array.from({ length: 20 }, (_, i) => i)),
  )

  // Refs for quick-nav scroll
  const sectionRefs = useRef(
    Array.from({ length: 20 }, () => createRef<HTMLDivElement>()),
  )

  // ---- Section nav items for sidebar/mobile --------------------------------
  const sectionNavItems = useMemo(
    () =>
      sectionData.map((sec) => {
        const points = computeSectionPoints(sec.questions, answers, meta)
        return {
          title: sec.title,
          color: sec.color,
          answeredCount: sec.questions.filter((q) => answers[q.id]?.answer).length,
          totalCount: sec.questions.length,
          status: getSectionStatus(answers, sec.questions),
          pointsEarned: points.pointsEarned,
          pointsMax: points.pointsMax,
          pointsMeta: points.pointsMeta,
          percentageOfMax: points.percentageOfMax,
          sectionScore: points.sectionScore,
        }
      }),
    [sectionData, answers, meta],
  )

  // ---- Global pointsMeta (derived from pointsBreakdown) --------------------
  const pointsMeta = pointsBreakdown.max * (meta / 100)

  // ---- Callbacks -----------------------------------------------------------

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  const scrollToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
    setSidebarOpen(false)
  }, [])

  // ---- Not found ----------------------------------------------------------
  if (!group) {
    return (
      <PageContainer>
        <p className="text-gray-400 text-center py-16">Grupo não encontrado.</p>
      </PageContainer>
    )
  }

  // ---- Render -------------------------------------------------------------
  return (
    <PageContainer maxWidth="xl">
      <AccessDeniedToast message={deniedMessage} onDismiss={dismissDenied} />

      <motion.div
        variants={evalStaggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* ---- Breadcrumb ---- */}
        <Breadcrumb
          items={[
            { label: 'Grupos', href: '/groups' },
            { label: group.name, href: `/groups/${group.id}` },
            { label: evalType === 'audit' ? 'Auditoria' : 'Follow-up' },
          ]}
        />

        {/* ================================================================
            1. PREMIUM HERO SECTION (D8 fixed)
        ================================================================ */}
        <motion.div variants={staggerItem}>
          <EvalHeroVariants
            variant="D8"
            group={group}
            evalType={evalType as 'audit' | 'followup'}
            userName={userName}
            score={score}
            meta={meta}
            answeredCount={answeredCount}
            totalQuestions={totalQuestions}
            presentMembers={presentMembers}
            otherPeople={otherPeople}
            evaluationDate={evaluationDate}
            sections={sectionNavItems}
            eligibility={eligibility}
            pointsBreakdown={pointsBreakdown}
            onToggleMember={toggleMember}
            onSetOtherPeople={setOtherPeople}
            onSetEvaluationDate={setEvaluationDate}
          />
        </motion.div>

        {/* ================================================================
            2. TWO-COLUMN LAYOUT
        ================================================================ */}
        <div className="flex gap-6 items-start">
          {/* Left: Section Content */}
          <div className="flex-1 min-w-0">
            <EvalSectionBand
              variant="H"
              sections={extendedSectionData}
              allQuestions={questions}
              answers={answers}
              onAnswer={setAnswer}
              onJustification={setJustification}
              onComment={setComment}
              onAddAttachments={addAttachments}
              onRemoveAttachment={removeAttachment}
              sectionRefs={sectionRefs.current}
            />
          </div>

          {/* Right: Sidebar (desktop) */}
          <EvalSidebarVariants
              variant="S5"
              className="hidden lg:block w-80 flex-shrink-0"
              score={score}
              meta={meta}
              progress={progress}
              answeredCount={answeredCount}
              totalQuestions={totalQuestions}
              presentMembers={presentMembers}
              teamMembers={group.team}
              evalType={evalType as 'audit' | 'followup'}
              eligibility={eligibility}
              sections={sectionNavItems}
              pointsBreakdown={pointsBreakdown}
              pointsMeta={pointsMeta}
              questionAnswers={questions.map((q) => answers[q.id]?.answer ?? null)}
              canFinalize={canFinalize}
              onScrollToSection={scrollToSection}
              onFinalize={handleFinalize}
            />
        </div>

        {/* ================================================================
            3. MOBILE COMPONENTS
        ================================================================ */}
        <EvalMobileBar
          score={score}
          meta={meta}
          progress={progress}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          evalType={evalType as 'audit' | 'followup'}
          eligibility={eligibility}
          sections={sectionNavItems}
          canFinalize={canFinalize}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          onCloseSidebar={() => setSidebarOpen(false)}
          onScrollToSection={scrollToSection}
          onFinalize={handleFinalize}
        />

        {/* ================================================================
            4. DIALOGS / MODALS
        ================================================================ */}
        {showAdvanceDialog && (
          <AdvanceDialog
            group={group}
            score={score}
            meta={meta}
            onDecision={handleAdvanceDecision}
          />
        )}

        {showResult && (
          <EvaluationResultModal
            group={group}
            evalType={evalType}
            score={score}
            meta={meta}
            advanceDecision={advanceDecision}
            eligibility={eligibility}
            onNavigateGroup={() => {
              setShowResult(false)
              navigate({ to: '/groups/$groupId', params: { groupId: group.id } })
            }}
            onNavigateDashboard={() => {
              setShowResult(false)
              navigate({ to: '/dashboard' })
            }}
          />
        )}
      </motion.div>
    </PageContainer>
  )
}
