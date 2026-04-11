/**
 * Premium evaluation confirmation modal — unified component for all 3 scenarios:
 * A) Audit + Eligible  → radio selection (advance/maintain) + "Confirmar e Salvar"
 * B) Audit + Not Eligible → criteria list + "Salvar Avaliação"
 * C) Follow-up → simple confirmation + "Salvar Avaliação"
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircleIcon,
  ArrowAdvanceIcon,
  AlertTriangleIcon,
} from '@/assets/icons'
import { getScoreColor } from '@/design-system/tokens'
import { formatPts } from '@/features/evaluation/components/eval-sidebar-variants'
import type { Group, EvaluationType } from '@/types'

interface EvaluationConfirmModalProps {
  group: Group
  evalType: EvaluationType
  score: number
  meta: number
  pointsBreakdown: { earned: number; max: number; percentage: number }
  eligibility: { eligible: boolean; reasons: string[] }
  answeredCount: number
  totalQuestions: number
  presentMembers: string[]
  onConfirm: (decision: 'advance' | 'maintain' | null) => void
  onCancel: () => void
}

/* ────────────────────────────────────────────────────────────
   MINI GAUGE (56px — for summary)
──────────────────────────────────────────────────────────── */

function SummaryGauge({ score, meta, size: sizeProp = 120 }: { score: number; meta: number; size?: number }) {
  const size = sizeProp
  const strokeOuter = Math.round(size * 0.08)
  const strokeInner = Math.round(size * 0.035)
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
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="modalGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#103734" />
            <stop offset="50%" stopColor="#1E7A73" />
            <stop offset="100%" stopColor={scoreColor} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#E4E8E8" strokeWidth={strokeOuter} />
        <circle
          cx={cx} cy={cy} r={rOuter} fill="none"
          stroke="url(#modalGaugeGrad)"
          strokeWidth={strokeOuter} strokeLinecap="round"
          strokeDasharray={circOuter} strokeDashoffset={outerOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx} cy={cy} r={rInner} fill="none"
          stroke="#CDD4D3" strokeWidth={strokeInner}
          strokeDasharray="2 4" strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} opacity={0.6}
        />
        <circle
          cx={cx} cy={cy} r={rInner} fill="none"
          stroke="#A3ADAC" strokeWidth={strokeInner}
          strokeDasharray={circInner} strokeDashoffset={innerOffset}
          strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-black tabular-nums leading-none"
          style={{
            fontFamily: 'Plus Jakarta Sans, Inter',
            fontSize: Math.round(size * 0.22),
            color: score >= meta ? '#065F46' : '#9F1239',
          }}
        >
          {Math.round(score)}
          <span style={{ fontSize: Math.round(size * 0.12), opacity: 0.45 }} className="font-bold ml-0.5">%</span>
        </span>
        <span className="uppercase tracking-[0.2em] text-gray-400 font-semibold" style={{ fontSize: Math.max(7, Math.round(size * 0.065)), marginTop: 2 }}>
          Meta {meta}%
        </span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   RADIO OPTION CARD
──────────────────────────────────────────────────────────── */

function RadioOption({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
  variant: 'advance' | 'maintain'
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 relative flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
        selected
          ? 'border-amber-400 bg-amber-50/60'
          : 'border-gray-200 bg-white hover:border-amber-200'
      }`}
    >
      {/* Check badge — top-right, only when selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-sm"
          >
            <CheckCircleIcon size={12} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? 'bg-amber-500' : 'bg-amber-100'
      }`}>
        <span className={`transition-colors ${selected ? 'text-white' : 'text-amber-600'}`}>{icon}</span>
      </div>

      {/* Text */}
      <div>
        <p className="text-[12px] font-semibold text-gray-800 leading-tight">{title}</p>
        <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────── */

