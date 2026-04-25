import { motion } from 'framer-motion'
import type { Group } from '@/types'
import { bento, bentoTileBase } from './bento-tokens'

interface Props {
  topGroups: Group[]
}

const stripPrefix = (name: string) => name.replace(/^Equipe\s+/i, '')
const initials = (name: string) =>
  name
    .replace(/^Equipe\s+/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function LeaderTile({ group }: { group: Group }) {
  const score = group.lastAuditScore ?? 0
  const size = 150
  const stroke = 12
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: bento.surface.tileShadowHover, transition: { duration: 0.25 } }}
      className="relative col-span-2 row-span-2 p-5 md:p-6 flex flex-col justify-between overflow-hidden"
      style={{
        ...bentoTileBase,
        background: `linear-gradient(135deg, #FFFFFF 0%, ${bento.category.podium.soft} 130%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -top-10 -right-8 w-32 h-32 rounded-full opacity-30 blur-2xl"
        style={{ background: bento.category.podium.tint }}
      />

      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="flex items-center justify-center font-bold rounded-full"
              style={{
                width: 28,
                height: 28,
                background: bento.category.podium.tint,
                color: '#3E2A00',
                fontFamily: bento.font.mono,
                fontSize: 13,
                boxShadow: '0 4px 12px rgba(221,221,3,0.35)',
              }}
            >
              1
            </span>
            <span
              className="uppercase font-bold tracking-[0.16em]"
              style={{
                fontFamily: bento.font.mono,
                fontSize: 10,
                color: bento.category.podium.icon,
              }}
            >
              ★ LÍDER · TOP 1
            </span>
          </div>
          <h3
            className="font-bold leading-tight"
            style={{
              fontFamily: bento.font.display,
              fontSize: 26,
              color: bento.surface.text,
              letterSpacing: '-0.02em',
            }}
          >
            {stripPrefix(group.name)}
          </h3>
          <div
            className="mt-1"
            style={{
              fontFamily: bento.font.display,
              fontSize: 12,
              color: bento.surface.textMuted,
            }}
          >
            {group.managementName} · seq {group.currentSequence}/{group.maxSequence}
          </div>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span
            className="uppercase tracking-[0.14em]"
            style={{ fontFamily: bento.font.mono, fontSize: 9.5, color: bento.surface.textMuted }}
          >
            NOTA AUDITORIA
          </span>
          <span
            className="font-bold leading-none tabular-nums mt-1"
            style={{
              fontFamily: bento.font.display,
              fontSize: 60,
              color: bento.surface.text,
              letterSpacing: '-0.04em',
            }}
          >
            {score}
            <span
              className="font-semibold"
              style={{ fontSize: 24, color: bento.surface.textMuted }}
            >
              %
            </span>
          </span>
        </div>

        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90 absolute inset-0">
            <defs>
              <linearGradient id="leader-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={bento.category.podium.tint} />
                <stop offset="100%" stopColor="#867F06" />
              </linearGradient>
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={bento.surface.rule}
              strokeWidth={stroke}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="url(#leader-grad)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ * (1 - score / 100) }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg width="36" height="28" viewBox="0 0 32 25" fill="none">
              <path
                d="M2 8 L8 16 L12 4 L16 14 L20 4 L24 16 L30 8 L27 22 L5 22 Z"
                fill={bento.category.podium.tint}
                stroke="#867F06"
                strokeWidth="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MiniTile({ group, rank, delay }: { group: Group; rank: number; delay: number }) {
  const score = group.lastAuditScore ?? 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: bento.surface.tileShadowHover, transition: { duration: 0.25 } }}
      className="relative p-3 flex flex-col justify-between"
      style={bentoTileBase}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-bold tabular-nums"
          style={{
            fontFamily: bento.font.mono,
            fontSize: 11,
            color: bento.surface.textMuted,
          }}
        >
          #{rank}
        </span>
        <span
          className="flex items-center justify-center rounded-full font-bold"
          style={{
            width: 24,
            height: 24,
            background: `linear-gradient(135deg, ${bento.category.chart.tint} 0%, ${bento.category.kpi.tint} 100%)`,
            color: '#FFFFFF',
            fontFamily: bento.font.mono,
            fontSize: 9,
          }}
        >
          {initials(group.name)}
        </span>
      </div>
      <div>
        <div
          className="font-semibold truncate"
          style={{
            fontFamily: bento.font.display,
            fontSize: 13,
            color: bento.surface.text,
          }}
        >
          {stripPrefix(group.name)}
        </div>
        <div
          className="text-[10px] truncate"
          style={{ fontFamily: bento.font.display, color: bento.surface.textMuted }}
        >
          {group.managementName}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: bento.surface.rule }}>
        <span
          className="font-bold tabular-nums"
          style={{
            fontFamily: bento.font.mono,
            fontSize: 18,
            color: bento.surface.text,
          }}
        >
          {score}
          <span style={{ fontSize: 10, color: bento.surface.textMuted, marginLeft: 1 }}>%</span>
        </span>
        <div
          className="h-1 rounded-full overflow-hidden flex-1 ml-2"
          style={{ background: bento.surface.rule }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
            style={{
              background: `linear-gradient(90deg, ${bento.category.chart.tint} 0%, ${bento.category.activity.tint} 100%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function WideTile({ group, rank, delay }: { group: Group; rank: number; delay: number }) {
  const score = group.lastAuditScore ?? 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: bento.surface.tileShadowHover, transition: { duration: 0.25 } }}
      className="relative col-span-2 p-3 flex items-center gap-3"
      style={bentoTileBase}
    >
      <span
        className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: `linear-gradient(135deg, ${bento.category.chart.tint} 0%, ${bento.category.kpi.tint} 100%)`,
          color: '#FFFFFF',
          fontFamily: bento.font.mono,
          fontSize: 13,
        }}
      >
        {initials(group.name)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-bold tabular-nums"
            style={{
              fontFamily: bento.font.mono,
              fontSize: 11,
              color: bento.surface.textMuted,
            }}
          >
            #{rank}
          </span>
          <span
            className="font-semibold truncate"
            style={{
              fontFamily: bento.font.display,
              fontSize: 14,
              color: bento.surface.text,
            }}
          >
            {stripPrefix(group.name)}
          </span>
        </div>
        <div
          className="text-[10.5px] truncate"
          style={{ fontFamily: bento.font.display, color: bento.surface.textMuted }}
        >
          {group.managementName}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div
          className="font-bold tabular-nums leading-none"
          style={{
            fontFamily: bento.font.mono,
            fontSize: 22,
            color: bento.surface.text,
            letterSpacing: '-0.02em',
          }}
        >
          {score}
          <span style={{ fontSize: 12, color: bento.surface.textMuted, marginLeft: 1 }}>%</span>
        </div>
      </div>
    </motion.div>
  )
}

export function BentoPodiumBlock({ topGroups }: Props) {
  if (topGroups.length === 0) return null
  const leader = topGroups[0]
  const minis = topGroups.slice(1, 5)
  const wide = topGroups[5]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="lg:col-span-3 lg:row-span-3"
    >
      <div className="grid grid-cols-2 grid-rows-3 gap-3 h-full" style={{ minHeight: 460 }}>
        {leader && <LeaderTile group={leader} />}
        {minis.map((g, i) => (
          <MiniTile key={g.id} group={g} rank={i + 2} delay={0.18 + i * 0.06} />
        ))}
        {wide && <WideTile group={wide} rank={6} delay={0.42} />}
      </div>
    </motion.div>
  )
}
