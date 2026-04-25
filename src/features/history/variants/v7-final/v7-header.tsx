import { motion } from 'framer-motion'
import type { HistoryKPIs } from '../../shared/types'

interface V7HeaderProps {
  kpis: HistoryKPIs
}

export function V7Header({ kpis }: V7HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden p-6 text-white"
      style={{ background: 'linear-gradient(135deg, #0C2B28 0%, #103734 45%, #155F59 100%)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* Ambient orbs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-primary-300/15 blur-3xl" />

      {/* Premium watermark — relógio orbital */}
      <div
        className="absolute top-1/2 right-8 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 260 260"
          fill="none"
          className="text-white/[0.08]"
        >
          <defs>
            <radialGradient id="v7-watermark-fade" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="75%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Outer orbit (dashed) */}
          <circle
            cx="130"
            cy="130"
            r="118"
            stroke="url(#v7-watermark-fade)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          {/* Middle orbit */}
          <circle
            cx="130"
            cy="130"
            r="94"
            stroke="url(#v7-watermark-fade)"
            strokeWidth="1"
          />
          {/* Clock face */}
          <circle
            cx="130"
            cy="130"
            r="68"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Inner ring */}
          <circle
            cx="130"
            cy="130"
            r="62"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* Hour markers (12, 3, 6, 9) */}
          <line x1="130" y1="68" x2="130" y2="76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="130" y1="184" x2="130" y2="192" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="130" x2="76" y2="130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="184" y1="130" x2="192" y2="130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Clock hands */}
          <path
            d="M130 82 L130 130 L168 150"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center dot */}
          <circle cx="130" cy="130" r="3" fill="currentColor" />
          {/* Orbit particle */}
          <circle cx="248" cy="130" r="2.5" fill="currentColor" opacity="0.9" />
          <circle cx="36" cy="92" r="1.5" fill="currentColor" opacity="0.6" />
          <circle cx="54" cy="198" r="1.8" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-200 font-semibold">
            AUDITORIAS & FOLLOW-UPS
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
            Histórico de avaliações
          </h2>
          <p className="mt-1.5 text-sm text-primary-100/80 max-w-xl leading-relaxed">
            Registro completo das auditorias e follow-ups aplicados aos grupos desta unidade.
          </p>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <HeaderStat label="Total" value={kpis.total.toString()} />
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <HeaderStat
            label="Score médio"
            value={kpis.total > 0 ? `${kpis.avgScore.toFixed(1)}%` : '—'}
          />
        </div>
      </div>
    </motion.div>
  )
}

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary-300 font-semibold">{label}</p>
      <p className="mt-0.5 text-2xl font-black tabular-nums">{value}</p>
    </div>
  )
}
