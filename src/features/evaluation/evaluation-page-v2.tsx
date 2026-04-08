import { useState, useRef, useMemo, useCallback, createRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEvaluationState } from '@/hooks/use-evaluation-state'
import { PageContainer } from '@/components/layout/app-shell'
import { Card, Badge, Button, Label, Textarea, Input } from '@/components/ui'
import { ProgressBar } from '@/components/ui/progress-bar'
import { AccessDeniedToast } from '@/components/ui/access-denied-toast'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { SequenceProgress } from '@/components/data-display/sequence-progress'
import { CircularScoreGauge } from '@/components/data-display/circular-score-gauge'
import { AnswerButtonGroup } from '@/components/ui/answer-button-group'
import { AttachmentZone } from '@/components/ui/attachment-zone'
import { AdvanceDialog } from '@/components/ui/advance-dialog'
import { EvaluationResultModal } from '@/components/ui/evaluation-result-modal'
import {
  UserIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XIcon,
  CheckIcon,
} from '@/assets/icons'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import { cn } from '@/lib/cn'
import type { AnswerValue, Question } from '@/types'

// ---------------------------------------------------------------------------
// Section definitions (static grouping by question index)
// ---------------------------------------------------------------------------
const SECTION_COLORS = ['#0D9488', '#6366F1', '#F59E0B', '#EF4444'] as const

