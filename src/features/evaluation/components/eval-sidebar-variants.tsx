/**
 * Evaluation Sidebar — 8 design variants.
 *
 *   S1 — Refined Baseline       (pixel-port of EvalSidebar + points data)
 *   S2 — Executive Whitespace   (premium minimal typography)
 *   S3 — Editorial Magazine     (big-type + baseline grid)
 *   S4 — Aurora Glass           (refined glassmorphism)
 *   S5 — Gauge Hero Stack       (dual-ring gauge as protagonist)
 *   S6 — Soft Depth Neo         (modern subtle neumorphism)
 *   S7 — Chromatic Pulse        (multi-color harmony)
 *   S8 — Midnight Obsidian      (dark luxury, teal-esmerald accent)
 *
 * Wrapper: <EvalSidebarVariants variant="S1" {...props} />
 * Every variant honors the same prop contract and contains the same 6 blocks
 * (Score, Progress, Team, Criteria-if-audit, QuickNav, Finalize).
 */

import { cn } from '@/lib/cn'
import { Button } from '@/components/ui'
import { ProgressBar } from '@/components/ui/progress-bar'
import { CircularScoreGauge } from '@/components/data-display/circular-score-gauge'
import { CheckIcon, XIcon, CheckCircleIcon } from '@/assets/icons'
import { getScoreColor } from '@/design-system/tokens'
import type { TeamMember, EvaluationType } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EvalSidebarVariant =
  | 'S1'
  | 'S2'
  | 'S3'
  | 'S3a'
  | 'S3b'
  | 'S3c'
  | 'S3d'
  | 'S4'
  | 'S5'
  | 'S6'
  | 'S7'
  | 'S8'

export interface SectionNavItemWithPoints {
  title: string
  color: string
  answeredCount: number
  totalCount: number
  status: 'complete' | 'partial' | 'empty'
  /** Σ (yes*w + partial*w*0.5), NA excluded */
  pointsEarned: number
  /** Σ w, NA excluded */
  pointsMax: number
  /** pointsMax * (meta/100) — section-level goal in absolute points */
  pointsMeta: number
  /** (pointsEarned / pointsMax) * 100, or 0 if pointsMax === 0 */
  percentageOfMax: number
  /** Score-style %: only answered questions in denominator (same as header NOTA) */
  sectionScore: number
}

export interface EvalSidebarVariantsProps {
  variant?: EvalSidebarVariant
  score: number
  meta: number
  progress: number
  answeredCount: number
  totalQuestions: number
  presentMembers: string[]
  teamMembers: TeamMember[]
  evalType: EvaluationType
  eligibility: { eligible: boolean; reasons: string[] }
  sections: SectionNavItemWithPoints[]
  pointsBreakdown: { earned: number; max: number; percentage: number }
  /** Derived: pointsBreakdown.max * (meta/100) */
  pointsMeta: number
  /** Per-question answer status, ordered by sequence. null = unanswered */
  questionAnswers?: Array<'yes' | 'partial' | 'no' | 'na' | null>
  canFinalize: boolean
  onScrollToSection: (index: number) => void
  onFinalize: () => void
  className?: string
  disableEntrance?: boolean
}

