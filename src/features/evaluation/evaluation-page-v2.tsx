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
import { EvalSectionHero } from './components/eval-section-hero'
import { EvalSectionTimeline } from './components/eval-section-timeline'
import { EvalSectionBand } from './components/eval-section-band'
import type { SectionDef } from './components'

// ---------------------------------------------------------------------------
// Section variant types
// ---------------------------------------------------------------------------

type SectionVariant = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K'

type VariantGroup = 'hero' | 'band' | 'timeline'

const VARIANT_LABELS: Record<SectionVariant, { name: string; desc: string; group: VariantGroup }> = {
  A: { name: 'Sidebar', desc: 'Sidebar gradiente lateral', group: 'hero' },
  B: { name: 'Top Bar', desc: 'Barra superior + fluxo de cor', group: 'hero' },
  C: { name: 'Glass', desc: 'Glassmorphism com accent', group: 'hero' },
  D: { name: 'Envelope', desc: 'Accent em L geométrico', group: 'hero' },
  E: { name: 'Spine', desc: 'Spine vertical + branches', group: 'hero' },
  F: { name: 'Seamless', desc: 'Faixa colorida sem divisão', group: 'band' },
  G: { name: 'Split', desc: 'Faixa assimétrica + painel', group: 'band' },
  H: { name: 'Float', desc: 'Faixa flutuante + profundidade', group: 'band' },
  I: { name: 'Connected', desc: 'Cards conectados ao timeline', group: 'timeline' },
  J: { name: 'Zigzag', desc: 'Timeline alternada esq/dir', group: 'timeline' },
  K: { name: 'Compact', desc: 'Timeline compacta data-dense', group: 'timeline' },
}

const VARIANT_GROUPS: { label: string; variants: SectionVariant[] }[] = [
  { label: 'Mini Hero', variants: ['A', 'B', 'C', 'D', 'E'] },
  { label: 'Color Band', variants: ['F', 'G', 'H'] },
  { label: 'Timeline', variants: ['I', 'J', 'K'] },
]

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
    addAttachments,
    removeAttachment,
    toggleMember,
    setOtherPeople,
    handleFinalize,
    handleAdvanceDecision,
    setShowResult,
    navigate,
    deniedMessage,
    dismissDenied,
  } = useEvaluationState()

  // ---- Local state --------------------------------------------------------
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sectionVariant, setSectionVariant] = useState<SectionVariant>('A')

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
            onToggleMember={toggleMember}
            onSetOtherPeople={setOtherPeople}
          />
        </motion.div>

        {/* ================================================================
            1.5. VARIANT SELECTOR
        ================================================================ */}
        <motion.div variants={staggerItem}>
          <div
            className="rounded-2xl border border-white/60 p-3 sm:p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 4px 16px rgba(30,122,115,0.06)',
            }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-shrink-0">
                <p className="text-xs font-semibold text-gray-600">Layout das Seções</p>
                <p className="text-[10px] text-gray-400">{VARIANT_LABELS[sectionVariant].desc}</p>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {VARIANT_GROUPS.map((group, gIdx) => (
                  <div key={group.label} className="flex items-center">
                    {gIdx > 0 && (
                      <div className="w-px h-5 bg-gray-200 mx-1.5 flex-shrink-0" />
                    )}
                    <span className="text-[9px] text-gray-400 font-medium mr-1 hidden sm:inline">
                      {group.label}
                    </span>
                    {group.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSectionVariant(v)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          sectionVariant === v
                            ? 'bg-primary-700 text-white shadow-md'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 hidden sm:inline ml-auto">
                {VARIANT_LABELS[sectionVariant].name}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ================================================================
            2. TWO-COLUMN LAYOUT
        ================================================================ */}
        <div className="flex gap-6 items-start">
          {/* Left: Section Content (variant-dependent) */}
          <div className="flex-1 min-w-0">
            {/* Mini Hero variants (A-E) */}
            {(['A', 'B', 'C', 'D', 'E'] as const).includes(sectionVariant as 'A' | 'B' | 'C' | 'D' | 'E') && (
              <EvalSectionHero
                variant={sectionVariant as 'A' | 'B' | 'C' | 'D' | 'E'}
                sections={extendedSectionData}
                allQuestions={questions}
                answers={answers}
                onAnswer={setAnswer}
                onJustification={setJustification}
                onAddAttachments={addAttachments}
                onRemoveAttachment={removeAttachment}
                sectionRefs={sectionRefs.current}
              />
            )}
            {/* Color Band variants (F-H) */}
            {(['F', 'G', 'H'] as const).includes(sectionVariant as 'F' | 'G' | 'H') && (
              <EvalSectionBand
                variant={sectionVariant as 'F' | 'G' | 'H'}
                sections={extendedSectionData}
                allQuestions={questions}
                answers={answers}
                onAnswer={setAnswer}
                onJustification={setJustification}
                onAddAttachments={addAttachments}
                onRemoveAttachment={removeAttachment}
                sectionRefs={sectionRefs.current}
              />
            )}
            {/* Timeline variants (I-K) */}
            {(['I', 'J', 'K'] as const).includes(sectionVariant as 'I' | 'J' | 'K') && (
              <EvalSectionTimeline
                variant={sectionVariant as 'I' | 'J' | 'K'}
                sections={extendedSectionData}
                allQuestions={questions}
                answers={answers}
                onAnswer={setAnswer}
                onJustification={setJustification}
                onAddAttachments={addAttachments}
                onRemoveAttachment={removeAttachment}
                sectionRefs={sectionRefs.current}
              />
            )}
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