const sections = [
  { title: 'Organização e Limpeza', color: SECTION_COLORS[0], range: [0, 3] as const },
  { title: 'Gestão Visual e Indicadores', color: SECTION_COLORS[1], range: [3, 5] as const },
  { title: 'Participação e Melhoria', color: SECTION_COLORS[2], range: [5, 7] as const },
  { title: 'Equipamentos e Anomalias', color: SECTION_COLORS[3], range: [7, 9] as const },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract initials from a group name (first letter of each word, max 2). */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

/** Determine border color class for a given answer value. */
function answerBorderColor(answer: AnswerValue | null | undefined): string {
  switch (answer) {
    case 'yes':
      return 'bg-green-500'
    case 'partial':
      return 'bg-yellow-500'
    case 'no':
      return 'bg-rose-500'
    case 'na':
      return 'bg-gray-300'
    default:
      return 'bg-transparent'
  }
}

/** Return section status: 'complete' | 'partial' | 'empty'. */
function sectionStatus(
  answers: Record<string, { answer: AnswerValue | null }>,
  questionIds: string[],
): 'complete' | 'partial' | 'empty' {
  let answered = 0
  for (const id of questionIds) {
    if (answers[id]?.answer) answered++
  }
  if (answered === 0) return 'empty'
  if (answered === questionIds.length) return 'complete'
  return 'partial'
}

function statusDotColor(status: 'complete' | 'partial' | 'empty'): string {
  switch (status) {
    case 'complete':
      return 'bg-green-500'
    case 'partial':
      return 'bg-yellow-400'
    case 'empty':
      return 'bg-gray-300'
  }
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
    groupId,
  } = useEvaluationState()

  // ---- Local state ----------------------------------------------------------
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    () => new Set(sections.map((_, i) => i)),
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Refs for quick-nav scroll
  const sectionRefs = useRef(sections.map(() => createRef<HTMLDivElement>()))

  // ---- Derived data ---------------------------------------------------------

  /** For each section, compute the slice of questions and how many are answered. */
  const sectionData = useMemo(() => {
    return sections.map((sec) => {
      const slice: Question[] = questions.slice(sec.range[0], sec.range[1])
      const ids = slice.map((q: Question) => q.id)
      const answeredInSection = slice.filter((q: Question) => answers[q.id]?.answer).length
      const status: 'complete' | 'partial' | 'empty' = sectionStatus(answers, ids)
      return { ...sec, questions: slice, answeredInSection, status }
    })
  }, [questions, answers])

  // Eligibility criteria breakdown
  const criteriaRows = useMemo(() => {
    if (evalType !== 'audit') return []
    const scoreOk = score >= meta
    const mandatoryOk = !eligibility.reasons.some((r) =>
      r.toLowerCase().includes('obrigator'),
    )
    return [
      { label: 'Nota >= Meta', ok: scoreOk },
      { label: 'Perguntas obrigatórias', ok: mandatoryOk },
      { label: 'Pode avançar', ok: eligibility.eligible },
    ]
  }, [evalType, score, meta, eligibility])

  // ---- Callbacks ------------------------------------------------------------

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const scrollToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Ensure the section is expanded
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
    // Close mobile sidebar after navigation
    setSidebarOpen(false)
  }, [])

  // ---- Not found ------------------------------------------------------------
  if (!group) {
    return (
      <PageContainer>
        <p className="text-gray-400 text-center py-16">Grupo não encontrado.</p>
      </PageContainer>
    )
  }

  // ---- Render ---------------------------------------------------------------

  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR')
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <PageContainer maxWidth="xl">
      <AccessDeniedToast message={deniedMessage} onDismiss={dismissDenied} />

      <motion.div
        variants={staggerContainer}
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

        {/* ==================================================================
            1. RICH HEADER CARD
        ================================================================== */}
        <motion.div variants={staggerItem}>
          <Card padding="lg">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left: Avatar + Group Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-heading font-bold text-lg">
                    {getInitials(group.name)}
                  </span>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    {group.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {group.groupTypeName} - {group.areaName} - {group.managementName}
                  </p>
                </div>
              </div>

              {/* Right: Badges + Applicator + Sequence */}
              <div className="flex flex-col items-start lg:items-end gap-2 flex-shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={evalType === 'audit' ? 'primary' : 'info'} className="text-xs">
                    {evalType === 'audit' ? 'AUDITORIA' : 'FOLLOW-UP'}
                  </Badge>
                  <Badge variant="default" className="text-xs">
                    Meta: {meta}%
                  </Badge>
                  <Badge variant="default" className="text-xs">
                    Passo {group.currentSequence}/{group.maxSequence}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-gray-400">Aplicador:</span>{' '}
                  <span className="text-gray-700">{userName}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  {dateStr} {timeStr}
                </p>
                <SequenceProgress
                  current={group.currentSequence}
                  max={group.maxSequence}
                  size="sm"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
              {/* Team members */}
              <div>
                <Label>Pessoas presentes</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {group.team.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => toggleMember(member.name)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                        presentMembers.includes(member.name)
                          ? 'bg-primary-800 text-white border-primary-800'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300',
                      )}
                    >
                      <UserIcon size={12} />
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other people */}
              <div>
                <Label>Outras pessoas (não cadastradas)</Label>
                <Input
                  placeholder="Ex: João da equipe externa, Maria visitante..."
                  value={otherPeople}
                  onChange={(e) => setOtherPeople(e.target.value)}
                />
              </div>

              {/* Last audit info */}
              {group.lastAuditScore !== undefined && group.lastEvaluationDate && (
                <p className="text-xs text-gray-400">
                  Última auditoria: {group.lastEvaluationDate} - Nota:{' '}
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        group.lastAuditScore >= 80
                          ? '#00A650'
                          : group.lastAuditScore >= 50
                            ? '#867F06'
                            : '#CE3C5A',
                    }}
                  >
                    {group.lastAuditScore}%
                  </span>
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* ==================================================================
            2. TWO-COLUMN LAYOUT
        ================================================================== */}
        <div className="flex gap-6 items-start">
          {/* ----------------------------------------------------------------
              LEFT COLUMN — Accordion Sections
          ---------------------------------------------------------------- */}
          <motion.div variants={staggerContainer} className="flex-1 min-w-0 space-y-4">
            {sectionData.map((sec: { title: string; color: string; range: readonly [number, number]; questions: Question[]; answeredInSection: number; status: 'complete' | 'partial' | 'empty' }, sectionIdx: number) => {
              const isExpanded = expandedSections.has(sectionIdx)
              const sectionQuestions: Question[] = sec.questions

              return (
                <motion.div
                  key={sectionIdx}
                  variants={staggerItem}
                  ref={sectionRefs.current[sectionIdx]}
                  className="scroll-mt-24"
                >
                  {/* ---- Section Header (clickable) ---- */}
                  <button
                    onClick={() => toggleSection(sectionIdx)}
                    className="w-full flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Status dot */}
                      <span
                        className={cn(
                          'w-2.5 h-2.5 rounded-full flex-shrink-0',
                          statusDotColor(sec.status),
                        )}
                      />
                      {/* Colored accent dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: sec.color }}
                      />
                      <span className="text-sm font-semibold text-gray-700 text-left">
                        {sec.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-medium tabular-nums">
                        {sec.answeredInSection}/{sectionQuestions.length} respondidas
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDownIcon
                          size={16}
                          className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        />
                      </motion.div>
                    </div>
                  </button>

                  {/* ---- Section Content (animated) ---- */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-3 px-1">
                          {sectionQuestions.map((question) => {
                            const globalIndex = questions.indexOf(question)
                            const answer = answers[question.id]
                            const needsJustification =
                              answer?.answer === 'no' || answer?.answer === 'partial'

                            return (
                              <Card
                                key={question.id}
                                className="relative overflow-hidden"
                                padding="sm"
                              >
                                {/* Left colored border indicator */}
                                <div
                                  className={cn(
                                    'absolute top-0 left-0 w-1 h-full',
                                    answerBorderColor(answer?.answer),
                                  )}
                                />

                                <div className="pl-3">
                                  {/* Question number + text */}
                                  <div className="flex items-start gap-3 mb-2">
                                    <span className="text-xs font-bold text-gray-300 mt-0.5 tabular-nums">
                                      {String(globalIndex + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                        {question.text}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-gray-400 font-medium">
                                          Peso: {question.weight}
                                        </span>
                                        {question.requiredYesForAdvance && (
                                          <Badge
                                            variant="warning"
                                            className="text-[9px] px-1.5 py-0"
                                          >
                                            Obrigatório Sim
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Answer buttons */}
                                  <div className="mb-2">
                                    <AnswerButtonGroup
                                      value={answer?.answer ?? null}
                                      onChange={(v) => setAnswer(question.id, v)}
                                      variant="buttons"
                                    />
                                  </div>

                                  {/* Justification (conditional, animated) */}
                                  <AnimatePresence>
                                    {needsJustification && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-2">
                                          <Label>Justificativa (obrigatória)</Label>
                                          <Textarea
                                            placeholder="Informe o motivo..."
                                            value={answer?.justification || ''}
                                            onChange={(e) =>
                                              setJustification(question.id, e.target.value)
                                            }
                                            error={needsJustification && !answer?.justification}
                                            className="min-h-[60px]"
                                          />
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  {/* Attachment zone */}
                                  <div className="mt-2">
                                    <AttachmentZone
                                      files={answer?.attachments || []}
                                      onAdd={(files) => addAttachments(question.id, files)}
                                      onRemove={(index) => removeAttachment(question.id, index)}
                                      compact
                                    />
                                  </div>
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>

          {/* ----------------------------------------------------------------
              RIGHT COLUMN — Sticky Sidebar (desktop only)
          ---------------------------------------------------------------- */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <Card padding="md">
                {/* Score gauge */}
                <div className="flex flex-col items-center mb-2">
                  <CircularScoreGauge score={score} meta={meta} size="lg" showMeta />
                  <p className="text-xs text-gray-400 font-medium mt-2">Nota Atual</p>
                </div>

                {/* Completion progress */}
                <div className="mt-4">
                  <ProgressBar value={progress} variant="score" size="md" />
                  <p className="text-xs text-gray-500 text-center mt-1.5 tabular-nums">
                    {answeredCount} de {totalQuestions} perguntas
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4" />

                {/* Team section */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Equipe Presente</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.team.map((member) => {
                      const isPresent = presentMembers.includes(member.name)
                      return (
                        <div
                          key={member.id}
                          title={member.name}
                          className={cn(
                            'w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-700 transition-all',
                            isPresent
                              ? 'ring-2 ring-green-400'
                              : 'opacity-50',
                          )}
                        >
                          {member.name
                            .split(' ')
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4" />

                {/* Eligibility section (audit only) */}
                {evalType === 'audit' && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Critérios de Avanço
                      </p>
                      <div className="space-y-1.5">
                        {criteriaRows.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-500">{row.label}</span>
                            {row.ok ? (
                              <CheckIcon size={14} className="text-green-500" />
                            ) : (
                              <XIcon size={14} className="text-rose-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-4" />
                  </>
                )}

                {/* Quick Nav */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Navegação Rápida</p>
                  <div className="space-y-1">
                    {sectionData.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(idx)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer text-left"
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            statusDotColor(sec.status),
                          )}
                        />
                        <span className="truncate">{sec.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4" />

                {/* Finalize button */}
                <Button
                  className="w-full"
                  disabled={!canFinalize}
                  onClick={handleFinalize}
                  size="lg"
                >
                  <CheckCircleIcon size={18} />
                  Finalizar Avaliação
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* ==================================================================
            3. MOBILE: Sticky Bottom Bar
        ================================================================== */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-between px-4 h-16 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <CircularScoreGauge score={score} meta={meta} size="sm" showMeta={false} />
              <div>
                <p className="text-xs font-semibold text-gray-800 tabular-nums">
                  {Math.round(score)}%
                </p>
                <p className="text-[10px] text-gray-400">
                  {answeredCount}/{totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={!canFinalize}
                onClick={handleFinalize}
                size="sm"
              >
                Finalizar
              </Button>
            </div>
          </div>
        </div>

        {/* ==================================================================
            3b. MOBILE: FAB to open sidebar bottom sheet
        ================================================================== */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-primary-800 text-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-primary-900 transition-colors active:scale-95"
        >
          <span className="font-heading font-bold text-sm tabular-nums">
            {Math.round(score)}%
          </span>
        </button>

        {/* ==================================================================
            3c. MOBILE: Bottom Sheet Overlay
        ================================================================== */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-40 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto p-6"
              >
                {/* Drag handle */}
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                {/* Score gauge */}
                <div className="flex flex-col items-center mb-4">
                  <CircularScoreGauge score={score} meta={meta} size="lg" showMeta />
                  <p className="text-xs text-gray-400 font-medium mt-2">Nota Atual</p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <ProgressBar value={progress} variant="score" size="md" />
                  <p className="text-xs text-gray-500 text-center mt-1.5 tabular-nums">
                    {answeredCount} de {totalQuestions} perguntas
                  </p>
                </div>

                {/* Eligibility (audit only) */}
                {evalType === 'audit' && (
                  <>
                    <div className="border-t border-gray-100 my-4" />
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Critérios de Avanço
                      </p>
                      <div className="space-y-1.5">
                        {criteriaRows.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-gray-500">{row.label}</span>
                            {row.ok ? (
                              <CheckIcon size={14} className="text-green-500" />
                            ) : (
                              <XIcon size={14} className="text-rose-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Quick Nav */}
                <div className="border-t border-gray-100 my-4" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Navegação Rápida</p>
                  <div className="space-y-1">
                    {sectionData.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(idx)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer text-left"
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            statusDotColor(sec.status),
                          )}
                        />
                        <span className="truncate">{sec.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finalize */}
                <div className="mt-4">
                  <Button
                    className="w-full"
                    disabled={!canFinalize}
                    onClick={() => {
                      setSidebarOpen(false)
                      handleFinalize()
                    }}
                    size="lg"
                  >
                    <CheckCircleIcon size={18} />
                    Finalizar Avaliação
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ==================================================================
            4. DIALOGS / MODALS
        ================================================================== */}
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

      {/* Spacer for mobile bottom bar */}
      <div className="lg:hidden h-20" />
    </PageContainer>
  )
}
