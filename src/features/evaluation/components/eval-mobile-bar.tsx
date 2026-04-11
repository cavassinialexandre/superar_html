/**
 * Premium mobile components — condensed S5 sidebar experience.
 * Bottom bar (glassmorphism + DualRingGauge), bottom sheet (full sidebar card).
 * Visible only below lg breakpoint (< 1024px).
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { CheckIcon, XIcon, CheckCircleIcon, ChevronUpIcon } from '@/assets/icons'
import { getScoreColor } from '@/design-system/tokens'
import type { EvaluationType } from '@/types'
import { formatPts, type SectionNavItemWithPoints } from './eval-sidebar-variants'

/* ────────────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────────────── */

interface EvalMobileBarProps {
  meta: number
  progress: number
  answeredCount: number
  totalQuestions: number
  evalType: EvaluationType
  eligibility: { eligible: boolean; reasons: string[] }
  sections: SectionNavItemWithPoints[]
  pointsBreakdown: { earned: number; max: number; percentage: number }
  pointsMeta: number
  canFinalize: boolean
  sidebarOpen: boolean
  onOpenSidebar: () => void
  onCloseSidebar: () => void
  onScrollToSection: (index: number) => void
  onFinalize: () => void
}

/* ────────────────────────────────────────────────────────────
   MINI DUAL RING GAUGE (44px — bar) + SHEET GAUGE (120px)
──────────────────────────────────────────────────────────── */

