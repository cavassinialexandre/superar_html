import { motion } from 'framer-motion'
import type { Group } from '@/types'
import { cinematic } from './cinematic-tokens'

interface Props {
  topGroups: Group[]
}

const initials = (name: string) =>
  name
    .replace(/^Equipe\s+/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const stripPrefix = (name: string) => name.replace(/^Equipe\s+/i, '')

function Crown({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 32 25" fill="none" aria-hidden>
      <defs>
        <linearGradient id="crown-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="55%" stopColor={cinematic.accents.crownGold} />
          <stop offset="100%" stopColor="#867F06" />
        </linearGradient>
      </defs>
      <path
        d="M2 8 L8 16 L12 4 L16 14 L20 4 L24 16 L30 8 L27 22 L5 22 Z"
        fill="url(#crown-grad)"
        stroke="#867F06"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="8" r="1.6" fill="#FFEB7A" />
      <circle cx="30" cy="8" r="1.6" fill="#FFEB7A" />
      <circle cx="16" cy="14" r="1.4" fill="#FFEB7A" />
    </svg>
  )
}

function PodiumCard({
  group,
  rank,
  height,
  isFirst,
  delay,
}: {
  group: Group
  rank: number
  height: number
  isFirst: boolean
  delay: number
}) {
  const score = group.lastAuditScore ?? 0
  const ringSize = isFirst ? 110 : 78
  const strokeWidth = isFirst ? 8 : 6

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className="relative flex flex-col items-center"
      style={{ width: isFirst ? 200 : 156 }}
    >
      {isFirst && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        >
          <Crown size={36} />
        </motion.div>
      )}

      {isFirst && (
        <motion.div
          aria-hidden
          className="absolute -inset-x-8 -bottom-6 -top-12 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(221,221,3,0.28) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div
        className="relative w-full flex flex-col items-center justify-end px-3 pt-5 pb-4 rounded-t-3xl"
        style={{
          height,
          background: cinematic.hero.glassBgStrong,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: `1px solid ${isFirst ? cinematic.hero.glassBorderStrong : cinematic.hero.glassBorder}`,
          borderBottom: 'none',
          boxShadow: isFirst ? cinematic.shadow.podiumFirst : cinematic.shadow.podiumSide,
        }}
      >
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center justify-center font-bold"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isFirst
              ? `linear-gradient(135deg, ${cinematic.accents.crownGold} 0%, #867F06 100%)`
              : 'rgba(255, 255, 255, 0.14)',
            color: isFirst ? '#3E2A00' : '#FFFFFF',
            fontFamily: cinematic.font.mono,
            fontSize: 13,
            border: isFirst ? '1.5px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.18)',
            boxShadow: isFirst ? '0 4px 14px rgba(221,221,3,0.4)' : 'none',
          }}
        >
          {rank}
        </div>

        <div
          className="relative flex items-center justify-center mb-3"
          style={{ width: ringSize, height: ringSize }}
        >
          <svg width={ringSize} height={ringSize} className="absolute inset-0 -rotate-90">
            <defs>
              <linearGradient id={`ring-${rank}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isFirst ? cinematic.accents.crownGold : cinematic.accents.mint} />
                <stop offset="100%" stopColor={isFirst ? '#FFE875' : cinematic.accents.lime} />
              </linearGradient>
            </defs>
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={(ringSize - strokeWidth) / 2}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={(ringSize - strokeWidth) / 2}
              fill="none"
              stroke={`url(#ring-${rank})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={Math.PI * (ringSize - strokeWidth)}
              initial={{ strokeDashoffset: Math.PI * (ringSize - strokeWidth) }}
              animate={{
                strokeDashoffset:
                  Math.PI * (ringSize - strokeWidth) * (1 - score / 100),
              }}
              transition={{ duration: 1.4, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="relative flex flex-col items-center justify-center">
            <span
              className="text-white font-bold tabular-nums leading-none"
              style={{
                fontFamily: cinematic.font.mono,
                fontSize: isFirst ? 30 : 22,
              }}
            >
              {score}
            </span>
            <span
              className="text-white/55 leading-none"
              style={{
                fontFamily: cinematic.font.mono,
                fontSize: isFirst ? 12 : 10,
                marginTop: 2,
              }}
            >
              %
            </span>
          </div>
        </div>

        <div className="text-center w-full px-1">
          <div
            className="text-white font-semibold leading-tight truncate"
            style={{
              fontFamily: cinematic.font.display,
              fontSize: isFirst ? 17 : 14,
            }}
            title={group.name}
          >
            {stripPrefix(group.name)}
          </div>
          <div
            className="text-white/50 text-[10.5px] leading-tight mt-1 truncate"
            title={group.managementName}
          >
            {group.managementName}
          </div>
        </div>
      </div>

      <div
        className="w-full h-2 rounded-b-md"
        style={{
          background: isFirst
            ? `linear-gradient(180deg, ${cinematic.accents.crownGold} 0%, #867F06 100%)`
            : 'rgba(255, 255, 255, 0.18)',
          boxShadow: isFirst ? '0 4px 16px rgba(221,221,3,0.4)' : 'none',
        }}
      />
    </motion.div>
  )
}

function SatelliteCard({ group, rank, delay }: { group: Group; rank: number; delay: number }) {
  const score = group.lastAuditScore ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      className="relative flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: cinematic.hero.glassBg,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${cinematic.hero.glassBorder}`,
        boxShadow: cinematic.shadow.satellite,
      }}
    >
      <div
        className="flex items-center justify-center font-bold flex-shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${cinematic.accents.teal} 0%, ${cinematic.accents.deepTeal} 100%)`,
          color: cinematic.accents.mint,
          fontFamily: cinematic.font.mono,
          fontSize: 11,
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        {initials(group.name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-white/55 font-bold"
            style={{ fontFamily: cinematic.font.mono, fontSize: 11 }}
          >
            #{rank}
          </span>
          <span
            className="text-white font-semibold truncate"
            style={{ fontFamily: cinematic.font.display, fontSize: 14 }}
          >
            {stripPrefix(group.name)}
          </span>
        </div>
        <div className="text-white/45 text-[10.5px] truncate">{group.managementName}</div>
      </div>

      <div className="text-right flex-shrink-0">
        <div
          className="text-white font-bold tabular-nums leading-none"
          style={{ fontFamily: cinematic.font.mono, fontSize: 20 }}
        >
          {score}
          <span className="text-white/40 text-[12px] ml-0.5">%</span>
        </div>
        <div className="flex items-center justify-end gap-0.5 mt-1">
          <div
            className="h-1 w-12 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${cinematic.accents.mint} 0%, ${cinematic.accents.lime} 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CinematicPodium({ topGroups }: Props) {
  if (topGroups.length === 0) return null

  const top3 = topGroups.slice(0, 3)
  const sat = topGroups.slice(3, 6)

  const visualOrder = [
    { group: top3[1], rank: 2, height: 200, isFirst: false },
    { group: top3[0], rank: 1, height: 250, isFirst: true },
    { group: top3[2], rank: 3, height: 180, isFirst: false },
  ].filter((p) => p.group)

  return (
    <div className="relative w-full max-w-[760px] mx-auto">
      <div className="flex items-end justify-center gap-3 md:gap-5">
        {visualOrder.map((item, idx) => (
          <PodiumCard
            key={item.group!.id}
            group={item.group!}
            rank={item.rank}
            height={item.height}
            isFirst={item.isFirst}
            delay={item.isFirst ? 0.1 : idx === 0 ? 0.25 : 0.4}
          />
        ))}
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }} />
        <span
          className="text-white/45 uppercase tracking-[0.18em]"
          style={{ fontFamily: cinematic.font.mono, fontSize: 9 }}
        >
          satélites
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sat.map((g, i) => (
          <SatelliteCard key={g.id} group={g} rank={i + 4} delay={0.55 + i * 0.08} />
        ))}
      </div>
    </div>
  )
}
