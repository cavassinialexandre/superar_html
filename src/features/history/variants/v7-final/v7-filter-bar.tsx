import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { FilterIcon, ChevronDownIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'
import { groups, managements, areas, groupTypes } from '@/mocks/data'
import { PERIODS, buildPeriod, matchPeriod, type PeriodId } from './v7-periods'

interface V7FilterBarProps {
  api: HistoryFiltersApi
}

export function V7FilterBar({ api }: V7FilterBarProps) {
  const [expanded, setExpanded] = useState(false)
  const { filters, setFilter, activeFilterCount } = api
  const firstFieldRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (!expanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [expanded])

  useEffect(() => {
    if (expanded) {
      const id = requestAnimationFrame(() => firstFieldRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [expanded])

  return (
    <div className="bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls="v7-filter-panel"
        className="w-full flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-primary-50/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-inset"
      >
        <FilterIcon size={14} className="text-primary-700 shrink-0" />
        <span className="text-sm font-semibold text-gray-800">Filtros</span>
        {activeFilterCount > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 text-white text-[10px] font-bold tabular-nums"
            aria-hidden="true"
          >
            {activeFilterCount}
          </span>
        )}
        <div className="flex-1" />
        <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
          {expanded ? 'Fechar' : 'Expandir'}
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center"
        >
          <ChevronDownIcon size={14} className="text-gray-500" />
        </motion.span>
        <span className="sr-only" aria-live="polite">
          {activeFilterCount === 0
            ? 'Nenhum filtro ativo'
            : `${activeFilterCount} ${activeFilterCount === 1 ? 'filtro ativo' : 'filtros ativos'}`}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="v7-filter-panel"
            role="region"
            aria-label="Filtros avançados"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gray-200/80"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-gradient-to-b from-gray-50/40 to-white">
              <FilterField label="Gerência" active={filters.managementId !== ''}>
                <select
                  ref={firstFieldRef}
                  value={filters.managementId}
                  onChange={(e) => setFilter('managementId', e.target.value)}
                  className={selectClass(filters.managementId !== '')}
                >
                  <option value="">Todas as gerências</option>
                  {managements
                    .filter((m) => m.status === 'active')
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </select>
              </FilterField>

              <FilterField label="Área" active={filters.areaId !== ''}>
                <select
                  value={filters.areaId}
                  onChange={(e) => setFilter('areaId', e.target.value)}
                  className={selectClass(filters.areaId !== '')}
                >
                  <option value="">Todas as áreas</option>
                  {areas
                    .filter(
                      (a) =>
                        a.status === 'active' &&
                        (!filters.managementId || a.managementId === filters.managementId),
                    )
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </FilterField>

              <FilterField label="Tipo de grupo" active={filters.groupTypeName !== ''}>
                <select
                  value={filters.groupTypeName}
                  onChange={(e) => setFilter('groupTypeName', e.target.value)}
                  className={selectClass(filters.groupTypeName !== '')}
                >
                  <option value="">Todos</option>
                  {groupTypes
                    .filter((t) => t.status === 'active')
                    .map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </FilterField>

              <FilterField label="Grupo" active={filters.groupId !== ''}>
                <select
                  value={filters.groupId}
                  onChange={(e) => setFilter('groupId', e.target.value)}
                  className={selectClass(filters.groupId !== '')}
                >
                  <option value="">Todos os grupos</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </FilterField>

              <FilterField
                label="Período"
                active={matchPeriod(filters.dateFrom, filters.dateTo) !== 'last-60'}
              >
                <select
                  value={matchPeriod(filters.dateFrom, filters.dateTo)}
                  onChange={(e) => {
                    const id = e.target.value as PeriodId
                    const built = buildPeriod(id)
                    api.setMany({ dateFrom: built.dateFrom, dateTo: built.dateTo })
                  }}
                  className={selectClass(
                    matchPeriod(filters.dateFrom, filters.dateTo) !== 'last-60',
                  )}
                >
                  {PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </FilterField>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterField({
  label,
  active,
  children,
}: {
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className={cn(
          'flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold mb-1.5 transition-colors',
          active ? 'text-primary-700' : 'text-gray-500',
        )}
      >
        {active && (
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500"
            aria-hidden="true"
          />
        )}
        {label}
      </label>
      {children}
    </div>
  )
}

const selectClass = (active: boolean) =>
  cn(
    'w-full rounded-lg px-3 py-2 text-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
    active
      ? 'bg-primary-50/60 border border-primary-300 text-primary-800 hover:border-primary-400'
      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300',
  )
