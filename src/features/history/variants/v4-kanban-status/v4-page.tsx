import { useCallback, useEffect } from 'react'
import type { VariantPageProps } from '../../shared/types'
import { V4CompactHero } from './v4-compact-hero'
import { V4FilterBar } from './v4-filter-bar'
import { V4KanbanBoard } from './v4-kanban-board'
import { V4DetailModal } from './v4-detail-modal'
import { V4EmptyState } from './v4-empty-state'

export function V4Page({ filters, data }: VariantPageProps) {
  const onNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const target = direction === 'prev' ? data.neighbors.prev : data.neighbors.next
      if (target) filters.openEvaluation(target.id)
    },
    [data.neighbors, filters],
  )

  useEffect(() => {
    if (!data.selectedEvaluation) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        filters.closeEvaluation()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onNavigate('prev')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNavigate('next')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [data.selectedEvaluation, filters, onNavigate])

  return (
    <div className="space-y-4">
      <V4CompactHero buckets={data.groupedByStatus} />
      <V4FilterBar api={filters} />

      {data.isEmpty ? (
        <V4EmptyState reason={data.emptyReason} onClear={filters.clearAll} />
      ) : (
        <V4KanbanBoard
          buckets={data.groupedByStatus}
          selectedId={filters.filters.selectedEvalId}
          onSelect={filters.openEvaluation}
        />
      )}

      <V4DetailModal
        evaluation={data.selectedEvaluation}
        onClose={filters.closeEvaluation}
        onNavigate={onNavigate}
        neighbors={data.neighbors}
      />
    </div>
  )
}
