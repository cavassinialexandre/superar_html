import type { Group } from '@/types'
import { ecards } from './editorial-cards-tokens'

interface Props {
  topGroups: Group[]
}

const RANK_LABEL: Record<number, string> = { 1: '1º LUGAR', 2: '2º LUGAR', 3: '3º LUGAR' }

const stripPrefix = (name: string) => name.replace(/^Equipe\s+/i, '')
const stripMgmt = (name: string) => name.replace(/^Ger[êe]ncia\s+(de\s+)?/i, '')

function medalFor(rank: number) {
  if (rank === 1) return ecards.medal.gold
  if (rank === 2) return ecards.medal.silver
  return ecards.medal.bronze
}

function CrownGlyph({ size = 22, rank = 1 }: { size?: number; rank?: number }) {
  const medal = medalFor(rank)
  const gradientId = `ecards-crown-grad-${rank}`
  return (
    <svg
      width={size}
      height={size * 0.78}
      viewBox="0 0 32 25"
      fill="none"
      aria-hidden
      style={{ filter: `drop-shadow(0 1px 4px ${medal.glow})` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={medal.light} />
          <stop offset="55%" stopColor={medal.mid} />
          <stop offset="100%" stopColor={medal.deep} />
        </linearGradient>
      </defs>
      <path
        d="M2 8 L8 16 L12 4 L16 14 L20 4 L24 16 L30 8 L27 22 L5 22 Z"
        fill={`url(#${gradientId})`}
        stroke={medal.deep}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PedestalIdentity({ group, isFirst }: { group: Group; isFirst: boolean }) {
  return (
    <div className="flex flex-col items-center w-full gap-1 text-center">
      <div
        className="text-white leading-tight truncate w-full"
        style={{
          fontFamily: ecards.font.serif,
          fontWeight: 400,
          fontSize: isFirst ? 17 : 14.5,
          letterSpacing: '-0.01em',
        }}
        title={group.name}
      >
        {stripPrefix(group.name)}
      </div>
      <div
        className="leading-tight truncate w-full"
        style={{
          fontFamily: ecards.font.body,
          fontSize: isFirst ? 10.5 : 9.5,
          color: 'rgba(255,255,255,0.42)',
        }}
        title={group.managementName}
      >
        {stripMgmt(group.managementName)}
      </div>
      <div
        className="uppercase italic truncate w-full"
        style={{
          fontFamily: ecards.font.mono,
          fontSize: isFirst ? 7 : 6.5,
          letterSpacing: '0.26em',
          color: 'rgba(255,255,255,0.55)',
        }}
        title={group.groupTypeName}
      >
        {group.groupTypeName}
      </div>
    </div>
  )
}

function Pedestal({
  group,
  rank,
  height,
  isFirst,
  width,
}: {
  group: Group
  rank: number
  height: number
  isFirst: boolean
  width: number
}) {
  const score = group.lastAuditScore ?? 0
  const medal = medalFor(rank)
  const ringSize = isFirst ? 96 : 60
  const strokeWidth = isFirst ? 6 : 3
  const r = (ringSize - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const crownSize = isFirst ? 24 : 18

  return (
    <div className="relative flex flex-col items-center" style={{ width }}>
      {isFirst && (
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: '-32px -28px -10px -28px',
            background:
              'radial-gradient(ellipse 55% 55% at 50% 45%, rgba(221,221,3,0.22) 0%, transparent 70%)',
            opacity: 0.75,
          }}
        />
      )}

      <div className={`relative z-10 ${isFirst ? 'mb-2' : 'mb-1.5'}`}>
        <CrownGlyph size={crownSize} rank={rank} />
      </div>

      <div
        className="relative w-full flex flex-col items-center justify-between px-3 pt-4 pb-4 rounded-t-2xl"
        style={{
          height,
          background: ecards.hero.glassBgStrong,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${isFirst ? ecards.hero.glassBorderStrong : ecards.hero.glassBorder}`,
          borderBottom: 'none',
          boxShadow: isFirst
            ? `0 0 48px ${medal.glow}, 0 22px 44px -18px rgba(0,0,0,0.5)`
            : `0 14px 32px -16px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          className="font-bold uppercase tabular-nums tracking-[0.18em] text-center"
          style={{
            fontFamily: ecards.font.mono,
            fontSize: isFirst ? 9.5 : 8.5,
            color: medal.mid,
            textShadow: `0 0 10px ${medal.glow}`,
          }}
        >
          {RANK_LABEL[rank]}
        </div>

        <div
          className="relative flex items-center justify-center"
          style={{ width: ringSize, height: ringSize }}
        >
          <svg width={ringSize} height={ringSize} className="absolute inset-0 -rotate-90">
            <defs>
              <linearGradient id={`ecards-ring-${rank}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={medal.mid} />
                <stop offset="100%" stopColor={rank === 3 ? medal.deep : medal.light} />
              </linearGradient>
            </defs>
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={r}
              fill="none"
              stroke={`url(#ecards-ring-${rank})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - score / 100)}
            />
          </svg>
          <div className="relative flex items-baseline justify-center">
            <span
              className="font-bold tabular-nums leading-none"
              style={{
                fontFamily: ecards.font.mono,
                fontSize: isFirst ? 30 : 18,
                color: rank === 2 ? medal.light : medal.mid,
              }}
            >
              {score}
            </span>
            <span
              className="leading-none"
              style={{
                fontFamily: ecards.font.mono,
                fontSize: isFirst ? 12 : 9,
                marginLeft: 2,
                color: rank === 2 ? medal.light : medal.mid,
              }}
            >
              %
            </span>
          </div>
        </div>

        <PedestalIdentity group={group} isFirst={isFirst} />
      </div>

      <div
        className="w-full rounded-b-md"
        style={{
          height: isFirst ? 6 : 4,
          background: `linear-gradient(180deg, ${medal.mid} 0%, ${medal.deep} 100%)`,
          boxShadow: `0 2px 8px ${medal.glow}`,
        }}
      />
    </div>
  )
}

function Satellite({ group, rank }: { group: Group; rank: number }) {
  const score = group.lastAuditScore ?? 0
  return (
    <div
      className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
      style={{
        background: ecards.hero.glassBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${ecards.hero.glassBorder}`,
        boxShadow: ecards.shadow.satellite,
      }}
    >
      <div
        className="flex items-center justify-center font-bold flex-shrink-0 tabular-nums"
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${ecards.accent.tealMid} 0%, ${ecards.accent.teal} 100%)`,
          color: ecards.accent.mint,
          fontFamily: ecards.font.mono,
          fontSize: 13,
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        {`${rank}º`}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="text-white truncate"
          style={{
            fontFamily: ecards.font.serif,
            fontWeight: 400,
            fontSize: 13.5,
            letterSpacing: '-0.01em',
          }}
          title={group.name}
        >
          {stripPrefix(group.name)}
        </div>
        <div
          className="truncate mt-0.5"
          style={{
            fontFamily: ecards.font.body,
            fontSize: 10,
            color: 'rgba(255,255,255,0.42)',
          }}
          title={group.managementName}
        >
          {stripMgmt(group.managementName)}
        </div>
        <div
          className="uppercase italic truncate mt-0.5"
          style={{
            fontFamily: ecards.font.mono,
            fontSize: 8,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.55)',
          }}
          title={group.groupTypeName}
        >
          {group.groupTypeName}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div
          className="text-white font-bold tabular-nums leading-none"
          style={{ fontFamily: ecards.font.mono, fontSize: 16 }}
        >
          {score}
          <span className="text-white/40 text-[9.5px] ml-0.5">%</span>
        </div>
      </div>
    </div>
  )
}

export function EditorialCardsPodium({ topGroups }: Props) {
  if (topGroups.length === 0) return null

  const top3 = topGroups.slice(0, 3)
  const sat = topGroups.slice(3, 5)

  const visualOrder = [
    { group: top3[1], rank: 2, height: 196, isFirst: false, width: 144 },
    { group: top3[0], rank: 1, height: 244, isFirst: true, width: 172 },
    { group: top3[2], rank: 3, height: 172, isFirst: false, width: 144 },
  ].filter((p) => p.group)

  return (
    <div className="relative w-full">
      <div className="flex items-end justify-center gap-4 md:gap-5 mb-7">
        {visualOrder.map((item) => (
          <Pedestal
            key={item.group!.id}
            group={item.group!}
            rank={item.rank}
            height={item.height}
            isFirst={item.isFirst}
            width={item.width}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sat.map((g, i) => (
          <Satellite key={g.id} group={g} rank={i + 4} />
        ))}
      </div>
    </div>
  )
}