function MiniDualRingGauge({ score, meta, size = 44 }: { score: number; meta: number; size?: number }) {
  const strokeOuter = size <= 60 ? 4 : 8
  const strokeInner = size <= 60 ? 1.5 : 2.5
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
  const gradId = size <= 60 ? 'miniDualRingScore' : 'sheetDualRingScore'

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#103734" />
            <stop offset="50%" stopColor="#1E7A73" />
            <stop offset="100%" stopColor={scoreColor} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#E4E8E8" strokeWidth={strokeOuter} />
        <circle
          cx={cx} cy={cy} r={rOuter} fill="none"
          stroke={`url(#${gradId})`}
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
        {size <= 60 ? (
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontFamily: 'Plus Jakarta Sans, Inter',
              fontSize: size <= 50 ? 13 : 17,
              color: score >= meta ? '#065F46' : '#9F1239',
            }}
          >
            {Math.round(score)}
          </span>
        ) : (
          <>
            <span
              className="font-black tabular-nums leading-none"
              style={{
                fontFamily: 'Plus Jakarta Sans, Inter',
                fontSize: 36,
                color: score >= meta ? '#065F46' : '#9F1239',
              }}
            >
              {Math.round(score)}
              <span className="text-lg font-bold ml-0.5" style={{ opacity: 0.45 }}>%</span>
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-semibold mt-1">
              Meta {meta}%
            </span>
          </>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   DIAMOND WATERMARK PATTERN
──────────────────────────────────────────────────────────── */

function DiamondWatermark({ id, opacity = 0.015 }: { id: string; opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="#1E7A73" />
      </pattern>
      <rect width="100" height="100" fill={`url(#${id})`} />
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────── */

export function EvalMobileBar({
  meta, progress, answeredCount, totalQuestions,
  evalType, eligibility, sections, pointsBreakdown, pointsMeta,
  canFinalize, sidebarOpen, onOpenSidebar, onCloseSidebar,
  onScrollToSection, onFinalize,
}: EvalMobileBarProps) {
  const pct = pointsBreakdown.percentage
  const scoreOk = pct >= meta
  const mandatoryOk = !eligibility.reasons.some((r) => r.toLowerCase().includes('obrigator'))
  const criteriaRows = evalType === 'audit'
    ? [
        { label: 'Nota >= Meta', ok: scoreOk },
        { label: 'Perguntas obrigatórias', ok: mandatoryOk },
        { label: 'Pode avançar', ok: eligibility.eligible },
      ]
    : []

  return (
    <>
      {/* ============================================================
          BOTTOM BAR — premium condensed sidebar slice
      ============================================================ */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top gradient border */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #E4E8E8 20%, #CDD4D3 50%, #E4E8E8 80%, transparent)',
          }}
        />

        {/* Glass body */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(248,250,250,0.97) 0%, rgba(255,255,255,0.95) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 -8px 32px rgba(16,55,52,0.08), 0 -2px 8px rgba(16,55,52,0.04)',
          }}
        >
          <DiamondWatermark id="barDiamond" opacity={0.015} />

          <div className="relative flex items-center px-4 h-[80px] max-w-xl mx-auto gap-4">
            {/* LEFT — gauge */}
            <MiniDualRingGauge score={pct} meta={meta} size={52} />

            {/* CENTER — counter above progress bar, right-aligned */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[9px] text-gray-500 tabular-nums font-medium text-right">
                {answeredCount}/{totalQuestions} perguntas
              </span>
              <div className="h-[3px] rounded-full bg-gray-200/60 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #103734, #1E7A73, #00A650)' }}
                  animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* RIGHT — Ver Resumo + Finalizar */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenSidebar}
                className="h-12 px-4 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer"
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(30,122,115,0.3)',
                  color: '#1E7A73',
                }}
              >
                Ver Resumo
              </button>
              <button
                disabled={!canFinalize}
                onClick={onFinalize}
                className="h-12 px-6 rounded-xl text-[13px] font-bold text-white flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer"
                style={{
                  background: canFinalize
                    ? 'linear-gradient(135deg, #1E7A73 0%, #0D9488 50%, #00A650 100%)'
                    : '#CDD4D3',
                  boxShadow: canFinalize
                    ? '0 4px 16px rgba(30,122,115,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : 'none',
                }}
              >
                <CheckCircleIcon size={16} />
                Finalizar
              </button>
            </div>
          </div>

          {/* Safe area for iOS */}
          <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
        </div>
      </motion.div>

      {/* ============================================================
          BOTTOM SHEET — full sidebar card experience
      ============================================================ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop — teal tinted */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(16,55,52,0.25)' }}
              onClick={onCloseSidebar}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl max-h-[75vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(180deg, rgba(248,250,250,0.98) 0%, rgba(255,255,255,0.96) 100%)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow: '0 -12px 48px rgba(16,55,52,0.12), 0 -4px 16px rgba(16,55,52,0.06)',
                border: '1px solid rgba(228,232,232,0.5)',
                borderBottom: 'none',
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300/40" />
              </div>

              <div className="px-6 pb-6">
                {/* Header band — S5 replica */}
                <div
                  className="flex items-center h-[40px] mb-3"
                  style={{ borderBottom: '0.5px solid #E4E8E8' }}
                >
                  <span className="flex-1 text-[10px] uppercase tracking-[0.22em] text-primary-700 font-bold">
                    {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
                  </span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span className="flex-1 text-right text-[10px] text-gray-500 tabular-nums font-medium">
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>

                {/* Score gauge + diamond watermark */}
                <div className="relative flex flex-col items-center mb-4">
                  <DiamondWatermark id="sheetDiamond" opacity={0.025} />
                  <div className="relative">
                    <MiniDualRingGauge score={pointsBreakdown.percentage} meta={meta} size={120} />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold mt-3">
                    Nota Atual
                  </p>

                  {/* Points breakdown — 3 columns */}
                  <div className="mt-3 flex items-start justify-center gap-2.5">
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
                        {formatPts(pointsMeta)}
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
                  </div>
                </div>

                {/* Eligibility criteria (audit only) */}
                {evalType === 'audit' && (
                  <>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2.5">
                        Critérios de Avanço
                      </p>
                      <div className="flex flex-col gap-2">
                        {criteriaRows.map((row, i) => (
                          <div key={row.label} className="flex items-center gap-3">
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
                              {row.ok ? <CheckIcon size={14} /> : <XIcon size={14} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Quick Nav — colored progress bars */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2.5">
                    Navegação Rápida
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {sections.map((sec, idx) => {
                      const pct = Math.min(Math.max(sec.percentageOfMax, 0), 100)
                      return (
                        <button
                          key={sec.title}
                          onClick={() => {
                            onScrollToSection(idx)
                            onCloseSidebar()
                          }}
                          className="text-left rounded-xl px-3 py-2.5 transition-all hover:bg-white/50 active:scale-[0.98] cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-bold truncate" style={{ color: sec.color }}>
                              {sec.title}
                            </p>
                            <span className="text-[10px] font-black tabular-nums" style={{ color: sec.color }}>
                              {Math.round(pct)}%
                            </span>
                          </div>
                          <div className="h-1 rounded-full mt-1.5" style={{ background: `${sec.color}25` }}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
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
                <div className="mt-4">
                  <button
                    onClick={() => { onCloseSidebar(); onFinalize() }}
                    disabled={!canFinalize}
                    className="w-full h-12 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer"
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

              {/* Safe area */}
              <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for bottom bar */}
      <div className="lg:hidden h-[84px]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </>
  )
}