export function EvaluationConfirmModal({
  group,
  evalType,
  score,
  meta,
  pointsBreakdown,
  eligibility,
  answeredCount,
  totalQuestions,
  presentMembers,
  onConfirm,
  onCancel,
}: EvaluationConfirmModalProps) {
  const [decision, setDecision] = useState<'advance' | 'maintain' | null>(null)

  const isAudit = evalType === 'audit'
  const isEligible = isAudit && eligibility.eligible
  const scoreColor = getScoreColor(score)
  const metaPoints = pointsBreakdown.max * (meta / 100)

  const handleConfirm = () => {
    if (isEligible && !decision) return // shouldn't happen — button is disabled
    onConfirm(isEligible ? decision : null)
  }

  // Button label and enabled state
  const confirmLabel = isEligible ? 'Confirmar e Salvar' : 'Salvar Avaliação'
  const confirmEnabled = isEligible ? decision !== null : true

  // Button gradient based on selection
  const confirmGradient = confirmEnabled
    ? 'linear-gradient(135deg, #1E7A73 0%, #0D9488 50%, #00A650 100%)'
    : '#CDD4D3'

  const confirmShadow = confirmEnabled
    ? '0 4px 16px rgba(30,122,115,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
    : 'none'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(16,55,52,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
        className="bg-white rounded-2xl shadow-2xl max-w-[420px] w-full overflow-hidden"
      >
        {/* ============================================================
            HEADER — minimal premium
        ============================================================ */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1E7A73, #0D9488)' }}
            >
              <CheckCircleIcon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">
                Avaliação Concluída
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isAudit ? 'Auditoria' : 'Follow-Up'} · {group.name}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            SCORE HERO — centered gauge + NOTA ATUAL + 3-column points
        ============================================================ */}
        <div className="flex flex-col items-center px-6 pt-4 pb-5">
          <SummaryGauge score={score} meta={meta} />

          {/* 3-column points breakdown */}
          <div className="mt-3 flex items-start justify-center gap-3">
            <div className="text-center">
              <p
                className="text-[13px] font-bold text-gray-700 tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
              >
                {formatPts(pointsBreakdown.earned)}
              </p>
              <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Obtido</p>
            </div>
            <span className="w-px self-stretch bg-gray-200" />
            <div className="text-center">
              <p
                className="text-[13px] font-bold text-gray-700 tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
              >
                {formatPts(metaPoints)}
              </p>
              <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Meta</p>
            </div>
            <span className="w-px self-stretch bg-gray-200" />
            <div className="text-center">
              <p
                className="text-[13px] font-bold text-gray-700 tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
              >
                {formatPts(pointsBreakdown.max)}
              </p>
              <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Máximo</p>
            </div>
            {isAudit && (
              <>
                <span className="w-px self-stretch bg-gray-200" />
                <div className="text-center">
                  <p
                    className="text-[13px] font-bold text-gray-700 tabular-nums"
                    style={{ fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
                  >
                    {group.currentSequence}/{group.maxSequence}
                  </p>
                  <p className="text-[7px] uppercase tracking-[0.18em] text-gray-400 font-semibold mt-0.5">Passo</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ============================================================
            BODY
        ============================================================ */}
        <div className="px-6 pb-6">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />

          {/* ── Cenário A: Auditoria + Elegível ──────────────── */}
          {isEligible && (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-1.5">
                Ação de Sequência
              </p>
              <p className="text-sm text-gray-600 mb-4">
                O grupo atingiu todos os critérios para avanço de sequência.
              </p>

              <div className="flex gap-2.5 mb-5">
                <RadioOption
                  selected={decision === 'advance'}
                  onClick={() => setDecision('advance')}
                  icon={<ArrowAdvanceIcon size={18} />}
                  title={`Avançar para o passo ${group.currentSequence + 1}`}
                  subtitle="O grupo passará para a próxima sequência"
                  variant="advance"
                />
                <RadioOption
                  selected={decision === 'maintain'}
                  onClick={() => setDecision('maintain')}
                  icon={<CheckCircleIcon size={18} />}
                  title={`Manter no passo ${group.currentSequence}`}
                  subtitle="O grupo permanecerá na sequência atual"
                  variant="maintain"
                />
              </div>
            </>
          )}

          {/* ── Cenário B: Auditoria + NÃO Elegível ──────────── */}
          {isAudit && !eligibility.eligible && eligibility.reasons.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-2">
                Critérios Não Atendidos
              </p>
              <div className="space-y-2 mb-4">
                {eligibility.reasons.map((reason, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-rose-50/60"
                  >
                    <AlertTriangleIcon size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-rose-600">{reason}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-5">
                O grupo não atende os critérios para avanço e permanecerá no passo {group.currentSequence}.
              </p>
            </>
          )}

          {/* ── Botões ───────────────────────────────────────── */}
          <button
            onClick={handleConfirm}
            disabled={!confirmEnabled}
            className="w-full h-12 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
            style={{
              background: confirmGradient,
              boxShadow: confirmShadow,
            }}
          >
            <CheckCircleIcon size={18} />
            {confirmLabel}
          </button>

          <button
            onClick={onCancel}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer py-2"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
