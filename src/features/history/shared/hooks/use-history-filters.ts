import { useMemo, useCallback } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type {
  HistoryFiltersApi,
  HistoryFiltersState,
  HistoryPresetId,
  HistoryDrawerTab,
  ActiveChip,
} from '../types'
import { DEFAULT_FILTERS, countActiveFilters, filtersAreDefault } from '../utils/history-filters'
import { applyPresetToState, detectActivePreset } from '../utils/history-presets'
import { groups, managements, areas, users, groupTypes } from '@/mocks/data'

/**
 * Parse o search params da URL para HistoryFiltersState.
 * Valores default são aplicados quando ausentes.
 */
function parseFromSearch(search: Record<string, unknown>): HistoryFiltersState {
  const scoreMin = Number(search.scoreMin ?? 0)
  const scoreMax = Number(search.scoreMax ?? 100)
  const validType = ['all', 'audit', 'followup'].includes(String(search.type))
  const validAdvanced = ['all', 'yes', 'no'].includes(String(search.advanced))
  const validSort = ['date-desc', 'date-asc', 'score-desc', 'score-asc'].includes(String(search.sort))
  const validTab = ['summary', 'answers', 'attendance', 'context'].includes(String(search.drawerTab))

  return {
    search: String(search.search ?? ''),
    type: validType ? (String(search.type) as HistoryFiltersState['type']) : 'all',
    groupId: String(search.groupId ?? ''),
    managementId: String(search.managementId ?? ''),
    areaId: String(search.areaId ?? ''),
    groupTypeName: String(search.groupTypeName ?? ''),
    applicantId: String(search.applicantId ?? ''),
    checklistRevision: search.checklistRevision != null && search.checklistRevision !== ''
      ? Number(search.checklistRevision)
      : null,
    dateFrom: search.dateFrom ? String(search.dateFrom) : null,
    dateTo: search.dateTo ? String(search.dateTo) : null,
    scoreRange: [
      Number.isFinite(scoreMin) ? Math.max(0, Math.min(100, scoreMin)) : 0,
      Number.isFinite(scoreMax) ? Math.max(0, Math.min(100, scoreMax)) : 100,
    ],
    advanced: validAdvanced ? (String(search.advanced) as HistoryFiltersState['advanced']) : 'all',
    sort: validSort ? (String(search.sort) as HistoryFiltersState['sort']) : 'date-desc',
    preset: (search.preset as HistoryPresetId | null) ?? null,
    selectedEvalId: String(search.selectedEvalId ?? ''),
    drawerTab: validTab ? (String(search.drawerTab) as HistoryDrawerTab) : 'summary',
  }
}

/**
 * Converte FiltersState para query params serializáveis.
 * Omite valores default para manter URLs limpas.
 */
function serializeToSearch(state: HistoryFiltersState, currentSearch: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...currentSearch }

  // Preserve o v (variante) que vem de fora
  const keep = ['v']
  for (const k of Object.keys(currentSearch)) {
    if (!keep.includes(k)) delete out[k]
  }

  if (state.search) out.search = state.search
  if (state.type !== 'all') out.type = state.type
  if (state.groupId) out.groupId = state.groupId
  if (state.managementId) out.managementId = state.managementId
  if (state.areaId) out.areaId = state.areaId
  if (state.groupTypeName) out.groupTypeName = state.groupTypeName
  if (state.applicantId) out.applicantId = state.applicantId
  if (state.checklistRevision != null) out.checklistRevision = state.checklistRevision
  if (state.dateFrom) out.dateFrom = state.dateFrom
  if (state.dateTo) out.dateTo = state.dateTo
  if (state.scoreRange[0] !== 0) out.scoreMin = state.scoreRange[0]
  if (state.scoreRange[1] !== 100) out.scoreMax = state.scoreRange[1]
  if (state.advanced !== 'all') out.advanced = state.advanced
  if (state.sort !== 'date-desc') out.sort = state.sort
  if (state.preset) out.preset = state.preset
  if (state.selectedEvalId) out.selectedEvalId = state.selectedEvalId
  if (state.drawerTab !== 'summary') out.drawerTab = state.drawerTab

  return out
}

// ---------------------------------------------------------------------------
// Hook principal
// ---------------------------------------------------------------------------

