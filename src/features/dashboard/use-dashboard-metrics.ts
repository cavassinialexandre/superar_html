import { useMemo } from 'react'
import { groups, evaluations, groupTypes, dashboardData } from '@/mocks/data'
import type { Group, Evaluation } from '@/types'
import { format, parseISO } from 'date-fns'

const MONTH_LABELS: Record<string, string> = {
  '10': 'Out',
  '11': 'Nov',
  '12': 'Dez',
  '1': 'Jan',
  '2': 'Fev',
  '3': 'Mar',
}
const MONTH_KEYS = ['10', '11', '12', '1', '2', '3']

function getGroupGoal(group: Group): number {
  const type = groupTypes.find((t) => t.id === group.groupTypeId)
  if (!type) return 0
  const seq = type.sequences.find((s) => s.number === group.currentSequence)
  if (!seq) return 0
  return seq.useDefaultGoal ? type.defaultGoal : (seq.customGoal ?? 0)
}

function getMonthKey(dateStr: string): string {
  return format(parseISO(dateStr), 'M')
}

export interface DashboardMetrics {
  // Raw base
  totalGroups: number
  activeGroups: number
  completedGroups: number
  averageScore: number

  // Derived
  approvalRate: number
  averageScoreByManagement: { name: string; score: number }[]
  averageScoreByGroupType: { name: string; score: number }[]
  sequenceDistribution: { step: string; count: number }[]
  topGroups: Group[]
  bottomGroups: Group[]
  recentActivity: Evaluation[]
  scoreEvolutionByType: { month: string; [type: string]: number | string }[]
}

export function useDashboardMetrics(): DashboardMetrics {
  return useMemo(() => {
    // Approval rate
    const scoredGroups = groups.filter((g) => g.lastAuditScore !== undefined)
    const approvedCount = scoredGroups.filter((g) => (g.lastAuditScore ?? 0) >= getGroupGoal(g)).length
    const approvalRate = scoredGroups.length > 0 ? Math.round((approvedCount / scoredGroups.length) * 100) : 0

    // Average score by management
    const mgmtScores = new Map<string, number[]>()
    for (const g of groups) {
      if (g.lastAuditScore === undefined) continue
      const arr = mgmtScores.get(g.managementName) ?? []
      arr.push(g.lastAuditScore)
      mgmtScores.set(g.managementName, arr)
    }
    const averageScoreByManagement = Array.from(mgmtScores.entries())
      .map(([name, scores]) => ({ name, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }))
      .sort((a, b) => b.score - a.score)

    // Average score by group type
    const typeScores = new Map<string, number[]>()
    for (const g of groups) {
      if (g.lastAuditScore === undefined) continue
      const arr = typeScores.get(g.groupTypeName) ?? []
      arr.push(g.lastAuditScore)
      typeScores.set(g.groupTypeName, arr)
    }
    const averageScoreByGroupType = Array.from(typeScores.entries())
      .map(([name, scores]) => ({ name, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }))
      .sort((a, b) => b.score - a.score)

    // Sequence distribution
    const seqMap = new Map<number, number>()
    for (const g of groups) {
      seqMap.set(g.currentSequence, (seqMap.get(g.currentSequence) ?? 0) + 1)
    }
    const sequenceDistribution = Array.from(seqMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([step, count]) => ({ step: `Passo ${step}`, count }))

    // Top / Bottom groups
    const sortedByScore = [...groups]
      .filter((g) => g.lastAuditScore !== undefined)
      .sort((a, b) => (b.lastAuditScore ?? 0) - (a.lastAuditScore ?? 0))
    const topGroups = sortedByScore.slice(0, 6)
    const bottomGroups = [...sortedByScore].reverse().slice(0, 6)

    // Recent activity
    const recentActivity = [...evaluations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)

    // Score evolution by type
    const evoMap = new Map<string, Map<string, number[]>>()
    for (const ev of evaluations) {
      const monthKey = getMonthKey(ev.date)
      if (!MONTH_KEYS.includes(monthKey)) continue
      if (!evoMap.has(monthKey)) evoMap.set(monthKey, new Map())
      const typeMap = evoMap.get(monthKey)!
      const arr = typeMap.get(ev.groupTypeName) ?? []
      arr.push(ev.score)
      typeMap.set(ev.groupTypeName, arr)
    }

    const allTypes = Array.from(new Set(evaluations.map((e) => e.groupTypeName)))
    const scoreEvolutionByType = MONTH_KEYS.map((monthKey) => {
      const row: { month: string; [type: string]: number | string } = { month: MONTH_LABELS[monthKey] }
      const typeMap = evoMap.get(monthKey)
      for (const type of allTypes) {
        const scores = typeMap?.get(type) ?? []
        row[type] = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      }
      return row
    })

    return {
      totalGroups: dashboardData.totalGroups,
      activeGroups: dashboardData.activeGroups,
      completedGroups: dashboardData.completedGroups,
      averageScore: dashboardData.averageScore,
      approvalRate,
      averageScoreByManagement,
      averageScoreByGroupType,
      sequenceDistribution,
      topGroups,
      bottomGroups,
      recentActivity,
      scoreEvolutionByType,
    }
  }, [])
}
