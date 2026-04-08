/**
 * CardsLayout - Sidebar Enterprise (V7/V10)
 * Equipe sidebar + Score evolution chart + Atendimento donuts
 */

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import type { TeamMember, GroupAnalytics, QuestionGroup } from '@/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

// ============================================================================
// PROPS
// ============================================================================

interface CardsLayoutProps {
  team: TeamMember[]
  analytics: GroupAnalytics
  scoreEvolutionData: { month: string; score: number }[]
  questionGroupData: { groupId: string; groupName: string; compliance: number; color?: string }[]
  questionGroups: QuestionGroup[]
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  TrendUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Layers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Star: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  ChartWatermark: () => (
    <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="text-primary-500/[0.03]">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  TeamWatermark: () => (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-primary-500/[0.04]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
}

// ============================================================================
// HELPERS
// ============================================================================

function getRoleLabel(role: TeamMember['role']) {
  switch (role) { case 'facilitator': return 'Facilitador'; case 'auditor': return 'Auditor'; default: return 'Membro' }
}

function getRoleSectionTitle(role: TeamMember['role']) {
  switch (role) { case 'facilitator': return 'Facilitadores'; case 'auditor': return 'Auditores'; default: return 'Membros' }
}

function getRoleDotColor(role: TeamMember['role']) {
  switch (role) { case 'facilitator': return 'bg-primary-500'; case 'auditor': return 'bg-blue-500'; default: return 'bg-slate-400' }
}

function getRoleAvatarStyles(role: TeamMember['role']) {
  switch (role) {
    case 'facilitator': return { bg: 'bg-primary-100', text: 'text-primary-700' }
    case 'auditor': return { bg: 'bg-blue-100', text: 'text-blue-700' }
    default: return { bg: 'bg-slate-100', text: 'text-slate-600' }
  }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const staggerParent = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

const fadeLeft = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-primary-600">{payload[0].value}</span>
        <span className="text-xs text-gray-400">%</span>
      </div>
    </div>
  )
}

// ============================================================================
// SIDEBAR EQUIPE
// ============================================================================

function SidebarEquipe({ team }: { team: TeamMember[] }) {
  const facilitators = team.filter(m => m.role === 'facilitator')
  const auditors = team.filter(m => m.role === 'auditor')
  const members = team.filter(m => m.role === 'member')

  const roleGroups = [
    { role: 'facilitator' as const, members: facilitators },
    { role: 'auditor' as const, members: auditors },
    { role: 'member' as const, members: members },
  ].filter(g => g.members.length > 0)

  return (
    <motion.div variants={fadeLeft} className="h-full">
      <Card className="h-full relative overflow-hidden flex flex-col" padding="none">
        <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }} />
        <div className="absolute -bottom-2 -right-2 pointer-events-none"><Icons.TeamWatermark /></div>

