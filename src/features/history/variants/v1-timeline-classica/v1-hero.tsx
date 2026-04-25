import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { HistoryKPIs } from '../../shared/types'

// ---------------------------------------------------------------------------
// Diamond pattern — side accent
// ---------------------------------------------------------------------------

function DiamondSidebarPattern() {
  const diamonds: { x: number; y: number; size: number; opacity: number }[] = []
  const spacing = 22
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 4; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({
        x: col * spacing + offset + 10,
        y: row * spacing + 10,
        size: 5,
        opacity: 0.05 + Math.random() * 0.03,
      })
    }
  }
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 360" preserveAspectRatio="xMidYMid slice" fill="none">
      {diamonds.map((d, i) => (
        <rect
          key={i}
          x={d.x - d.size / 2}
          y={d.y - d.size / 2}
          width={d.size}
          height={d.size}
          transform={`rotate(45 ${d.x} ${d.y})`}
          fill="white"
          opacity={d.opacity}
        />
      ))}
    </svg>
  )
}

function WaveWatermark() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <linearGradient id="v1wg1" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#1E7A73" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#3AA39C" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#96D4D0" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="v1wg2" x1="0" y1="0.5" x2="1" y2="0">
          <stop offset="0%" stopColor="#3AA39C" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1E7A73" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path d="M-50 280 C100 220, 250 340, 400 260 S650 180, 800 240 S950 320, 1000 260" stroke="url(#v1wg1)" strokeWidth="1.5" />
      <path d="M-50 310 C120 250, 280 370, 430 290 S690 210, 840 270 S990 350, 1060 290" stroke="url(#v1wg2)" strokeWidth="0.8" />
      <path d="M0 400 L0 320 C140 260, 290 370, 440 300 S700 230, 860 280 S1010 350, 900 310 L900 400 Z" fill="url(#v1wg1)" opacity="0.3" />
      <circle cx="220" cy="290" r="2.5" fill="#1E7A73" opacity="0.08" />
      <circle cx="450" cy="270" r="3" fill="#3AA39C" opacity="0.06" />
      <circle cx="680" cy="235" r="2" fill="#1E7A73" opacity="0.08" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Clock icon in glass card
// ---------------------------------------------------------------------------

function ClockGlass({ total }: { total: number }) {
  return (
    <div
      className="relative rounded-2xl border border-white/60 p-5 overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 32px rgba(30, 122, 115, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Acervo</p>
          <p className="text-lg font-bold text-gray-800 tabular-nums">{total} avaliações</p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface V1HeroProps {
  kpis: HistoryKPIs
  groupFilter?: { name: string; onClear: () => void }
}

export function V1Hero({ kpis, groupFilter }: V1HeroProps) {
  return (
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex">
        {/* LEFT ACCENT SIDEBAR */}
        <div
          className={cn('relative w-32 flex-shrink-0 hidden sm:flex flex-col items-center justify-center py-6')}
          style={{ background: 'linear-gradient(180deg, #155F59 0%, #1E7A73 40%, #3AA39C 100%)' }}
        >
          <DiamondSidebarPattern />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-semibold mt-2">Histórico</span>
          </motion.div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 relative min-w-0 bg-gradient-to-br from-white via-white to-primary-50/30 overflow-hidden">
          <WaveWatermark />

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Identity */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className="flex items-center gap-1.5 text-xs text-gray-400 mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <span className="uppercase tracking-wider font-semibold">V1 · Timeline Clássica</span>
                </motion.div>

                <motion.h1
                  className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight leading-tight mb-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  As decisões, em ordem.
                </motion.h1>

                <motion.p
                  className="text-sm text-gray-500 max-w-xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  Linha do tempo narrativa de auditorias e follow-ups. Cada evento preserva o contexto da sequência, da meta e do aplicador.
                </motion.p>

                {groupFilter && (
                  <motion.div
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                    </svg>
                    <span>Filtrando por grupo: <strong>{groupFilter.name}</strong></span>
                    <button
                      onClick={groupFilter.onClear}
                      className="ml-1 text-primary-500 hover:text-primary-800 cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Glass card */}
              <motion.div
                className="flex-shrink-0 lg:max-w-[280px] w-full lg:w-auto"
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <ClockGlass total={kpis.total} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
