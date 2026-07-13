import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { FilterIcon, ChevronDownIcon, SearchIcon } from '@/assets/icons'
import { managements, areas, groupTypes } from '@/mocks/data'

export interface GroupsFilterValues {
  search: string
  filterType: string
  filterMgmt: string
  filterArea: string
}

interface GroupsFilterBarProps {
  values: GroupsFilterValues
  onChange: <K extends keyof GroupsFilterValues>(key: K, value: GroupsFilterValues[K]) => void
  /** Quando definido, o filtro de tipo vem da URL e fica bloqueado (chip locked). */
  lockedType?: string
}

export function GroupsFilterBar({ values, onChange, lockedType }: GroupsFilterBarProps) {
  const [expanded, setExpanded] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const activeCount =
    (values.search ? 1 : 0) +
    (values.filterType ? 1 : 0) +
    (values.filterMgmt ? 1 : 0) +
    (values.filterArea ? 1 : 0)

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

  const filteredAreas = values.filterMgmt
    ? areas.filter(a => a.managementId === values.filterMgmt && a.status === 'active')
    : areas.filter(a => a.status === 'active')

  return (
    <div className="bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls="groups-filter-panel"
        className="w-full flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-primary-50/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 focus-visible:ring-inset"
      >
        <FilterIcon size={14} className="text-primary-700 shrink-0" />
        <span className="text-sm font-semibold text-gray-800">Filtros</span>
        {activeCount > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary-600 text-white text-[10px] font-bold tabular-nums"
            aria-hidden="true"
          >
            {activeCount}
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
          {activeCount === 0
            ? 'Nenhum filtro ativo'
            : `${activeCount} ${activeCount === 1 ? 'filtro ativo' : 'filtros ativos'}`}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="groups-filter-panel"
            role="region"
            aria-label="Filtros avançados"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gray-200/80"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-b from-gray-50/40 to-white">
              <FilterField label="Buscar" active={values.search !== ''}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <SearchIcon size={14} />
                  </span>
                  <input
                    ref={firstFieldRef}
                    type="text"
                    value={values.search}
                    onChange={(e) => onChange('search', e.target.value)}
                    placeholder="Nome do grupo..."
                    className={cn(
                      inputClass(values.search !== ''),
                      'pl-9',
                    )}
                  />
                </div>
              </FilterField>

              <FilterField
                label="Tipo de grupo"
                active={values.filterType !== '' || !!lockedType}
                locked={!!lockedType}
              >
                <select
                  value={lockedType || values.filterType}
                  onChange={(e) => onChange('filterType', e.target.value)}
                  disabled={!!lockedType}
                  className={cn(
                    selectClass(values.filterType !== '' || !!lockedType),
                    lockedType && 'opacity-90 cursor-not-allowed',
                  )}
                >
                  <option value="">Todos os tipos</option>
                  {groupTypes
                    .filter((t) => t.status === 'active')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </FilterField>

              <FilterField label="Gerência" active={values.filterMgmt !== ''}>
                <select
                  value={values.filterMgmt}
                  onChange={(e) => {
                    onChange('filterMgmt', e.target.value)
                    if (values.filterArea) onChange('filterArea', '')
                  }}
                  className={selectClass(values.filterMgmt !== '')}
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

              <FilterField label="Área" active={values.filterArea !== ''}>
                <select
                  value={values.filterArea}
                  onChange={(e) => onChange('filterArea', e.target.value)}
                  disabled={!values.filterMgmt}
                  className={cn(
                    selectClass(values.filterArea !== ''),
                    !values.filterMgmt && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <option value="">
                    {values.filterMgmt ? 'Todas as áreas' : 'Selecione gerência primeiro'}
                  </option>
                  {filteredAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
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
  locked,
  children,
}: {
  label: string
  active?: boolean
  locked?: boolean
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
        {locked && (
          <span className="ml-1 text-[9px] uppercase tracking-wide font-bold text-primary-500/70">
            (URL)
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

const baseFieldClass =
  'w-full rounded-lg px-3 py-2 text-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'

const selectClass = (active: boolean) =>
  cn(
    baseFieldClass,
    active
      ? 'bg-primary-50/60 border border-primary-300 text-primary-800 hover:border-primary-400'
      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300',
  )

const inputClass = (active: boolean) =>
  cn(
    baseFieldClass,
    'cursor-text',
    active
      ? 'bg-primary-50/60 border border-primary-300 text-primary-800 hover:border-primary-400'
      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300',
  )
