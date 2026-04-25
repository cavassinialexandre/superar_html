import { useMemo } from 'react'
import { evaluations as evaluationsMock, areas, managements } from '@/mocks/data'
import { useUnitStore } from '@/stores/unit-store'
import { filterEvaluations, sortEvaluations, DEFAULT_FILTERS } from '../utils/history-filters'
import { groupEvaluationsByMonth, groupEvaluationsByDay, classifyByStatus } from '../utils/evaluation-adapter'
import { computeKPIs } from '../utils/history-kpis'
import type { Evaluation } from '@/types'
import type { HistoryDataResult, HistoryFiltersState } from '../types'

export function useHistoryData(filters: HistoryFiltersState): HistoryDataResult {
  const { selectedUnit } = useUnitStore()

  // Dataset da unit atual
  const all = useMemo<Evaluation[]>(() => {
    return evaluationsMock.filter((e) => !selectedUnit || e.unitId === selectedUnit)
  }, [selectedUnit])

  // Lookups para filtro
  const lookups = useMemo(() => {
    const managementNameById: Record<string, string> = {}
    managements.forEach((m) => (managementNameById[m.id] = m.name))
    const areaNameById: Record<string, string> = {}
    areas.forEach((a) => (areaNameById[a.id] = a.name))
    const groupTypeNameById: Record<string, string> = {}
    return { managementNameById, areaNameById, groupTypeNameById }
  }, [])

  // Filtered + sorted
  const filtered = useMemo<Evaluation[]>(() => {
    const filteredRaw = filterEvaluations(all, filters, lookups)
    return sortEvaluations(filteredRaw, filters.sort)
  }, [all, filters, lookups])

  // Agrupamentos
  const groupedByMonth = useMemo(() => groupEvaluationsByMonth(filtered), [filtered])
  const groupedByDay = useMemo(() => groupEvaluationsByDay(filtered), [filtered])
  const groupedByStatus = useMemo(() => classifyByStatus(filtered), [filtered])

  // KPIs
  const kpis = useMemo(
    () => computeKPIs(filtered, all, filters.dateFrom, filters.dateTo),
    [filtered, all, filters.dateFrom, filters.dateTo],
  )

  // Seleção + vizinhos
  const selectedEvaluation = useMemo<Evaluation | null>(() => {
    if (!filters.selectedEvalId) return null
    return all.find((e) => e.id === filters.selectedEvalId) ?? null
  }, [filters.selectedEvalId, all])

  const neighbors = useMemo(() => {
    if (!selectedEvaluation) return {}
    const idx = filtered.findIndex((e) => e.id === selectedEvaluation.id)
    if (idx === -1) return {}
    return {
      prev: idx > 0 ? filtered[idx - 1] : undefined,
      next: idx < filtered.length - 1 ? filtered[idx + 1] : undefined,
    }
  }, [filtered, selectedEvaluation])

  // Empty reason
  const isEmpty = filtered.length === 0
  const emptyReason: HistoryDataResult['emptyReason'] = (() => {
    if (!isEmpty) return null
    if (all.length === 0) return 'no-data'
    // Comparar com DEFAULT_FILTERS seria melhor, mas simplificamos aqui
    const hasActiveFilters =
      filters.search ||
      filters.type !== 'all' ||
      filters.groupId ||
      filters.managementId ||
      filters.areaId ||
      filters.groupTypeName ||
      filters.applicantId ||
      filters.checklistRevision != null ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.scoreRange[0] !== DEFAULT_FILTERS.scoreRange[0] ||
      filters.scoreRange[1] !== DEFAULT_FILTERS.scoreRange[1] ||
      filters.advanced !== 'all'

    if (hasActiveFilters) {
      if (filters.dateFrom || filters.dateTo) return 'date-out-of-range'
      return 'filters-too-tight'
    }
    return 'no-data'
  })()

  return {
    all,
    filtered,
    groupedByMonth,
    groupedByStatus,
    groupedByDay,
    kpis,
    selectedEvaluation,
    neighbors,
    isEmpty,
    emptyReason,
  }
}
