import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { format, subDays } from 'date-fns'
import type { VariantPageProps } from '../../shared/types'
import { V7Header } from './v7-header'
import { V7FilterBar } from './v7-filter-bar'
import { V7ActiveChips } from './v7-active-chips'
import { V7GroupedTabularView } from './v7-grouped-tabular-view'
import { V7EmptyState } from './v7-empty-state'
import { V7ViewToggle, type V7View } from './v7-view-toggle'
import { V7SortButton } from './v7-sort-button'
import { V1TimelineView } from '../v1-timeline-classica/v1-timeline-view'

export function VFinalPage({ filters, data }: VariantPageProps) {
  const navigate = useNavigate()
  const { dateFrom, dateTo } = filters.filters
  const { setMany } = filters
  const initializedRef = useRef(false)
  const [view, setView] = useState<V7View>('table')

  // Default na primeira montagem: últimos 60 dias quando não há período na URL
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    if (dateFrom === null && dateTo === null) {
      const today = new Date()
      setMany({
        dateFrom: format(subDays(today, 60), 'yyyy-MM-dd'),
        dateTo: format(today, 'yyyy-MM-dd'),
      })
    }
  }, [dateFrom, dateTo, setMany])

  const handleSelect = (id: string) => {
    const ev = data.filtered.find((e) => e.id === id)
    if (!ev) return
    navigate({
      to: '/evaluation/$groupId',
      params: { groupId: ev.groupId },
      search: { type: ev.type === 'followup' ? 'followup' : 'audit' },
    })
  }

  // Limpar todos os filtros exceto o período — V7 exige que sempre haja período selecionado
  const handleClearAllKeepDate = () => {
    const today = new Date()
    const nextFrom = dateFrom ?? format(subDays(today, 60), 'yyyy-MM-dd')
    const nextTo = dateTo ?? format(today, 'yyyy-MM-dd')
    setMany({
      search: '',
      type: 'all',
      groupId: '',
      managementId: '',
      areaId: '',
      groupTypeName: '',
      applicantId: '',
      checklistRevision: null,
      scoreRange: [0, 100],
      advanced: 'all',
      preset: null,
      dateFrom: nextFrom,
      dateTo: nextTo,
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <V7Header kpis={data.kpis} />
        <V7FilterBar api={filters} />
      </div>

      {filters.activeChips.length > 0 && (
        <V7ActiveChips
          api={filters}
          lockedKeys={['dateFrom']}
          onClearAll={handleClearAllKeepDate}
        />
      )}

      {!data.isEmpty && (
        <div className="flex items-center justify-end gap-2">
          <V7SortButton
            sort={filters.filters.sort === 'date-asc' ? 'date-asc' : 'date-desc'}
            onToggle={() => {
              const next = filters.filters.sort === 'date-desc' ? 'date-asc' : 'date-desc'
              filters.setFilter('sort', next)
            }}
          />
          <V7ViewToggle value={view} onChange={setView} />
        </div>
      )}

      {data.isEmpty ? (
        <V7EmptyState reason={data.emptyReason} onClear={handleClearAllKeepDate} />
      ) : view === 'timeline' ? (
        <V1TimelineView
          grouped={data.groupedByMonth}
          selectedId=""
          onSelect={handleSelect}
        />
      ) : (
        <V7GroupedTabularView
          grouped={data.groupedByMonth}
          selectedId=""
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
