import type { ReactNode } from 'react'
import type { Evaluation } from '@/types'

// ---------------------------------------------------------------------------
// Variant IDs
// ---------------------------------------------------------------------------

export type HistoryVariantId =
  | 'timeline-classica'
  | 'magazine-editorial'
  | 'dashboard-analytics'
  | 'kanban-status'
  | 'calendar-heatmap'
  | 'command-inbox'
  | 'final'

export const HISTORY_VARIANT_IDS: HistoryVariantId[] = [
  'timeline-classica',
  'magazine-editorial',
  'dashboard-analytics',
  'kanban-status',
  'calendar-heatmap',
  'command-inbox',
  'final',
]

export interface HistoryVariantMeta {
  id: HistoryVariantId
  shortLabel: string
  longLabel: string
  description: string
  identity: string
  bestFor: string
  icon: ReactNode
  accent: string // hex cor primária da variante
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export type HistoryPresetId =
  | 'last-30d'
  | 'last-90d'
  | 'this-year'
  | 'audits-only'
  | 'advances-only'
  | 'below-goal'

export interface HistoryPreset {
  id: HistoryPresetId
  label: string
  shortLabel: string
  description: string
  icon: ReactNode
  apply: (base: HistoryFiltersState) => Partial<HistoryFiltersState>
  matches: (state: HistoryFiltersState) => boolean
}

// ---------------------------------------------------------------------------
// Filters state
// ---------------------------------------------------------------------------

export type HistoryTypeFilter = 'all' | 'audit' | 'followup'
export type HistoryAdvancedFilter = 'all' | 'yes' | 'no'
export type HistorySortOrder = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc'
export type HistoryDrawerTab = 'summary' | 'answers' | 'attendance' | 'context'

export interface HistoryFiltersState {
  search: string
  type: HistoryTypeFilter
  groupId: string
  managementId: string
  areaId: string
  groupTypeName: string
  applicantId: string
  checklistRevision: number | null
  dateFrom: string | null
  dateTo: string | null
  scoreRange: [number, number]
  advanced: HistoryAdvancedFilter
  sort: HistorySortOrder
  preset: HistoryPresetId | null
  selectedEvalId: string
  drawerTab: HistoryDrawerTab
}

export interface ActiveChip {
  key: keyof HistoryFiltersState
  label: string
  icon?: ReactNode
  onRemove: () => void
}

export interface HistoryFiltersApi {
  filters: HistoryFiltersState
  setFilter: <K extends keyof HistoryFiltersState>(key: K, value: HistoryFiltersState[K]) => void
  setMany: (patch: Partial<HistoryFiltersState>) => void
  clearAll: () => void
  clearFilter: (key: keyof HistoryFiltersState) => void
  applyPreset: (id: HistoryPresetId) => void
  toggleSort: () => void
  activeFilterCount: number
  activeChips: ActiveChip[]
  isDefault: boolean
  openEvaluation: (id: string) => void
  closeEvaluation: () => void
  setDrawerTab: (tab: HistoryDrawerTab) => void
}

// ---------------------------------------------------------------------------
// Data result
// ---------------------------------------------------------------------------

export interface HistoryKPIs {
  total: number
  auditCount: number
  followupCount: number
  avgScore: number
  advanceRate: number
  belowGoalCount: number
  trend: {
    avgScoreDelta: number
    direction: 'up' | 'down' | 'flat'
  }
}

export interface GroupedByMonth {
  monthKey: string        // "2026-10"
  monthLabel: string      // "OUT 2026"
  items: Evaluation[]
}

export interface StatusBuckets {
  avancou: Evaluation[]
  meta: Evaluation[]
  abaixo: Evaluation[]
}

export interface HistoryDataResult {
  all: Evaluation[]
  filtered: Evaluation[]
  groupedByMonth: GroupedByMonth[]
  groupedByStatus: StatusBuckets
  groupedByDay: Record<string, Evaluation[]>
  kpis: HistoryKPIs
  selectedEvaluation: Evaluation | null
  neighbors: { prev?: Evaluation; next?: Evaluation }
  isEmpty: boolean
  emptyReason: 'no-data' | 'filters-too-tight' | 'date-out-of-range' | null
}

// ---------------------------------------------------------------------------
// Variant page props (único ponto de acoplamento)
// ---------------------------------------------------------------------------

export interface VariantPageProps {
  filters: HistoryFiltersApi
  data: HistoryDataResult
}
