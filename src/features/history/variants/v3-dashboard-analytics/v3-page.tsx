import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { VariantPageProps } from '../../shared/types'
import { V3ScoreChart } from './v3-score-chart'
import { V3MixDonut } from './v3-mix-donut'
import { V3KPIStack } from './v3-kpi-stack'
import { V3SparklineTable } from './v3-sparkline-table'
import { V3FilterBar } from './v3-filter-bar'
import { V3DataTable } from './v3-data-table'
import { V3SidePanel } from './v3-side-panel'
import { V3EmptyState } from './v3-empty-state'

export function V3Page({ filters, data }: VariantPageProps) {
  const splitOpen = data.selectedEvaluation !== null

  const onNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const target = direction === 'prev' ? data.neighbors.prev : data.neighbors.next
      if (target) filters.openEvaluation(target.id)
    },
    [data.neighbors, filters],
  )

  return (
    <div className="space-y-4">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-indigo-950 to-indigo-900 p-6 text-white"
      >
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-semibold">V3 · Dashboard Analytics</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-black tracking-tight">Painel de auditorias</h2>
            <p className="mt-1 text-sm text-indigo-100/80 max-w-xl">
              Bento grid com cross-filter entre gráficos e tabela. Selecione uma linha para abrir o painel lateral.
            </p>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <HeaderStat label="Total" value={data.kpis.total.toString()} />
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <HeaderStat label="Score médio" value={`${data.kpis.avgScore.toFixed(1)}%`} />
            <div className="w-px h-10 bg-white/20 hidden md:block" />
            <HeaderStat label="Avanços" value={`${Math.round(data.kpis.advanceRate)}%`} />
          </div>
        </div>
      </motion.div>

      {/* Bento grid — chart + mix + sparklines + KPIs */}
      {!data.isEmpty && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <V3ScoreChart evaluations={data.filtered} />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <V3MixDonut
              kpis={data.kpis}
              onFilterAudit={() => filters.setFilter('type', 'audit')}
              onFilterFollowup={() => filters.setFilter('type', 'followup')}
            />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <V3SparklineTable
              evaluations={data.filtered}
              selectedId={filters.filters.selectedEvalId}
              onSelect={filters.openEvaluation}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <V3KPIStack kpis={data.kpis} />
          </div>
        </div>
      )}

      {/* Filter bar */}
      <V3FilterBar api={filters} />

      {/* Main + side panel */}
      {data.isEmpty ? (
        <V3EmptyState reason={data.emptyReason} onClear={filters.clearAll} />
      ) : (
        <div className={cn('grid gap-4', splitOpen ? 'grid-cols-12' : 'grid-cols-1')}>
          <div className={cn(splitOpen ? 'col-span-12 lg:col-span-7 xl:col-span-8' : 'col-span-1')}>
            <V3DataTable
              evaluations={data.filtered}
              selectedId={filters.filters.selectedEvalId}
              onSelect={filters.openEvaluation}
              splitOpen={splitOpen}
            />
          </div>
          {splitOpen && (
            <div className="col-span-12 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4 lg:self-start">
              <V3SidePanel
                evaluation={data.selectedEvaluation}
                onClose={filters.closeEvaluation}
                onNavigate={onNavigate}
                neighbors={data.neighbors}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-semibold">{label}</p>
      <p className="text-xl font-black tabular-nums mt-0.5">{value}</p>
    </div>
  )
}
