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
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Evaluation, Group } from '@/types'
import { AuditIcon, FollowupIcon, SparklesIcon } from '@/assets/icons'
import { cinematic } from './cinematic-tokens'

interface Props {
  scoreEvolution: { month: string; [type: string]: number | string }[]
  groupsByType: { name: string; count: number }[]
  managementPerformance: { name: string; score: number }[]
  sequenceDistribution: { step: string; count: number }[]
  recentActivity: Evaluation[]
  bottomGroups: Group[]
}

const TYPE_COLORS = ['#1E7A73', '#3AA39C', '#5EA448', '#DDDD03', '#CE3C5A']

interface TooltipPayload {
  payload?: Record<string, unknown>
  value?: number
  name?: string
  color?: string
}

function GlassTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      className="rounded-xl px-3 py-2.5 min-w-[140px]"
      style={{
        background: 'rgba(7, 29, 27, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${cinematic.hero.glassBorder}`,
        boxShadow: '0 12px 30px -10px rgba(0,0,0,0.5)',
      }}
    >
      {label && (
        <div
          className="text-white/55 mb-1.5 uppercase tracking-[0.14em]"
          style={{ fontFamily: cinematic.font.mono, fontSize: 9 }}
        >
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }}
            />
            <span className="text-white/85 text-[11px]">{p.name}</span>
          </div>
          <span
            className="text-white font-semibold tabular-nums"
            style={{ fontFamily: cinematic.font.mono, fontSize: 12 }}
          >
            {p.value}
            {typeof p.value === 'number' ? '' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  meta,
  children,
  delay,
  className = '',
}: {
  title: string
  meta?: string
  children: React.ReactNode
  delay: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className={`bg-white rounded-2xl p-5 ${className}`}
      style={{
        border: `1px solid ${cinematic.body.cardBorder}`,
        boxShadow: cinematic.shadow.chartCard,
      }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h3
          className="font-semibold"
          style={{
            fontFamily: cinematic.font.display,
            fontSize: 15,
            color: cinematic.text.onLight,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>
        {meta && (
          <span
            className="uppercase tracking-[0.14em]"
            style={{ fontSize: 9, color: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }}
          >
            {meta}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  )
}

function ScoreEvolutionChart({ data }: { data: Props['scoreEvolution'] }) {
  const types = data.length
    ? Object.keys(data[0]).filter((k) => k !== 'month')
    : []

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <defs>
          {types.map((t, i) => (
            <linearGradient key={t} id={`grad-evo-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TYPE_COLORS[i % TYPE_COLORS.length]} stopOpacity={0.45} />
              <stop offset="100%" stopColor={TYPE_COLORS[i % TYPE_COLORS.length]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 4" stroke="#E4E8E8" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip content={<GlassTooltip />} cursor={{ stroke: '#3AA39C', strokeWidth: 1, strokeDasharray: '3 3' }} />
        {types.map((t, i) => (
          <Area
            key={t}
            type="monotone"
            dataKey={t}
            stroke={TYPE_COLORS[i % TYPE_COLORS.length]}
            strokeWidth={2.2}
            fill={`url(#grad-evo-${i})`}
            dot={{ r: 3, fill: TYPE_COLORS[i % TYPE_COLORS.length], strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

function GroupsByTypeChart({ data }: { data: Props['groupsByType'] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0)
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={56}
            outerRadius={88}
            paddingAngle={3}
            dataKey="count"
            stroke="none"
          >
            {data.map((_entry, i) => (
              <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<GlassTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-bold tabular-nums leading-none"
          style={{
            fontFamily: cinematic.font.display,
            fontSize: 30,
            color: cinematic.text.onLight,
          }}
        >
          {total}
        </span>
        <span
          className="uppercase tracking-[0.14em] mt-1"
          style={{ fontFamily: cinematic.font.mono, fontSize: 9, color: cinematic.text.onLightSubtle }}
        >
          grupos
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }}
            />
            <span className="text-[11px] text-gray-600">{d.name}</span>
            <span
              className="text-[11px] font-semibold tabular-nums"
              style={{ fontFamily: cinematic.font.mono, color: cinematic.text.onLight }}
            >
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ManagementBars({ data }: { data: Props['managementPerformance'] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-mgmt" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#103734" />
            <stop offset="100%" stopColor="#3AA39C" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 4" stroke="#E4E8E8" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: cinematic.text.onLightMuted }}
          axisLine={false}
          tickLine={false}
          width={130}
        />
        <Tooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(58,163,156,0.06)' }} />
        <Bar dataKey="score" fill="url(#grad-mgmt)" radius={[0, 8, 8, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SequenceBars({ data }: { data: Props['sequenceDistribution'] }) {
  const stepColors = ['#103734', '#1E7A73', '#3AA39C', '#5EA448', '#DDDD03']
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 4" stroke="#E4E8E8" vertical={false} />
        <XAxis
          dataKey="step"
          tick={{ fontSize: 11, fill: cinematic.text.onLightMuted, fontFamily: cinematic.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(58,163,156,0.06)' }} />
        <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={42}>
          {data.map((_, i) => (
            <Cell key={i} fill={stepColors[i % stepColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function ActivityFeed({ items }: { items: Evaluation[] }) {
  return (
    <div className="space-y-3">
      {items.slice(0, 6).map((ev, i) => {
        const isAudit = ev.type === 'audit'
        const Icon = isAudit ? AuditIcon : FollowupIcon
        const accent = isAudit ? cinematic.accents.teal : cinematic.accents.crownGold
        const dateStr = format(parseISO(ev.date), "d 'de' MMM", { locale: ptBR })
        const score = ev.score
        const scoreColor =
          score >= 80 ? cinematic.accents.lime : score >= 50 ? cinematic.accents.crownGold : cinematic.accents.rose

        return (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex flex-col items-center">
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  background: `${accent}14`,
                  color: accent,
                }}
              >
                <Icon size={16} />
              </div>
              {i < items.length - 1 && (
                <div
                  className="w-px h-3 mt-1"
                  style={{ background: 'linear-gradient(180deg, #E4E8E8 0%, transparent 100%)' }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-3 border-b border-gray-100 group-last:border-b-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span
                    className="font-semibold truncate"
                    style={{
                      fontFamily: cinematic.font.display,
                      fontSize: 13,
                      color: cinematic.text.onLight,
                    }}
                  >
                    {ev.groupName}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold"
                    style={{
                      background: `${accent}12`,
                      color: accent,
                      letterSpacing: '0.12em',
                    }}
                  >
                    {isAudit ? 'Auditoria' : 'Follow-up'}
                  </span>
                </div>
                <span
                  className="font-bold tabular-nums flex-shrink-0"
                  style={{
                    fontFamily: cinematic.font.mono,
                    fontSize: 13,
                    color: scoreColor,
                  }}
                >
                  {score}%
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[11px] text-gray-500 truncate">{ev.applicantName}</span>
                <span
                  className="text-[10px] text-gray-400 flex-shrink-0"
                  style={{ fontFamily: cinematic.font.mono }}
                >
                  {dateStr}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function NeedsAttentionCard({ groups }: { groups: Group[] }) {
  const items = groups.slice(0, 3)
  return (
    <div className="space-y-2.5">
      {items.map((g, i) => {
        const score = g.lastAuditScore ?? 0
        return (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(206,60,90,0.04) 0%, rgba(206,60,90,0.08) 100%)',
              border: '1px solid rgba(206,60,90,0.12)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 30,
                height: 30,
                background: 'rgba(206,60,90,0.14)',
                color: cinematic.accents.rose,
                fontFamily: cinematic.font.mono,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-semibold truncate"
                style={{
                  fontFamily: cinematic.font.display,
                  fontSize: 13,
                  color: cinematic.text.onLight,
                }}
              >
                {g.name}
              </div>
              <div className="text-[10.5px] text-gray-500 truncate">{g.managementName}</div>
            </div>
            <div
              className="font-bold tabular-nums flex-shrink-0"
              style={{
                fontFamily: cinematic.font.mono,
                fontSize: 16,
                color: cinematic.accents.rose,
              }}
            >
              {score}%
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export function CinematicCharts({
  scoreEvolution,
  groupsByType,
  managementPerformance,
  sequenceDistribution,
  recentActivity,
  bottomGroups,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <ChartCard
        title="Evolução das notas por tipo"
        meta="últimos 6 meses"
        delay={0.1}
        className="lg:col-span-8"
      >
        <ScoreEvolutionChart data={scoreEvolution} />
      </ChartCard>

      <ChartCard
        title="Grupos por tipo"
        meta="distribuição"
        delay={0.16}
        className="lg:col-span-4"
      >
        <GroupsByTypeChart data={groupsByType} />
      </ChartCard>

      <ChartCard
        title="Desempenho por gerência"
        meta="nota média"
        delay={0.22}
        className="lg:col-span-6"
      >
        <ManagementBars data={managementPerformance} />
      </ChartCard>

      <ChartCard
        title="Distribuição por sequência"
        meta="grupos por passo"
        delay={0.28}
        className="lg:col-span-6"
      >
        <SequenceBars data={sequenceDistribution} />
      </ChartCard>

      <ChartCard
        title="Atividade recente"
        meta="últimas avaliações"
        delay={0.34}
        className="lg:col-span-8"
      >
        <ActivityFeed items={recentActivity} />
      </ChartCard>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="lg:col-span-4 rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF1F3 100%)',
          border: `1px solid ${cinematic.body.cardBorder}`,
          boxShadow: cinematic.shadow.chartCard,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold"
            style={{
              fontFamily: cinematic.font.display,
              fontSize: 15,
              color: cinematic.text.onLight,
              letterSpacing: '-0.01em',
            }}
          >
            Precisam de atenção
          </h3>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 28,
              height: 28,
              background: 'rgba(206,60,90,0.12)',
              color: cinematic.accents.rose,
            }}
          >
            <SparklesIcon size={14} />
          </div>
        </div>
        <NeedsAttentionCard groups={bottomGroups} />
        <div className="mt-3 pt-3 border-t border-rose-100">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Equipes com menor pontuação na última auditoria. Considere agendar follow-up.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
