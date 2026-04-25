import type { Evaluation } from '@/types'
import type { HistoryKPIs } from '../types'
import { resolveGoalPct } from './evaluation-adapter'

/**
 * Computa KPIs agregados de um conjunto filtrado de avaliações.
 * O trend é calculado comparando com o período anterior equivalente:
 * - Se houver filtro de data, pega a janela imediatamente anterior de mesma duração
 * - Se não houver, compara com os 30 dias anteriores aos 30 dias mais recentes
 */
export function computeKPIs(
  filtered: Evaluation[],
  allUnitScoped: Evaluation[],
  dateFrom: string | null,
  dateTo: string | null,
): HistoryKPIs {
  const total = filtered.length
  const auditCount = filtered.filter((e) => e.type === 'audit').length
  const followupCount = filtered.filter((e) => e.type === 'followup').length

  const avgScore = total > 0
    ? filtered.reduce((sum, e) => sum + e.score, 0) / total
    : 0

  const audits = filtered.filter((e) => e.type === 'audit')
  const advanced = audits.filter((e) => e.advancedSequence === true).length
  const advanceRate = audits.length > 0 ? (advanced / audits.length) * 100 : 0

  const belowGoalCount = filtered.filter((e) => {
    const goal = resolveGoalPct(e) ?? 0
    return e.score < goal
  }).length

  // Trend: score médio vs período anterior
  const trend = computeTrend(filtered, allUnitScoped, dateFrom, dateTo, avgScore)

  return {
    total,
    auditCount,
    followupCount,
    avgScore,
    advanceRate,
    belowGoalCount,
    trend,
  }
}

function computeTrend(
  filtered: Evaluation[],
  allUnitScoped: Evaluation[],
  dateFrom: string | null,
  dateTo: string | null,
  currentAvg: number,
): HistoryKPIs['trend'] {
  if (filtered.length === 0) return { avgScoreDelta: 0, direction: 'flat' }

  let windowStart: Date
  let windowEnd: Date

  if (dateFrom && dateTo) {
    windowStart = new Date(dateFrom)
    windowEnd = new Date(dateTo)
  } else {
    // Janela default: últimos 30 dias
    windowEnd = new Date()
    windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - 30)
  }

  const duration = windowEnd.getTime() - windowStart.getTime()
  const prevEnd = new Date(windowStart.getTime() - 1)
  const prevStart = new Date(prevEnd.getTime() - duration)

  const prevSet = allUnitScoped.filter((e) => {
    const d = new Date(e.date).getTime()
    return d >= prevStart.getTime() && d <= prevEnd.getTime()
  })

  if (prevSet.length === 0) return { avgScoreDelta: 0, direction: 'flat' }

  const prevAvg = prevSet.reduce((s, e) => s + e.score, 0) / prevSet.length
  const delta = currentAvg - prevAvg
  let direction: 'up' | 'down' | 'flat' = 'flat'
  if (Math.abs(delta) < 0.5) direction = 'flat'
  else if (delta > 0) direction = 'up'
  else direction = 'down'

  return { avgScoreDelta: Math.round(delta * 10) / 10, direction }
}
