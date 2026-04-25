import type { Evaluation } from '@/types'
import type { HistoryFiltersState, HistorySortOrder } from '../types'

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

export const DEFAULT_FILTERS: HistoryFiltersState = {
  search: '',
  type: 'all',
  groupId: '',
  managementId: '',
  areaId: '',
  groupTypeName: '',
  applicantId: '',
  checklistRevision: null,
  dateFrom: null,
  dateTo: null,
  scoreRange: [0, 100],
  advanced: 'all',
  sort: 'date-desc',
  preset: null,
  selectedEvalId: '',
  drawerTab: 'summary',
}

// Chaves de filtros propriamente ditos (excluindo sort, drawer state, preset)
export const FILTER_KEYS: (keyof HistoryFiltersState)[] = [
  'search',
  'type',
  'groupId',
  'managementId',
  'areaId',
  'groupTypeName',
  'applicantId',
  'checklistRevision',
  'dateFrom',
  'dateTo',
  'scoreRange',
  'advanced',
]

// ---------------------------------------------------------------------------
// Predicate helpers (puros)
// ---------------------------------------------------------------------------

function matchesSearch(ev: Evaluation, q: string): boolean {
  if (!q) return true
  const needle = q.toLowerCase()
  return (
    ev.groupName.toLowerCase().includes(needle) ||
    ev.applicantName.toLowerCase().includes(needle) ||
    ev.presentMembers.some((m) => m.toLowerCase().includes(needle)) ||
    ev.managementName.toLowerCase().includes(needle) ||
    ev.areaName.toLowerCase().includes(needle)
  )
}

function matchesDateRange(ev: Evaluation, from: string | null, to: string | null): boolean {
  const d = new Date(ev.date)
  if (from) {
    const f = new Date(from)
    if (d < f) return false
  }
  if (to) {
    const t = new Date(to)
    t.setHours(23, 59, 59, 999)
    if (d > t) return false
  }
  return true
}

function matchesScoreRange(ev: Evaluation, range: [number, number]): boolean {
  const [min, max] = range
  return ev.score >= min && ev.score <= max
}

function matchesAdvanced(ev: Evaluation, filter: 'all' | 'yes' | 'no'): boolean {
  if (filter === 'all') return true
  if (ev.type !== 'audit') return false
  const advanced = ev.advancedSequence === true
  return filter === 'yes' ? advanced : !advanced
}

// ---------------------------------------------------------------------------
// Main filter function
// ---------------------------------------------------------------------------

export function applyFilters(
  evaluations: Evaluation[],
  filters: HistoryFiltersState,
  contextLookups?: {
    groupIdToType?: Record<string, string>
    applicantIdToName?: Record<string, string>
  },
): Evaluation[] {
  return evaluations.filter((ev) => {
    if (!matchesSearch(ev, filters.search)) return false
    if (filters.type !== 'all' && ev.type !== filters.type) return false
    if (filters.groupId && ev.groupId !== filters.groupId) return false
    if (filters.managementId && ev.managementName !== contextLookups?.groupIdToType?.[filters.managementId]) {
      // this is a placeholder; real mgmt matching happens in use-history-data
      // we do string match below
    }
    if (filters.applicantId && ev.applicantId !== filters.applicantId) return false
    if (filters.checklistRevision != null && ev.checklistRevision !== filters.checklistRevision) return false
    if (!matchesDateRange(ev, filters.dateFrom, filters.dateTo)) return false
    if (!matchesScoreRange(ev, filters.scoreRange)) return false
    if (!matchesAdvanced(ev, filters.advanced)) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// Full filter implementation with management/area/groupType cross-lookup
// ---------------------------------------------------------------------------

export function filterEvaluations(
  evaluations: Evaluation[],
  filters: HistoryFiltersState,
  lookups: {
    managementNameById: Record<string, string>
    areaNameById: Record<string, string>
    groupTypeNameById: Record<string, string>
  },
): Evaluation[] {
  return evaluations.filter((ev) => {
    if (!matchesSearch(ev, filters.search)) return false
    if (filters.type !== 'all' && ev.type !== filters.type) return false
    if (filters.groupId && ev.groupId !== filters.groupId) return false
    if (filters.managementId) {
      const mgmtName = lookups.managementNameById[filters.managementId]
      if (!mgmtName || ev.managementName !== mgmtName) return false
    }
    if (filters.areaId) {
      const areaName = lookups.areaNameById[filters.areaId]
      if (!areaName || ev.areaName !== areaName) return false
    }
    if (filters.groupTypeName && ev.groupTypeName !== filters.groupTypeName) return false
    if (filters.applicantId && ev.applicantId !== filters.applicantId) return false
    if (filters.checklistRevision != null && ev.checklistRevision !== filters.checklistRevision) return false
    if (!matchesDateRange(ev, filters.dateFrom, filters.dateTo)) return false
    if (!matchesScoreRange(ev, filters.scoreRange)) return false
    if (!matchesAdvanced(ev, filters.advanced)) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export function sortEvaluations(evaluations: Evaluation[], sort: HistorySortOrder): Evaluation[] {
  const copy = [...evaluations]
  switch (sort) {
    case 'date-desc':
      return copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'date-asc':
      return copy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    case 'score-desc':
      return copy.sort((a, b) => b.score - a.score)
    case 'score-asc':
      return copy.sort((a, b) => a.score - b.score)
  }
}

// ---------------------------------------------------------------------------
// Cascade: alterar managementId pode limpar areaId se inválido
// ---------------------------------------------------------------------------

export function applyFilterCascade(
  patch: Partial<HistoryFiltersState>,
  current: HistoryFiltersState,
  lookups: { areaIdToManagementId: Record<string, string> },
): Partial<HistoryFiltersState> {
  const next = { ...current, ...patch }
  // Se mudou managementId e a areaId atual não pertence à nova gerência, limpar
  if (
    'managementId' in patch &&
    next.areaId &&
    lookups.areaIdToManagementId[next.areaId] !== next.managementId
  ) {
    return { ...patch, areaId: '' }
  }
  return patch
}

// ---------------------------------------------------------------------------
// Is default — determina se filtros estão em estado virgem
// ---------------------------------------------------------------------------

export function filtersAreDefault(state: HistoryFiltersState): boolean {
  return FILTER_KEYS.every((k) => {
    const val = state[k]
    const defVal = DEFAULT_FILTERS[k]
    if (Array.isArray(val) && Array.isArray(defVal)) {
      return val[0] === defVal[0] && val[1] === defVal[1]
    }
    return val === defVal
  })
}

// ---------------------------------------------------------------------------
// Active filter count
// ---------------------------------------------------------------------------

export function countActiveFilters(state: HistoryFiltersState): number {
  let count = 0
  if (state.search) count++
  if (state.type !== 'all') count++
  if (state.groupId) count++
  if (state.managementId) count++
  if (state.areaId) count++
  if (state.groupTypeName) count++
  if (state.applicantId) count++
  if (state.checklistRevision != null) count++
  if (state.dateFrom || state.dateTo) count++
  if (state.scoreRange[0] !== 0 || state.scoreRange[1] !== 100) count++
  if (state.advanced !== 'all') count++
  return count
}
