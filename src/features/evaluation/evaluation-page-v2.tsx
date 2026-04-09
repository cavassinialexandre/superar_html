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
  EvalSidebar,
  EvalMobileBar,
} from './components'
import { EvalSectionBand } from './components/eval-section-band'
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
  { title: 'Organização e Limpeza', color: '#0D9488', colorDark: '#065652', colorLight: '#5EEAD4', icon: 'broom', range: [0, 3] as const },
  { title: 'Gestão Visual e Indicadores', color: '#6366F1', colorDark: '#3730A3', colorLight: '#A5B4FC', icon: 'chart', range: [3, 5] as const },
  { title: 'Participação e Melhoria', color: '#F59E0B', colorDark: '#B45309', colorLight: '#FCD34D', icon: 'users', range: [5, 7] as const },
  { title: 'Equipamentos e Anomalias', color: '#EF4444', colorDark: '#B91C1C', colorLight: '#FCA5A5', icon: 'wrench', range: [7, 9] as const },
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
      sectionData.map((sec) => ({
        title: sec.title,
        color: sec.color,
        answeredCount: sec.questions.filter((q) => answers[q.id]?.answer).length,
        totalCount: sec.questions.length,
        status: getSectionStatus(answers, sec.questions),
      })),
    [sectionData, answers],
  )

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
          title={evalType === 'audit' ? 'Auditoria' : 'Follow-up'}
          description={group.name}
        />

        {/* ================================================================
            1. PREMIUM HERO SECTION
        ================================================================ */}
        <motion.div variants={staggerItem}>
          <EvalHeroSection
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

          {/* Right: Glassmorphism Sidebar (desktop) */}
          <EvalSidebar
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