        <div className="relative p-5 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}>
              <span className="text-white"><Icons.Users /></span>
            </div>
            <h3 className="font-semibold text-gray-800">Equipe</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[480px] px-3 pb-3 space-y-1 scrollbar-thin">
          {roleGroups.map((group, groupIndex) => (
            <div key={group.role}>
              <div className={cn('flex items-center gap-2 px-3 py-2', groupIndex > 0 && 'mt-2')}>
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', getRoleDotColor(group.role))} />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {getRoleSectionTitle(group.role)}
                </span>
                <span className="text-[10px] text-gray-300 ml-auto">{group.members.length}</span>
              </div>

              {group.members.map((member, index) => {
                const avatarStyles = getRoleAvatarStyles(member.role)
                return (
                  <motion.div key={member.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + (groupIndex * 3 + index) * 0.04, duration: 0.3 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-150 cursor-default"
                  >
                    <div className="relative">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold', avatarStyles.bg, avatarStyles.text)}>
                        {getInitials(member.name)}
                      </div>
                      {member.role === 'facilitator' && (
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full flex items-center justify-center">
                          <Icons.Star />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{member.name}</p>
                      <span className="text-[10px] text-gray-400">{getRoleLabel(member.role)}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            {facilitators.length > 0 && (
              <span className="flex items-center gap-1"><Icons.Star /> {facilitators.length} Facilitador{facilitators.length > 1 ? 'es' : ''}</span>
            )}
            {auditors.length > 0 && <span>{auditors.length} Auditor{auditors.length > 1 ? 'es' : ''}</span>}
            {members.length > 0 && <span>{members.length} Membro{members.length > 1 ? 's' : ''}</span>}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// CARD EVOLUCAO
// ============================================================================

function CardEvolucao({ scoreEvolutionData, analytics }: {
  scoreEvolutionData: { month: string; score: number }[]
  analytics: GroupAnalytics
}) {
  const trendIcon = analytics.scoreTrend === 'up' ? '↑' : analytics.scoreTrend === 'down' ? '↓' : '→'

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Card className="relative overflow-hidden h-full" padding="none">
        <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }} />
        <div className="absolute -bottom-6 -right-6 pointer-events-none"><Icons.ChartWatermark /></div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}>
                <span className="text-white"><Icons.TrendUp /></span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Evolucao de Notas</h3>
                <p className="text-xs text-gray-400 mt-0.5">Historico dos ultimos 6 meses</p>
              </div>
            </div>
            <Badge variant={analytics.scoreTrend === 'up' ? 'success' : analytics.scoreTrend === 'down' ? 'error' : 'default'} size="sm" dot>
              {trendIcon} {Math.abs(analytics.scoreChangePercentage)}%
            </Badge>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreEvolutionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="v7ScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E7A73" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#3AA39C" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#96D4D0" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={analytics.nextSequenceGoal} stroke="#D97706" strokeDasharray="5 5" strokeWidth={1.5}
                  label={{ value: `Meta ${analytics.nextSequenceGoal}%`, position: 'right', fill: '#D97706', fontSize: 10, fontWeight: 500 }} />
                <Area type="monotone" dataKey="score" stroke="#1E7A73" strokeWidth={2.5} fill="url(#v7ScoreGrad)"
                  dot={{ fill: '#1E7A73', strokeWidth: 0, r: 3.5 }}
                  activeDot={{ fill: '#1E7A73', r: 6, stroke: '#C5E8E6', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// DONUT RING
// ============================================================================

function DonutRing({ percentage, color, label, delay = 0 }: {
  percentage: number; color: string; label: string; delay?: number
}) {
  const radius = 28
  const strokeWidth = 6
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <motion.div className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}>
      <div className="relative">
        <svg width={radius * 2} height={radius * 2} className="-rotate-90">
          <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
          <motion.circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="text-xs font-bold text-gray-700"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + 0.6 }}>
            {percentage}%
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 font-medium text-center truncate w-16" title={label}>
        {label}
      </span>
    </motion.div>
  )
}

// ============================================================================
// CARD ATENDIMENTO - Donuts
// ============================================================================

function CardAtendimento({ questionGroupData, questionGroups }: {
  questionGroupData: { groupId: string; groupName: string; compliance: number; color?: string }[]
  questionGroups: QuestionGroup[]
}) {
  const defaultColors = ['#1E7A73', '#3AA39C', '#8B5CF6', '#EC4899', '#F59E0B']
  const displayData = questionGroupData.slice(0, 5).map((item, index) => {
    const group = questionGroups.find(g => g.id === item.groupId)
    return { ...item, color: item.color || group?.color || defaultColors[index % defaultColors.length] }
  })

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Card className="relative overflow-hidden h-full" padding="none">
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }} />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}>
              <span className="text-white"><Icons.Layers /></span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Atendimento por Categoria</h3>
              <p className="text-xs text-gray-400 mt-0.5">Percentual de itens respondidos como "Sim"</p>
            </div>
          </div>

          <div className="flex items-start justify-around gap-2">
            {displayData.map((item, index) => (
              <DonutRing key={item.groupId} percentage={item.compliance} color={item.color}
                label={item.groupName} delay={0.3 + index * 0.1} />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CardsLayout({ team, analytics, scoreEvolutionData, questionGroupData, questionGroups }: CardsLayoutProps) {
  return (
    <motion.div className="flex flex-col lg:flex-row gap-5" variants={staggerParent} initial="hidden" animate="show">
      <div className="lg:w-72 flex-shrink-0">
        <SidebarEquipe team={team} />
      </div>
      <div className="flex-1 flex flex-col min-w-0" style={{ gap: '20px' }}>
        <div className="flex-[6]">
          <CardEvolucao scoreEvolutionData={scoreEvolutionData} analytics={analytics} />
        </div>
        <div className="flex-[4]">
          <CardAtendimento questionGroupData={questionGroupData} questionGroups={questionGroups} />
        </div>
      </div>
    </motion.div>
  )
}
