import type { Group } from '@/types'
import { ecards } from './editorial-cards-tokens'
import { EditorialCardsPodium } from './editorial-cards-podium'

interface Props {
  topGroups: Group[]
  unitLabel: string
}

const STATIC_PARTICLES = [
  { x: 4, y: 12, size: 1.5, opacity: 0.28 },
  { x: 11, y: 64, size: 1, opacity: 0.18 },
  { x: 17, y: 30, size: 2, opacity: 0.22 },
  { x: 23, y: 82, size: 1.25, opacity: 0.32 },
  { x: 29, y: 18, size: 1, opacity: 0.14 },
  { x: 34, y: 52, size: 1.75, opacity: 0.24 },
  { x: 41, y: 88, size: 1, opacity: 0.16 },
  { x: 47, y: 26, size: 1.25, opacity: 0.2 },
  { x: 52, y: 70, size: 1.5, opacity: 0.26 },
  { x: 58, y: 8, size: 1, opacity: 0.18 },
  { x: 63, y: 44, size: 1.25, opacity: 0.22 },
  { x: 69, y: 76, size: 1.5, opacity: 0.2 },
  { x: 74, y: 22, size: 1, opacity: 0.14 },
  { x: 81, y: 58, size: 1.75, opacity: 0.28 },
  { x: 86, y: 14, size: 1.25, opacity: 0.22 },
  { x: 91, y: 84, size: 1, opacity: 0.18 },
  { x: 96, y: 38, size: 1.5, opacity: 0.24 },
]

function StaticParticleField() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {STATIC_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: ecards.accent.mint,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

function TargetWatermark() {
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
        <linearGradient id="ecards-target-wm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={ecards.accent.mint} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" stroke="url(#ecards-target-wm)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="70" stroke="url(#ecards-target-wm)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="50" stroke="url(#ecards-target-wm)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="30" stroke="url(#ecards-target-wm)" strokeWidth="0.5" />
      <path
        d="M40 100 L160 100 M100 40 L100 160 M58 58 L142 142 M58 142 L142 58"
        stroke="url(#ecards-target-wm)"
        strokeWidth="0.5"
      />
    </svg>
  )
}

export function EditorialCardsHero({ topGroups, unitLabel }: Props) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: ecards.hero.bg,
        boxShadow: ecards.hero.shadow,
        borderRadius: ecards.hero.radius,
      }}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: ecards.hero.bgInner }} />
      <div aria-hidden className="absolute inset-0" style={{ background: ecards.hero.spotlight }} />
      <TargetWatermark />
      <StaticParticleField />

      <div className="relative z-10 px-6 md:px-10 py-5 md:py-7">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="font-bold uppercase"
            style={{
              fontFamily: ecards.font.sans,
              fontSize: ecards.scale.kicker,
              letterSpacing: ecards.letter.kicker,
              color: ecards.accent.crownGold,
            }}
          >
            OS CINCO NO TOPO
          </span>
          <span className="w-px h-3" style={{ background: 'rgba(255,255,255,0.18)' }} />
          <span
            className="uppercase"
            style={{
              fontFamily: ecards.font.sans,
              fontSize: ecards.scale.kicker,
              letterSpacing: ecards.letter.kicker,
              color: ecards.text.onDarkSubtle,
            }}
          >
            TOP 5
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 mb-2.5 flex-wrap">
          <h2
            className="font-bold leading-[1.05]"
            style={{
              fontFamily: ecards.font.sans,
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: ecards.text.onDark,
              letterSpacing: ecards.letter.display,
            }}
          >
            Ranking{' '}
            <span style={{ fontFamily: ecards.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
              Executivo
            </span>
          </h2>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              background: ecards.hero.glassBg,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${ecards.hero.glassBorder}`,
              transform: 'translateY(-10px)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: ecards.accent.lime,
                boxShadow: `0 0 8px ${ecards.accent.lime}`,
              }}
            />
            <span className="text-white/85 text-[11px] font-medium tracking-wide">
              Unidade {unitLabel}
            </span>
          </div>
        </div>

        <p
          className="text-sm max-w-[520px]"
          style={{
            fontFamily: ecards.font.body,
            fontSize: '13px',
            color: ecards.text.onDarkMuted,
            lineHeight: 1.55,
          }}
        >
          Visão gerencial da implementação do Kaizen/TPM.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-[860px]">
            <EditorialCardsPodium topGroups={topGroups} />
          </div>
        </div>
      </div>
    </section>
  )
}
