import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Group } from '@/types'
import { CinematicPodium } from './cinematic-podium'
import { cinematic } from './cinematic-tokens'

interface Props {
  unitLabel: string
  topGroups: Group[]
  totalGroups: number
  averageScore: number
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 6,
        opacity: 0.18 + Math.random() * 0.35,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: '#3AA39C',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 1.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function Watermark() {
  return (
    <svg
      aria-hidden
      className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none"
      width="380"
      height="380"
      viewBox="0 0 200 200"
      fill="none"
      style={{ opacity: 0.045 }}
    >
      <defs>
        <linearGradient id="wm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#3AA39C" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" stroke="url(#wm-grad)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="70" stroke="url(#wm-grad)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="50" stroke="url(#wm-grad)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="30" stroke="url(#wm-grad)" strokeWidth="0.5" />
      <path
        d="M40 100 L160 100 M100 40 L100 160 M58 58 L142 142 M58 142 L142 58"
        stroke="url(#wm-grad)"
        strokeWidth="0.5"
      />
    </svg>
  )
}

export function CinematicHero({ unitLabel, topGroups, totalGroups, averageScore }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: cinematic.hero.bg,
        boxShadow: '0 30px 80px -30px rgba(0,0,0,0.5)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: cinematic.hero.bgInner }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: cinematic.hero.spotlight }}
      />

      <Watermark />
      <ParticleField />

      <div className="relative z-10 px-6 md:px-10 pt-7 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between gap-4 mb-7"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: cinematic.hero.glassBg,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${cinematic.hero.glassBorder}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: cinematic.accents.lime,
                  boxShadow: `0 0 8px ${cinematic.accents.lime}`,
                }}
              />
              <span className="text-white/85 text-[11px] font-medium tracking-wide">
                Unidade {unitLabel}
              </span>
            </div>
            <div
              className="hidden md:flex items-center gap-2 text-white/45"
              style={{ fontFamily: cinematic.font.mono, fontSize: 10 }}
            >
              <span>·</span>
              <span className="uppercase tracking-[0.18em]">{totalGroups} grupos ativos</span>
              <span>·</span>
              <span className="uppercase tracking-[0.18em]">média {averageScore}%</span>
            </div>
          </div>

          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: cinematic.hero.glassBg,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${cinematic.hero.glassBorder}`,
            }}
          >
            <span
              className="text-white/55 uppercase tracking-[0.18em]"
              style={{ fontFamily: cinematic.font.mono, fontSize: 9 }}
            >
              top 6 · ranking
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-center mb-9 max-w-2xl mx-auto"
        >
          <div
            className="text-white/45 mb-2 uppercase tracking-[0.32em]"
            style={{ fontFamily: cinematic.font.mono, fontSize: 9 }}
          >
            portal executivo · kaizen tpm 4.0
          </div>
          <h1
            className="font-bold text-white leading-tight"
            style={{
              fontFamily: cinematic.font.display,
              fontSize: 'clamp(28px, 4vw, 40px)',
              letterSpacing: '-0.02em',
            }}
          >
            Os 6 grupos no topo do ranking
          </h1>
          <p
            className="text-white/55 text-sm mt-2 max-w-xl mx-auto"
            style={{ lineHeight: 1.55 }}
          >
            Performance da última auditoria · ordenado por nota global · clique em qualquer card para
            explorar a equipe.
          </p>
        </motion.div>

        <CinematicPodium topGroups={topGroups} />
      </div>
    </motion.section>
  )
}
