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
import { AuditIcon, FollowupIcon, AlertCircleIcon } from '@/assets/icons'
import { ec } from './editorial-cinema-tokens'

interface AnalyticsProps {
  scoreEvolution: { month: string; [type: string]: number | string }[]
  groupsByType: { name: string; count: number }[]
  managementPerformance: { name: string; score: number }[]
  sequenceDistribution: { step: string; count: number }[]
  recentActivity: Evaluation[]
  bottomGroups: Group[]
}

const PALETTE = ['#103734', '#3AA39C', '#5EA448', '#DDDD03', '#B72E4A']

interface TooltipPayload {
  payload?: Record<string, unknown>
  value?: number
  name?: string
  color?: string
}

function ECTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      className="rounded-lg px-3 py-2 min-w-[140px]"
      style={{
        background: ec.surface.paper,
        border: `1px solid ${ec.surface.ruleStrong}`,
        boxShadow: '0 6px 18px -6px rgba(16,55,52,0.16)',
      }}
    >
      {label && (
        <div
          className="uppercase mb-1.5 font-semibold"
          style={{
            fontFamily: ec.font.sans,
            fontSize: '9.5px',
            letterSpacing: ec.letter.kickerSm,
            color: ec.surface.inkMuted,
          }}
        >
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span style={{ fontFamily: ec.font.body, fontSize: '11.5px', color: ec.surface.inkSoft }}>
              {p.name}
            </span>
          </div>
          <span
            className="font-bold tabular-nums"
            style={{ fontFamily: ec.font.mono, fontSize: '11.5px', color: ec.surface.ink }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function SectionTitle({
  kicker,
  titleStart,
  titleSerif,
  titleEnd,
  insight,
}: {
  kicker: string
  titleStart?: string
  titleSerif: string
  titleEnd?: string
  insight?: string
}) {
  return (
    <div className="mb-5">
      <div
        className="uppercase font-bold mb-2"
        style={{
          fontFamily: ec.font.sans,
          fontSize: ec.scale.kicker,
          letterSpacing: ec.letter.kicker,
          color: ec.accent.teal,
        }}
      >
        {kicker}
      </div>
      <h2
        className="font-bold mb-1.5"
        style={{
          fontFamily: ec.font.sans,
          fontSize: ec.scale.h2,
          color: ec.surface.ink,
          letterSpacing: '-0.012em',
          lineHeight: 1.15,
        }}
      >
        {titleStart && <>{titleStart} </>}
        <span style={{ fontFamily: ec.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
          {titleSerif}
        </span>
        {titleEnd && <> {titleEnd}</>}
      </h2>
      {insight && (
        <p
          className="max-w-lg"
          style={{
            fontFamily: ec.font.body,
            fontSize: '12.5px',
            color: ec.surface.inkMuted,
            lineHeight: 1.5,
          }}
        >
          {insight}
        </p>
      )}
    </div>
  )
}

function ScoreEvolutionChart({ data }: { data: AnalyticsProps['scoreEvolution'] }) {
  const types = data.length ? Object.keys(data[0]).filter((k) => k !== 'month') : []
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
        <defs>
          {types.map((t, i) => (
            <linearGradient key={t} id={`ec-evo-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.32} />
              <stop offset="100%" stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke={ec.surface.rule} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: ec.surface.inkMuted, fontFamily: ec.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: ec.surface.inkSubtle, fontFamily: ec.font.mono }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip content={<ECTooltip />} cursor={{ stroke: ec.accent.mint, strokeWidth: 1, strokeDasharray: '3 3' }} />
        {types.map((t, i) => (
          <Area
            key={t}
            type="monotone"
            dataKey={t}
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={2}
            fill={`url(#ec-evo-${i})`}
            dot={{ r: 3, fill: PALETTE[i % PALETTE.length], strokeWidth: 1.5, stroke: '#FFFFFF' }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

function GroupsByTypeChart({ data }: { data: AnalyticsProps['groupsByType'] }) {
  const total = data.reduce((acc, d) => acc + d.count, 0)
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full" style={{ maxWidth: 200 }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={78}
              paddingAngle={3}
              dataKey="count"
              stroke={ec.surface.canvas}
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<ECTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="font-bold tabular-nums leading-none"
            style={{
              fontFamily: ec.font.serif,
              fontWeight: 400,
              fontSize: '32px',
              color: ec.surface.ink,
              letterSpacing: '-0.02em',
            }}
          >
            {total}
          </span>
          <span
            className="uppercase mt-1"
            style={{
              fontFamily: ec.font.sans,
              fontSize: '9.5px',
              letterSpacing: ec.letter.kicker,
              color: ec.surface.inkMuted,
            }}
          >
            grupos
          </span>
        </div>
      </div>
      <div className="mt-3 w-full space-y-1.5">
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
                style={{ fontFamily: ec.font.body, fontSize: '12px', color: ec.surface.inkSoft }}
              >
                {d.name}
              </span>
              <span
                className="tabular-nums w-8 text-right"
                style={{
                  fontFamily: ec.font.mono,
                  fontSize: '10.5px',
                  color: ec.surface.inkMuted,
                }}
              >
                {pct}%
              </span>
              <span
                className="tabular-nums font-bold w-6 text-right"
                style={{ fontFamily: ec.font.serif, fontSize: '15px', color: ec.surface.ink }}
              >
                {d.count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ManagementBars({ data }: { data: AnalyticsProps['managementPerformance'] }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ec-mgmt-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ec.accent.teal} />
            <stop offset="100%" stopColor={ec.accent.mint} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke={ec.surface.rule} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: ec.surface.inkMuted, fontFamily: ec.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: ec.surface.inkSoft }}
          axisLine={false}
          tickLine={false}
          width={130}
        />
        <Tooltip content={<ECTooltip />} cursor={{ fill: 'rgba(58,163,156,0.05)' }} />
        <Bar dataKey="score" fill="url(#ec-mgmt-grad)" radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SequenceBars({ data }: { data: AnalyticsProps['sequenceDistribution'] }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke={ec.surface.rule} vertical={false} />
        <XAxis
          dataKey="step"
          tick={{ fontSize: 11, fill: ec.surface.inkSoft, fontFamily: ec.font.mono }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: ec.surface.inkMuted, fontFamily: ec.font.mono }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<ECTooltip />} cursor={{ fill: 'rgba(58,163,156,0.05)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={36}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function ActivityFeed({ items }: { items: Evaluation[] }) {
  return (
    <div className="space-y-3.5">
      {items.slice(0, 6).map((ev, i) => {
        const isAudit = ev.type === 'audit'
        const Icon = isAudit ? AuditIcon : FollowupIcon
        const accent = isAudit ? ec.accent.teal : ec.accent.crownGoldDeep
        const dateStr = format(parseISO(ev.date), "d 'de' MMM", { locale: ptBR })
        const score = ev.score
        const scoreColor = score >= 80 ? ec.accent.sage : score >= 50 ? ec.accent.teal : ec.accent.rose
        return (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            className="flex items-center gap-3 group"
          >
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                background: `${accent}14`,
                color: accent,
              }}
            >
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0 pb-3 border-b group-last:border-b-0" style={{ borderColor: ec.surface.rule }}>
              <div className="flex items-baseline justify-between gap-2 mb-0.5">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span
                    className="font-semibold truncate"
                    style={{
                      fontFamily: ec.font.sans,
                      fontSize: '13px',
                      color: ec.surface.ink,
                    }}
                  >
                    {ev.groupName}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8.5px] uppercase tracking-[0.14em] font-bold flex-shrink-0"
                    style={{ background: `${accent}12`, color: accent }}
                  >
                    {isAudit ? 'AUDITORIA' : 'FOLLOW-UP'}
                  </span>
                </div>
                <span
                  className="font-bold tabular-nums flex-shrink-0"
                  style={{
                    fontFamily: ec.font.mono,
                    fontSize: '13.5px',
                    color: scoreColor,
                  }}
                >
                  {score}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="italic"
                  style={{
                    fontFamily: ec.font.body,
                    fontSize: '11.5px',
                    color: ec.surface.inkMuted,
                  }}
                >
                  por {ev.applicantName}
                </span>
                <span
                  className="uppercase tabular-nums"
                  style={{
                    fontFamily: ec.font.mono,
                    fontSize: '10px',
                    letterSpacing: ec.letter.kickerSm,
                    color: ec.surface.inkSubtle,
                  }}
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

function NeedsAttentionList({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-3">
      {groups.slice(0, 3).map((g, i) => {
        const score = g.lastAuditScore ?? 0
        return (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{
              background: 'rgba(183,46,74,0.04)',
              border: '1px solid rgba(183,46,74,0.16)',
            }}
          >
            <span
              className="font-bold leading-none"
              style={{
                fontFamily: ec.font.serif,
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '24px',
                color: ec.accent.rose,
                width: 26,
                textAlign: 'center',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="flex items-center justify-center rounded-md flex-shrink-0"
              style={{
                width: 24,
                height: 24,
                background: 'rgba(183,46,74,0.12)',
                color: ec.accent.rose,
              }}
            >
              <AlertCircleIcon size={12} />
            </span>
            <div className="flex-1 min-w-0">
              <div
                className="font-semibold truncate"
                style={{
                  fontFamily: ec.font.sans,
                  fontSize: '13px',
                  color: ec.surface.ink,
                }}
              >
                {g.name}
              </div>
              <div
                className="text-[10.5px] truncate italic"
                style={{ fontFamily: ec.font.body, color: ec.surface.inkMuted }}
              >
                {g.managementName}
              </div>
            </div>
            <span
              className="font-bold tabular-nums flex-shrink-0"
              style={{ fontFamily: ec.font.mono, fontSize: '17px', color: ec.accent.rose }}
            >
              {score}%
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

function Section({
  children,
  className = '',
  delay,
}: {
  children: React.ReactNode
  className?: string
  delay: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export function EditorialCinemaAnalytics({
  scoreEvolution,
  groupsByType,
  managementPerformance,
  sequenceDistribution,
  recentActivity,
  bottomGroups,
}: AnalyticsProps) {
  return (
    <>
      <Section className="py-9 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8 border-b" delay={0.7}>
        <div className="lg:col-span-8">
          <SectionTitle
            kicker="ANÁLISE TEMPORAL · ÚLTIMOS 6 MESES"
            titleStart="Evolução"
            titleSerif="das notas"
            titleEnd="por tipo"
            insight="Média móvel mensal por categoria de grupo. Picos sinalizam ciclos com bom desempenho coletivo; quedas merecem investigação dirigida."
          />
          <ScoreEvolutionChart data={scoreEvolution} />
        </div>
        <div className="lg:col-span-4 lg:border-l lg:pl-10" style={{ borderColor: ec.surface.rule }}>
          <SectionTitle
            kicker="DISTRIBUIÇÃO POR TIPO"
            titleSerif="Composição"
            titleEnd="dos grupos"
            insight="Quantos grupos cada categoria operacional possui."
          />
          <GroupsByTypeChart data={groupsByType} />
        </div>
      </Section>

      <Section className="py-9 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8 border-b" delay={0.78}>
        <div>
          <SectionTitle
            kicker="PERFORMANCE OPERACIONAL"
            titleStart="Nota"
            titleSerif="por gerência"
            insight="Pontuação consolidando as últimas auditorias."
          />
          <ManagementBars data={managementPerformance} />
        </div>
        <div className="lg:border-l lg:pl-10" style={{ borderColor: ec.surface.rule }}>
          <SectionTitle
            kicker="PIPELINE DA SEQUÊNCIA"
            titleStart="Distribuição"
            titleSerif="por sequência"
            insight="Onde os grupos estão na jornada Kaizen — concentrações em sequências iniciais indicam fôlego."
          />
          <SequenceBars data={sequenceDistribution} />
        </div>
      </Section>

      <Section className="py-9 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8" delay={0.86}>
        <div className="lg:col-span-8">
          <SectionTitle
            kicker="HEMEROTECA · ATIVIDADE RECENTE"
            titleStart="Últimas"
            titleSerif="avaliações"
            insight="Auditorias e follow-ups registrados pelo time avaliador, em ordem cronológica reversa."
          />
          <ActivityFeed items={recentActivity} />
        </div>
        <div className="lg:col-span-4 lg:border-l lg:pl-10" style={{ borderColor: ec.surface.rule }}>
          <SectionTitle
            kicker="ATENÇÃO EXECUTIVA"
            titleSerif="Em risco"
            insight="Grupos abaixo da meta atual da sequência. Considere agendar follow-up dirigido."
          />
          <NeedsAttentionList groups={bottomGroups} />
        </div>
      </Section>
    </>
  )
}
