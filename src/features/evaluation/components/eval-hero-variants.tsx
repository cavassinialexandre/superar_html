/**
 * Premium Hero Variants (A-G) for the evaluation page.
 *
 * This file contains the FIRST HALF: shared types, shared internal components,
 * and variants A, B, C. Variants D, E, F, G follow at the bottom.
 *
 * A — "Linear Metadata"
 * B — "Glass Triptych"
 * C — "Cockpit Grid"
 * D — (below)
 * E — (below)
 * F — (below)
 * G — (below)
 */

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Badge, Input, Label } from '@/components/ui'
import { ChevronDownIcon } from '@/assets/icons'
import { getScoreColor } from '@/design-system/tokens'
import { EvalWaveWatermark, EvalDiamondPattern } from './eval-watermarks'
import type { Group, EvaluationType, TeamMember } from '@/types'

// ===========================================================================
// Shared interfaces & types
// ===========================================================================

interface SectionNavItem {
  title: string
  color: string
  answeredCount: number
  totalCount: number
  status: 'complete' | 'partial' | 'empty'
}

export interface HeroVariantProps {
  group: Group
  evalType: EvaluationType
  userName: string
  score: number
  meta: number
  answeredCount: number
  totalQuestions: number
  presentMembers: string[]
  otherPeople: string
  evaluationDate: string
  sections: SectionNavItem[]
  eligibility: { eligible: boolean; reasons: string[] }
  pointsBreakdown?: {
    earned: number
    max: number
    percentage: number
  }
  onToggleMember: (name: string) => void
  onSetOtherPeople: (value: string) => void
  onSetEvaluationDate: (value: string) => void
}

type HeroVariant = 'A' | 'B' | 'C' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'E' | 'F' | 'G'

// ===========================================================================
// 1. getInitials — helper
// ===========================================================================

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

// ===========================================================================
// 2. AvatarStack — overlapping circles with count
// ===========================================================================

function AvatarStack({
  members,
  presentMembers,
  max = 5,
  size = 28,
  onClick,
  prioritizePresent = false,
}: {
  members: TeamMember[]
  presentMembers: string[]
  max?: number
  size?: number
  onClick?: () => void
  prioritizePresent?: boolean
}) {
  const ordered = prioritizePresent
    ? [
        ...members.filter((m) => presentMembers.includes(m.name)),
        ...members.filter((m) => !presentMembers.includes(m.name)),
      ]
    : members
  const shown = ordered.slice(0, max)
  const rest = ordered.length - max

  return (
    <div onClick={onClick} className={cn('flex items-center', onClick && 'cursor-pointer group')} role={onClick ? 'button' : undefined}>
      <div className="flex" style={{ marginRight: rest > 0 ? 4 : 0 }}>
        {shown.map((m, i) => {
          const isPresent = presentMembers.includes(m.name)
          return (
            <div
              key={m.id}
              className={cn(
                'rounded-full flex items-center justify-center font-bold border-2 border-white',
                isPresent
                  ? 'bg-primary-800 text-white'
                  : 'bg-gray-200 text-gray-400',
              )}
              style={{
                width: size,
                height: size,
                fontSize: size * 0.32,
                marginLeft: i > 0 ? -(size * 0.28) : 0,
                zIndex: max - i,
              }}
              title={m.name}
            >
              {getInitials(m.name)}
            </div>
          )
        })}
      </div>
      {rest > 0 && (
        <span className="text-xs text-gray-400 font-medium ml-1 group-hover:text-gray-600 transition-colors">
          +{rest}
        </span>
      )}
    </div>
  )
}

// ===========================================================================
// 3. ScoreRing — SVG circular ring with score
// ===========================================================================

function ScoreRing({
  score,
  meta,
  size = 56,
  strokeWidth = 4,
  strokeColor,
  metaMarkerColor,
  textColor,
}: {
  score: number
  meta?: number
  size?: number
  strokeWidth?: number
  strokeColor?: string
  metaMarkerColor?: string
  textColor?: string
}) {
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(score, 100) / 100)
  const scoreColor = strokeColor || getScoreColor(score)
  const trackColor = strokeColor ? 'rgba(255,255,255,0.15)' : '#F3F4F6'
  const markerFill = metaMarkerColor || 'white'
  const markerStroke = metaMarkerColor || '#9CA3AF'
  const txtColor = textColor || scoreColor

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        {meta !== undefined &&
          (() => {
            const metaAngle = (meta / 100) * 360 - 90
            const metaRad = (metaAngle * Math.PI) / 180
            const mx = center + radius * Math.cos(metaRad)
            const my = center + radius * Math.sin(metaRad)
            return (
              <circle
                cx={mx}
                cy={my}
                r={2.5}
                fill={markerFill}
                stroke={markerStroke}
                strokeWidth={1}
              />
            )
          })()}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-sm font-black tabular-nums"
          style={{ color: txtColor }}
        >
          {Math.round(score)}
        </span>
      </div>
    </div>
  )
}

// ===========================================================================
// 3.5. InlineDiamondWatermark — randomized diamond grid (matches groups hero)
// ===========================================================================

function InlineDiamondWatermark({
  spacing = 22,
  diamondSize = 5,
  opacityBase = 0.04,
  opacityVariance = 0.025,
  color = 'white',
  viewBoxWidth = 900,
  viewBoxHeight = 280,
}: {
  spacing?: number
  diamondSize?: number
  opacityBase?: number
  opacityVariance?: number
  color?: string
  viewBoxWidth?: number
  viewBoxHeight?: number
}) {
  const diamonds: { x: number; y: number; opacity: number }[] = []
  const cols = Math.ceil(viewBoxWidth / spacing) + 2
  const rows = Math.ceil(viewBoxHeight / spacing) + 2
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2
      diamonds.push({
        x: col * spacing + offset,
        y: row * spacing,
        opacity: opacityBase + Math.random() * opacityVariance,
      })
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {diamonds.map((d, i) => (
        <rect
          key={i}
          x={d.x - diamondSize / 2}
          y={d.y - diamondSize / 2}
          width={diamondSize}
          height={diamondSize}
          transform={`rotate(45 ${d.x} ${d.y})`}
          fill={color}
          opacity={d.opacity}
        />
      ))}
    </svg>
  )
}

// ===========================================================================
// 3.6. InlineWaveWatermark — wave for dark backgrounds (white strokes)
// ===========================================================================

function InlineWaveWatermark() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 900 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="d8wave1" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="white" stopOpacity="0.06" />
          <stop offset="50%" stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="d8wave2" x1="0" y1="0.5" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.04" />
          <stop offset="100%" stopColor="white" stopOpacity="0.07" />
        </linearGradient>
      </defs>
      <path
        d="M-50 280 C100 220, 250 340, 400 260 S650 180, 800 240 S950 320, 1000 260"
        stroke="url(#d8wave1)"
        strokeWidth="1.5"
      />
      <path
        d="M-50 310 C120 250, 280 370, 430 290 S690 210, 840 270 S990 350, 1060 290"
        stroke="url(#d8wave2)"
        strokeWidth="0.8"
      />
      <path
        d="M0 400 L0 320 C140 260, 290 370, 440 300 S700 230, 860 280 S1010 350, 900 310 L900 400 Z"
        fill="url(#d8wave1)"
        opacity="0.5"
      />
      <circle cx="220" cy="290" r="2.5" fill="white" opacity="0.07" />
      <circle cx="450" cy="270" r="3" fill="white" opacity="0.05" />
      <circle cx="680" cy="235" r="2" fill="white" opacity="0.08" />
      <circle cx="820" cy="260" r="3" fill="white" opacity="0.05" />
    </svg>
  )
}

// ===========================================================================
// 4. SectionMicroBars — stacked horizontal bars for sections
// ===========================================================================

