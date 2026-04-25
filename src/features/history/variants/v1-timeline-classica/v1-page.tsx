import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { VariantPageProps } from '../../shared/types'
import { V1Hero } from './v1-hero'
import { V1KPIStrip } from './v1-kpi-strip'
import { V1FilterBar } from './v1-filter-bar'
import { V1ActiveChips } from './v1-active-chips'
import { V1TimelineView } from './v1-timeline-view'
import { V1TabularView } from './v1-tabular-view'
import { V1DetailDrawer } from './v1-detail-drawer'
import { V1EmptyState } from './v1-empty-state'
import { groups } from '@/mocks/data'

type V1InnerView = 'timeline' | 'tabular'

export function V1Page({ filters, data }: VariantPageProps) {
  const [innerView, setInnerView] = useState<V1InnerView>('timeline')
  const groupFilter = filters.filters.groupId
    ? {
        name: groups.find((g) => g.id === filters.filters.groupId)?.name ?? filters.filters.groupId,
        onClear: () => filters.clearFilter('groupId'),
      }
    : undefined

  const onNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const target = direction === 'prev' ? data.neighbors.prev : data.neighbors.next
      if (target) filters.openEvaluation(target.id)
    },
    [data.neighbors, filters],
  )

  return (
    <div className="space-y-5">
      <V1Hero kpis={data.kpis} groupFilter={groupFilter} />

      <V1KPIStrip kpis={data.kpis} />

      <V1FilterBar api={filters} />

      {filters.activeChips.length > 0 && <V1ActiveChips api={filters} />}

      {/* Results header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-800 tabular-nums">{data.filtered.length}</span>{' '}
          {data.filtered.length === 1 ? 'avaliação' : 'avaliações'}
          {innerView === 'timeline' && data.groupedByMonth.length > 0 && (
            <span className="text-gray-400">
              {' '}· agrupadas por mês
            </span>
          )}
        </p>

        {/* Inner view toggle (Timeline ↔ Tabular) */}
        <div className="inline-flex p-0.5 bg-gray-100 rounded-xl gap-0.5">
          <InnerViewButton active={innerView === 'timeline'} onClick={() => setInnerView('timeline')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22" />
              <rect x="3" y="4" width="7" height="5" rx="1" />
              <rect x="14" y="10" width="7" height="5" rx="1" />
              <rect x="3" y="17" width="7" height="5" rx="1" />
            </svg>
            Timeline
          </InnerViewButton>
          <InnerViewButton active={innerView === 'tabular'} onClick={() => setInnerView('tabular')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            Tabela
          </InnerViewButton>
        </div>
      </div>

      {/* Content */}
      {data.isEmpty ? (
        <V1EmptyState reason={data.emptyReason} onClear={filters.clearAll} />
      ) : (
        <motion.div
          key={innerView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {innerView === 'timeline' ? (
            <V1TimelineView
              grouped={data.groupedByMonth}
              selectedId={filters.filters.selectedEvalId}
              onSelect={filters.openEvaluation}
            />
          ) : (
            <V1TabularView
              evaluations={data.filtered}
              selectedId={filters.filters.selectedEvalId}
              onSelect={filters.openEvaluation}
            />
          )}
        </motion.div>
      )}

      {/* Drawer */}
      <V1DetailDrawer
        evaluation={data.selectedEvaluation}
        neighbors={data.neighbors}
        activeTab={filters.filters.drawerTab}
        onClose={filters.closeEvaluation}
        onTabChange={filters.setDrawerTab}
        onNavigate={onNavigate}
      />
    </div>
  )
}

function InnerViewButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer',
        active ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700',
      )}
    >
      {children}
    </button>
  )
}
