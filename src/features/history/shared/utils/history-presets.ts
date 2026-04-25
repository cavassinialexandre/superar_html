import type { HistoryFiltersState, HistoryPreset, HistoryPresetId } from '../types'
import { DEFAULT_FILTERS } from './history-filters'

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

function today(): string {
  return toISODate(new Date())
}

function firstOfYear(): string {
  const d = new Date()
  return toISODate(new Date(d.getFullYear(), 0, 1))
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export const HISTORY_PRESETS: HistoryPreset[] = [
  {
    id: 'last-30d',
    label: 'Últimos 30 dias',
    shortLabel: '30 dias',
    description: 'Avaliações realizadas no último mês',
    icon: null,
    apply: () => ({
      dateFrom: daysAgo(30),
      dateTo: today(),
      preset: 'last-30d',
    }),
    matches: (s) => {
      const exp = daysAgo(30)
      return s.dateFrom === exp && s.dateTo === today()
    },
  },
  {
    id: 'last-90d',
    label: 'Últimos 90 dias',
    shortLabel: '90 dias',
    description: 'Avaliações do último trimestre',
    icon: null,
    apply: () => ({
      dateFrom: daysAgo(90),
      dateTo: today(),
      preset: 'last-90d',
    }),
    matches: (s) => {
      const exp = daysAgo(90)
      return s.dateFrom === exp && s.dateTo === today()
    },
  },
  {
    id: 'this-year',
    label: 'Este ano',
    shortLabel: 'Ano',
    description: 'Avaliações deste ano calendário',
    icon: null,
    apply: () => ({
      dateFrom: firstOfYear(),
      dateTo: today(),
      preset: 'this-year',
    }),
    matches: (s) => s.dateFrom === firstOfYear() && s.dateTo === today(),
  },
  {
    id: 'audits-only',
    label: 'Apenas auditorias',
    shortLabel: 'Auditorias',
    description: 'Filtrar apenas avaliações do tipo auditoria',
    icon: null,
    apply: () => ({
      type: 'audit',
      preset: 'audits-only',
    }),
    matches: (s) => s.type === 'audit' && s.advanced === 'all' && s.scoreRange[0] === 0 && s.scoreRange[1] === 100 && !s.dateFrom && !s.dateTo,
  },
  {
    id: 'advances-only',
    label: 'Apenas avanços',
    shortLabel: 'Avanços',
    description: 'Avaliações em que o grupo avançou de sequência',
    icon: null,
    apply: () => ({
      type: 'audit',
      advanced: 'yes',
      preset: 'advances-only',
    }),
    matches: (s) => s.type === 'audit' && s.advanced === 'yes',
  },
  {
    id: 'below-goal',
    label: 'Abaixo da meta',
    shortLabel: 'Abaixo meta',
    description: 'Avaliações com score abaixo de 60%',
    icon: null,
    apply: () => ({
      scoreRange: [0, 59] as [number, number],
      preset: 'below-goal',
    }),
    matches: (s) => s.scoreRange[0] === 0 && s.scoreRange[1] === 59,
  },
]

export function getPresetById(id: HistoryPresetId | null): HistoryPreset | undefined {
  if (!id) return undefined
  return HISTORY_PRESETS.find((p) => p.id === id)
}

export function detectActivePreset(state: HistoryFiltersState): HistoryPresetId | null {
  const match = HISTORY_PRESETS.find((p) => p.matches(state))
  return match?.id ?? null
}

export function applyPresetToState(
  state: HistoryFiltersState,
  id: HistoryPresetId,
): HistoryFiltersState {
  const preset = HISTORY_PRESETS.find((p) => p.id === id)
  if (!preset) return state
  // Reset primeiro para defaults, depois aplica o patch do preset
  return {
    ...DEFAULT_FILTERS,
    sort: state.sort,
    selectedEvalId: state.selectedEvalId,
    drawerTab: state.drawerTab,
    ...preset.apply(state),
  }
}
