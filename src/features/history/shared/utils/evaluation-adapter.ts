import type { Evaluation } from '@/types'
import type { HistoryEntry } from '@/types'
import { groups, groupTypes } from '@/mocks/data'

/**
 * Resolve a meta aplicável para uma avaliação baseada no tipo de grupo
 * e sequência. Retorna a meta percentual (0-100).
 */
export function resolveGoalPct(evaluation: Evaluation): number | undefined {
  const group = groups.find((g) => g.id === evaluation.groupId)
  if (!group) return undefined
  const groupType = groupTypes.find((t) => t.id === group.groupTypeId)
  if (!groupType) return undefined
  const seq = groupType.sequences.find((s) => s.number === evaluation.sequenceAtTime)
  if (!seq) return groupType.defaultGoal
  return seq.useDefaultGoal ? groupType.defaultGoal : seq.customGoal ?? groupType.defaultGoal
}

/**
 * Converte uma Evaluation em HistoryEntry (formato usado pelos componentes
 * visuais herdados de HistoryCardV10). A V1 reusa este formato; outras
 * variantes podem consumir a Evaluation diretamente.
 */
export function evaluationToHistoryEntry(ev: Evaluation, goalPct?: number): HistoryEntry {
  const resolvedGoal = goalPct ?? resolveGoalPct(ev)
  return {
    id: ev.id,
    type: ev.type,
    date: ev.date,
    title: ev.groupName,
    appliedBy: ev.applicantName,
    score: ev.score,
    sequenceNumber: ev.sequenceAtTime,
    sequenceAdvanced: ev.advancedSequence,
    goalMet: resolvedGoal != null ? ev.score >= resolvedGoal : undefined,
    goalPct: resolvedGoal,
  }
}

/**
 * Agrupa evaluations por mês (YYYY-MM).
 */
export function groupEvaluationsByMonth(evaluations: Evaluation[]): {
  monthKey: string
  monthLabel: string
  items: Evaluation[]
}[] {
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  const map = new Map<string, Evaluation[]>()
  for (const ev of evaluations) {
    const d = new Date(ev.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(ev)
  }
  const sorted = Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  return sorted.map(([key, items]) => {
    const [year, month] = key.split('-')
    return {
      monthKey: key,
      monthLabel: `${months[Number(month) - 1]} ${year}`,
      items,
    }
  })
}

/**
 * Agrupa evaluations por dia (YYYY-MM-DD).
 */
export function groupEvaluationsByDay(evaluations: Evaluation[]): Record<string, Evaluation[]> {
  const map: Record<string, Evaluation[]> = {}
  for (const ev of evaluations) {
    const d = new Date(ev.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!map[key]) map[key] = []
    map[key].push(ev)
  }
  return map
}

/**
 * Classifica avaliações em 3 buckets por status.
 * - avancou: type=audit && advancedSequence=true
 * - meta: type=audit && advancedSequence=false && score>=goal (ou followup com score>=goal)
 * - abaixo: score<goal (auditoria que não avançou com score abaixo da meta, followup abaixo, etc.)
 */
export function classifyByStatus(evaluations: Evaluation[]): {
  avancou: Evaluation[]
  meta: Evaluation[]
  abaixo: Evaluation[]
} {
  const buckets = { avancou: [] as Evaluation[], meta: [] as Evaluation[], abaixo: [] as Evaluation[] }
  for (const ev of evaluations) {
    const goal = resolveGoalPct(ev) ?? 0
    if (ev.type === 'audit' && ev.advancedSequence === true) {
      buckets.avancou.push(ev)
    } else if (ev.score >= goal) {
      buckets.meta.push(ev)
    } else {
      buckets.abaixo.push(ev)
    }
  }
  return buckets
}
