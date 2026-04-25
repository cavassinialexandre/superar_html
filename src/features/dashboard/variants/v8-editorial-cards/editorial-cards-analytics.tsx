import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from '@tanstack/react-router'
import type { Evaluation, Group } from '@/types'
import { AuditIcon, FollowupIcon, AlertCircleIcon, ChevronRightIcon } from '@/assets/icons'
import { groups as allGroups, groupTypes } from '@/mocks/data'
import { getMetaForSequence } from '@/lib/advance-eligibility'
import { ecards, cardBase } from './editorial-cards-tokens'

function computeEvaluationPoints(ev: Evaluation): { earned: number; max: number } {
  let earned = 0
  let max = 0
  for (const a of ev.answers) {
    if (a.answer === 'na') continue
    max += a.weight
    if (a.answer === 'yes') earned += a.weight
    else if (a.answer === 'partial') earned += a.weight * 0.5
  }
  return { earned, max }
}

function getEvaluationMeta(ev: Evaluation): number {
  const group = allGroups.find((g) => g.id === ev.groupId)
  if (!group) return 80
  return getMetaForSequence(group.groupTypeId, ev.sequenceAtTime, groupTypes)
}

interface AnalyticsProps {
  scoreEvolution: { month: string; [type: string]: number | string }[]
  groupsByType: { name: string; count: number }[]
  managementPerformance: { name: string; score: number }[]
  sequenceDistribution: { step: string; count: number }[]
  recentActivity: Evaluation[]
  bottomGroups: Group[]
}

const PALETTE = ['#1E7A73', '#3AA39C', '#7AB83E', '#E8BF3A', '#D66B82']

interface TooltipPayload {
  payload?: Record<string, unknown>
  value?: number
  name?: string
  color?: string
}

function ECardsTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      className="rounded-lg px-3 py-2 min-w-[140px]"
      style={{
        background: ecards.card.bg,
        border: `1px solid ${ecards.surface.ruleStrong}`,
        boxShadow: '0 6px 18px -6px rgba(16,55,52,0.16)',
      }}
    >
      {label && (
        <div
          className="uppercase mb-1.5 font-semibold"
          style={{
            fontFamily: ecards.font.sans,
            fontSize: '9.5px',
            letterSpacing: ecards.letter.kickerSm,
            color: ecards.surface.inkMuted,
          }}
        >
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span style={{ fontFamily: ecards.font.body, fontSize: '11.5px', color: ecards.surface.inkSoft }}>
              {p.name}
            </span>
          </div>
          <span
            className="font-bold tabular-nums"
            style={{ fontFamily: ecards.font.mono, fontSize: '11.5px', color: ecards.surface.ink }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function CardHead({
  titleStart,
  titleSerif,
  titleEnd,
  insight,
}: {
  titleStart?: string
  titleSerif: string
  titleEnd?: string
  insight?: string
}) {
  return (
    <div className="mb-4">
      <h3
        className="font-bold leading-tight"
        style={{
          fontFamily: ecards.font.sans,
          fontSize: ecards.scale.h2,
          color: ecards.surface.ink,
          letterSpacing: '-0.012em',
        }}
      >
        {titleStart && <>{titleStart} </>}
        <span style={{ fontFamily: ecards.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
          {titleSerif}
        </span>
        {titleEnd && <> {titleEnd}</>}
      </h3>
      {insight && (
        <p
          className="mt-1"
          style={{
            fontFamily: ecards.font.body,
            fontSize: '11.5px',
            color: ecards.surface.inkMuted,
            lineHeight: 1.45,
          }}
        >
          {insight}
        </p>
      )}
    </div>
  )
}

function Card({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`px-5 py-5 ${className}`} style={cardBase}>
      {children}
    </div>
  )
}

interface BarTopLabelProps {
  x?: number
  y?: number
  width?: number
  value?: number | string
  fill?: string
}

function BarTopLabel({ x, y, width, value, fill }: BarTopLabelProps) {
  if (x == null || y == null || width == null || value == null) return null
  const text = String(value)
  const chipWidth = Math.max(22, text.length * 6 + 8)
  const centerX = x + width / 2
  const chipX = centerX - chipWidth / 2
  const chipY = y - 15
  return (
    <g>
      <rect
        x={chipX}
        y={chipY}
        width={chipWidth}
        height={12}
        rx={3}
        fill="#FFFFFF"
        stroke={fill ?? ecards.surface.rule}
        strokeWidth={0.75}
        opacity={0.96}
      />
      <text
        x={centerX}
        y={chipY + 6}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: ecards.font.mono,
          fontSize: 9.5,
          fontWeight: 600,
          fill: ecards.surface.ink,
        }}
      >
        {text}
      </text>
    </g>
  )
}

function ScoreEvolutionCard({ data }: { data: AnalyticsProps['scoreEvolution'] }) {
  const trimmed = data.slice(-4)
  const types = trimmed.length ? Object.keys(trimmed[0]).filter((k) => k !== 'month') : []
  return (
    <Card className="sm:col-span-2 lg:col-span-2">
      <CardHead
        titleStart="Notas"
        titleSerif="por tipo"
        insight="Média mensal por categoria de grupo — últimos 4 meses."
      />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={trimmed} margin={{ top: 22, right: 12, left: -22, bottom: 0 }} barCategoryGap="22%" barGap={4}>
          <CartesianGrid strokeDasharray="2 4" stroke={ecards.surface.rule} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10.5, fill: ecards.surface.inkMuted, fontFamily: ecards.font.mono }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9.5, fill: ecards.surface.inkSubtle, fontFamily: ecards.font.mono }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<ECardsTooltip />} cursor={{ fill: ecards.surface.rule, opacity: 0.35 }} />
          {types.map((t, i) => (
            <Bar
              key={t}
              dataKey={t}
              fill={PALETTE[i % PALETTE.length]}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            >
              <LabelList dataKey={t} content={<BarTopLabel fill={PALETTE[i % PALETTE.length]} />} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 px-1">
        {types.map((t, i) => (
          <div key={t} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span
              style={{ fontFamily: ecards.font.body, fontSize: '10.5px', color: ecards.surface.inkSoft }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function GroupsByTypeCard({ data }: { data: AnalyticsProps['groupsByType'] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0)
  return (
    <Card>
      <CardHead
        titleStart="Por"
        titleSerif="tipo"
        insight="Composição operacional."
      />
      <div className="relative flex items-center justify-center" style={{ minHeight: 150 }}>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={42}
              outerRadius={66}
              paddingAngle={3}
              dataKey="count"
              stroke={ecards.card.bg}
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<ECardsTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="font-bold tabular-nums leading-none"
            style={{
              fontFamily: ecards.font.serif,
              fontWeight: 400,
              fontSize: '26px',
              color: ecards.surface.ink,
              letterSpacing: '-0.02em',
            }}
          >
            {total}
          </span>
          <span
            className="uppercase mt-0.5"
            style={{
              fontFamily: ecards.font.sans,
              fontSize: '9px',
              letterSpacing: ecards.letter.kicker,
              color: ecards.surface.inkMuted,
            }}
          >
            grupos
          </span>
        </div>
      </div>
      <div className="space-y-1 mt-2">
        {data.map((d, i) => {
          const pct = Math.round((d.count / total) * 100)
          return (
            <div key={d.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              <span
                className="flex-1 truncate"
                style={{ fontFamily: ecards.font.body, fontSize: '11.5px', color: ecards.surface.inkSoft }}
              >
                {d.name}
              </span>
              <span
                className="tabular-nums w-7 text-right"
                style={{
                  fontFamily: ecards.font.mono,
                  fontSize: '10px',
                  color: ecards.surface.inkMuted,
                }}
              >
                {pct}%
              </span>
              <span
                className="tabular-nums font-bold w-5 text-right"
                style={{ fontFamily: ecards.font.serif, fontSize: '14px', color: ecards.surface.ink }}
              >
                {d.count}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function ManagementCard({ data }: { data: AnalyticsProps['managementPerformance'] }) {
  return (
    <Card>
      <CardHead
        titleStart="Nota"
        titleSerif="por gerência"
        insight="Última auditoria."
      />
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 14, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="v8-mgmt-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ecards.accent.teal} />
              <stop offset="100%" stopColor={ecards.accent.mint} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke={ecards.surface.rule} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: ecards.surface.inkMuted, fontFamily: ecards.font.mono }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10.5, fill: ecards.surface.inkSoft }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip content={<ECardsTooltip />} cursor={{ fill: 'rgba(58,163,156,0.05)' }} />
          <Bar dataKey="score" fill="url(#v8-mgmt-grad)" radius={[0, 5, 5, 0]} barSize={12} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

function SequenceCard({ data }: { data: AnalyticsProps['sequenceDistribution'] }) {
  return (
    <Card>
      <CardHead
        titleStart="Por"
        titleSerif="sequência"
        insight="Jornada Kaizen."
      />
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={ecards.surface.rule} vertical={false} />
          <XAxis
            dataKey="step"
            tick={{ fontSize: 10.5, fill: ecards.surface.inkSoft, fontFamily: ecards.font.mono }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: ecards.surface.inkMuted, fontFamily: ecards.font.mono }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ECardsTooltip />} cursor={{ fill: 'rgba(58,163,156,0.05)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28} isAnimationActive={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

function RiskCard({ groups }: { groups: Group[] }) {
  return (
    <Card>
      <CardHead
        titleStart="Abaixo da"
        titleSerif="meta"
        insight="Agende um follow-up para acompanhamento próximo."
      />
      <div className="space-y-2">
        {groups.slice(0, 3).map((g, i) => {
          const score = g.lastAuditScore ?? 0
          return (
            <div
              key={g.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg"
              style={{
                background: 'rgba(183,46,74,0.04)',
                border: '1px solid rgba(183,46,74,0.16)',
              }}
            >
              <span
                className="font-bold leading-none flex-shrink-0"
                style={{
                  fontFamily: ecards.font.serif,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '20px',
                  color: ecards.accent.rose,
                  width: 22,
                  textAlign: 'center',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="flex items-center justify-center rounded-md flex-shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  background: 'rgba(183,46,74,0.12)',
                  color: ecards.accent.rose,
                }}
              >
                <AlertCircleIcon size={11} />
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold truncate"
                  style={{
                    fontFamily: ecards.font.sans,
                    fontSize: '12px',
                    color: ecards.surface.ink,
                  }}
                >
                  {g.name}
                </div>
                <div
                  className="text-[10px] truncate italic"
                  style={{ fontFamily: ecards.font.body, color: ecards.surface.inkMuted }}
                >
                  {g.managementName}
                </div>
              </div>
              <span
                className="font-bold tabular-nums flex-shrink-0"
                style={{ fontFamily: ecards.font.mono, fontSize: '15px', color: ecards.accent.rose }}
              >
                {score}%
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

const SCORE_COL_WIDTH = 120

interface ScoreCellProps {
  score: number
  meta: number
  pointsEarned: number
  pointsMax: number
  pointsMeta: number
  scoreColor: string
}

function formatPts(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

function ScoreCell({ score, meta, pointsEarned, pointsMeta, scoreColor }: ScoreCellProps) {
  const clampedScore = Math.min(Math.max(score, 0), 100)
  const clampedMeta = Math.min(Math.max(meta, 0), 100)
  const ptsStyle = {
    fontFamily: ecards.font.mono,
    fontSize: '7.5px',
    letterSpacing: ecards.letter.kickerSm,
    color: ecards.surface.inkSubtle,
  } as const
  return (
    <div className="flex-shrink-0 tabular-nums" style={{ width: SCORE_COL_WIDTH }}>
      <div className="flex items-baseline justify-between gap-1" style={{ marginBottom: 2 }}>
        <span style={{ ...ptsStyle, color: scoreColor, fontWeight: 700 }}>
          {formatPts(pointsEarned)} pts
        </span>
        <span
          style={{
            fontFamily: ecards.font.mono,
            fontSize: '12.5px',
            fontWeight: 700,
            color: scoreColor,
            lineHeight: 1,
          }}
        >
          {score}%
        </span>
      </div>
      <div
        className="relative"
        style={{ height: 3, borderRadius: 2, background: ecards.surface.rule }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${clampedScore}%`,
            background: scoreColor,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: `${clampedMeta}%`,
            width: 2,
            height: 7,
            background: ecards.surface.ink,
            transform: 'translateX(-1px)',
          }}
        />
      </div>
      <div className="flex items-baseline justify-between gap-1" style={{ marginTop: 2 }}>
        <span style={ptsStyle}>
          {formatPts(pointsMeta)} pts
        </span>
        <span
          style={{
            fontFamily: ecards.font.mono,
            fontSize: '9.5px',
            fontWeight: 400,
            color: ecards.surface.inkSubtle,
          }}
        >
          {meta}%
        </span>
      </div>
    </div>
  )
}

function ActivityCard({ items }: { items: Evaluation[] }) {
  const navigate = useNavigate()
  return (
    <Card className="sm:col-span-2 lg:col-span-3">
      <CardHead
        titleStart="Últimas"
        titleSerif="avaliações"
        insight="Auditorias e follow-ups recentes."
      />
      <div className="flex flex-col">
        <div
          className="flex items-center gap-3 py-1.5 border-b"
          style={{ borderColor: ecards.surface.rule }}
        >
          <div className="flex-shrink-0" style={{ width: 30 }} />
          <div
            className="flex-1 min-w-0 uppercase font-bold"
            style={{
              fontFamily: ecards.font.mono,
              fontSize: '9px',
              letterSpacing: ecards.letter.kickerSm,
              color: ecards.surface.inkSubtle,
            }}
          >
            Avaliação
          </div>
          <div
            className="flex-shrink-0 uppercase font-bold"
            style={{
              fontFamily: ecards.font.mono,
              fontSize: '9px',
              letterSpacing: ecards.letter.kickerSm,
              color: ecards.surface.inkSubtle,
              width: 100,
            }}
          >
            Tipo
          </div>
          <div
            className="flex-shrink-0 uppercase font-bold"
            style={{
              fontFamily: ecards.font.mono,
              fontSize: '9px',
              letterSpacing: ecards.letter.kickerSm,
              color: ecards.surface.inkSubtle,
              width: 140,
            }}
          >
            Avaliado por
          </div>
          <div
            className="flex-shrink-0 uppercase font-bold text-right"
            style={{
              fontFamily: ecards.font.mono,
              fontSize: '9px',
              letterSpacing: ecards.letter.kickerSm,
              color: ecards.surface.inkSubtle,
              width: SCORE_COL_WIDTH,
            }}
          >
            Resultado
          </div>
          <div className="flex-shrink-0" style={{ width: 24 }} />
        </div>
        {items.slice(0, 6).map((ev) => {
          const isAudit = ev.type === 'audit'
          const Icon = isAudit ? AuditIcon : FollowupIcon
          const accent = isAudit ? ecards.accent.teal : ecards.accent.crownGoldDeep
          const dateStr = format(parseISO(ev.date), "d 'de' MMM", { locale: ptBR })
          const score = ev.score
          const meta = getEvaluationMeta(ev)
          const { earned: pointsEarned, max: pointsMax } = computeEvaluationPoints(ev)
          const pointsMeta = pointsMax * (meta / 100)
          const scoreColor = score >= meta ? ecards.accent.sage : '#C87581'
          return (
            <div
              key={ev.id}
              className="flex items-center gap-3 py-2.5 border-b last:border-b-0"
              style={{ borderColor: ecards.surface.rule }}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{
                  width: 30,
                  height: 30,
                  background: `${accent}14`,
                  color: accent,
                }}
              >
                <Icon size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5 min-w-0">
                  <span
                    className="font-semibold truncate"
                    style={{
                      fontFamily: ecards.font.sans,
                      fontSize: '12.5px',
                      color: ecards.surface.ink,
                    }}
                  >
                    {ev.groupName}
                  </span>
                  <span
                    className="px-1.5 py-px rounded text-[8px] uppercase tracking-[0.14em] font-bold flex-shrink-0"
                    style={{ background: `${accent}12`, color: accent }}
                  >
                    {isAudit ? 'AUDITORIA' : 'FOLLOW-UP'}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 mb-0.5 truncate"
                  style={{
                    fontFamily: ecards.font.body,
                    fontSize: '10.5px',
                    color: ecards.surface.inkSoft,
                  }}
                >
                  <span className="truncate">{ev.managementName}</span>
                  <span style={{ color: ecards.surface.inkSubtle }}>·</span>
                  <span className="truncate">{ev.areaName}</span>
                </div>
              </div>
              <div
                className="flex-shrink-0 uppercase truncate font-bold"
                style={{
                  fontFamily: ecards.font.mono,
                  fontSize: '9.5px',
                  letterSpacing: ecards.letter.kickerSm,
                  color: ecards.accent.teal,
                  width: 100,
                }}
                title={ev.groupTypeName}
              >
                {ev.groupTypeName}
              </div>
              <div
                className="flex-shrink-0"
                style={{
                  fontFamily: ecards.font.body,
                  fontSize: '11px',
                  color: ecards.surface.inkMuted,
                  width: 140,
                }}
              >
                <div className="italic truncate" title={ev.applicantName}>
                  por {ev.applicantName}
                </div>
                <div
                  className="uppercase tabular-nums truncate"
                  style={{
                    fontFamily: ecards.font.mono,
                    fontSize: '9.5px',
                    letterSpacing: ecards.letter.kickerSm,
                    color: ecards.surface.inkSubtle,
                  }}
                >
                  {dateStr}
                </div>
              </div>
              <ScoreCell
                score={score}
                meta={meta}
                pointsEarned={pointsEarned}
                pointsMax={pointsMax}
                pointsMeta={pointsMeta}
                scoreColor={scoreColor}
              />
              <button
                type="button"
                className="flex-shrink-0 flex items-center justify-center rounded hover:opacity-70 transition-opacity"
                style={{
                  width: 24,
                  height: 24,
                  color: ecards.surface.inkSubtle,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                title="Abrir auditoria"
                onClick={() =>
                  navigate({
                    to: '/history',
                    search: ((prev: Record<string, unknown>) => ({
                      ...prev,
                      selectedEvalId: ev.id,
                    })) as never,
                  })
                }
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export function EditorialCardsAnalytics({
  scoreEvolution,
  groupsByType,
  managementPerformance,
  sequenceDistribution,
  recentActivity,
  bottomGroups,
}: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ScoreEvolutionCard data={scoreEvolution} />
      <GroupsByTypeCard data={groupsByType} />
      <ManagementCard data={managementPerformance} />
      <SequenceCard data={sequenceDistribution} />
      <RiskCard groups={bottomGroups} />
      <ActivityCard items={recentActivity} />
    </div>
  )
}
