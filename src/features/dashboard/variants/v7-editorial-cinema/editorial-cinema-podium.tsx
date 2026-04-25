import { motion } from 'framer-motion'
import type { Group } from '@/types'
import { ec } from './editorial-cinema-tokens'

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

function Crown({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 32 25" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ec-crown-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="55%" stopColor={ec.accent.crownGold} />
          <stop offset="100%" stopColor={ec.accent.crownGoldDeep} />
        </linearGradient>
      </defs>
      <path
        d="M2 8 L8 16 L12 4 L16 14 L20 4 L24 16 L30 8 L27 22 L5 22 Z"
        fill="url(#ec-crown-grad)"
        stroke={ec.accent.crownGoldDeep}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="8" r="1.4" fill="#FFEB7A" />
      <circle cx="30" cy="8" r="1.4" fill="#FFEB7A" />
      <circle cx="16" cy="14" r="1.2" fill="#FFEB7A" />
    </svg>
  )
}

function PedestalCard({
  group,
  rank,
  height,
  isFirst,
  delay,
  width,
}: {
  group: Group
  rank: number
  height: number
  isFirst: boolean
  delay: number
  width: number
}) {
  const score = group.lastAuditScore ?? 0
  const ringSize = isFirst ? 96 : 70
  const strokeWidth = isFirst ? 7 : 5
  const r = (ringSize - strokeWidth) / 2
  const circ = 2 * Math.PI * r

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
      className="relative flex flex-col items-center"
      style={{ width }}
    >
      {isFirst && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20"
        >
          <Crown size={28} />
        </motion.div>
      )}

      {isFirst && (
        <motion.div
          aria-hidden
          className="absolute -inset-x-7 -bottom-4 -top-9 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(221,221,3,0.26) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div
        className="relative w-full flex flex-col items-center justify-end px-2.5 pt-4 pb-3.5 rounded-t-2xl"
        style={{
          height,
          background: ec.hero.glassBgStrong,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${isFirst ? ec.hero.glassBorderStrong : ec.hero.glassBorder}`,
          borderBottom: 'none',
          boxShadow: isFirst ? ec.shadow.podiumLeader : ec.shadow.podiumSide,
        }}
      >
        <div
          className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center font-bold"
          style={{
            width: isFirst ? 28 : 24,
            height: isFirst ? 28 : 24,
            borderRadius: '50%',
            background: isFirst
              ? `linear-gradient(135deg, ${ec.accent.crownGold} 0%, ${ec.accent.crownGoldDeep} 100%)`
              : 'rgba(255, 255, 255, 0.14)',
            color: isFirst ? '#3E2A00' : '#FFFFFF',
            fontFamily: ec.font.mono,
            fontSize: isFirst ? 12 : 11,
            border: isFirst ? '1.5px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.18)',
            boxShadow: isFirst ? '0 3px 10px rgba(221,221,3,0.4)' : 'none',
          }}
        >
          {rank}
        </div>

        <div
          className="relative flex items-center justify-center mb-2"
          style={{ width: ringSize, height: ringSize }}
        >
          <svg width={ringSize} height={ringSize} className="absolute inset-0 -rotate-90">
            <defs>
              <linearGradient id={`ec-ring-${rank}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isFirst ? ec.accent.crownGold : ec.accent.mint} />
                <stop offset="100%" stopColor={isFirst ? '#FFE875' : ec.accent.lime} />
              </linearGradient>
            </defs>
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke={`url(#ec-ring-${rank})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ * (1 - score / 100) }}
              transition={{ duration: 1.4, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="relative flex flex-col items-center justify-center">
            <span
              className="text-white font-bold tabular-nums leading-none"
              style={{
                fontFamily: ec.font.mono,
                fontSize: isFirst ? 26 : 18,
              }}
            >
              {score}
            </span>
            <span
              className="text-white/55 leading-none mt-0.5"
              style={{
                fontFamily: ec.font.mono,
                fontSize: isFirst ? 10 : 9,
              }}
            >
              %
            </span>
          </div>
        </div>

        <div className="text-center w-full">
          <div
            className="text-white font-semibold leading-tight truncate"
            style={{
              fontFamily: ec.font.sans,
              fontSize: isFirst ? 14 : 12,
            }}
            title={group.name}
          >
            {stripPrefix(group.name)}
          </div>
          <div
            className="text-white/45 leading-tight mt-0.5 truncate"
            style={{ fontSize: 9.5 }}
            title={group.managementName}
          >
            {group.managementName}
          </div>
        </div>
      </div>

      <div
        className="w-full h-1.5 rounded-b-md"
        style={{
          background: isFirst
            ? `linear-gradient(180deg, ${ec.accent.crownGold} 0%, ${ec.accent.crownGoldDeep} 100%)`
            : 'rgba(255, 255, 255, 0.18)',
          boxShadow: isFirst ? '0 3px 12px rgba(221,221,3,0.4)' : 'none',
        }}
      />
    </motion.div>
  )
}

function SatelliteRow({ group, rank, delay }: { group: Group; rank: number; delay: number }) {
  const score = group.lastAuditScore ?? 0
  const isPositive = true

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
      style={{
        background: ec.hero.glassBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${ec.hero.glassBorder}`,
        boxShadow: ec.shadow.satellite,
      }}
    >
      <div
        className="flex items-center justify-center font-bold flex-shrink-0"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${ec.accent.tealMid} 0%, ${ec.accent.teal} 100%)`,
          color: ec.accent.mint,
          fontFamily: ec.font.mono,
          fontSize: 10,
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        {initials(group.name)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <span
            className="text-white/55 font-bold"
            style={{ fontFamily: ec.font.mono, fontSize: 9.5 }}
          >
            #{rank}
          </span>
          <span
            className="text-white font-semibold truncate"
            style={{ fontFamily: ec.font.sans, fontSize: 12.5 }}
          >
            {stripPrefix(group.name)}
          </span>
        </div>
        <div className="text-white/40 text-[9.5px] truncate">{group.managementName}</div>
      </div>

      <div className="text-right flex-shrink-0">
        <div
          className="text-white font-bold tabular-nums leading-none"
          style={{ fontFamily: ec.font.mono, fontSize: 16 }}
        >
          {score}
          <span className="text-white/40 text-[9.5px] ml-0.5">%</span>
        </div>
      </div>
    </motion.div>
  )
}

export function EditorialCinemaPodium({ topGroups }: Props) {
  if (topGroups.length === 0) return null

  const top3 = topGroups.slice(0, 3)
  const sat = topGroups.slice(3, 6)

  const visualOrder = [
    { group: top3[1], rank: 2, height: 168, isFirst: false, width: 132 },
    { group: top3[0], rank: 1, height: 210, isFirst: true, width: 168 },
    { group: top3[2], rank: 3, height: 152, isFirst: false, width: 132 },
  ].filter((p) => p.group)

  return (
    <div className="relative w-full">
      <div className="flex items-end justify-center gap-3 mb-5">
        {visualOrder.map((item, idx) => (
          <PedestalCard
            key={item.group!.id}
            group={item.group!}
            rank={item.rank}
            height={item.height}
            isFirst={item.isFirst}
            delay={item.isFirst ? 0.15 : idx === 0 ? 0.28 : 0.42}
            width={item.width}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {sat.map((g, i) => (
          <SatelliteRow key={g.id} group={g} rank={i + 4} delay={0.55 + i * 0.07} />
        ))}
      </div>
    </div>
  )
}
