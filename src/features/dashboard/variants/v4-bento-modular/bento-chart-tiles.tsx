import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Evaluation, Group } from '@/types'
import { AuditIcon, FollowupIcon, AlertCircleIcon } from '@/assets/icons'
import { bento, bentoTileBase } from './bento-tokens'

interface Props {
  scoreEvolution: { month: string; [type: string]: number | string }[]
  groupsByType: { name: string; count: number }[]
  managementPerformance: { name: string; score: number }[]
  sequenceDistribution: { step: string; count: number }[]
  recentActivity: Evaluation[]
  bottomGroups: Group[]
}

const PALETTE = ['#3AA39C', '#5EA448', '#1E7A73', '#DDDD03', '#CE3C5A']

interface TooltipPayload {
  payload?: Record<string, unknown>
  value?: number
  name?: string
  color?: string
}

function CleanTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      className="rounded-xl px-3 py-2 min-w-[120px]"
      style={{
        background: bento.surface.tile,
        border: `1px solid ${bento.surface.tileBorder}`,
        boxShadow: bento.surface.tileShadowHover,
      }}
    >
      {label && (
        <div
          className="uppercase tracking-[0.14em] mb-1"
          style={{ fontFamily: bento.font.mono, fontSize: 9, color: bento.surface.textMuted }}
        >
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[11px]" style={{ color: bento.surface.textSoft }}>
              {p.name}
            </span>
          </div>
          <span
            className="font-bold tabular-nums"
            style={{ fontFamily: bento.font.mono, fontSize: 11, color: bento.surface.text }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function BentoTile({
  category,
  title,
  meta,
  children,
  delay,
  className = '',
  height,
}: {
  category: keyof typeof bento.category
  title: string
  meta?: string
  children: React.ReactNode
  delay: number
  className?: string
  height?: number
}) {
  const cat = bento.category[category]
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: bento.surface.tileShadowHover, transition: { duration: 0.25 } }}
      className={`relative p-5 flex flex-col ${className}`}
      style={{ ...bentoTileBase, minHeight: height }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: cat.tint }}
          />
          <h3
            className="font-semibold"
            style={{
              fontFamily: bento.font.display,
              fontSize: 13.5,
              color: bento.surface.text,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        </div>
        {meta && (
          <span
            className="px-1.5 py-0.5 rounded uppercase tracking-[0.14em] font-semibold"
            style={{
              fontFamily: bento.font.mono,
              fontSize: 8.5,
              background: cat.soft,
              color: cat.tint,
            }}
          >
            {meta}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </motion.div>
  )
}

function ScoreEvolutionTile({ data }: { data: Props['scoreEvolution'] }) {
  const types = data.length ? Object.keys(data[0]).filter((k) => k !== 'month') : []
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={180}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
        <defs>
          {types.map((t, i) => (
            <linearGradient key={t} id={`bento-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.4} />
              <stop offset="100%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke={bento.surface.rule} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: bento.surface.textMuted, fontFamily: bento.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 9.5, fill: bento.surface.textMuted, fontFamily: bento.font.mono }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip content={<CleanTooltip />} />
        {types.map((t, i) => (
          <Area
            key={t}
            type="monotone"
            dataKey={t}
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={2}
            fill={`url(#bento-grad-${i})`}
            dot={{ r: 3, fill: PALETTE[i % PALETTE.length], strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

function GroupsByTypeTile({ data }: { data: Props['groupsByType'] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0)
  return (
    <div className="relative h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%" minHeight={180}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={42}
            outerRadius={68}
            paddingAngle={3}
            dataKey="count"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CleanTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-bold tabular-nums leading-none"
          style={{
            fontFamily: bento.font.display,
            fontSize: 28,
            color: bento.surface.text,
            letterSpacing: '-0.02em',
          }}
        >
          {total}
        </span>
        <span
          className="uppercase tracking-[0.14em] mt-0.5"
          style={{ fontFamily: bento.font.mono, fontSize: 8.5, color: bento.surface.textMuted }}
        >
          grupos
        </span>
      </div>
    </div>
  )
}

function ManagementTile({ data }: { data: Props['managementPerformance'] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={180}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="bento-mgmt-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E7A73" />
            <stop offset="100%" stopColor="#3AA39C" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke={bento.surface.rule} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: bento.surface.textMuted, fontFamily: bento.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: bento.surface.textSoft }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip content={<CleanTooltip />} cursor={{ fill: 'rgba(58,163,156,0.05)' }} />
        <Bar dataKey="score" fill="url(#bento-mgmt-grad)" radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SequenceTile({ data }: { data: Props['sequenceDistribution'] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke={bento.surface.rule} vertical={false} />
        <XAxis
          dataKey="step"
          tick={{ fontSize: 10, fill: bento.surface.textSoft, fontFamily: bento.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: bento.surface.textMuted, fontFamily: bento.font.mono }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CleanTooltip />} cursor={{ fill: 'rgba(58,163,156,0.05)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={32}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function ActivityTile({ items }: { items: Evaluation[] }) {
  return (
    <div className="space-y-2">
      {items.slice(0, 4).map((ev, i) => {
        const isAudit = ev.type === 'audit'
        const Icon = isAudit ? AuditIcon : FollowupIcon
        const accent = isAudit ? bento.category.chart.tint : bento.category.podium.icon
        const ago = formatDistanceToNow(parseISO(ev.date), { locale: ptBR, addSuffix: true })
        const score = ev.score
        const scoreColor = score >= 80 ? '#5EA448' : score >= 50 ? '#1E7A73' : '#CE3C5A'
        return (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-2.5"
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
              <div
                className="flex items-baseline justify-between gap-2"
              >
                <span
                  className="font-semibold truncate"
                  style={{ fontFamily: bento.font.display, fontSize: 12.5, color: bento.surface.text }}
                >
                  {ev.groupName}
                </span>
                <span
                  className="font-bold tabular-nums flex-shrink-0"
                  style={{ fontFamily: bento.font.mono, fontSize: 12, color: scoreColor }}
                >
                  {score}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[10px] truncate"
                  style={{ fontFamily: bento.font.display, color: bento.surface.textMuted }}
                >
                  {isAudit ? 'Auditoria' : 'Follow-up'} · {ev.applicantName}
                </span>
                <span
                  className="text-[9.5px] flex-shrink-0"
                  style={{ fontFamily: bento.font.mono, color: bento.surface.textSubtle }}
                >
                  {ago.replace('há ', '')}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function RiskTile({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-2">
      {groups.slice(0, 3).map((g, i) => {
        const score = g.lastAuditScore ?? 0
        return (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-2.5 p-2 rounded-xl"
            style={{ background: bento.category.risk.soft }}
          >
            <span
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 26,
                height: 26,
                background: 'rgba(206,60,90,0.15)',
                color: bento.category.risk.tint,
              }}
            >
              <AlertCircleIcon size={13} />
            </span>
            <div className="flex-1 min-w-0">
              <div
                className="font-semibold truncate"
                style={{ fontFamily: bento.font.display, fontSize: 12, color: bento.surface.text }}
              >
                {g.name}
              </div>
              <div
                className="text-[10px] truncate"
                style={{ fontFamily: bento.font.display, color: bento.surface.textMuted }}
              >
                {g.managementName}
              </div>
            </div>
            <span
              className="font-bold tabular-nums flex-shrink-0"
              style={{ fontFamily: bento.font.mono, fontSize: 14, color: bento.category.risk.tint }}
            >
              {score}%
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export function BentoChartTiles(props: Props) {
  return (
    <>
      <BentoTile
        category="chart"
        title="Evolução · 6 meses"
        meta="POR TIPO"
        delay={0.2}
        className="lg:col-span-3 lg:row-span-2"
      >
        <ScoreEvolutionTile data={props.scoreEvolution} />
      </BentoTile>

      <BentoTile category="chart" title="Distribuição" meta="TIPOS" delay={0.26}>
        <GroupsByTypeTile data={props.groupsByType} />
        <div className="mt-2 space-y-1">
          {props.groupsByType.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              <span
                className="flex-1 truncate text-[10.5px]"
                style={{ color: bento.surface.textSoft }}
              >
                {d.name}
              </span>
              <span
                className="font-bold tabular-nums text-[10.5px]"
                style={{ fontFamily: bento.font.mono, color: bento.surface.text }}
              >
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </BentoTile>

      <BentoTile category="kpi" title="Risco · grupos críticos" meta="ATENÇÃO" delay={0.32}>
        <RiskTile groups={props.bottomGroups} />
      </BentoTile>

      <BentoTile
        category="chart"
        title="Performance por gerência"
        meta="MÉDIA"
        delay={0.38}
        className="lg:col-span-3"
      >
        <ManagementTile data={props.managementPerformance} />
      </BentoTile>

      <BentoTile
        category="chart"
        title="Pipeline da sequência"
        meta="GRUPOS"
        delay={0.44}
        className="lg:col-span-2"
      >
        <SequenceTile data={props.sequenceDistribution} />
      </BentoTile>

      <BentoTile
        category="activity"
        title="Atividade recente"
        meta="LOG"
        delay={0.5}
        className="lg:col-span-2"
      >
        <ActivityTile items={props.recentActivity} />
      </BentoTile>
    </>
  )
}
