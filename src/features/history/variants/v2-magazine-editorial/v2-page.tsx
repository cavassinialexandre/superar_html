import { useCallback } from 'react'
import type { VariantPageProps } from '../../shared/types'
import { V2HeroMagazine } from './v2-hero-magazine'
import { V2StatsLedger } from './v2-stats-ledger'
import { V2FilterBar } from './v2-filter-bar'
import { V2ArticleList } from './v2-article-list'
import { V2ReadingDrawer } from './v2-reading-drawer'
import { V2EmptyState } from './v2-empty-state'

export function V2Page({ filters, data }: VariantPageProps) {
  const onNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const target = direction === 'prev' ? data.neighbors.prev : data.neighbors.next
      if (target) filters.openEvaluation(target.id)
    },
    [data.neighbors, filters],
  )

  return (
    <div className="relative rounded-3xl border border-[#E8DEC9] bg-[#FAF7F2] overflow-hidden">
      <div className="p-6 md:p-10 space-y-10">
        <V2HeroMagazine />
        <V2StatsLedger kpis={data.kpis} />
        <V2FilterBar api={filters} />

        {/* Results summary */}
        <div className="flex items-baseline justify-between pb-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
            Nesta edição
          </p>
          <p className="text-sm italic text-[#8A7A4A]" style={{ fontFamily: 'Georgia, serif' }}>
            {data.filtered.length} matéria{data.filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {data.isEmpty ? (
          <V2EmptyState reason={data.emptyReason} onClear={filters.clearAll} />
        ) : (
          <V2ArticleList
            evaluations={data.filtered}
            selectedId={filters.filters.selectedEvalId}
            onSelect={filters.openEvaluation}
          />
        )}
      </div>

      <V2ReadingDrawer
        evaluation={data.selectedEvaluation}
        neighbors={data.neighbors}
        onClose={filters.closeEvaluation}
        onNavigate={onNavigate}
      />
    </div>
  )
}