type InternalProps = Omit<EvalSidebarVariantsProps, 'variant'>

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Format points with Brazilian locale, max 1 decimal, no trailing zero. */
export function formatPts(n: number): string {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

function statusDotColor(status: 'complete' | 'partial' | 'empty'): string {
  switch (status) {
    case 'complete': return 'bg-green-500'
    case 'partial': return 'bg-yellow-400'
    case 'empty': return 'bg-gray-300'
  }
}

function buildCriteriaRows(
  evalType: EvaluationType,
  score: number,
  meta: number,
  eligibility: { eligible: boolean; reasons: string[] },
): Array<{ label: string; ok: boolean }> {
  if (evalType !== 'audit') return []
  const scoreOk = score >= meta
  const mandatoryOk = !eligibility.reasons.some((r) => r.toLowerCase().includes('obrigator'))
  return [
    { label: 'Nota >= Meta', ok: scoreOk },
    { label: 'Requisitos Mínimos', ok: mandatoryOk },
    { label: 'Pode avançar', ok: eligibility.eligible },
  ]
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

// ---------------------------------------------------------------------------
// V1 — Refined Baseline (pixel-perfect port of EvalSidebar + points data)
// ---------------------------------------------------------------------------

function VariantS1(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="relative rounded-2xl bg-white"
          style={{
            border: '1px solid #F3F4F6',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.03), 0 12px 24px rgba(30,122,115,0.06)',
          }}
        >
          <div className="relative z-10 p-5">
            {/* Score gauge with glow */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <div
                  className="absolute inset-4 rounded-full blur-xl opacity-15"
                  style={{ background: getScoreColor(score) }}
                />
                <CircularScoreGauge score={score} meta={meta} size="lg" showMeta />
              </div>
              <p className="text-xs text-gray-400 font-medium mt-2">Nota Atual</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5 tabular-nums">
                {formatPts(pointsBreakdown.earned)} / {formatPts(pointsBreakdown.max)} pts
                <span className="text-gray-300"> · meta {formatPts(pointsMeta)}</span>
              </p>
            </div>

            {/* Completion progress */}
            <div className="mt-4">
              <ProgressBar value={progress} variant="gradient" size="md" />
              <p className="text-xs text-gray-500 text-center mt-1.5 tabular-nums">
                {answeredCount} de {totalQuestions} perguntas
              </p>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

            {/* Team present */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Equipe Presente</p>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold transition-all',
                        isPresent
                          ? 'bg-primary-100 text-primary-700 ring-2 ring-green-400/50'
                          : 'bg-gray-100 text-gray-300 opacity-40',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 tabular-nums">
                {presentMembers.length}/{teamMembers.length} presentes
              </p>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

            {/* Eligibility criteria (audit only) */}
            {evalType === 'audit' && (
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Critérios de Avanço</p>
                  <div className="space-y-1.5">
                    {criteriaRows.map((row) => (
                      <div
                        key={row.label}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors',
                          row.ok ? 'bg-green-50/50' : 'bg-rose-50/50',
                        )}
                      >
                        <span className={row.ok ? 'text-gray-600' : 'text-gray-500'}>{row.label}</span>
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center',
                            row.ok ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-500',
                          )}
                        >
                          {row.ok ? <CheckIcon size={12} /> : <XIcon size={12} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
              </>
            )}

            {/* Quick navigation */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Navegação Rápida</p>
              <div className="space-y-1">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-white/50 hover:shadow-xs transition-all cursor-pointer text-left"
                  >
                    <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1', statusDotColor(sec.status))} />
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">{sec.title}</span>
                      {sec.status !== 'empty' && (
                        <span className="block text-[9px] text-gray-400 tabular-nums mt-0.5">
                          {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)}p · {Math.round(sec.percentageOfMax)}%
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 tabular-nums mt-0.5">
                      {sec.answeredCount}/{sec.totalCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

            {/* Finalize button */}
            <Button
              variant="premium"
              className="w-full"
              disabled={!canFinalize}
              onClick={onFinalize}
              size="lg"
            >
              <CheckCircleIcon size={18} />
              Finalizar Avaliação
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stub placeholder for variants S2..S8 (will be implemented in later phases)
// ---------------------------------------------------------------------------

function VariantStub({
  label,
  concept,
  className,
}: {
  label: string
  concept: string
  className?: string
}) {
  return (
    <div className={className}>
      <div className="sticky top-24">
        <div className="relative rounded-2xl bg-white border border-dashed border-gray-300 p-5 text-center">
          <p className="text-xs font-semibold text-gray-600">{label}</p>
          <p className="text-[10px] text-gray-400 mt-1">{concept}</p>
          <p className="text-[9px] text-gray-300 mt-4">⏳ aguardando implementação</p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V2 — Executive Whitespace (premium minimalista tipográfico)
// Zero decoração gratuita, whitespace como elemento de design.
// ---------------------------------------------------------------------------

function VariantS2(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const progressPct = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="rounded-3xl bg-white"
          style={{ boxShadow: '0 4px 24px rgba(16,55,52,0.04)' }}
        >
          <div className="p-6 flex flex-col gap-6">
            {/* Score — typography driven, no gauge */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Nota Atual
              </p>
              <div className="mt-2 flex items-end gap-4">
                <span
                  className="font-extrabold text-gray-900 leading-none tabular-nums"
                  style={{ fontFamily: 'Plus Jakarta Sans, Inter, system-ui', fontSize: 64 }}
                >
                  {Math.round(score)}
                  <span className="text-2xl text-gray-300 font-bold ml-0.5">%</span>
                </span>
                <div className="flex items-center gap-3 pb-2">
                  <span className="block w-px h-10 bg-primary-500" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                      Meta {meta}%
                    </span>
                    <span className="text-[10px] text-gray-500 tabular-nums mt-1">
                      {formatPts(pointsBreakdown.earned)} / {formatPts(pointsBreakdown.max)} pts
                    </span>
                    <span className="text-[9px] text-gray-400 tabular-nums">
                      alvo {formatPts(pointsMeta)} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress — thin line + right-aligned label */}
            <div>
              <div className="h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #103734, #1E7A73)',
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-500 text-right mt-1.5 tabular-nums">
                {answeredCount} de {totalQuestions} perguntas
              </p>
            </div>

            {/* Team presence */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2.5">
                Equipe Presente
              </p>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold transition-all',
                        isPresent
                          ? 'bg-primary-50 text-primary-700 border border-primary-500'
                          : 'bg-transparent text-gray-300 border border-gray-200',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-2 tabular-nums">
                {presentMembers.length} de {teamMembers.length} presentes
              </p>
            </div>

            {/* Eligibility criteria (audit only) */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Critérios de Avanço
                </p>
                <div className="flex flex-col gap-1.5">
                  {criteriaRows.map((row) => (
                    <div key={row.label} className="flex items-center gap-2.5 h-7">
                      {row.ok ? (
                        <CheckIcon size={14} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <XIcon size={14} className="text-rose-500 flex-shrink-0" />
                      )}
                      <span className={cn('text-xs', row.ok ? 'text-gray-700' : 'text-gray-400')}>
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick navigation — two-line rows, no bullets */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Navegação Rápida
              </p>
              <div className="flex flex-col gap-3">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group text-left w-full"
                  >
                    <p className="text-[13px] font-semibold text-gray-800 group-hover:text-primary-700 transition-colors truncate">
                      {sec.title}
                    </p>
                    <p className="text-[10px] text-gray-400 tabular-nums mt-0.5">
                      {sec.answeredCount}/{sec.totalCount} perguntas
                      {sec.pointsMax > 0 && (
                        <>
                          {' · '}
                          {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts
                          {' · '}
                          <span className={cn(
                            sec.percentageOfMax >= 100
                              ? 'text-green-600'
                              : sec.percentageOfMax > 0
                                ? 'text-gray-500'
                                : 'text-gray-300'
                          )}>
                            {Math.round(sec.percentageOfMax)}%
                          </span>
                        </>
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Finalize — ghost button with border */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className={cn(
                'w-full h-11 rounded-xl border text-[13px] font-semibold transition-all flex items-center justify-center gap-2',
                canFinalize
                  ? 'border-primary-600 text-primary-700 hover:bg-primary-700 hover:text-white hover:border-primary-700 cursor-pointer'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed',
              )}
            >
              <CheckCircleIcon size={16} />
              Finalizar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V3 — Editorial Magazine (big-type narrativo + baseline grid)
// Inspirado em revistas de design premium (Kinfolk, Cereal Magazine).
// ---------------------------------------------------------------------------

function VariantS3(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="bg-white overflow-hidden"
          style={{
            borderRadius: 6,
            border: '0.5px solid #E4E8E8',
            boxShadow: '0 2px 12px rgba(16,55,52,0.05)',
          }}
        >
          {/* Editorial header bar */}
          <div className="bg-[#103734] px-5 py-2 flex items-center justify-between">
            <span
              className="text-[9px] uppercase tracking-[0.25em] text-white/90 font-semibold"
              style={{ fontFamily: 'Plus Jakarta Sans, Inter' }}
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-white/50 tabular-nums">
              {today}
            </span>
          </div>

          <div className="p-5">
            {/* Score editorial — big type with rotated label + baseline rules */}
            <div className="relative">
              <div className="h-px bg-gray-200" />
              <div className="flex items-center py-3">
                <span
                  className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.25em]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Nota
                </span>
                <div className="flex-1 flex items-baseline justify-center">
                  <span
                    className="font-black text-gray-900 leading-none tabular-nums"
                    style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 68 }}
                  >
                    {Math.round(score)}
                  </span>
                  <span className="text-3xl font-bold text-gray-300 ml-0.5">%</span>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <p
                className="text-[11px] text-gray-600 mt-2 text-center"
                style={{ fontStyle: 'italic' }}
              >
                {formatPts(pointsBreakdown.earned)} de {formatPts(pointsBreakdown.max)} pontos · meta {formatPts(pointsMeta)} · {meta}%
              </p>
            </div>

            {/* Progress — ruler with numbered ticks */}
            <div className="mt-5">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                Progresso
              </p>
              <div className="flex items-end gap-[2px] h-6">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <span
                      className={cn(
                        'w-full rounded-sm transition-all',
                        i < answeredCount ? 'bg-primary-700 h-4' : 'bg-gray-200 h-2',
                      )}
                    />
                    <span className="text-[7px] text-gray-400 tabular-nums leading-none">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team — minimalist grid */}
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                Equipe
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'h-6 flex items-center justify-center text-[8px] font-bold tracking-wide',
                        isPresent ? 'text-primary-800' : 'text-gray-300',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mt-2 tabular-nums text-center">
                {presentMembers.length}/{teamMembers.length} presentes
              </p>
            </div>

            {/* Criteria — numbered list like table of contents */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                  Critérios
                </p>
                <div className="flex flex-col">
                  {criteriaRows.map((row, i) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-[9px] font-bold text-gray-400 tabular-nums w-4">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('text-[11px] flex-1', row.ok ? 'text-gray-800' : 'text-gray-400')}>
                        {row.label}
                      </span>
                      {row.ok ? (
                        <CheckIcon size={12} className="text-green-600" />
                      ) : (
                        <XIcon size={12} className="text-rose-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick navigation — magazine article list */}
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-2">
                Seções
              </p>
              <div className="flex flex-col">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0 text-left w-full"
                  >
                    <span
                      className="font-black text-gray-200 tabular-nums leading-none"
                      style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 24 }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                        {sec.title}
                      </p>
                      <p
                        className="text-[10px] text-gray-500 mt-0.5 tabular-nums"
                        style={{ fontStyle: 'italic' }}
                      >
                        {sec.answeredCount}/{sec.totalCount} perguntas · {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts · {Math.round(sec.percentageOfMax)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Finalize — editorial button (hard edges) */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className={cn(
                'mt-6 w-full h-11 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2',
                canFinalize
                  ? 'bg-[#103734] text-white hover:bg-[#1E7A73] cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              )}
              style={{ borderRadius: 0 }}
            >
              Finalizar Avaliação →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V4 — Aurora Glass (refined glassmorphism — visionOS / Arc Browser inspired)
// Backdrop blur forte + highlights brancos + glow controlado.
// ---------------------------------------------------------------------------

function ConicGauge({
  score,
  meta,
  size = 140,
}: {
  score: number
  meta: number
  size?: number
}) {
  const stroke = 10
  const cx = size / 2
  const cy = size / 2
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const scorePct = Math.min(Math.max(score, 0), 100) / 100
  const offset = circ * (1 - scorePct)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="auroraStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#103734" />
            <stop offset="50%" stopColor="#1E7A73" />
            <stop offset="100%" stopColor="#3AA39C" />
          </linearGradient>
          <filter id="auroraGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(16,55,52,0.08)" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#auroraStroke)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#auroraGlow)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black text-gray-900 tabular-nums leading-none"
          style={{
            fontFamily: 'Plus Jakarta Sans, Inter',
            fontSize: 42,
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          {Math.round(score)}
          <span className="text-xl font-bold text-gray-400 ml-0.5">%</span>
        </span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-primary-700 font-bold mt-1">
          Meta {meta}%
        </span>
      </div>
    </div>
  )
}

function VariantS4(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const progressPct = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      <div className="sticky top-24">
        {/* Ambient mesh background to make glass visible */}
        <div className="relative rounded-[28px] p-[1px] overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(circle at 20% 0%, rgba(58,163,156,0.18), transparent 50%),' +
                'radial-gradient(circle at 100% 40%, rgba(99,102,241,0.10), transparent 55%),' +
                'radial-gradient(circle at 0% 100%, rgba(245,158,11,0.10), transparent 50%),' +
                'linear-gradient(180deg, #F8FAFA 0%, #FFFFFF 100%)',
            }}
          />
          <div
            className="relative rounded-[27px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.7), 0 12px 40px rgba(16,55,52,0.08), 0 2px 8px rgba(16,55,52,0.04)',
            }}
          >
            <div className="p-5 flex flex-col gap-4">
              {/* Score gauge */}
              <div className="flex flex-col items-center">
                <ConicGauge score={score} meta={meta} />
                <p className="text-[9px] uppercase tracking-[0.22em] text-primary-700/70 font-bold mt-3">
                  {formatPts(pointsBreakdown.earned)} / {formatPts(pointsBreakdown.max)} PTS · Alvo {formatPts(pointsMeta)}
                </p>
              </div>

              {/* Progress with glow */}
              <div>
                <div className="h-1.5 rounded-full bg-white/40 overflow-hidden relative">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      background: 'linear-gradient(90deg, #103734, #1E7A73, #3AA39C)',
                      boxShadow: '0 0 12px rgba(30,122,115,0.5)',
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 text-center mt-1.5 tabular-nums">
                  {answeredCount} de {totalQuestions} perguntas
                </p>
              </div>

              {/* Glass divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              {/* Team as glass chips */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">
                  Equipe Presente
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {teamMembers.map((member) => {
                    const isPresent = presentMembers.includes(member.name)
                    return (
                      <div
                        key={member.id}
                        title={member.name}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{
                          background: isPresent ? 'rgba(30,122,115,0.18)' : 'rgba(255,255,255,0.4)',
                          border: isPresent
                            ? '1px solid rgba(30,122,115,0.5)'
                            : '1px solid rgba(255,255,255,0.5)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          color: isPresent ? '#104A46' : '#CDD4D3',
                          boxShadow: isPresent
                            ? '0 0 8px rgba(30,122,115,0.2), inset 0 1px 0 rgba(255,255,255,0.4)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.5)',
                        }}
                      >
                        {getInitials(member.name)}
                      </div>
                    )
                  })}
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5 tabular-nums">
                  {presentMembers.length}/{teamMembers.length} presentes
                </p>
              </div>

              {/* Criteria as glass pills */}
              {evalType === 'audit' && criteriaRows.length > 0 && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">
                      Critérios de Avanço
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {criteriaRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px]"
                          style={{
                            background: row.ok
                              ? 'rgba(16,166,80,0.08)'
                              : 'rgba(206,60,90,0.08)',
                            border: row.ok
                              ? '1px solid rgba(16,166,80,0.22)'
                              : '1px solid rgba(206,60,90,0.22)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                          }}
                        >
                          <span className={row.ok ? 'text-gray-700' : 'text-gray-500'}>{row.label}</span>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              background: row.ok ? 'rgba(16,166,80,0.18)' : 'rgba(206,60,90,0.18)',
                              color: row.ok ? '#00A650' : '#CE3C5A',
                            }}
                          >
                            {row.ok ? <CheckIcon size={11} /> : <XIcon size={11} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              {/* Quick navigation */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-2">
                  Navegação Rápida
                </p>
                <div className="flex flex-col gap-1">
                  {sections.map((sec, idx) => (
                    <button
                      key={sec.title}
                      onClick={() => onScrollToSection(idx)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: sec.status === 'complete' ? '#00A650' : sec.status === 'partial' ? '#F59E0B' : '#CDD4D3',
                          boxShadow: sec.status === 'complete' ? '0 0 6px rgba(0,166,80,0.6)' : undefined,
                        }}
                      />
                      <span className="flex-1 text-[11px] font-semibold text-gray-700 truncate">
                        {sec.title}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono tabular-nums">
                        {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)}p · {Math.round(sec.percentageOfMax)}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              {/* Finalize — glass teal button */}
              <button
                onClick={onFinalize}
                disabled={!canFinalize}
                className="w-full h-11 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: canFinalize ? 'rgba(16,55,52,0.85)' : 'rgba(16,55,52,0.4)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: canFinalize
                    ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(16,55,52,0.3)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <CheckCircleIcon size={16} />
                Finalizar Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V5 — Gauge Hero Stack (dual-ring gauge as protagonist)
// Hero band with watermark + dual-ring SVG + compact rest below.
// ---------------------------------------------------------------------------

function DualRingGauge({
  score,
  meta,
  size = 160,
}: {
  score: number
  meta: number
  size?: number
}) {
  const strokeOuter = 10
  const strokeInner = 3
  const cx = size / 2
  const cy = size / 2
  const rOuter = (size - strokeOuter) / 2
  const rInner = rOuter - strokeOuter
  const circOuter = 2 * Math.PI * rOuter
  const circInner = 2 * Math.PI * rInner
  const scorePct = Math.min(Math.max(score, 0), 100) / 100
  const metaPct = Math.min(Math.max(meta, 0), 100) / 100
  const outerOffset = circOuter * (1 - scorePct)
  const innerOffset = circInner * (1 - metaPct)
  const scoreColor = getScoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="dualRingScore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#103734" />
            <stop offset="50%" stopColor="#1E7A73" />
            <stop offset="100%" stopColor={scoreColor} />
          </linearGradient>
        </defs>
        {/* Outer track */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#E4E8E8" strokeWidth={strokeOuter} />
        {/* Outer score arc */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke="url(#dualRingScore)"
          strokeWidth={strokeOuter}
          strokeLinecap="round"
          strokeDasharray={circOuter}
          strokeDashoffset={outerOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Inner meta arc (dashed) */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="#CDD4D3"
          strokeWidth={strokeInner}
          strokeDasharray={`2 4`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.6}
        />
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="#A3ADAC"
          strokeWidth={strokeInner}
          strokeDasharray={circInner}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black tabular-nums leading-none"
          style={{
            fontFamily: 'Plus Jakarta Sans, Inter',
            fontSize: 44,
            color: score >= meta ? '#065F46' : '#9F1239',
          }}
        >
          {Math.round(score)}
          <span className="text-xl font-bold ml-0.5" style={{ color: score >= meta ? '#065F46' : '#9F1239', opacity: 0.45 }}>%</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-semibold mt-1">
          Meta {meta}%
        </span>
      </div>
    </div>
  )
}

function MiniRing({ percent, color, size = 18 }: { percent: number; color: string; size?: number }) {
  const stroke = 2.5
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const clamped = Math.min(Math.max(percent, 0), 100) / 100
  const offset = circ * (1 - clamped)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E8E8" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

function VariantS5(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const progressPct = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="rounded-2xl bg-white overflow-hidden"
          style={{
            border: '1px solid #F3F4F6',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(30,122,115,0.05)',
          }}
        >
          {/* Header — split 2-col with separator */}
          <div
            className="px-4 py-2.5 flex items-center"
            style={{ background: 'linear-gradient(180deg, #F8FAFA 0%, #FFFFFF 100%)', borderBottom: '0.5px solid #E4E8E8' }}
          >
            <span className="flex-1 text-[10px] uppercase tracking-[0.22em] text-primary-700 font-bold">
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
            <span className="h-3 w-px bg-gray-300" />
            <span className="flex-1 text-right text-[10px] text-gray-500 tabular-nums font-medium">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>

          {/* Hero band with gauge */}
          <div
            className="relative pt-5 pb-5"
            style={{
              background: 'linear-gradient(180deg, #F8FAFA 0%, #FFFFFF 100%)',
            }}
          >
            {/* Watermark diamond */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <pattern id="heroDiamond" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="#1E7A73" />
              </pattern>
              <rect width="100" height="100" fill="url(#heroDiamond)" />
            </svg>

            <div className="relative flex flex-col items-center">
              <DualRingGauge score={pointsBreakdown.percentage} meta={meta} />
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold mt-3">
                Nota Atual
              </p>
              <div className="mt-3 flex items-start justify-center gap-2.5">
                <div className="text-center">
                  <p className="text-[13px] font-bold text-gray-700 tabular-nums" style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>{formatPts(pointsBreakdown.earned)}</p>
                  <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Obtido</p>
                </div>
                <span className="w-px self-stretch bg-gray-200" />
                <div className="text-center">
                  <p className="text-[13px] font-bold text-gray-700 tabular-nums" style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>{formatPts(pointsMeta)}</p>
                  <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Meta</p>
                </div>
                <span className="w-px self-stretch bg-gray-200" />
                <div className="text-center">
                  <p className="text-[13px] font-bold text-gray-700 tabular-nums" style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>{formatPts(pointsBreakdown.max)}</p>
                  <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Máximo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Rest of content */}
          <div className="p-5 flex flex-col gap-4">
            {/* Progress — colored ruler ticks by answer, split into 2 rows */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1.5">
                Progresso ({answeredCount}/{totalQuestions})
              </p>
              {(() => {
                const half = Math.ceil(totalQuestions / 2)
                const rows = [
                  Array.from({ length: half }).map((_, i) => i),
                  Array.from({ length: totalQuestions - half }).map((_, i) => i + half),
                ]
                return (
                  <div className="flex flex-col gap-2">
                    {rows.map((row, rowIdx) => (
                      <div key={rowIdx} className="flex items-end gap-[1.5px]">
                        {row.map((i) => {
                          const answer = props.questionAnswers?.[i] ?? null
                          const isAnswered = answer !== null
                          const tickColor =
                            answer === 'yes' ? '#00A650'
                            : answer === 'partial' ? '#DDDD03'
                            : answer === 'no' ? '#CE3C5A'
                            : answer === 'na' ? '#A3ADAC'
                            : '#E4E8E8'
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                              <span
                                className="w-full rounded-sm"
                                style={{
                                  height: isAnswered ? 20 : 8,
                                  background: tickColor,
                                  transition: 'height 0.3s ease, background 0.3s ease',
                                }}
                              />
                              <span className="text-[6px] text-gray-400 tabular-nums leading-none">{i + 1}</span>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* Team compact */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1.5">
                Equipe Presente ({presentMembers.length}/{teamMembers.length})
              </p>
              <div className="grid grid-cols-9 gap-1">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'aspect-square rounded-full flex items-center justify-center text-[8px] font-bold',
                        isPresent
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-300',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Criteria — numbered, bold icons, prominent */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">
                  Critérios de Avanço
                </p>
                <div className="flex flex-col gap-2">
                  {criteriaRows.map((row, i) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[9px] font-bold text-gray-300 tabular-nums w-4">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('text-[12px] flex-1', row.ok ? 'text-gray-700' : 'text-rose-400')}>
                        {row.label}
                      </span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: row.ok ? 'rgba(0,166,80,0.12)' : 'rgba(206,60,90,0.12)',
                          color: row.ok ? '#00A650' : '#CE3C5A',
                        }}
                      >
                        {row.ok ? <CheckIcon size={16} /> : <XIcon size={16} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nav — Chromatic Pulse style colored section cards */}
            <div className="mt-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1.5">
                Grupos
              </p>
              <div className="flex flex-col gap-1.5">
                {sections.map((sec, idx) => {
                  const pct = Math.min(Math.max(sec.percentageOfMax, 0), 100)
                  return (
                    <button
                      key={sec.title}
                      onClick={() => onScrollToSection(idx)}
                      className="text-left rounded-xl py-2.5 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="text-[11px] font-bold truncate"
                          style={{ color: sec.color }}
                        >
                          {sec.title}
                        </p>
                        <span className="text-[10px] font-black tabular-nums" style={{ color: sec.color }}>
                          {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full mt-1.5" style={{ background: `${sec.color}25` }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: sec.color }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 tabular-nums mt-1">
                        {sec.answeredCount}/{sec.totalCount} perguntas · {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Finalize — gradient teal → green (Chromatic Pulse style) */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className="w-full h-11 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{
                background: canFinalize
                  ? 'linear-gradient(135deg, #1E7A73 0%, #0D9488 50%, #00A650 100%)'
                  : '#CDD4D3',
                boxShadow: canFinalize
                  ? '0 4px 16px rgba(30,122,115,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : undefined,
              }}
            >
              <CheckCircleIcon size={16} />
              Finalizar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V6 — Soft Depth Neo (refined neumorphism — Notion Calendar vibe)
// Sutil depth, contraste preservado, cinzas tintados + teal primary.
// ---------------------------------------------------------------------------

function NeoGauge({
  score,
  meta,
  size = 110,
}: {
  score: number
  meta: number
  size?: number
}) {
  const stroke = 8
  const cx = size / 2
  const cy = size / 2
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const scorePct = Math.min(Math.max(score, 0), 100) / 100
  const offset = circ * (1 - scorePct)
  const scoreColor = getScoreColor(score)

  return (
    <div
      className="relative rounded-full flex items-center justify-center"
      style={{
        width: size + 14,
        height: size + 14,
        background: '#EEF2F1',
        boxShadow:
          'inset 3px 3px 6px rgba(16,55,52,0.08), inset -3px -3px 6px rgba(255,255,255,0.9)',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D9E0DF" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={scoreColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-extrabold text-gray-800 tabular-nums leading-none"
          style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 30 }}
        >
          {Math.round(score)}
          <span className="text-base text-gray-400 font-bold ml-0.5">%</span>
        </span>
        <span className="text-[8px] uppercase tracking-[0.18em] text-gray-500 font-semibold mt-0.5">
          Meta {meta}%
        </span>
      </div>
    </div>
  )
}

function VariantS6(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const progressPct = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="rounded-3xl p-5 flex flex-col gap-5"
          style={{
            background: '#EEF2F1',
            boxShadow:
              '8px 8px 20px rgba(16,55,52,0.09), -8px -8px 20px rgba(255,255,255,0.95)',
          }}
        >
          {/* Score block */}
          <div className="flex flex-col items-center">
            <NeoGauge score={score} meta={meta} />
            <p className="text-[10px] text-gray-600 tabular-nums mt-3">
              {formatPts(pointsBreakdown.earned)}/{formatPts(pointsBreakdown.max)} pts
              <span className="text-gray-400"> · meta {formatPts(pointsMeta)}</span>
            </p>
          </div>

          {/* Progress as inset track */}
          <div
            className="rounded-full p-1"
            style={{
              background: '#E4E8E8',
              boxShadow:
                'inset 2px 2px 4px rgba(16,55,52,0.1), inset -1px -1px 2px rgba(255,255,255,0.6)',
            }}
          >
            <div className="h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #1E7A73, #3AA39C)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-600 text-center -mt-3 tabular-nums">
            {answeredCount} de {totalQuestions} perguntas
          </p>

          {/* Team */}
          <div>
            <p className="text-[10px] font-semibold text-gray-700 mb-2">
              Equipe Presente
            </p>
            <div className="flex flex-wrap gap-1.5">
              {teamMembers.map((member) => {
                const isPresent = presentMembers.includes(member.name)
                return (
                  <div
                    key={member.id}
                    title={member.name}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{
                      background: isPresent ? '#D7E9E5' : '#EEF2F1',
                      color: isPresent ? '#104A46' : '#A3ADAC',
                      boxShadow: isPresent
                        ? '3px 3px 6px rgba(16,55,52,0.1), -2px -2px 4px rgba(255,255,255,0.9)'
                        : 'inset 1.5px 1.5px 3px rgba(16,55,52,0.06), inset -1.5px -1.5px 3px rgba(255,255,255,0.8)',
                    }}
                  >
                    {getInitials(member.name)}
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-gray-500 mt-2 tabular-nums">
              {presentMembers.length}/{teamMembers.length} presentes
            </p>
          </div>

          {/* Criteria */}
          {evalType === 'audit' && criteriaRows.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-2">
                Critérios de Avanço
              </p>
              <div className="flex flex-col gap-2">
                {criteriaRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-3 h-9 rounded-xl text-[11px] text-gray-700"
                    style={{
                      background: '#EEF2F1',
                      boxShadow:
                        'inset 1.5px 1.5px 3px rgba(16,55,52,0.06), inset -1.5px -1.5px 3px rgba(255,255,255,0.8)',
                    }}
                  >
                    <span>{row.label}</span>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: row.ok ? '#D7F0DE' : '#F8DDE3',
                        color: row.ok ? '#00A650' : '#CE3C5A',
                        boxShadow:
                          '2px 2px 4px rgba(16,55,52,0.08), -1.5px -1.5px 3px rgba(255,255,255,0.9)',
                      }}
                    >
                      {row.ok ? <CheckIcon size={11} /> : <XIcon size={11} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick navigation */}
          <div>
            <p className="text-[10px] font-semibold text-gray-700 mb-2">
              Navegação Rápida
            </p>
            <div className="flex flex-col gap-2">
              {sections.map((sec, idx) => (
                <button
                  key={sec.title}
                  onClick={() => onScrollToSection(idx)}
                  className="flex items-center gap-2.5 h-11 px-3 rounded-xl text-left transition-all"
                  style={{
                    background: '#EEF2F1',
                    boxShadow:
                      '3px 3px 6px rgba(16,55,52,0.08), -3px -3px 6px rgba(255,255,255,0.9)',
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow =
                      'inset 2px 2px 4px rgba(16,55,52,0.08), inset -2px -2px 4px rgba(255,255,255,0.8)'
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow =
                      '3px 3px 6px rgba(16,55,52,0.08), -3px -3px 6px rgba(255,255,255,0.9)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      '3px 3px 6px rgba(16,55,52,0.08), -3px -3px 6px rgba(255,255,255,0.9)'
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: sec.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800 truncate">
                      {sec.title}
                    </p>
                    <p className="text-[9px] text-gray-500 tabular-nums mt-0.5">
                      {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts
                    </p>
                  </div>
                  <div
                    className="px-2 py-1 rounded-md text-[10px] font-bold tabular-nums text-gray-700"
                    style={{
                      background: '#E4E8E8',
                      boxShadow:
                        'inset 1.5px 1.5px 3px rgba(16,55,52,0.08), inset -1px -1px 2px rgba(255,255,255,0.7)',
                    }}
                  >
                    {Math.round(sec.percentageOfMax)}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Finalize — raised button */}
          <button
            onClick={onFinalize}
            disabled={!canFinalize}
            className="w-full h-12 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: canFinalize
                ? 'linear-gradient(180deg, #1E7A73 0%, #155F59 100%)'
                : '#CDD4D3',
              boxShadow: canFinalize
                ? '5px 5px 10px rgba(16,55,52,0.2), -3px -3px 6px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '3px 3px 6px rgba(16,55,52,0.08), -3px -3px 6px rgba(255,255,255,0.9)',
            }}
          >
            <CheckCircleIcon size={16} />
            Finalizar Avaliação
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V7 — Chromatic Pulse (multi-color harmony — cada grupo tem identidade)
// Gradient mesh sutil no topo + tiles KPI + cards coloridos por seção.
// ---------------------------------------------------------------------------

function VariantS7(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const progressPct = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="rounded-2xl bg-white overflow-hidden"
          style={{
            border: '1px solid #F3F4F6',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.04), 0 10px 30px rgba(30,122,115,0.06)',
          }}
        >
          {/* Top hero with mesh gradient */}
          <div
            className="relative p-5"
            style={{
              background: [
                'radial-gradient(circle at 20% 20%, rgba(13,148,136,0.14), transparent 45%)',
                'radial-gradient(circle at 80% 10%, rgba(99,102,241,0.12), transparent 45%)',
                'radial-gradient(circle at 20% 90%, rgba(245,158,11,0.10), transparent 45%)',
                'radial-gradient(circle at 85% 90%, rgba(239,68,68,0.10), transparent 45%)',
                'white',
              ].join(','),
            }}
          >
            {/* Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative" style={{ width: 120, height: 120 }}>
                <svg width={120} height={120} viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="chromaticStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0D9488" />
                      <stop offset="33%" stopColor="#6366F1" />
                      <stop offset="66%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#F1F4F4" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="url(#chromaticStroke)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - Math.min(Math.max(score, 0), 100) / 100)}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-extrabold text-gray-900 tabular-nums leading-none"
                    style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 32 }}
                  >
                    {Math.round(score)}
                    <span className="text-sm text-gray-400 font-bold ml-0.5">%</span>
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">
                    Meta {meta}%
                  </span>
                </div>
              </div>

              {/* 3 KPI tiles */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4">
                <div
                  className="rounded-xl p-2.5 text-center"
                  style={{ background: 'rgba(16,166,80,0.08)', border: '1px solid rgba(16,166,80,0.18)' }}
                >
                  <p className="text-[8px] uppercase tracking-wider font-bold text-green-700">Obtido</p>
                  <p className="text-lg font-extrabold text-green-700 tabular-nums leading-tight">
                    {formatPts(pointsBreakdown.earned)}
                  </p>
                </div>
                <div
                  className="rounded-xl p-2.5 text-center"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
                >
                  <p className="text-[8px] uppercase tracking-wider font-bold text-amber-700">Meta</p>
                  <p className="text-lg font-extrabold text-amber-700 tabular-nums leading-tight">
                    {formatPts(pointsMeta)}
                  </p>
                </div>
                <div
                  className="rounded-xl p-2.5 text-center"
                  style={{ background: 'rgba(30,122,115,0.08)', border: '1px solid rgba(30,122,115,0.18)' }}
                >
                  <p className="text-[8px] uppercase tracking-wider font-bold text-primary-700">Máximo</p>
                  <p className="text-lg font-extrabold text-primary-700 tabular-nums leading-tight">
                    {formatPts(pointsBreakdown.max)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of content */}
          <div className="px-5 pb-5 flex flex-col gap-4">
            {/* Segmented progress bar per group */}
            <div>
              <div className="flex items-center gap-[2px] mb-1.5">
                {sections.map((sec) => (
                  <p
                    key={sec.title}
                    className="flex-1 text-center text-[8px] uppercase tracking-wider font-bold truncate"
                    style={{ color: sec.color }}
                  >
                    {sec.title.slice(0, 4).toUpperCase()}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-[2px] h-1.5">
                {sections.map((sec) => {
                  const pct = Math.min(Math.max(sec.percentageOfMax, 0), 100)
                  return (
                    <div
                      key={sec.title}
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ background: `${sec.color}20` }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: sec.color,
                        }}
                      />
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-1.5 tabular-nums">
                {answeredCount} de {totalQuestions} · {Math.round(progressPct)}% completo
              </p>
            </div>

            {/* Team */}
            <div>
              <p className="text-[10px] font-semibold text-gray-600 mb-1.5">
                Equipe Presente · {presentMembers.length}/{teamMembers.length}
              </p>
              <div className="flex flex-wrap gap-1">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold',
                        isPresent
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-300',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Criteria */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div className="flex items-center gap-2">
                {criteriaRows.map((row) => (
                  <div
                    key={row.label}
                    className={cn(
                      'flex-1 rounded-lg px-2 py-1.5 text-[9px] font-semibold flex items-center gap-1.5',
                      row.ok ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-600',
                    )}
                    title={row.label}
                  >
                    {row.ok ? <CheckIcon size={11} /> : <XIcon size={11} />}
                    <span className="truncate">{row.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Nav — colored section cards */}
            <div>
              <p className="text-[10px] font-semibold text-gray-600 mb-2">
                Grupos
              </p>
              <div className="flex flex-col gap-1.5">
                {sections.map((sec, idx) => {
                  const pct = Math.min(Math.max(sec.percentageOfMax, 0), 100)
                  return (
                    <button
                      key={sec.title}
                      onClick={() => onScrollToSection(idx)}
                      className="text-left rounded-xl px-3 py-2.5 transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="text-[11px] font-bold truncate"
                          style={{ color: sec.color }}
                        >
                          {sec.title}
                        </p>
                        <span className="text-[10px] font-black tabular-nums" style={{ color: sec.color }}>
                          {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full mt-1.5" style={{ background: `${sec.color}25` }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: sec.color }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-500 tabular-nums mt-1">
                        {sec.answeredCount}/{sec.totalCount} perguntas · {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Finalize — gradient teal → green */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className="w-full h-11 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: canFinalize
                  ? 'linear-gradient(135deg, #1E7A73 0%, #0D9488 50%, #00A650 100%)'
                  : '#CDD4D3',
                boxShadow: canFinalize
                  ? '0 4px 16px rgba(30,122,115,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : undefined,
              }}
            >
              <CheckCircleIcon size={16} />
              Finalizar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// V8 — Midnight Obsidian (dark luxury — Linear / Arc / Vercel inspired)
// Confinado ao card, teal-esmerald (#14B8A6) como único pop color.
// ---------------------------------------------------------------------------

function ObsidianGauge({
  score,
  meta,
  size = 130,
}: {
  score: number
  meta: number
  size?: number
}) {
  const stroke = 8
  const cx = size / 2
  const cy = size / 2
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const scorePct = Math.min(Math.max(score, 0), 100) / 100
  const offset = circ * (1 - scorePct)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="obsidianGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#14B8A6"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#obsidianGlow)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black text-white tabular-nums leading-none"
          style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 38 }}
        >
          {Math.round(score)}
          <span className="text-lg text-white/40 font-bold ml-0.5">%</span>
        </span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-semibold mt-1">
          Meta {meta}%
        </span>
      </div>
    </div>
  )
}

function VariantS8(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const progressPct = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0F1A19 0%, #0A1211 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow:
              '0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="p-5 flex flex-col gap-5">
            {/* Score gauge */}
            <div className="flex flex-col items-center">
              <ObsidianGauge score={score} meta={meta} />
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold mt-3">
                Nota Atual
              </p>
              <p
                className="mt-2 tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: 11 }}
              >
                <span style={{ color: '#14B8A6' }}>{formatPts(pointsBreakdown.earned)}</span>
                <span className="text-white/25 mx-1">/</span>
                <span style={{ color: '#14B8A6' }}>{formatPts(pointsMeta)}</span>
                <span className="text-white/25 mx-1">/</span>
                <span style={{ color: '#14B8A6' }}>{formatPts(pointsBreakdown.max)}</span>
                <span className="text-white/40 ml-1.5">PTS</span>
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />

            {/* Progress */}
            <div>
              <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    background: '#14B8A6',
                    boxShadow: '0 0 8px rgba(20,184,166,0.5)',
                  }}
                />
              </div>
              <p
                className="text-center mt-1.5 tabular-nums text-white/50"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: 10 }}
              >
                {answeredCount} / {totalQuestions} perguntas
              </p>
            </div>

            {/* Team */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] font-semibold text-white/50 mb-2">
                Equipe Presente
              </p>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: isPresent ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.04)',
                        border: isPresent
                          ? '1px solid rgba(20,184,166,0.6)'
                          : '1px solid rgba(255,255,255,0.06)',
                        color: isPresent ? '#5EEAD4' : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p
                className="text-[10px] mt-2 tabular-nums text-white/40"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
              >
                {presentMembers.length}/{teamMembers.length} PRESENTES
              </p>
            </div>

            {/* Criteria */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <>
                <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] font-semibold text-white/50 mb-2">
                    Critérios de Avanço
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {criteriaRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between px-3 h-8 rounded-md text-[11px]"
                        style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        <span>{row.label}</span>
                        {row.ok ? (
                          <CheckIcon size={12} style={{ color: '#14B8A6' }} />
                        ) : (
                          <XIcon size={12} style={{ color: '#F87171' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />

            {/* Quick navigation */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] font-semibold text-white/50 mb-2">
                Navegação Rápida
              </p>
              <div className="flex flex-col gap-1">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors"
                    style={{
                      borderLeft: `2px solid ${sec.color}`,
                      background: 'rgba(255,255,255,0.02)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <span className="flex-1 text-[12px] font-semibold text-white/85 truncate">
                      {sec.title}
                    </span>
                    <span
                      className="text-[9px] tabular-nums text-white/40"
                      style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
                    >
                      {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)}p · {Math.round(sec.percentageOfMax)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />

            {/* Finalize — solid teal-esmerald button */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className="w-full h-11 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canFinalize ? '#14B8A6' : 'rgba(20,184,166,0.3)',
                color: '#0A1211',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                boxShadow: canFinalize
                  ? '0 4px 20px rgba(20,184,166,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : undefined,
              }}
            >
              <CheckCircleIcon size={16} />
              Finalizar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// EDITORIAL MAGAZINE SERIES (derived from V3)
// ===========================================================================
// Shared editorial helpers — rulers, dual-ring, nav row with mini-ring.
// All 4 variants (S3, S3a, S3b, S3c, S3d) share the DNA of V3:
// Plus Jakarta Sans 900, caps tracking, baseline-grid rulers, header bar,
// hard-edged finalize. Variants incorporate elements from V5 (dual-ring gauge
// + points ticker + mini-ring nav rows) selectively to match each concept.
// ---------------------------------------------------------------------------

/** Editorial dual-ring gauge (outer score + inner dashed meta). */
function EditorialDualRing({
  score,
  meta,
  size = 130,
  strokeOuter = 8,
  strokeInner = 2.5,
}: {
  score: number
  meta: number
  size?: number
  strokeOuter?: number
  strokeInner?: number
}) {
  const cx = size / 2
  const cy = size / 2
  const rOuter = (size - strokeOuter) / 2
  const rInner = rOuter - strokeOuter - 2
  const circOuter = 2 * Math.PI * rOuter
  const circInner = 2 * Math.PI * rInner
  const scorePct = Math.min(Math.max(score, 0), 100) / 100
  const metaPct = Math.min(Math.max(meta, 0), 100) / 100
  const outerOffset = circOuter * (1 - scorePct)
  const innerOffset = circInner * (1 - metaPct)
  const scoreColor = getScoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer track */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#E4E8E8" strokeWidth={strokeOuter} />
        {/* Outer score arc */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeOuter}
          strokeLinecap="round"
          strokeDasharray={circOuter}
          strokeDashoffset={outerOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Inner meta track (dashed) */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="#CDD4D3"
          strokeWidth={strokeInner}
          strokeDasharray="2 3"
          opacity={0.5}
        />
        {/* Inner meta arc */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="#7A8584"
          strokeWidth={strokeInner}
          strokeDasharray={circInner}
          strokeDashoffset={innerOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black text-gray-900 tabular-nums leading-none"
          style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: size * 0.3 }}
        >
          {Math.round(score)}
          <span className="text-gray-300 font-bold" style={{ fontSize: size * 0.14 }}>%</span>
        </span>
        <span className="text-[8px] uppercase tracking-[0.22em] text-gray-400 font-bold mt-1">
          Meta {meta}%
        </span>
      </div>
    </div>
  )
}

/** Editorial points ticker (OBT · META · MÁX in mono). */
function EditorialTicker({
  earned,
  metaPts,
  max,
  mono = true,
}: {
  earned: number
  metaPts: number
  max: number
  mono?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <p
        className="tabular-nums text-gray-700"
        style={{
          fontFamily: mono ? 'JetBrains Mono, Fira Code, monospace' : 'Inter, system-ui',
          fontSize: 11,
          letterSpacing: mono ? 0 : '0.02em',
        }}
      >
        <span className="font-bold">{formatPts(earned)}</span>
        <span className="text-gray-300 mx-1.5">/</span>
        <span className="font-bold">{formatPts(metaPts)}</span>
        <span className="text-gray-300 mx-1.5">/</span>
        <span className="font-bold">{formatPts(max)}</span>
        <span className="text-gray-400 ml-2 text-[9px]">PTS</span>
      </p>
      <p className="text-[8px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
        Obtido · Meta · Máximo
      </p>
    </div>
  )
}

/** Editorial progress ruler — N numbered ticks. */
function EditorialProgressRuler({
  answered,
  total,
  variant = 'flat',
}: {
  answered: number
  total: number
  variant?: 'flat' | 'varied'
}) {
  return (
    <div className="flex items-end gap-[2px] h-6">
      {Array.from({ length: total }).map((_, i) => {
        // "varied" adds subtle organic height jitter for sketch feel
        const offset = variant === 'varied' ? (i % 3) * 0.5 : 0
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <span
              className={cn(
                'w-full rounded-sm transition-all',
                i < answered ? 'bg-primary-700' : 'bg-gray-200',
              )}
              style={{ height: i < answered ? 16 + offset : 8 + offset }}
            />
            <span className="text-[7px] text-gray-400 tabular-nums leading-none">{i + 1}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Editorial section mini-ring (colored per section). */
function SectionMiniRing({
  percent,
  color,
  size = 20,
  strokeWidth = 2.5,
}: {
  percent: number
  color: string
  size?: number
  strokeWidth?: number
}) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const clamped = Math.min(Math.max(percent, 0), 100) / 100
  const offset = circ * (1 - clamped)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E8E8" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// S3a — Editorial Dossier
// O "arquivo oficial" — formal, header expandido, label NOTA rotacionado,
// dual-ring centralizado, numeração editorial + mini-ring na nav.
// ---------------------------------------------------------------------------

function VariantS3a(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="bg-white overflow-hidden"
          style={{
            borderRadius: 6,
            border: '0.5px solid #E4E8E8',
            boxShadow: '0 2px 14px rgba(16,55,52,0.06)',
          }}
        >
          {/* Expanded editorial header bar — 3 cols with vertical separators */}
          <div className="bg-[#103734] px-4 py-2 flex items-center">
            <span
              className="flex-1 text-[9px] uppercase tracking-[0.24em] text-white/90 font-bold"
              style={{ fontFamily: 'Plus Jakarta Sans, Inter' }}
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="flex-1 text-center text-[9px] uppercase tracking-[0.2em] text-white/70 tabular-nums">
              {today}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="flex-1 text-right text-[9px] uppercase tracking-[0.2em] text-white/70">
              Dossiê
            </span>
          </div>

          <div className="p-5">
            {/* Hero editorial — rotated label + dual-ring gauge */}
            <div className="relative">
              <div className="h-px bg-gray-300" />
              <div className="flex items-center py-4 gap-3">
                <span
                  className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.28em]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Nota
                </span>
                <div className="flex-1 flex justify-center">
                  <EditorialDualRing score={score} meta={meta} size={130} />
                </div>
              </div>
              <div className="h-px bg-gray-300" />
              {/* Ticker — imported from S5 concept */}
              <div className="pt-3 pb-1">
                <EditorialTicker
                  earned={pointsBreakdown.earned}
                  metaPts={pointsMeta}
                  max={pointsBreakdown.max}
                />
              </div>
            </div>

            {/* Progress ruler */}
            <div className="mt-5">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Progresso
              </p>
              <EditorialProgressRuler answered={answeredCount} total={totalQuestions} />
            </div>

            {/* Team editorial grid */}
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Equipe
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'h-6 flex items-center justify-center text-[8px] font-bold tracking-wide',
                        isPresent ? 'text-primary-800' : 'text-gray-300',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-2 tabular-nums text-center">
                {presentMembers.length}/{teamMembers.length} presentes
              </p>
            </div>

            {/* Criteria (numbered list) */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                  Critérios
                </p>
                <div className="flex flex-col">
                  {criteriaRows.map((row, i) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-[9px] font-bold text-gray-400 tabular-nums w-5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('text-[11px] flex-1', row.ok ? 'text-gray-800' : 'text-gray-400')}>
                        {row.label}
                      </span>
                      {row.ok ? (
                        <CheckIcon size={12} className="text-green-600" />
                      ) : (
                        <XIcon size={12} className="text-rose-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nav — hybrid: numeração editorial + mini-ring do S5 */}
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Seções
              </p>
              <div className="flex flex-col">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0 text-left w-full"
                  >
                    <span
                      className="font-black text-gray-200 tabular-nums leading-none w-7"
                      style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 22 }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <SectionMiniRing percent={sec.percentageOfMax} color={sec.color} size={22} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                        {sec.title}
                      </p>
                      <p
                        className="text-[9px] text-gray-500 mt-0.5 tabular-nums"
                        style={{ fontStyle: 'italic' }}
                      >
                        {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts · {Math.round(sec.percentageOfMax)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Finalize hard-edge widest tracking */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className={cn(
                'mt-6 w-full h-11 text-[10px] font-bold uppercase tracking-[0.28em] transition-colors flex items-center justify-center gap-2',
                canFinalize
                  ? 'bg-[#103734] text-white hover:bg-[#1E7A73] cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              )}
              style={{ borderRadius: 0 }}
            >
              Finalizar Dossiê →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// S3b — Editorial Broadsheet
// Jornal broadsheet vintage — big-number à esquerda + gauge à direita inline,
// masthead, double divider, key statistics box, colunas 2-col, nav romana.
// ---------------------------------------------------------------------------

function VariantS3b(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="bg-white overflow-hidden"
          style={{
            borderRadius: 4,
            border: '0.5px solid #D6DCDC',
            boxShadow: '0 2px 16px rgba(16,55,52,0.07)',
          }}
        >
          <div className="p-5">
            {/* Masthead — newspaper style */}
            <div className="text-center pb-3">
              <p
                className="text-[11px] font-black uppercase tracking-[0.32em] text-gray-900"
                style={{ fontFamily: 'Plus Jakarta Sans, Inter' }}
              >
                Avaliação
              </p>
              <p className="text-[8px] text-gray-400 tabular-nums mt-0.5" style={{ fontStyle: 'italic' }}>
                Edição · {today} · {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
              </p>
            </div>

            {/* Double divider */}
            <div className="h-px bg-gray-300" />
            <div className="h-px bg-gray-300 mt-[2px]" />

            {/* Hero asymmetric — big-number left + dual-ring right */}
            <div className="flex items-center gap-4 py-5">
              <div className="flex-1">
                <span
                  className="font-black text-gray-900 tabular-nums leading-none"
                  style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 72 }}
                >
                  {Math.round(score)}
                </span>
                <span className="text-2xl font-bold text-gray-300">%</span>
                <p
                  className="text-[9px] uppercase tracking-[0.22em] text-gray-500 font-bold mt-1"
                >
                  Nota · Meta {meta}%
                </p>
              </div>
              <div className="h-[72px] w-px bg-gray-300" />
              <EditorialDualRing score={score} meta={meta} size={88} strokeOuter={6} strokeInner={2} />
            </div>

            {/* Double divider bottom */}
            <div className="h-[2px] bg-gray-300" />
            <div className="h-px bg-gray-300 mt-[2px]" />

            {/* Key Statistics box — 3 cols */}
            <div
              className="mt-4 border border-gray-300 grid grid-cols-3"
              style={{ borderRadius: 2 }}
            >
              <div className="p-2.5 text-center border-r border-gray-300">
                <p className="text-[7px] uppercase tracking-[0.2em] text-gray-500 font-bold">Obtido</p>
                <p className="text-base font-black text-gray-900 tabular-nums mt-0.5 leading-none">
                  {formatPts(pointsBreakdown.earned)}
                </p>
              </div>
              <div className="p-2.5 text-center border-r border-gray-300">
                <p className="text-[7px] uppercase tracking-[0.2em] text-gray-500 font-bold">Meta</p>
                <p className="text-base font-black text-gray-900 tabular-nums mt-0.5 leading-none">
                  {formatPts(pointsMeta)}
                </p>
              </div>
              <div className="p-2.5 text-center">
                <p className="text-[7px] uppercase tracking-[0.2em] text-gray-500 font-bold">Máximo</p>
                <p className="text-base font-black text-gray-900 tabular-nums mt-0.5 leading-none">
                  {formatPts(pointsBreakdown.max)}
                </p>
              </div>
              <div className="col-span-3 border-t border-gray-300 px-2.5 py-1.5 text-center">
                <p className="text-[8px] uppercase tracking-[0.18em] text-gray-400" style={{ fontStyle: 'italic' }}>
                  Estatísticas-chave · pontos (pts)
                </p>
              </div>
            </div>

            {/* Progress ruler */}
            <div className="mt-5">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Progresso
              </p>
              <EditorialProgressRuler answered={answeredCount} total={totalQuestions} />
            </div>

            {/* 2-col layout: team | criteria (broadsheet columns) */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              {/* Team column */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                  Equipe
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {teamMembers.map((member) => {
                    const isPresent = presentMembers.includes(member.name)
                    return (
                      <div
                        key={member.id}
                        title={member.name}
                        className={cn(
                          'h-5 flex items-center justify-center text-[7px] font-bold tracking-wide',
                          isPresent ? 'text-primary-800' : 'text-gray-300',
                        )}
                      >
                        {getInitials(member.name)}
                      </div>
                    )
                  })}
                </div>
                <p className="text-[8px] uppercase text-gray-400 mt-1.5 tabular-nums">
                  {presentMembers.length}/{teamMembers.length}
                </p>
              </div>

              {/* Criteria column */}
              {evalType === 'audit' && criteriaRows.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                    Critérios
                  </p>
                  <div className="flex flex-col gap-1">
                    {criteriaRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-1.5"
                      >
                        {row.ok ? (
                          <CheckIcon size={10} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <XIcon size={10} className="text-rose-500 flex-shrink-0" />
                        )}
                        <span className={cn('text-[10px] truncate', row.ok ? 'text-gray-700' : 'text-gray-400')}>
                          {row.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mt-5 h-px bg-gray-300" />
            <div className="h-px bg-gray-300 mt-[2px]" />

            {/* Nav — "inside this edition" — roman numerals + mini-ring */}
            <div className="mt-4">
              <p
                className="text-[9px] uppercase tracking-[0.24em] font-bold text-gray-500 mb-2 text-center"
                style={{ fontStyle: 'italic' }}
              >
                Nesta Edição
              </p>
              <div className="flex flex-col">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group flex items-center gap-2.5 py-2 text-left w-full border-b border-dotted border-gray-200 last:border-b-0"
                  >
                    <span
                      className="font-bold text-gray-400 tabular-nums w-6 text-right"
                      style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 11, fontStyle: 'italic' }}
                    >
                      {roman[idx]}
                    </span>
                    <SectionMiniRing percent={sec.percentageOfMax} color={sec.color} size={18} strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                        {sec.title}
                      </p>
                      <p className="text-[9px] text-gray-500 tabular-nums">
                        {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)}p · {Math.round(sec.percentageOfMax)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Double divider */}
            <div className="mt-5 h-px bg-gray-300" />
            <div className="h-[2px] bg-gray-300 mt-[2px]" />

            {/* Finalize as edition footer */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className={cn(
                'mt-4 w-full h-10 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors flex items-center justify-center',
                canFinalize
                  ? 'bg-[#103734] text-white hover:bg-[#1E7A73] cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              )}
              style={{ borderRadius: 0 }}
            >
              Publicar Edição
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// S3c — Editorial Hybrid Hero
// Casamento direto entre S3 Editorial + S5 Gauge Hero — rulers editoriais,
// gauge protagonista no topo, nav com mini-rings + hairline dividers.
// ---------------------------------------------------------------------------

function VariantS3c(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="bg-white overflow-hidden"
          style={{
            borderRadius: 6,
            border: '0.5px solid #E4E8E8',
            boxShadow: '0 2px 16px rgba(16,55,52,0.06)',
          }}
        >
          {/* Classic editorial header bar */}
          <div className="bg-[#103734] px-5 py-2 flex items-center justify-between">
            <span
              className="text-[9px] uppercase tracking-[0.25em] text-white/90 font-bold"
              style={{ fontFamily: 'Plus Jakarta Sans, Inter' }}
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 tabular-nums">
              {today}
            </span>
          </div>

          <div className="p-5">
            {/* Hero band — editorial rules + dual-ring gauge + ticker */}
            <div className="relative">
              <div className="h-px bg-gray-300" />
              <div className="py-5 flex flex-col items-center gap-3">
                <p className="text-[9px] uppercase tracking-[0.28em] font-bold text-primary-700">
                  Nota Atual
                </p>
                <EditorialDualRing score={score} meta={meta} size={150} strokeOuter={9} />
                <EditorialTicker
                  earned={pointsBreakdown.earned}
                  metaPts={pointsMeta}
                  max={pointsBreakdown.max}
                />
              </div>
              <div className="h-px bg-gray-300" />
            </div>

            {/* Progress ruler */}
            <div className="mt-5">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Progresso
              </p>
              <EditorialProgressRuler answered={answeredCount} total={totalQuestions} />
            </div>

            {/* Team grid */}
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Equipe
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className={cn(
                        'h-6 flex items-center justify-center text-[8px] font-bold tracking-wide',
                        isPresent ? 'text-primary-800' : 'text-gray-300',
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400 mt-2 tabular-nums text-center">
                {presentMembers.length}/{teamMembers.length} presentes
              </p>
            </div>

            {/* Criteria — numbered list */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                  Critérios
                </p>
                <div className="flex flex-col">
                  {criteriaRows.map((row, i) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-[9px] font-bold text-gray-400 tabular-nums w-5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={cn('text-[11px] flex-1', row.ok ? 'text-gray-800' : 'text-gray-400')}>
                        {row.label}
                      </span>
                      {row.ok ? (
                        <CheckIcon size={12} className="text-green-600" />
                      ) : (
                        <XIcon size={12} className="text-rose-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nav — S5 style (mini-ring + title + pts) but with editorial hairline */}
            <div className="mt-6">
              <p className="text-[9px] uppercase tracking-[0.22em] font-bold text-gray-500 mb-2">
                Navegação
              </p>
              <div className="flex flex-col">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group flex items-center gap-2.5 py-2.5 border-b border-gray-100 last:border-b-0 text-left w-full hover:bg-gray-50/50 transition-colors -mx-1 px-1"
                  >
                    <SectionMiniRing percent={sec.percentageOfMax} color={sec.color} size={22} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-900 group-hover:text-primary-700 truncate">
                        {sec.title}
                      </p>
                      <p
                        className="text-[9px] text-gray-500 tabular-nums mt-0.5"
                        style={{ fontStyle: 'italic' }}
                      >
                        {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts · {Math.round(sec.percentageOfMax)}%
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      {sec.answeredCount}/{sec.totalCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Finalize editorial hard-edge */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className={cn(
                'mt-6 w-full h-11 text-[11px] font-bold uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2',
                canFinalize
                  ? 'bg-[#103734] text-white hover:bg-[#1E7A73] cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              )}
              style={{ borderRadius: 0 }}
            >
              Finalizar Avaliação →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// S3d — Editorial Sketch
// Anotações à mão em papel creme — texturas orgânicas, linhas hand-drawn,
// dashed strokes, italic captions, estética de caderno editorial premium.
// ---------------------------------------------------------------------------

/** Hand-drawn ruler with irregular dashed stroke. */
function SketchRule({ dasharray = '4 2 1 3' }: { dasharray?: string }) {
  return (
    <svg width="100%" height="2" className="block">
      <line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="#8B7355"
        strokeWidth="0.8"
        strokeDasharray={dasharray}
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Hand-drawn check icon (wavy stroke). */
function SketchCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7.5 Q4 11, 5.5 9 T11.5 3"
        stroke="#0D9488"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/** Hand-drawn X icon. */
function SketchX() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3 Q7 6, 11 11" stroke="#CE3C5A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 3 Q7 6, 3 11" stroke="#CE3C5A" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/** Sketch dual-ring gauge with irregular dashed stroke (pencil feel). */
function SketchDualRing({ score, meta, size = 130 }: { score: number; meta: number; size?: number }) {
  const strokeOuter = 6
  const cx = size / 2
  const cy = size / 2
  const rOuter = (size - strokeOuter) / 2
  const rInner = rOuter - strokeOuter - 3
  const circOuter = 2 * Math.PI * rOuter
  const circInner = 2 * Math.PI * rInner
  const scorePct = Math.min(Math.max(score, 0), 100) / 100
  const metaPct = Math.min(Math.max(meta, 0), 100) / 100
  const outerOffset = circOuter * (1 - scorePct)
  const innerOffset = circInner * (1 - metaPct)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer track — very faint dashed ring */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#D6CCB4" strokeWidth={strokeOuter - 2} strokeDasharray="1 2" opacity={0.7} />
        {/* Outer score arc — sketch stroke */}
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke="#0D9488"
          strokeWidth={strokeOuter}
          strokeLinecap="round"
          strokeDasharray={`${circOuter * scorePct} ${circOuter}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: 'url(#sketchRoughen)' }}
        />
        {/* Inner meta track (dashed hand-drawn) */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="#A89066"
          strokeWidth="1.2"
          strokeDasharray="3 2 1 2"
          opacity={0.6}
        />
        {/* Inner meta arc */}
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke="#8B7355"
          strokeWidth="1.5"
          strokeDasharray={`${circInner * metaPct} ${circInner}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black tabular-nums leading-none"
          style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontSize: 40, color: '#2C2418' }}
        >
          {Math.round(score)}
          <span className="text-lg font-bold" style={{ color: '#A89066' }}>%</span>
        </span>
        <span
          className="text-[9px] mt-1 font-semibold"
          style={{ fontFamily: 'Plus Jakarta Sans, Inter', fontStyle: 'italic', color: '#6B5739' }}
        >
          meta {meta}%
        </span>
      </div>
    </div>
  )
}

function VariantS3d(props: InternalProps) {
  const {
    score, meta, progress, answeredCount, totalQuestions,
    presentMembers, teamMembers, evalType, eligibility, sections,
    pointsBreakdown, pointsMeta, canFinalize,
    onScrollToSection, onFinalize, className,
  } = props
  const criteriaRows = buildCriteriaRows(evalType, score, meta, eligibility)
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  // Paper-textured palette
  const paper = '#FAF6EC'
  const ink = '#2C2418'
  const inkSoft = '#6B5739'
  const inkFaint = '#A89066'

  return (
    <div className={className}>
      <div className="sticky top-24">
        <div
          className="overflow-hidden relative"
          style={{
            background: `
              radial-gradient(ellipse at top, ${paper} 0%, #F2ECD9 100%)
            `,
            borderRadius: 4,
            border: `0.5px solid ${inkFaint}`,
            boxShadow:
              '0 1px 2px rgba(84,60,20,0.08), 0 6px 20px rgba(84,60,20,0.1), inset 0 0 30px rgba(139,115,85,0.04)',
          }}
        >
          {/* Noise texture overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
            aria-hidden="true"
          >
            <filter id="paperNoise">
              <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="5" />
              <feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 0.6 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#paperNoise)" />
          </svg>

          <div className="relative p-5">
            {/* Hand-drawn manuscript header */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, Inter',
                    color: ink,
                  }}
                >
                  Dossiê · {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
                </span>
                <span
                  className="text-[9px] tabular-nums"
                  style={{ color: inkSoft, fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, Inter' }}
                >
                  {today}
                </span>
              </div>
              <SketchRule dasharray="6 2 1 2 3 2" />
            </div>

            {/* Hero — sketch dual-ring gauge */}
            <div className="relative py-4 flex flex-col items-center">
              <span
                className="text-[10px] uppercase tracking-[0.28em] font-bold mb-2"
                style={{
                  color: inkSoft,
                  fontStyle: 'italic',
                  fontFamily: 'Plus Jakarta Sans, Inter',
                }}
              >
                Nota Atual
              </span>
              <SketchDualRing score={score} meta={meta} />
            </div>

            <SketchRule dasharray="2 3 4 3" />

            {/* Ticker in annotation box (dashed border) */}
            <div
              className="mt-3 mx-2 px-3 py-2.5 text-center"
              style={{
                borderRadius: 3,
                border: `1px dashed ${inkFaint}`,
                background: 'rgba(255,253,244,0.5)',
              }}
            >
              <p
                className="tabular-nums text-[11px]"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace', color: ink }}
              >
                <span className="font-bold">{formatPts(pointsBreakdown.earned)}</span>
                <span style={{ color: inkFaint }} className="mx-1.5">/</span>
                <span className="font-bold">{formatPts(pointsMeta)}</span>
                <span style={{ color: inkFaint }} className="mx-1.5">/</span>
                <span className="font-bold">{formatPts(pointsBreakdown.max)}</span>
                <span className="ml-1.5 text-[9px]" style={{ color: inkSoft }}>pts</span>
              </p>
              <p
                className="text-[8px] mt-0.5 uppercase tracking-[0.2em]"
                style={{ color: inkFaint, fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, Inter' }}
              >
                obtido · meta · máximo
              </p>
            </div>

            {/* Progress — sketch varied ruler */}
            <div className="mt-5">
              <p
                className="text-[9px] uppercase tracking-[0.22em] font-bold mb-2"
                style={{ color: inkSoft, fontFamily: 'Plus Jakarta Sans, Inter' }}
              >
                Progresso
              </p>
              <div className="flex items-end gap-[3px] h-6">
                {Array.from({ length: totalQuestions }).map((_, i) => {
                  const variance = (i * 7) % 3
                  const isDone = i < answeredCount
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <span
                        className="w-full"
                        style={{
                          height: isDone ? 15 + variance : 7 + variance,
                          background: isDone ? '#0D9488' : '#D6CCB4',
                          borderRadius: '1px 1.5px 1px 2px',
                        }}
                      />
                      <span
                        className="text-[7px] tabular-nums leading-none"
                        style={{ color: inkFaint, fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, Inter' }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Team with dashed chips */}
            <div className="mt-5">
              <p
                className="text-[9px] uppercase tracking-[0.22em] font-bold mb-2"
                style={{ color: inkSoft, fontFamily: 'Plus Jakarta Sans, Inter' }}
              >
                Equipe
              </p>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((member) => {
                  const isPresent = presentMembers.includes(member.name)
                  return (
                    <div
                      key={member.id}
                      title={member.name}
                      className="w-7 h-7 flex items-center justify-center text-[9px] font-bold"
                      style={{
                        borderRadius: '50%',
                        border: isPresent ? `1.3px solid #0D9488` : `1px dashed ${inkFaint}`,
                        background: isPresent ? 'rgba(13,148,136,0.08)' : 'transparent',
                        color: isPresent ? '#0D9488' : inkFaint,
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                  )
                })}
              </div>
              <p
                className="text-[9px] mt-2 tabular-nums"
                style={{ color: inkSoft, fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, Inter' }}
              >
                {presentMembers.length}/{teamMembers.length} presentes
              </p>
            </div>

            {/* Criteria — handwritten checklist */}
            {evalType === 'audit' && criteriaRows.length > 0 && (
              <div className="mt-5">
                <p
                  className="text-[9px] uppercase tracking-[0.22em] font-bold mb-2"
                  style={{ color: inkSoft, fontFamily: 'Plus Jakarta Sans, Inter' }}
                >
                  Critérios
                </p>
                <div className="flex flex-col gap-1.5">
                  {criteriaRows.map((row) => (
                    <div key={row.label} className="flex items-center gap-2 py-1">
                      {row.ok ? <SketchCheck /> : <SketchX />}
                      <span
                        className="text-[11px]"
                        style={{
                          color: row.ok ? ink : inkFaint,
                          fontFamily: 'Plus Jakarta Sans, Inter',
                          textDecoration: row.ok ? 'none' : 'line-through',
                          textDecorationColor: inkFaint,
                        }}
                      >
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <SketchRule dasharray="3 2 5 2 1 2" />
            </div>

            {/* Nav — handwritten list with dashed underline on hover */}
            <div className="mt-4">
              <p
                className="text-[9px] uppercase tracking-[0.22em] font-bold mb-2"
                style={{ color: inkSoft, fontFamily: 'Plus Jakarta Sans, Inter' }}
              >
                Seções
              </p>
              <div className="flex flex-col gap-2">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.title}
                    onClick={() => onScrollToSection(idx)}
                    className="group flex items-start gap-2.5 text-left w-full py-1"
                  >
                    <SectionMiniRing percent={sec.percentageOfMax} color={sec.color} size={20} strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-semibold truncate group-hover:underline"
                        style={{
                          color: ink,
                          fontFamily: 'Plus Jakarta Sans, Inter',
                          textDecorationStyle: 'dashed',
                          textUnderlineOffset: 3,
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}. {sec.title}
                      </p>
                      <p
                        className="text-[9px] mt-0.5 tabular-nums"
                        style={{ color: inkSoft, fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, Inter' }}
                      >
                        {formatPts(sec.pointsEarned)}/{formatPts(sec.pointsMax)} pts — {Math.round(sec.percentageOfMax)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <SketchRule dasharray="6 2 1 2 3 2" />
            </div>

            {/* Finalize — stamp style with doble-dashed border */}
            <button
              onClick={onFinalize}
              disabled={!canFinalize}
              className="mt-4 w-full h-12 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: canFinalize ? 'rgba(13,148,136,0.06)' : 'transparent',
                border: canFinalize ? `1.5px dashed #0D9488` : `1px dashed ${inkFaint}`,
                borderRadius: 3,
                color: canFinalize ? '#0D6F68' : inkFaint,
                fontFamily: 'Plus Jakarta Sans, Inter',
                letterSpacing: '0.3em',
                fontSize: 10,
                fontWeight: 800,
                textTransform: 'uppercase',
                boxShadow: canFinalize ? 'inset 0 0 0 2.5px rgba(13,148,136,0.1)' : undefined,
              }}
            >
              ✓ Aprovar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Wrapper
// ---------------------------------------------------------------------------

export function EvalSidebarVariants(props: EvalSidebarVariantsProps) {
  const { variant = 'S1', ...internal } = props
  switch (variant) {
    case 'S1': return <VariantS1 {...internal} />
    case 'S2': return <VariantS2 {...internal} />
    case 'S3': return <VariantS3 {...internal} />
    case 'S3a': return <VariantS3a {...internal} />
    case 'S3b': return <VariantS3b {...internal} />
    case 'S3c': return <VariantS3c {...internal} />
    case 'S3d': return <VariantS3d {...internal} />
    case 'S4': return <VariantS4 {...internal} />
    case 'S5': return <VariantS5 {...internal} />
    case 'S6': return <VariantS6 {...internal} />
    case 'S7': return <VariantS7 {...internal} />
    case 'S8': return <VariantS8 {...internal} />
    default: {
      const _exhaustive: never = variant
      void _exhaustive
      return <VariantS1 {...internal} />
    }
  }
}

