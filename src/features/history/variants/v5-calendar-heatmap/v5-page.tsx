import { useState, useMemo } from 'react'
import type { VariantPageProps } from '../../shared/types'
import { V5SidebarFilters } from './v5-sidebar-filters'
import { V5YearSelector } from './v5-year-selector'
import { V5HeatmapCalendar } from './v5-heatmap-calendar'
import { V5Legend } from './v5-legend'
import { V5DayDetailPanel } from './v5-day-detail-panel'
import { V5TrendLine } from './v5-trend-line'
import { V5EmptyState } from './v5-empty-state'

export function V5Page({ filters, data }: VariantPageProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  // Anos disponíveis
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    for (const ev of data.all) {
      years.add(new Date(ev.date).getFullYear())
    }
    if (years.size === 0) years.add(new Date().getFullYear())
    return Array.from(years).sort((a, b) => a - b)
  }, [data.all])

  // Auto-ajustar ano se o atual não estiver disponível
  useMemo(() => {
    if (availableYears.length > 0 && !availableYears.includes(year)) {
      setYear(availableYears[availableYears.length - 1])
    }
  }, [availableYears, year])

  // Dia selecionado em evaluations
  const dayEvaluations = selectedDay ? (data.groupedByDay[selectedDay] ?? []) : []

  // Filtrar grouped por ano (apenas do ano atual)
  const yearGroupedByDay = useMemo(() => {
    const result: Record<string, typeof data.filtered> = {}
    for (const [key, evs] of Object.entries(data.groupedByDay)) {
      if (key.startsWith(String(year))) result[key] = evs
    }
    return result
  }, [data.groupedByDay, year])

  // Stats do ano
  const yearStats = useMemo(() => {
    const evals = data.filtered.filter((e) => new Date(e.date).getFullYear() === year)
    const daysActive = Object.keys(yearGroupedByDay).length
    const avgScore = evals.length > 0 ? evals.reduce((s, e) => s + e.score, 0) / evals.length : 0
    return { total: evals.length, daysActive, avgScore }
  }, [data.filtered, year, yearGroupedByDay])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      <V5SidebarFilters api={filters} />

      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <V5YearSelector year={year} availableYears={availableYears} onChange={setYear} />
          <V5Legend total={yearStats.total} daysActive={yearStats.daysActive} avgScore={yearStats.avgScore} />
        </div>

        {yearStats.total === 0 ? (
          <V5EmptyState
            year={year}
            onClear={filters.clearAll}
            hasFilters={!filters.isDefault}
          />
        ) : (
          <>
            <V5HeatmapCalendar
              year={year}
              groupedByDay={yearGroupedByDay}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />

            <V5DayDetailPanel
              dayKey={selectedDay}
              evaluations={dayEvaluations}
              onClose={() => setSelectedDay(null)}
              onSelectEvaluation={filters.openEvaluation}
              selectedEvalId={filters.filters.selectedEvalId}
            />

            <V5TrendLine year={year} evaluations={data.filtered} />
          </>
        )}
      </div>
    </div>
  )
}