export function useHistoryFilters(): HistoryFiltersApi {
  const navigate = useNavigate()
  const search = useSearch({ from: '/authenticated/history' as never }) as Record<string, unknown>

  const filters = useMemo(() => parseFromSearch(search), [search])

  const writeSearch = useCallback(
    (next: HistoryFiltersState, replace = false) => {
      navigate({
        to: '/history',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        search: ((prev: Record<string, unknown>) => serializeToSearch(next, prev ?? {})) as any,
        replace,
      })
    },
    [navigate],
  )

  const setFilter = useCallback(
    <K extends keyof HistoryFiltersState>(key: K, value: HistoryFiltersState[K]) => {
      const next = { ...filters, [key]: value }
      // Se mudou algo controlado por preset, limpa o preset
      if (key !== 'preset' && key !== 'sort' && key !== 'selectedEvalId' && key !== 'drawerTab') {
        next.preset = detectActivePreset(next)
      }
      // Cascata: se mudou managementId, limpar areaId se não pertencer
      if (key === 'managementId' && next.areaId) {
        const area = areas.find((a) => a.id === next.areaId)
        if (!area || area.managementId !== value) {
          next.areaId = ''
        }
      }
      writeSearch(next)
    },
    [filters, writeSearch],
  )

  const setMany = useCallback(
    (patch: Partial<HistoryFiltersState>) => {
      const next = { ...filters, ...patch }
      next.preset = detectActivePreset(next)
      writeSearch(next)
    },
    [filters, writeSearch],
  )

  const clearAll = useCallback(() => {
    writeSearch({ ...DEFAULT_FILTERS, sort: filters.sort })
  }, [writeSearch, filters.sort])

  const clearFilter = useCallback(
    (key: keyof HistoryFiltersState) => {
      const next = { ...filters, [key]: DEFAULT_FILTERS[key] }
      next.preset = detectActivePreset(next)
      writeSearch(next)
    },
    [filters, writeSearch],
  )

  const applyPreset = useCallback(
    (id: HistoryPresetId) => {
      // Se o preset já está ativo, desmarca
      if (filters.preset === id) {
        writeSearch({ ...DEFAULT_FILTERS, sort: filters.sort })
        return
      }
      writeSearch(applyPresetToState(filters, id))
    },
    [filters, writeSearch],
  )

  const toggleSort = useCallback(() => {
    const order: HistoryFiltersState['sort'][] = ['date-desc', 'date-asc', 'score-desc', 'score-asc']
    const idx = order.indexOf(filters.sort)
    const next = { ...filters, sort: order[(idx + 1) % order.length] }
    writeSearch(next)
  }, [filters, writeSearch])

  const openEvaluation = useCallback(
    (id: string) => {
      writeSearch({ ...filters, selectedEvalId: id, drawerTab: 'summary' })
    },
    [filters, writeSearch],
  )

  const closeEvaluation = useCallback(() => {
    writeSearch({ ...filters, selectedEvalId: '', drawerTab: 'summary' })
  }, [filters, writeSearch])

  const setDrawerTab = useCallback(
    (tab: HistoryDrawerTab) => {
      writeSearch({ ...filters, drawerTab: tab })
    },
    [filters, writeSearch],
  )

  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = []

    if (filters.search) {
      chips.push({
        key: 'search',
        label: `Busca: "${filters.search}"`,
        onRemove: () => clearFilter('search'),
      })
    }
    if (filters.type !== 'all') {
      chips.push({
        key: 'type',
        label: `Tipo: ${filters.type === 'audit' ? 'Auditoria' : 'Follow-up'}`,
        onRemove: () => clearFilter('type'),
      })
    }
    if (filters.groupId) {
      const g = groups.find((x) => x.id === filters.groupId)
      chips.push({
        key: 'groupId',
        label: `Grupo: ${g?.name ?? filters.groupId}`,
        onRemove: () => clearFilter('groupId'),
      })
    }
    if (filters.managementId) {
      const m = managements.find((x) => x.id === filters.managementId)
      chips.push({
        key: 'managementId',
        label: `Gerência: ${m?.name ?? filters.managementId}`,
        onRemove: () => clearFilter('managementId'),
      })
    }
    if (filters.areaId) {
      const a = areas.find((x) => x.id === filters.areaId)
      chips.push({
        key: 'areaId',
        label: `Área: ${a?.name ?? filters.areaId}`,
        onRemove: () => clearFilter('areaId'),
      })
    }
    if (filters.groupTypeName) {
      chips.push({
        key: 'groupTypeName',
        label: `Tipo de grupo: ${filters.groupTypeName}`,
        onRemove: () => clearFilter('groupTypeName'),
      })
    }
    if (filters.applicantId) {
      const u = users.find((x) => x.id === filters.applicantId)
      chips.push({
        key: 'applicantId',
        label: `Aplicador: ${u?.name ?? filters.applicantId}`,
        onRemove: () => clearFilter('applicantId'),
      })
    }
    if (filters.checklistRevision != null) {
      chips.push({
        key: 'checklistRevision',
        label: `Revisão: ${filters.checklistRevision}`,
        onRemove: () => clearFilter('checklistRevision'),
      })
    }
    if (filters.dateFrom || filters.dateTo) {
      const fmt = (s: string | null) => (s ? new Date(s).toLocaleDateString('pt-BR') : '…')
      chips.push({
        key: 'dateFrom',
        label: `Período: ${fmt(filters.dateFrom)} — ${fmt(filters.dateTo)}`,
        onRemove: () => {
          const next = { ...filters, dateFrom: null, dateTo: null }
          next.preset = detectActivePreset(next)
          writeSearch(next)
        },
      })
    }
    if (filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) {
      chips.push({
        key: 'scoreRange',
        label: `Score: ${filters.scoreRange[0]}% — ${filters.scoreRange[1]}%`,
        onRemove: () => clearFilter('scoreRange'),
      })
    }
    if (filters.advanced !== 'all') {
      chips.push({
        key: 'advanced',
        label: `Avançou: ${filters.advanced === 'yes' ? 'Sim' : 'Não'}`,
        onRemove: () => clearFilter('advanced'),
      })
    }

    return chips
  }, [filters, clearFilter, writeSearch])

  // Use the reference to avoid linter warnings
  void groupTypes

  const activeFilterCount = countActiveFilters(filters)
  const isDefault = filtersAreDefault(filters)

  return {
    filters,
    setFilter,
    setMany,
    clearAll,
    clearFilter,
    applyPreset,
    toggleSort,
    activeFilterCount,
    activeChips,
    isDefault,
    openEvaluation,
    closeEvaluation,
    setDrawerTab,
  }
}
