import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Group } from '@/types'
import { TrendUpIcon } from '@/assets/icons'
import { EditorialCinemaPodium } from './editorial-cinema-podium'
import { ec } from './editorial-cinema-tokens'

interface Props {
  topGroups: Group[]
  averageScore: number
  totalGroups: number
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 1.5,
        duration: 9 + Math.random() * 14,
        delay: Math.random() * 6,
        opacity: 0.16 + Math.random() * 0.28,
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
            y: [0, -22, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function MicroWatermark() {
  return (
    <svg
      aria-hidden
      className="absolute -left-6 -top-6 pointer-events-none"
      width="180"
      height="180"
      viewBox="0 0 200 200"
      fill="none"
      style={{ opacity: 0.05 }}
    >
      <text
        x="0"
        y="120"
        fontSize="180"
        fontFamily={ec.font.serif}
        fontWeight="300"
        fontStyle="italic"
        fill="#FFFFFF"
        letterSpacing="-12"
      >
        01
      </text>
    </svg>
  )
}

export function EditorialCinemaHero({ topGroups, averageScore, totalGroups }: Props) {
  const leader = topGroups[0]
  const leaderScore = leader?.lastAuditScore ?? 0
  const leaderName = leader ? leader.name.replace(/^Equipe\s+/i, '') : '—'

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: ec.hero.bg,
        boxShadow: ec.shadow.heroCard,
      }}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: ec.hero.bgInner }} />
      <div aria-hidden className="absolute inset-0" style={{ background: ec.hero.spotlight }} />
      <MicroWatermark />
      <ParticleField />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch px-5 md:px-7 py-6 gap-6 md:gap-7">
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex items-center gap-2.5 mb-4 flex-wrap"
            >
              <span
                className="font-bold uppercase"
                style={{
                  fontFamily: ec.font.sans,
                  fontSize: ec.scale.kicker,
                  letterSpacing: ec.letter.kicker,
                  color: ec.accent.crownGold,
                }}
              >
                OS SEIS NO TOPO
              </span>
              <span
                className="w-px h-3"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              />
              <span
                className="uppercase"
                style={{
                  fontFamily: ec.font.sans,
                  fontSize: ec.scale.kicker,
                  letterSpacing: ec.letter.kicker,
                  color: ec.text.onDarkSubtle,
                }}
              >
                TOP 6 · ÚLTIMA AUDITORIA
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="font-bold leading-[1.05] mb-3"
              style={{
                fontFamily: ec.font.sans,
                fontSize: 'clamp(26px, 3.4vw, 34px)',
                color: ec.text.onDark,
                letterSpacing: ec.letter.display,
              }}
            >
              Ranking{' '}
              <span style={{ fontFamily: ec.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
                Executivo
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.34 }}
              className="text-sm max-w-[360px] mb-5"
              style={{
                fontFamily: ec.font.body,
                fontSize: '13.5px',
                color: ec.text.onDarkMuted,
                lineHeight: 1.6,
              }}
            >
              As seis equipes que mais avançaram na auditoria do ciclo. Pódio cinematográfico para o
              top 3, satélites com o complemento.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="space-y-3"
          >
            <div
              className="flex items-stretch rounded-xl overflow-hidden"
              style={{
                background: ec.hero.glassBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${ec.hero.glassBorder}`,
              }}
            >
              <div
                className="px-3 py-2.5 flex flex-col justify-center"
                style={{ background: 'rgba(221,221,3,0.10)' }}
              >
                <span
                  className="uppercase font-bold"
                  style={{
                    fontFamily: ec.font.sans,
                    fontSize: '9.5px',
                    letterSpacing: ec.letter.kicker,
                    color: ec.accent.crownGold,
                  }}
                >
                  ★ LÍDER
                </span>
              </div>
              <div className="flex-1 px-3 py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div
                    className="font-semibold leading-tight"
                    style={{
                      fontFamily: ec.font.sans,
                      fontSize: '13.5px',
                      color: ec.text.onDark,
                    }}
                  >
                    {leaderName}
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: ec.text.onDarkSubtle, fontFamily: ec.font.body }}
                  >
                    {leader?.managementName}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="font-bold tabular-nums leading-none"
                    style={{
                      fontFamily: ec.font.mono,
                      fontSize: '22px',
                      color: ec.accent.crownGold,
                    }}
                  >
                    {leaderScore}
                  </span>
                  <span
                    className="ml-0.5"
                    style={{
                      fontFamily: ec.font.mono,
                      fontSize: '11px',
                      color: ec.text.onDarkMuted,
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: ec.accent.lime,
                    boxShadow: `0 0 6px ${ec.accent.lime}`,
                  }}
                />
                <span
                  className="uppercase"
                  style={{
                    fontFamily: ec.font.sans,
                    fontSize: '10px',
                    letterSpacing: ec.letter.kicker,
                    color: ec.text.onDarkMuted,
                  }}
                >
                  {totalGroups} GRUPOS
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
              <div className="flex items-center gap-1.5" style={{ color: ec.text.onDarkMuted }}>
                <TrendUpIcon size={11} />
                <span
                  className="uppercase"
                  style={{
                    fontFamily: ec.font.sans,
                    fontSize: '10px',
                    letterSpacing: ec.letter.kicker,
                  }}
                >
                  MÉDIA {averageScore}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 flex items-center justify-center">
          <EditorialCinemaPodium topGroups={topGroups} />
        </div>
      </div>
    </motion.section>
  )
}