function SectionMicroBars({
  sections,
  showLabels = false,
}: {
  sections: SectionNavItem[]
  showLabels?: boolean
}) {
  const maxQuestions = Math.max(...sections.map((s) => s.totalCount), 1)

  if (showLabels) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
        {sections.map((sec, i) => {
          const pct =
            sec.totalCount > 0 ? (sec.answeredCount / sec.totalCount) * 100 : 0
          return (
            <div
              key={i}
              className="flex flex-col gap-1 min-w-0"
              title={`${sec.title}: ${sec.answeredCount}/${sec.totalCount}`}
            >
              {/* Top row: dot + name + count */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: sec.color }}
                />
                <span className="text-[11px] text-gray-700 font-medium truncate flex-1 min-w-0">
                  {sec.title}
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums flex-shrink-0">
                  {sec.answeredCount}/{sec.totalCount}
                </span>
              </div>
              {/* Bottom row: full-width progress bar */}
              <div className="h-1 rounded-full bg-gray-100 w-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: sec.color }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: 0.2 + i * 0.08,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {sections.map((sec, i) => {
        const pct =
          sec.totalCount > 0 ? (sec.answeredCount / sec.totalCount) * 100 : 0
        const widthPct = (sec.totalCount / maxQuestions) * 100
        return (
          <div
            key={i}
            className="group relative"
            title={`${sec.title}: ${sec.answeredCount}/${sec.totalCount}`}
          >
            <div
              className="h-1.5 rounded-full bg-gray-100"
              style={{ width: `${widthPct}%` }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: sec.color }}
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 0.2 + i * 0.08,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ===========================================================================
// 5. SectionDots — colored dots with opacity for status
// ===========================================================================

function SectionDots({
  sections,
  size = 6,
}: {
  sections: SectionNavItem[]
  size?: number
}) {
  return (
    <div className="flex items-center gap-1">
      {sections.map((sec, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: size,
            height: size,
            backgroundColor: sec.color,
            opacity:
              sec.status === 'complete'
                ? 1
                : sec.status === 'partial'
                  ? 0.4
                  : 0.15,
          }}
          title={`${sec.title}: ${sec.answeredCount}/${sec.totalCount}`}
        />
      ))}
    </div>
  )
}

// ===========================================================================
// 6. SemiGauge — semicircular SVG gauge (variant C)
// ===========================================================================

function SemiGauge({
  score,
  meta,
  width = 120,
  height = 70,
}: {
  score: number
  meta: number
  width?: number
  height?: number
}) {
  const scoreColor = getScoreColor(score)
  const cx = width / 2
  const cy = height
  const radius = Math.min(width / 2 - 8, height - 8)
  const startAngle = Math.PI
  const scoreSweep = (Math.min(score, 100) / 100) * Math.PI
  const metaSweep = (Math.min(meta, 100) / 100) * Math.PI

  function polarToCartesian(angle: number) {
    return {
      x: cx + radius * Math.cos(startAngle + angle),
      y: cy - radius * Math.sin(startAngle + angle),
    }
  }

  function arcPath(sweep: number) {
    const start = polarToCartesian(0)
    const end = polarToCartesian(sweep)
    const largeArc = sweep > Math.PI ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`
  }

  const metaPos = polarToCartesian(metaSweep)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={arcPath(Math.PI)}
        fill="none"
        stroke="#F3F4F6"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <motion.path
        d={arcPath(scoreSweep)}
        fill="none"
        stroke={scoreColor}
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      />
      <line
        x1={metaPos.x - 3}
        y1={metaPos.y - 3}
        x2={metaPos.x + 3}
        y2={metaPos.y + 3}
        stroke="#9CA3AF"
        strokeWidth={1.5}
        strokeDasharray="2 2"
      />
    </svg>
  )
}

// ===========================================================================
// 7. ConcentricRings — dual rings (variant E)
// ===========================================================================

function ConcentricRings({
  score,
  progress,
  size = 64,
  strokeWidth = 4,
}: {
  score: number
  progress: number
  size?: number
  strokeWidth?: number
}) {
  const center = size / 2
  const outerR = (size - strokeWidth) / 2
  const innerR = outerR - strokeWidth - 4
  const outerCirc = 2 * Math.PI * outerR
  const innerCirc = 2 * Math.PI * innerR
  const outerOffset = outerCirc * (1 - Math.min(progress, 100) / 100)
  const innerOffset = innerCirc * (1 - Math.min(score, 100) / 100)
  const scoreColor = getScoreColor(score)

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer ring - progress */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="#1E7A73"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={outerCirc}
          initial={{ strokeDashoffset: outerCirc }}
          animate={{ strokeDashoffset: outerOffset }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Inner ring - score */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={innerCirc}
          initial={{ strokeDashoffset: innerCirc }}
          animate={{ strokeDashoffset: innerOffset }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-xs font-black tabular-nums"
          style={{ color: scoreColor }}
        >
          {Math.round(score)}
        </span>
      </div>
    </div>
  )
}

// ===========================================================================
// 8. MiniMemberAvatar — small clickable avatar for attendance panels
// ===========================================================================

function MiniMemberAvatar({
  member,
  isPresent,
  onToggle,
  size = 32,
}: {
  member: TeamMember
  isPresent: boolean
  onToggle: () => void
  size?: number
}) {
  return (
    <motion.button
      onClick={onToggle}
      title={member.name}
      className={cn(
        'rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors',
        isPresent
          ? 'bg-primary-800 text-white ring-2 ring-green-400 ring-offset-1'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200',
      )}
      style={{ width: size, height: size, fontSize: size * 0.3 }}
      whileTap={{ scale: 0.92 }}
    >
      {getInitials(member.name)}
    </motion.button>
  )
}

// ===========================================================================
// 9. InlineAttendancePanel — reusable expandable attendance
// ===========================================================================

function InlineAttendancePanel({
  members,
  presentMembers,
  otherPeople,
  onToggleMember,
  onSetOtherPeople,
}: {
  members: TeamMember[]
  presentMembers: string[]
  otherPeople: string
  onToggleMember: (name: string) => void
  onSetOtherPeople: (value: string) => void
}) {
  const handleSelectAll = () => {
    for (const m of members) {
      if (!presentMembers.includes(m.name)) onToggleMember(m.name)
    }
  }
  const handleClearAll = () => {
    for (const m of members) {
      if (presentMembers.includes(m.name)) onToggleMember(m.name)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="tabular-nums">
          {presentMembers.length}/{members.length} presentes
        </span>
        <span className="text-gray-200">|</span>
        <button
          onClick={handleSelectAll}
          className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
        >
          Selecionar todos
        </button>
        <button
          onClick={handleClearAll}
          className="text-gray-400 hover:text-gray-500 cursor-pointer font-medium"
        >
          Limpar
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {members.map((m) => (
          <MiniMemberAvatar
            key={m.id}
            member={m}
            isPresent={presentMembers.includes(m.name)}
            onToggle={() => onToggleMember(m.name)}
            size={42}
          />
        ))}
      </div>
      <div>
        <Label>Outras pessoas (não cadastradas)</Label>
        <Input
          placeholder="Ex: João da equipe externa, Maria visitante..."
          value={otherPeople}
          onChange={(e) => onSetOtherPeople(e.target.value)}
        />
      </div>
    </div>
  )
}

// ===========================================================================
// 10. CheckSmall + PillStepProgress
// ===========================================================================

function CheckSmall() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PillStepProgress({
  current,
  max,
}: {
  current: number
  max: number
}) {
  const steps = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step, index) => {
        const isCompleted = step < current
        const isCurrent = step === current
        return (
          <motion.div
            key={step}
            className={cn(
              'relative flex items-center justify-center rounded-full transition-all',
              isCompleted &&
                'h-6 w-6 bg-gradient-to-br from-green-400 to-green-500 text-white shadow-sm',
              isCurrent &&
                'h-7 px-2.5 bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md',
              !isCompleted &&
                !isCurrent &&
                'h-6 w-6 bg-white/60 text-gray-400 border border-gray-200',
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
          >
            {isCompleted ? (
              <CheckSmall />
            ) : (
              <span
                className={cn(
                  'text-[10px] font-bold',
                  isCurrent && 'text-[11px]',
                )}
              >
                {step}
              </span>
            )}
          </motion.div>
        )
      })}
      <span className="ml-1.5 text-[10px] font-medium text-gray-400">
        Sequencia {current}/{max}
      </span>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT A — "Linear Metadata"
//
// ===========================================================================
// ===========================================================================

function VariantA(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    eligibility,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const progressPct =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0
  const scoreColor = getScoreColor(score)

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* ---- Identity region ---- */}
      <div className="relative p-5 pb-4">
        {/* Group type — top-right corner */}
        <span className="absolute top-4 right-5 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          {group.groupTypeName}
        </span>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5">
          <span>{group.managementName}</span>
          <span>/</span>
          <span>{group.areaName}</span>
        </div>

        {/* Title + badge */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            {group.name}
          </h2>
          <Badge
            variant={evalType === 'audit' ? 'default' : 'secondary'}
            className="text-[10px] uppercase tracking-wide"
          >
            {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
          </Badge>
        </div>

        {/* Metadata row — 4 pairs separated by vertical dividers */}
        <div className="flex items-center gap-4 text-xs">
          {/* Data */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Data</span>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => onSetEvaluationDate(e.target.value)}
              className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
            />
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Auditor */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Auditor</span>
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Sequencia */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Sequencia</span>
            <span className="text-gray-700 font-medium tabular-nums">
              {group.currentSequence}/{group.maxSequence}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Metrics region (bottom bar) ---- */}
      <div className="bg-gray-50/30 rounded-b-2xl border-t border-gray-100 px-5 py-3">
        <div className="flex items-center gap-6">
          {/* Score number + micro progress bar */}
          <div className="flex items-center gap-3 min-w-[120px]">
            <span
              className="text-2xl font-black tabular-nums"
              style={{ color: scoreColor }}
            >
              {Math.round(score)}
            </span>
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-gray-100 w-20">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: scoreColor }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(score, 100)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 block">
                Meta {meta}%
              </span>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200" />

          {/* Section micro bars with labels — 2x2 grid layout */}
          <div className="flex-1 min-w-0">
            <SectionMicroBars sections={sections} showLabels />
          </div>

          <div className="w-px h-10 bg-gray-200" />

          {/* Avatar stack + count */}
          <div className="flex items-center gap-2">
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={4}
              size={26}
              onClick={() => setAttendanceOpen(!attendanceOpen)}
            />
            <button
              onClick={() => setAttendanceOpen(!attendanceOpen)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
              <span className="tabular-nums font-medium">
                {presentMembers.length}/{group.team.length}
              </span>
              <ChevronDownIcon
                size={14}
                className={cn(
                  'transition-transform duration-200',
                  attendanceOpen && 'rotate-180',
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ---- Expandable attendance panel ---- */}
      <AnimatePresence>
        {attendanceOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT B — "Glass Triptych"
//
// ===========================================================================
// ===========================================================================

function VariantB(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    eligibility,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const scoreColor = getScoreColor(score)

  const glassStyle =
    'bg-white/85 backdrop-blur-[20px] border border-white/60 rounded-2xl shadow-[0_4px_24px_rgba(30,122,115,0.06)]'

  return (
    <div className="flex gap-4">
      {/* ---- Card 1: Identity ---- */}
      <div className={cn(glassStyle, 'flex-1 relative overflow-hidden p-5')}>
        {/* Wave watermark behind */}
        <EvalWaveWatermark />

        <div className="relative z-10">
          {/* Breadcrumb */}
          <div className="text-[11px] text-gray-400 mb-1">
            {group.managementName} / {group.areaName}
          </div>

          {/* Title + badge */}
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {group.name}
            </h2>
            <Badge
              variant={evalType === 'audit' ? 'default' : 'secondary'}
              className="text-[10px] uppercase tracking-wide flex-shrink-0"
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </Badge>
          </div>

          {/* Inline form fields */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 w-14 flex-shrink-0">Data</span>
              <input
                type="date"
                value={evaluationDate}
                onChange={(e) => onSetEvaluationDate(e.target.value)}
                className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 w-14 flex-shrink-0">Auditor</span>
              <span className="text-gray-700 font-medium">{userName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 w-14 flex-shrink-0">Tipo</span>
              <span className="text-gray-700 font-medium">{group.groupTypeName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Card 2: Performance ---- */}
      <div
        className={cn(glassStyle, 'w-[220px] flex-shrink-0 overflow-hidden')}
        style={{ borderTopWidth: 2, borderTopColor: scoreColor }}
      >
        <div className="p-4 flex flex-col items-center">
          {/* ScoreRing centered */}
          <ScoreRing score={score} meta={meta} size={72} strokeWidth={5} />

          <span className="text-[10px] text-gray-400 mt-1.5 mb-3">
            Meta {meta}%
          </span>

          {/* Section vertical list */}
          <div className="w-full mb-3 space-y-1.5">
            {sections.map((sec, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: sec.color }}
                />
                <span className="text-[10px] text-gray-600 flex-1 truncate">
                  {sec.title}
                </span>
                <span className="text-[10px] text-gray-500 tabular-nums flex-shrink-0">
                  {sec.answeredCount}/{sec.totalCount}
                </span>
              </div>
            ))}
          </div>

          {/* Answered count */}
          <div className="text-center">
            <span className="text-xs text-gray-500 font-medium tabular-nums">
              {answeredCount}/{totalQuestions}
            </span>
            <span className="text-[10px] text-gray-400 ml-1">respondidas</span>
          </div>
        </div>
      </div>

      {/* ---- Card 3: Team ---- */}
      <div className={cn(glassStyle, 'w-[200px] flex-shrink-0 p-4')}>
        {/* Title */}
        <h3 className="text-xs font-semibold text-gray-600 mb-2">Equipe</h3>

        {/* Count large */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-black text-gray-900 tabular-nums">
            {presentMembers.length}
          </span>
          <span className="text-xs text-gray-400">
            / {group.team.length} presentes
          </span>
        </div>

        {/* Avatar stack — prioritize present */}
        <div className="mb-3">
          <AvatarStack
            members={group.team}
            presentMembers={presentMembers}
            max={6}
            size={26}
            prioritizePresent
          />
        </div>

        {/* Select all / Clear */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => {
              for (const m of group.team) {
                if (!presentMembers.includes(m.name)) onToggleMember(m.name)
              }
            }}
            className="text-[10px] text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
          >
            Todos
          </button>
          <button
            onClick={() => {
              for (const m of group.team) {
                if (presentMembers.includes(m.name)) onToggleMember(m.name)
              }
            }}
            className="text-[10px] text-gray-400 hover:text-gray-500 cursor-pointer font-medium"
          >
            Limpar
          </button>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setAttendanceOpen(!attendanceOpen)}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          <span>{attendanceOpen ? 'Recolher' : 'Expandir'}</span>
          <ChevronDownIcon
            size={12}
            className={cn(
              'transition-transform duration-200',
              attendanceOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Expandable member list */}
        <AnimatePresence>
          {attendanceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {group.team.map((m) => (
                    <MiniMemberAvatar
                      key={m.id}
                      member={m}
                      isPresent={presentMembers.includes(m.name)}
                      onToggle={() => onToggleMember(m.name)}
                      size={24}
                    />
                  ))}
                </div>
                <div>
                  <Label className="text-[10px]">
                    Outras pessoas
                  </Label>
                  <Input
                    placeholder="Nomes..."
                    value={otherPeople}
                    onChange={(e) => onSetOtherPeople(e.target.value)}
                    className="text-xs h-7"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT C — "Cockpit Grid"
//
// ===========================================================================
// ===========================================================================

function VariantC(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    eligibility,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const scoreColor = getScoreColor(score)
  const progressPct =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  // Mini KPI data — 3 items, vertically stacked
  const miniKpis = [
    {
      label: 'Respondidas',
      value: `${answeredCount}/${totalQuestions}`,
      color: '#1E7A73',
    },
    {
      label: 'Meta',
      value: `${meta}%`,
      color: '#9CA3AF',
    },
    {
      label: 'Elegivel',
      value: eligibility.eligible ? 'Sim' : 'Nao',
      color: eligibility.eligible ? '#00A650' : '#CE3C5A',
    },
  ]

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* ---- Main 2x2 grid ---- */}
      <div className="grid grid-cols-[1fr_240px]">
        {/* [0,0] — Identity */}
        <div className="p-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5">
            <span>{group.managementName}</span>
            <span>/</span>
            <span>{group.areaName}</span>
          </div>

          {/* Title + badge */}
          <div className="flex items-center gap-2.5 mb-2">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {group.name}
            </h2>
            <Badge
              variant={evalType === 'audit' ? 'default' : 'secondary'}
              className="text-[10px] uppercase tracking-wide"
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </Badge>
          </div>

          {/* Group type label */}
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            {group.groupTypeName}
          </span>
        </div>

        {/* [0,1] — SemiGauge + score */}
        <div className="border-l border-gray-100 p-4 flex flex-col items-center justify-center">
          <SemiGauge score={score} meta={meta} width={140} height={80} />
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              className="text-xl font-black tabular-nums"
              style={{ color: scoreColor }}
            >
              {Math.round(score)}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              / Meta {meta}%
            </span>
          </div>
        </div>

        {/* [1,0] — Form fields left + equipe right with separator */}
        <div className="border-t border-gray-100 p-5 py-4">
          <div className="flex items-start">
            {/* Left: form fields */}
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 w-14 flex-shrink-0">Data</span>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => onSetEvaluationDate(e.target.value)}
                  className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 w-14 flex-shrink-0">
                  Auditor
                </span>
                <span className="text-gray-700 font-medium">{userName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 w-14 flex-shrink-0">Tipo</span>
                <span className="text-gray-700 font-medium">
                  {group.groupTypeName}
                </span>
              </div>
            </div>

            {/* Vertical separator */}
            <div className="w-px h-16 bg-gray-100 mx-5" />

            {/* Right: equipe */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  Equipe
                </span>
                <span className="text-xs text-gray-700 font-semibold tabular-nums">
                  {presentMembers.length}/{group.team.length}
                </span>
              </div>
              <AvatarStack
                members={group.team}
                presentMembers={presentMembers}
                max={5}
                size={26}
                onClick={() => setAttendanceOpen(!attendanceOpen)}
              />
              <button
                onClick={() => setAttendanceOpen(!attendanceOpen)}
                className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <span>{attendanceOpen ? 'Recolher' : 'Gerenciar'}</span>
                <ChevronDownIcon
                  size={12}
                  className={cn(
                    'transition-transform duration-200',
                    attendanceOpen && 'rotate-180',
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* [1,1] — Vertical KPI stack */}
        <div className="border-t border-l border-gray-100 flex flex-col divide-y divide-gray-100">
          {miniKpis.map((kpi, i) => (
            <div
              key={i}
              className="flex-1 px-4 py-2.5 flex items-center gap-2.5"
            >
              <div
                className="w-1 h-5 rounded-full flex-shrink-0"
                style={{ backgroundColor: kpi.color }}
              />
              <span className="text-[11px] text-gray-500 flex-1">
                {kpi.label}
              </span>
              <span className="text-sm font-bold text-gray-900 tabular-nums">
                {kpi.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Expandable attendance panel below grid ---- */}
      <AnimatePresence>
        {attendanceOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D — "Floating Islands"
//
// ===========================================================================
// ===========================================================================

function VariantD1(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const scoreColor = getScoreColor(score)

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* ---- 65/35 split main layout ---- */}
      <div className="grid grid-cols-[1.85fr_1fr]">
        {/* ============================================================
            LEFT ZONE (65%) — Editorial Hero
        ============================================================ */}
        <div className="p-6">
          {/* Top row: breadcrumb + badge tipo */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] text-gray-400">
              {group.managementName} / {group.areaName}
            </div>
            <Badge
              variant={evalType === 'audit' ? 'default' : 'secondary'}
              className="text-[10px] uppercase tracking-wide flex-shrink-0"
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </Badge>
          </div>

          {/* Hero title */}
          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight truncate">
            {group.name}
          </h2>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium mt-1 block">
            {group.groupTypeName}
          </span>

          {/* Subtle divider */}
          <div className="h-px bg-gray-100 my-5" />

          {/* Editorial form grid */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                Data
              </div>
              <input
                type="date"
                value={evaluationDate}
                onChange={(e) => onSetEvaluationDate(e.target.value)}
                className="bg-transparent cursor-pointer text-sm font-medium text-gray-800 outline-none p-0 border-b border-transparent hover:border-gray-300 transition-colors"
              />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                Auditor
              </div>
              <span className="text-sm font-medium text-gray-800 border-b border-transparent hover:border-gray-300 transition-colors">
                {userName}
              </span>
            </div>
          </div>

          {/* Team strip */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              Equipe
            </span>
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={6}
              size={26}
              prioritizePresent
            />
            <span className="text-xs text-gray-500 tabular-nums">
              {presentMembers.length}/{group.team.length} presentes
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setTeamOpen(!teamOpen)}
              className="flex items-center gap-1 text-[11px] text-primary-600 hover:text-primary-700 cursor-pointer font-medium transition-colors"
            >
              {teamOpen ? 'Recolher' : 'Gerenciar'}
              <ChevronDownIcon
                size={12}
                className={cn(
                  'transition-transform duration-200',
                  teamOpen && 'rotate-180',
                )}
              />
            </button>
          </div>
        </div>

        {/* ============================================================
            RIGHT ZONE (35%) — Stats Dashboard
        ============================================================ */}
        <div className="bg-gray-50/40 border-l border-gray-100 p-5">
          {/* Score block */}
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Nota Atual
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span
              className="text-4xl font-black tabular-nums leading-none"
              style={{ color: scoreColor }}
            >
              {Math.round(score)}
            </span>
            <span className="text-lg text-gray-400 font-normal">%</span>
          </div>
          <div className="text-[11px] text-gray-400 mb-2">Meta {meta}%</div>
          <div className="h-1 w-full rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(score, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-4" />

          {/* Sections vertical list */}
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium mb-2">
            Grupos
          </div>
          <div className="space-y-2">
            {sections.map((sec, i) => {
              const pct =
                sec.totalCount > 0
                  ? (sec.answeredCount / sec.totalCount) * 100
                  : 0
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sec.color }}
                  />
                  <span className="text-[11px] text-gray-700 flex-1 truncate">
                    {sec.title}
                  </span>
                  <span className="text-[10px] text-gray-500 tabular-nums flex-shrink-0">
                    {sec.answeredCount}/{sec.totalCount}
                  </span>
                  <div className="w-10 h-1 rounded-full bg-gray-200 flex-shrink-0">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: sec.color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                        delay: 0.3 + i * 0.08,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total progress */}
          <div className="text-[10px] text-gray-400 mt-3 tabular-nums">
            {answeredCount}/{totalQuestions} perguntas respondidas
          </div>
        </div>
      </div>

      {/* ---- Expandable team panel ---- */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D2 — "Wave Crest"
//  Dark wave banner + light bottom strip
//
// ===========================================================================
// ===========================================================================

function VariantD2(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ============================================================
          ZONA 1 — Dark Wave Banner
      ============================================================ */}
      <div
        className="relative overflow-hidden px-6 py-5"
        style={{
          background:
            'linear-gradient(135deg, #103734 0%, #155F59 40%, #1E7A73 80%, #3AA39C 100%)',
        }}
      >
        {/* Wave watermark overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <EvalWaveWatermark />
        </div>

        <div className="relative z-10">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-white/50">
              {group.managementName} / {group.areaName}
            </div>
            <span className="bg-white/15 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
          </div>

          {/* Middle row — title + score */}
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-black text-white tracking-tight truncate">
                {group.name}
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium mt-1 block">
                {group.groupTypeName}
              </span>
            </div>

            <div className="flex flex-col items-center flex-shrink-0">
              <ScoreRing
                score={score}
                meta={meta}
                size={80}
                strokeWidth={5}
                strokeColor="white"
                textColor="white"
                metaMarkerColor="#DDDD03"
              />
              <span className="text-[10px] text-white/50 mt-1.5 tabular-nums">
                Meta {meta}%
              </span>
              <span className="text-[10px] text-white/40 tabular-nums">
                {answeredCount}/{totalQuestions} perguntas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ZONA 2 — Light Bottom Strip
      ============================================================ */}
      <div className="bg-white px-6 py-4 flex items-start gap-5">
        {/* Form */}
        <div className="flex-[1.3] space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 flex-shrink-0"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-gray-400 font-medium">Data</span>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => onSetEvaluationDate(e.target.value)}
              className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 flex-shrink-0"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-gray-400 font-medium">Auditor</span>
            <span className="text-sm font-medium text-gray-700">
              {userName}
            </span>
          </div>
        </div>

        <div className="w-px h-12 bg-gray-200" />

        {/* Sections */}
        <div className="flex-[2] min-w-0">
          <SectionMicroBars sections={sections} showLabels />
        </div>

        <div className="w-px h-12 bg-gray-200" />

        {/* Team */}
        <div className="flex-[1] min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Equipe
          </div>
          <div className="flex items-center gap-2 mb-1">
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={4}
              size={24}
              prioritizePresent
              onClick={() => setTeamOpen(!teamOpen)}
            />
          </div>
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-700 cursor-pointer font-medium transition-colors"
          >
            <span className="tabular-nums">
              {presentMembers.length}/{group.team.length} presentes
            </span>
            <ChevronDownIcon
              size={12}
              className={cn(
                'transition-transform duration-200',
                teamOpen && 'rotate-180',
              )}
            />
          </button>
        </div>
      </div>

      {/* Expandable attendance panel */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D3 — "Gold Trim Elite"
//  Dark + gold accents premium
//
// ===========================================================================
// ===========================================================================

function VariantD3(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const pontos = Math.round((score * totalQuestions) / 100)

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ============================================================
          ZONA 1 — Dark Elite Header with gold trim
      ============================================================ */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #103734 0%, #155F59 50%, #1E7A73 100%)',
        }}
      >
        {/* Gold trim top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DDDD03]/50 to-transparent z-20" />

        {/* Diamond watermark */}
        <InlineDiamondWatermark />

        <div className="relative z-10 px-6 py-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="bg-[#DDDD03]/10 text-[#DDDD03] border border-[#DDDD03]/30 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
                {group.groupTypeName}
              </span>
            </div>
            <div className="text-xs text-white/40">
              {group.managementName} / {group.areaName}
            </div>
          </div>

          {/* Center row — title + score */}
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-white tracking-tight truncate flex-1 min-w-0">
              {group.name}
            </h2>

            <div className="flex items-center gap-3 flex-shrink-0">
              <ScoreRing
                score={score}
                meta={meta}
                size={64}
                strokeWidth={4}
                strokeColor="white"
                textColor="white"
                metaMarkerColor="#DDDD03"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tabular-nums">
                  {Math.round(score)}%
                </span>
                <span className="text-[10px] text-[#DDDD03]/80 tabular-nums">
                  Meta {meta}%
                </span>
                <span className="text-[10px] text-white/40 tabular-nums">
                  Pontos {pontos}/{totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gold trim bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#867F06] to-transparent z-20" />
      </div>

      {/* ============================================================
          ZONA 2 — Light Content
      ============================================================ */}
      <div className="bg-white px-6 py-4">
        {/* Form row */}
        <div className="flex items-center gap-4 text-xs mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Data</span>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => onSetEvaluationDate(e.target.value)}
              className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
            />
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Auditor</span>
            <span className="text-sm font-medium text-gray-700">
              {userName}
            </span>
          </div>
        </div>

        {/* Subtle gold divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#DDDD03]/20 to-transparent my-3" />

        {/* Sections + Team row */}
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <SectionMicroBars sections={sections} showLabels />
          </div>

          <div className="w-px h-12 bg-gray-200" />

          <div className="flex-shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
              Equipe
            </div>
            <div className="flex items-center gap-2 mb-1">
              <AvatarStack
                members={group.team}
                presentMembers={presentMembers}
                max={4}
                size={24}
                prioritizePresent
                onClick={() => setTeamOpen(!teamOpen)}
              />
            </div>
            <button
              onClick={() => setTeamOpen(!teamOpen)}
              className="flex items-center gap-1 text-[10px] text-[#867F06] hover:text-[#DDDD03] cursor-pointer font-medium transition-colors"
            >
              <span className="tabular-nums">
                {presentMembers.length}/{group.team.length}
              </span>
              <ChevronDownIcon
                size={12}
                className={cn(
                  'transition-transform duration-200',
                  teamOpen && 'rotate-180',
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable attendance panel */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D4 — "Colored Stream Bands"
//  Compact dark header + full-width colored section bands
//
// ===========================================================================
// ===========================================================================

function VariantD4(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ============================================================
          ZONA 1 — Compact Dark Header
      ============================================================ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #103734 0%, #1E7A73 100%)',
        }}
      >
        {/* Wave watermark overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <EvalWaveWatermark />
        </div>

        <div className="relative z-10 px-6 py-3 flex items-center gap-4">
          {/* Left: breadcrumb + title */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/40">
              {group.managementName} / {group.areaName}
            </div>
            <h2 className="text-lg font-bold text-white truncate">
              {group.name}
            </h2>
          </div>

          {/* Center: badge + type */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="bg-white/15 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold mb-0.5">
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">
              {group.groupTypeName}
            </span>
          </div>

          {/* Right: score ring compact */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ScoreRing
              score={score}
              meta={meta}
              size={56}
              strokeWidth={4}
              strokeColor="white"
              textColor="white"
              metaMarkerColor="#DDDD03"
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/50 tabular-nums">
                Meta {meta}%
              </span>
              <span className="text-[10px] text-white/40 tabular-nums">
                {answeredCount}/{totalQuestions} perguntas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ZONA 2 — Colored Section Bands
      ============================================================ */}
      <div className="flex flex-col">
        {sections.map((sec, i) => {
          const pct =
            sec.totalCount > 0 ? (sec.answeredCount / sec.totalCount) * 100 : 0
          return (
            <div
              key={i}
              className="relative flex items-center gap-3 px-6 py-2.5"
              style={{
                backgroundColor: `${sec.color}0D`,
                borderTop: `1px solid ${sec.color}33`,
              }}
            >
              {/* Left color accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: sec.color }}
              />
              {/* Color block */}
              <div
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ backgroundColor: sec.color }}
              />
              {/* Section name */}
              <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
                {sec.title}
              </span>
              {/* Count */}
              <span className="text-xs text-gray-500 tabular-nums flex-shrink-0">
                {sec.answeredCount}/{sec.totalCount}
              </span>
              {/* Spacer */}
              <div className="flex-1" />
              {/* Progress bar */}
              <div className="h-1.5 w-48 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: sec.color }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: 0.2 + i * 0.08,
                  }}
                />
              </div>
              {/* Percentage */}
              <span
                className="text-xs font-bold tabular-nums flex-shrink-0 w-10 text-right"
                style={{ color: sec.color }}
              >
                {Math.round(pct)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* ============================================================
          ZONA 3 — Light Bottom Strip
      ============================================================ */}
      <div className="bg-gray-50/30 px-6 py-3 flex items-center gap-4 border-t border-gray-100">
        {/* Form */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Data</span>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => onSetEvaluationDate(e.target.value)}
              className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
            />
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-medium">Auditor</span>
            <span className="text-sm font-medium text-gray-700">
              {userName}
            </span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Team */}
        <div className="flex items-center gap-2">
          <AvatarStack
            members={group.team}
            presentMembers={presentMembers}
            max={4}
            size={24}
            prioritizePresent
            onClick={() => setTeamOpen(!teamOpen)}
          />
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          >
            <span className="tabular-nums font-medium">
              {presentMembers.length}/{group.team.length}
            </span>
            <span className="text-gray-400">presentes</span>
            <ChevronDownIcon
              size={12}
              className={cn(
                'transition-transform duration-200 text-gray-400',
                teamOpen && 'rotate-180',
              )}
            />
          </button>
        </div>
      </div>

      {/* Expandable attendance panel */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D5 — "Aurora Glass"
//  Mesh gradient + glass overlay, single-layer dark
//
// ===========================================================================
// ===========================================================================

function VariantD5(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const pontos = Math.round((score * totalQuestions) / 100)

  return (
    <div
      className="rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(16,55,52,0.12)] overflow-hidden relative"
      style={{
        backgroundColor: '#103734',
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(30,122,115,0.6) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(0,166,80,0.3) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 80%, rgba(58,163,156,0.4) 0%, transparent 55%),
          linear-gradient(135deg, #103734 0%, #155F59 100%)
        `,
      }}
    >
      {/* Diamond watermark */}
      <InlineDiamondWatermark />

      {/* Content */}
      <div className="relative z-10 px-6 py-6 grid grid-cols-[1.6fr_1fr] gap-6">
        {/* ============================================================
            LEFT — Identity + Form + Team
        ============================================================ */}
        <div>
          <div className="text-[11px] text-white/40 mb-1">
            {group.managementName} / {group.areaName}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight truncate mb-2">
            {group.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-white/15 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">
              {group.groupTypeName}
            </span>
          </div>

          <div className="h-px bg-white/10 my-4" />

          {/* Form grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
                Data
              </span>
              <div className="mt-1">
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => onSetEvaluationDate(e.target.value)}
                  className="bg-transparent cursor-pointer text-sm font-medium text-white outline-none p-0 border-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
                Auditor
              </span>
              <div className="mt-1">
                <span className="text-sm font-medium text-white">
                  {userName}
                </span>
              </div>
            </div>
          </div>

          {/* Team strip */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
              Equipe
            </span>
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={5}
              size={24}
              prioritizePresent
              onClick={() => setTeamOpen(!teamOpen)}
            />
            <span className="text-xs text-white/70 tabular-nums">
              {presentMembers.length}/{group.team.length}
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setTeamOpen(!teamOpen)}
              className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white cursor-pointer font-medium transition-colors"
            >
              {teamOpen ? 'Recolher' : 'Gerenciar'}
              <ChevronDownIcon
                size={12}
                className={cn(
                  'transition-transform duration-200',
                  teamOpen && 'rotate-180',
                )}
              />
            </button>
          </div>
        </div>

        {/* ============================================================
            RIGHT — Score + Sections
        ============================================================ */}
        <div>
          <div className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
            Nota Atual
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-5xl font-black text-white tabular-nums leading-none">
              {Math.round(score)}
            </span>
            <span className="text-xl text-white/50 font-normal">%</span>
          </div>
          <div className="text-[10px] text-white/50 mt-1 tabular-nums">
            Meta {meta}% &middot; Pontos {pontos}/{totalQuestions}
          </div>

          <div className="h-px bg-white/10 my-3" />

          <div className="text-[9px] uppercase tracking-wider text-white/40 font-medium mb-2">
            Grupos
          </div>
          <div className="space-y-1.5">
            {sections.map((sec, i) => {
              const pct =
                sec.totalCount > 0
                  ? (sec.answeredCount / sec.totalCount) * 100
                  : 0
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sec.color }}
                  />
                  <span className="text-[11px] text-white/80 flex-1 truncate">
                    {sec.title}
                  </span>
                  <span className="text-[10px] text-white/40 tabular-nums flex-shrink-0">
                    {sec.answeredCount}/{sec.totalCount}
                  </span>
                  <div className="w-10 h-1 rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white/70"
                      initial={{ width: '0%' }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                        delay: 0.3 + i * 0.08,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-[10px] text-white/40 mt-2 tabular-nums">
            {answeredCount}/{totalQuestions} perguntas
          </div>
        </div>
      </div>

      {/* Expandable attendance panel — light zone */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="px-6 py-4 bg-white border-t border-white/10">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D6 — "Contained Gradient Title"
//  Branco com bloco gradiente contido somente ao redor do titulo
//
// ===========================================================================
// ===========================================================================

function VariantD6(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const pontos = Math.round((score * totalQuestions) / 100)

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* ============================================================
          TOP — Breadcrumb (white) + Contained Gradient Title Card
      ============================================================ */}
      <div className="px-6 pt-5 pb-4">
        {/* Breadcrumb on white */}
        <div className="text-[11px] text-gray-400 mb-3">
          {group.managementName} / {group.areaName}
        </div>

        {/* CONTAINED GRADIENT TITLE BLOCK */}
        <div
          className="relative overflow-hidden rounded-xl px-5 py-4 shadow-[0_4px_16px_rgba(16,55,52,0.12)]"
          style={{
            background:
              'linear-gradient(135deg, #103734 0%, #155F59 50%, #1E7A73 100%)',
          }}
        >
          {/* Wave watermark */}
          <div className="absolute inset-0 pointer-events-none">
            <EvalWaveWatermark />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            {/* Left: title + badge + type */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-white tracking-tight truncate">
                {group.name}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-white/15 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                  {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
                </span>
                <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium">
                  {group.groupTypeName}
                </span>
              </div>
            </div>

            {/* Right: score ring white */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <ScoreRing
                score={score}
                meta={meta}
                size={60}
                strokeWidth={4}
                strokeColor="white"
                textColor="white"
                metaMarkerColor="#DDDD03"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 tabular-nums">
                  Meta {meta}%
                </span>
                <span className="text-[10px] text-white/60 tabular-nums">
                  Pontos {pontos}/{totalQuestions}
                </span>
                <span className="text-[10px] text-white/40 tabular-nums">
                  {answeredCount}/{totalQuestions} perguntas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          BOTTOM — Light content (form + sections + team)
      ============================================================ */}
      <div className="px-6 pb-4 space-y-4">
        {/* Form row */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 flex-shrink-0"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-gray-400 font-medium">Data</span>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => onSetEvaluationDate(e.target.value)}
              className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
            />
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 flex-shrink-0"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-gray-400 font-medium">Auditor</span>
            <span className="text-sm font-medium text-gray-700">
              {userName}
            </span>
          </div>
          <div className="flex-1" />
          {/* Team compact right-aligned */}
          <div className="flex items-center gap-2">
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={4}
              size={24}
              prioritizePresent
              onClick={() => setTeamOpen(!teamOpen)}
            />
            <button
              onClick={() => setTeamOpen(!teamOpen)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            >
              <span className="tabular-nums font-medium">
                {presentMembers.length}/{group.team.length}
              </span>
              <span className="text-gray-400">presentes</span>
              <ChevronDownIcon
                size={12}
                className={cn(
                  'transition-transform duration-200 text-gray-400',
                  teamOpen && 'rotate-180',
                )}
              />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Sections with labels */}
        <SectionMicroBars sections={sections} showLabels />
      </div>

      {/* Expandable attendance panel */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D7 — "Split Gradient Editorial"
//  D1 com zona esquerda em gradient dark + zona direita branca
//
// ===========================================================================
// ===========================================================================

function VariantD7(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const scoreColor = getScoreColor(score)

  return (
    <div>
      {/* ---- Bento grid: 2 separate cards with gap ---- */}
      <div className="grid grid-cols-[1.85fr_1fr] gap-4">
        {/* ============================================================
            CARD 1 (65%) — Editorial Hero on DARK GRADIENT
        ============================================================ */}
        <div
          className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm p-6"
          style={{
            background:
              'linear-gradient(135deg, #103734 0%, #155F59 50%, #1E7A73 100%)',
          }}
        >
          {/* Wave watermark overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <EvalWaveWatermark />
          </div>

          <div className="relative z-10">
            {/* Top row: breadcrumb + badge tipo */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] text-white/50">
                {group.managementName} / {group.areaName}
              </div>
              <span className="bg-white/15 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0 uppercase tracking-wide">
                {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
              </span>
            </div>

            {/* Hero title */}
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight truncate">
              {group.name}
            </h2>
            <span className="text-xs uppercase tracking-wider text-white/50 font-medium mt-1 block">
              {group.groupTypeName}
            </span>

            {/* Subtle divider */}
            <div className="h-px bg-white/15 my-5" />

            {/* Editorial form grid */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-white/50 font-medium mb-1">
                  Data
                </div>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => onSetEvaluationDate(e.target.value)}
                  className="bg-transparent cursor-pointer text-sm font-medium text-white outline-none p-0 border-b border-transparent hover:border-white/40 transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-white/50 font-medium mb-1">
                  Auditor
                </div>
                <span className="text-sm font-medium text-white border-b border-transparent hover:border-white/40 transition-colors">
                  {userName}
                </span>
              </div>
            </div>

            {/* Team strip */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/15">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
                Equipe
              </span>
              <AvatarStack
                members={group.team}
                presentMembers={presentMembers}
                max={6}
                size={26}
                prioritizePresent
              />
              <span className="text-xs text-white/70 tabular-nums">
                {presentMembers.length}/{group.team.length} presentes
              </span>
              <div className="flex-1" />
              <button
                onClick={() => setTeamOpen(!teamOpen)}
                className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white cursor-pointer font-medium transition-colors"
              >
                {teamOpen ? 'Recolher' : 'Gerenciar'}
                <ChevronDownIcon
                  size={12}
                  className={cn(
                    'transition-transform duration-200',
                    teamOpen && 'rotate-180',
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            CARD 2 (35%) — Stats Dashboard (WHITE)
        ============================================================ */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
          {/* Score block */}
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Nota Atual
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span
              className="text-4xl font-black tabular-nums leading-none"
              style={{ color: scoreColor }}
            >
              {Math.round(score)}
            </span>
            <span className="text-lg text-gray-400 font-normal">%</span>
          </div>
          <div className="text-[11px] text-gray-400 mb-2">Meta {meta}%</div>
          <div className="h-1 w-full rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(score, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-4" />

          {/* Sections vertical list */}
          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium mb-2">
            Grupos
          </div>
          <div className="space-y-2">
            {sections.map((sec, i) => {
              const pct =
                sec.totalCount > 0
                  ? (sec.answeredCount / sec.totalCount) * 100
                  : 0
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sec.color }}
                  />
                  <span className="text-[11px] text-gray-700 flex-1 truncate">
                    {sec.title}
                  </span>
                  <span className="text-[10px] text-gray-500 tabular-nums flex-shrink-0">
                    {sec.answeredCount}/{sec.totalCount}
                  </span>
                  <div className="w-10 h-1 rounded-full bg-gray-200 flex-shrink-0">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: sec.color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                        delay: 0.3 + i * 0.08,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total progress */}
          <div className="text-[10px] text-gray-400 mt-3 tabular-nums">
            {answeredCount}/{totalQuestions} perguntas respondidas
          </div>
        </div>
      </div>

      {/* ---- Expandable team panel (below left card) ---- */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden mt-4"
          >
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm px-6 py-4">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT D8 — "Aurora Glass + Section Cards Footer"
//  Clone do D5 com section cards row do E como footer
//
// ===========================================================================
// ===========================================================================

function HeroStepProgress({ current, max }: { current: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => {
          const step = i + 1
          const isCompleted = step < current
          const isCurrent = step === current
          return (
            <Fragment key={step}>
              <div
                className={`rounded-full flex-shrink-0 ${
                  isCurrent ? 'w-2.5 h-2.5 bg-white'
                  : isCompleted ? 'w-2 h-2 bg-white'
                  : 'w-2 h-2 bg-white/25'
                }`}
                style={isCurrent ? { boxShadow: '0 0 0 3px rgba(255,255,255,0.2)' } : undefined}
              />
              {step < max && (
                <div className={`h-[1.5px] w-3 ${step < current ? 'bg-white/40' : 'bg-white/12'}`} />
              )}
            </Fragment>
          )
        })}
      </div>
      <span className="text-[9px] text-white/50 uppercase tracking-[0.15em] font-semibold tabular-nums ml-0.5">
        Passo {current}
      </span>
    </div>
  )
}

function VariantD8(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    pointsBreakdown,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const earned = pointsBreakdown?.earned ?? 0
  const max = pointsBreakdown?.max ?? 0
  const pct = pointsBreakdown?.percentage ?? 0
  const scoreColor = getScoreColor(pct)
  const metaPoints = Math.round(((meta / 100) * max) * 10) / 10
  const formatPts = (n: number): string =>
    Number.isInteger(n) ? n.toString() : n.toFixed(1)

  return (
    <div
      className="rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(16,55,52,0.16)] overflow-hidden relative"
      style={{
        background:
          'linear-gradient(135deg, #103734 0%, #155F59 35%, #1E7A73 70%, #3AA39C 100%)',
      }}
    >
      {/* Wrapper: contains watermarks + content, above footer */}
      <div className="relative">
        {/* Layer 1: Diamond watermark — randomized organic feel */}
        <InlineDiamondWatermark opacityBase={0.012} opacityVariance={0.012} />

        {/* Layer 2: Wave watermark — adds organic motion */}
        <InlineWaveWatermark />

        {/* Layer 3: Content — full width */}
        <div className="relative z-10 px-6 py-6">
        {/* ============================================================
            Identity + Form + Team (full width)
        ============================================================ */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white/40 mb-1">
                {group.managementName} / {group.areaName}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight truncate">
                {group.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">
                  {group.groupTypeName}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
              <span
                className="text-white/90 text-xs uppercase tracking-[0.2em] font-medium px-5 py-2 rounded-lg"
                style={{
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.35)',
                }}
              >
                {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
              </span>
              {evalType === 'audit' && (
                <HeroStepProgress current={group.currentSequence} max={group.maxSequence} />
              )}
            </div>
          </div>

          <div className="h-px bg-white/10 my-5" />

          {/* Aligned row: Data left | Auditor center | Presenca right */}
          <div className="grid grid-cols-3 gap-4 items-start">
            {/* ---- Column 1: Data (left) ---- */}
            <div className="justify-self-start flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold leading-none h-[10px]">
                Data
              </span>
              <div className="mt-2.5 h-9 flex items-center">
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => onSetEvaluationDate(e.target.value)}
                  className="bg-transparent cursor-pointer text-sm font-medium text-white outline-none p-0 border-none leading-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* ---- Column 2: Auditor (center) ---- */}
            <div className="justify-self-center flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold leading-none h-[10px]">
                Auditor
              </span>
              <div className="mt-2.5 h-9 flex items-center">
                <span className="text-sm font-medium text-white leading-none">
                  {userName}
                </span>
              </div>
            </div>

            {/* ---- Column 3: Presenca (right) ---- */}
            <div className="justify-self-end flex flex-col items-end">
              <div className="flex items-center gap-1.5 leading-none h-[10px]">
                <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">
                  Presenca
                </span>
                <span className="text-[9px] text-white/70 tabular-nums font-bold">
                  {presentMembers.length}/{group.team.length}
                </span>
              </div>
              <div className="mt-2.5 h-9 flex items-center gap-3">
                <AvatarStack
                  members={group.team}
                  presentMembers={presentMembers}
                  max={5}
                  size={32}
                  prioritizePresent
                  onClick={() => setTeamOpen(!teamOpen)}
                />
                <button
                  onClick={() => setTeamOpen(!teamOpen)}
                  className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white cursor-pointer font-medium transition-colors"
                >
                  {teamOpen ? 'Recolher' : 'Gerenciar'}
                  <ChevronDownIcon
                    size={12}
                    className={cn(
                      'transition-transform duration-200',
                      teamOpen && 'rotate-180',
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ============================================================
          FOOTER — Nota e Meta com % grande + pontos discretos
      ============================================================ */}
      <div className="relative z-10 px-6 py-3 border-t border-white/10 bg-black/10 flex items-center gap-6">
        {/* NOTA */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
            Nota
          </span>
          <div className="flex flex-col leading-none">
            <span
              className="text-xl font-black tabular-nums"
              style={{ color: scoreColor }}
            >
              {Math.round(pct)}%
            </span>
            <span className="text-[9px] text-white/40 tabular-nums mt-1">
              {formatPts(earned)}/{max} pts
            </span>
          </div>
          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>

        <div className="w-px h-10 bg-white/10" />

        {/* META */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
            Meta
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-white/80 tabular-nums">
              {meta}%
            </span>
            <span className="text-[9px] text-white/40 tabular-nums mt-1">
              {formatPts(metaPoints)}/{max} pts
            </span>
          </div>
        </div>

        <div className="flex-1" />

        <span className="text-xs text-white/50 tabular-nums">
          {answeredCount}/{totalQuestions} perguntas
        </span>
      </div>

      {/* Expandable attendance panel — light zone */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="px-6 py-4 bg-white border-t border-white/10">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT E — "Unified Panel"
//
// ===========================================================================
// ===========================================================================

function VariantE(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const scoreColor = getScoreColor(score)

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* ============================================================
          REGION 1 — Identity bar
      ============================================================ */}
      <div className="relative px-6 pt-5 pb-4">
        {/* Group type — top-right */}
        <span className="absolute top-5 right-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          {group.groupTypeName}
        </span>

        <div className="text-[11px] text-gray-400 mb-1">
          {group.managementName} / {group.areaName}
        </div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {group.name}
          </h2>
          <Badge
            variant={evalType === 'audit' ? 'default' : 'secondary'}
            className="text-[10px] uppercase tracking-wide flex-shrink-0"
          >
            {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
          </Badge>
        </div>
      </div>

      {/* ============================================================
          REGION 2 — Form & Team strip
      ============================================================ */}
      <div className="px-6 py-3 bg-gray-50/30 border-y border-gray-100 flex items-center gap-4">
        {/* Data */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 font-medium">Data</span>
          <input
            type="date"
            value={evaluationDate}
            onChange={(e) => onSetEvaluationDate(e.target.value)}
            className="bg-transparent cursor-pointer text-sm font-medium text-gray-700 outline-none p-0 border-none"
          />
        </div>
        <div className="w-px h-4 bg-gray-200" />
        {/* Auditor */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 font-medium">Auditor</span>
          <span className="text-gray-700 font-medium">{userName}</span>
        </div>

        <div className="flex-1" />

        {/* Team compact */}
        <div className="flex items-center gap-2">
          <AvatarStack
            members={group.team}
            presentMembers={presentMembers}
            max={4}
            size={24}
            prioritizePresent
            onClick={() => setTeamOpen(!teamOpen)}
          />
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          >
            <span className="tabular-nums font-medium">
              {presentMembers.length}/{group.team.length}
            </span>
            <span className="text-gray-400">presentes</span>
            <ChevronDownIcon
              size={14}
              className={cn(
                'transition-transform duration-200 text-gray-400',
                teamOpen && 'rotate-180',
              )}
            />
          </button>
        </div>
      </div>

      {/* ============================================================
          REGION 3 — Section Cards Row (HERO VISUAL)
      ============================================================ */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-4 gap-3">
          {sections.map((sec, i) => {
            const pct =
              sec.totalCount > 0
                ? (sec.answeredCount / sec.totalCount) * 100
                : 0
            return (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white overflow-hidden p-3"
                style={{ borderTop: `3px solid ${sec.color}` }}
              >
                <div className="text-[11px] font-semibold text-gray-700 line-clamp-2 min-h-[28px] leading-tight">
                  {sec.title}
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span
                    className="text-2xl font-black tabular-nums leading-none"
                    style={{ color: sec.color }}
                  >
                    {sec.answeredCount}
                  </span>
                  <span className="text-sm text-gray-400 font-normal">
                    /{sec.totalCount}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 mt-2">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: sec.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeOut',
                      delay: 0.2 + i * 0.08,
                    }}
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-[9px] text-gray-500 tabular-nums">
                    {Math.round(pct)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ============================================================
          REGION 4 — Score summary footer
      ============================================================ */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/20 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Nota atual
          </span>
          <span
            className="text-xl font-black tabular-nums"
            style={{ color: scoreColor }}
          >
            {Math.round(score)}
          </span>
          <span className="text-sm text-gray-400">%</span>
          <div className="w-16 h-1.5 rounded-full bg-gray-200 ml-1">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: scoreColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(score, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Meta
          </span>
          <span className="text-xl font-bold text-gray-700 tabular-nums">
            {meta}%
          </span>
        </div>

        <div className="flex-1" />

        <span className="text-xs text-gray-500 tabular-nums">
          {answeredCount}/{totalQuestions} perguntas
        </span>
      </div>

      {/* ---- Expandable team panel ---- */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/20">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT F — "Layered Depth"
//
// ===========================================================================
// ===========================================================================

function VariantF(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [teamOpen, setTeamOpen] = useState(false)
  const scoreColor = getScoreColor(score)
  const pontos = Math.round(score * totalQuestions / 100)

  return (
    <div className="pb-4">
      {/* ---- Layer 0: Background strip ---- */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(16,55,52,0.04) 0%, rgba(30,122,115,0.02) 50%, transparent 100%)',
          height: 80,
        }}
      >
        <div className="p-5 h-full relative">
          {/* Top-left: Badge + group type */}
          <div className="flex items-center gap-2">
            <Badge
              variant={evalType === 'audit' ? 'default' : 'secondary'}
              size="sm"
            >
              {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
            </Badge>
            <span className="text-xs text-gray-500">{group.groupTypeName}</span>
          </div>

          {/* Top-right: breadcrumb */}
          <div className="absolute top-5 right-5 text-right">
            <div className="text-xs text-gray-400">
              {group.managementName} / {group.areaName}
            </div>
          </div>

          {/* Bottom-left: group name */}
          <h2 className="absolute bottom-4 left-5 text-2xl font-black text-gray-800">
            {group.name}
          </h2>

          {/* Diamond watermark far right */}
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-30">
            <EvalDiamondPattern />
          </div>
        </div>
      </div>

      {/* ---- Layer 1: 4 Elevated cards ---- */}
      <div className="mt-[-16px] relative z-10 mx-4 flex gap-3">
        {/* Card 1 — Form */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-gray-400 font-medium">
              Data
            </span>
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 flex-shrink-0"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                value={evaluationDate}
                onChange={(e) => onSetEvaluationDate(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-600 p-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2" />

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-gray-400 font-medium">
              Auditor
            </span>
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 flex-shrink-0"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm text-gray-600">{userName}</span>
            </div>
          </div>
        </div>

        {/* Card 2 — Score DONUT */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-4 flex flex-col items-center">
          <ScoreRing score={score} meta={meta} size={72} strokeWidth={5} />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">
              Nota
            </span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: scoreColor }}
            >
              {Math.round(score)}%
            </span>
            <span className="text-[10px] text-gray-400">/ Meta {meta}%</span>
          </div>
          <div className="h-px bg-gray-100 w-full my-2" />
          <div className="flex items-center justify-between w-full text-[9px] text-gray-500 tabular-nums">
            <span>
              Pontos: {pontos}/{totalQuestions}
            </span>
            <span>
              {answeredCount}/{totalQuestions} perguntas
            </span>
          </div>
        </div>

        {/* Card 3 — Sections with progress bars */}
        <div className="flex-[1.2] bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-4">
          <div className="flex flex-col gap-2.5">
            {sections.map((sec, i) => {
              const pct =
                sec.totalCount > 0
                  ? (sec.answeredCount / sec.totalCount) * 100
                  : 0
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: sec.color }}
                      />
                      <span className="text-[10px] text-gray-700 truncate">
                        {sec.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 tabular-nums flex-shrink-0">
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 rounded-full bg-gray-100 flex-1">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: sec.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.6,
                          ease: 'easeOut',
                          delay: 0.2 + i * 0.08,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 tabular-nums flex-shrink-0">
                      {sec.answeredCount}/{sec.totalCount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card 4 — Team PROMINENT */}
        <div className="flex-1 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-gray-400 font-medium">
              Equipe
            </span>
            <span className="text-sm font-bold text-gray-800 tabular-nums">
              {presentMembers.length}/{group.team.length}
            </span>
          </div>
          <div className="mb-3">
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={5}
              size={26}
              prioritizePresent
            />
          </div>
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex items-center gap-1 text-[10px] text-primary-600 hover:text-primary-700 cursor-pointer font-medium transition-colors mt-auto"
          >
            {teamOpen ? 'Recolher' : 'Gerenciar equipe →'}
          </button>
        </div>
      </div>

      {/* ---- Team expandable panel (full width below cards) ---- */}
      <AnimatePresence>
        {teamOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden mx-4 mt-3"
          >
            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-4">
              <InlineAttendancePanel
                members={group.team}
                presentMembers={presentMembers}
                otherPeople={otherPeople}
                onToggleMember={onToggleMember}
                onSetOtherPeople={onSetOtherPeople}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===========================================================================
// ===========================================================================
//
//  VARIANT G — "Minimal Strip"
//
// ===========================================================================
// ===========================================================================

function VariantG(props: HeroVariantProps) {
  const {
    group,
    evalType,
    userName,
    score,
    meta,
    answeredCount,
    totalQuestions,
    presentMembers,
    otherPeople,
    evaluationDate,
    sections,
    onToggleMember,
    onSetOtherPeople,
    onSetEvaluationDate,
  } = props

  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const pontos = Math.round(score * totalQuestions / 100)

  // White score ring for dark background
  const ringSize = 64
  const ringSW = 4
  const ringCenter = ringSize / 2
  const ringR = (ringSize - ringSW) / 2
  const ringCirc = 2 * Math.PI * ringR
  const ringOffset = ringCirc * (1 - Math.min(score, 100) / 100)

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* ================================================================
          DARK ZONE — Identity + Score + Sections
      ================================================================ */}
      <div
        className="relative overflow-hidden px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, #103734 0%, #155F59 35%, #1E7A73 70%, #3AA39C 100%)',
        }}
      >
        {/* Diamond watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%">
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 30 }, (_, col) => {
                const x = col * 28 + (row % 2 === 1 ? 14 : 0)
                const y = row * 28
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x - 3}
                    y={y - 3}
                    width={6}
                    height={6}
                    fill="white"
                    transform={`rotate(45 ${x} ${y})`}
                  />
                )
              }),
            )}
          </svg>
        </div>

        <div className="relative z-10 flex items-start justify-between gap-6">
          {/* Left: Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1.5">
              <span>{group.managementName}</span>
              <span className="text-white/20">/</span>
              <span>{group.areaName}</span>
            </div>
            <div className="flex items-center gap-2.5 mb-3">
              <h2 className="text-xl font-bold text-white truncate">
                {group.name}
              </h2>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0',
                  'bg-white/15 text-white',
                )}
              >
                {evalType === 'audit' ? 'Auditoria' : 'Follow-Up'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                {group.groupTypeName}
              </span>
            </div>
          </div>

          {/* Center: Score Ring + stack (white strokes) */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
                <circle
                  cx={ringCenter} cy={ringCenter} r={ringR}
                  fill="none" stroke="white" strokeWidth={ringSW} opacity={0.12}
                />
                <motion.circle
                  cx={ringCenter} cy={ringCenter} r={ringR}
                  fill="none" stroke="white" strokeWidth={ringSW} strokeLinecap="round"
                  strokeDasharray={ringCirc} strokeOpacity={0.85}
                  initial={{ strokeDashoffset: ringCirc }}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                  transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-black text-white tabular-nums">
                  {Math.round(score)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5 mt-1.5">
              <span className="text-[10px] text-white/50 tabular-nums">
                Meta {meta}%
              </span>
              <span className="text-[10px] text-white/60 tabular-nums">
                Pontos: {pontos}/{totalQuestions}
              </span>
              <span className="text-[10px] text-white/40 tabular-nums">
                {answeredCount}/{totalQuestions} perguntas
              </span>
            </div>
          </div>

          {/* Right: Section bars with names */}
          <div className="flex flex-col gap-1.5 flex-shrink-0 w-56">
            {sections.map((sec, i) => {
              const pct = sec.totalCount > 0 ? (sec.answeredCount / sec.totalCount) * 100 : 0
              return (
                <div key={i} className="flex items-center gap-2" title={`${sec.title}: ${sec.answeredCount}/${sec.totalCount}`}>
                  <span className="text-[9px] text-white/60 truncate w-[90px] flex-shrink-0">
                    {sec.title}
                  </span>
                  <span className="text-[9px] text-white/40 tabular-nums w-7 text-right flex-shrink-0">
                    {sec.answeredCount}/{sec.totalCount}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-white/70"
                      initial={{ width: '0%' }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.08 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ================================================================
          LIGHT ZONE — Form fields + Team
      ================================================================ */}
      <div className="bg-white px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => onSetEvaluationDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-700 font-medium p-0 cursor-pointer"
              style={{ width: 120 }}
            />
          </div>

          <div className="w-px h-4 bg-gray-200" />

          {/* Auditor */}
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-sm text-gray-700 font-medium">{userName}</span>
          </div>

          <div className="flex-1" />

          {/* Team compact */}
          <div className="flex items-center gap-2">
            <AvatarStack
              members={group.team}
              presentMembers={presentMembers}
              max={4}
              size={24}
              onClick={() => setAttendanceOpen(!attendanceOpen)}
            />
            <button
              onClick={() => setAttendanceOpen(!attendanceOpen)}
              className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
            >
              <span className="tabular-nums font-medium">{presentMembers.length}/{group.team.length}</span>
              <span className="text-gray-400">presentes</span>
              <motion.svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-gray-400"
                animate={{ rotate: attendanceOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>
          </div>
        </div>

        {/* Expandable attendance panel */}
        <AnimatePresence>
          {attendanceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-gray-100">
                <InlineAttendancePanel
                  members={group.team}
                  presentMembers={presentMembers}
                  otherPeople={otherPeople}
                  onToggleMember={onToggleMember}
                  onSetOtherPeople={onSetOtherPeople}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ===========================================================================
// Exported component — variant selector
// ===========================================================================

export function EvalHeroVariants({
  variant = 'A',
  ...props
}: HeroVariantProps & { variant?: HeroVariant }) {
  switch (variant) {
    case 'A': return <VariantA {...props} />
    case 'B': return <VariantB {...props} />
    case 'C': return <VariantC {...props} />
    case 'D1': return <VariantD1 {...props} />
    case 'D2': return <VariantD2 {...props} />
    case 'D3': return <VariantD3 {...props} />
    case 'D4': return <VariantD4 {...props} />
    case 'D5': return <VariantD5 {...props} />
    case 'D6': return <VariantD6 {...props} />
    case 'D7': return <VariantD7 {...props} />
    case 'D8': return <VariantD8 {...props} />
    case 'E': return <VariantE {...props} />
    case 'F': return <VariantF {...props} />
    case 'G': return <VariantG {...props} />
    default: return <VariantA {...props} />
  }
}

export type { HeroVariant, SectionNavItem }
