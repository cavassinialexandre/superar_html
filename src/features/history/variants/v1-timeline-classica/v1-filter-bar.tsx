import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SearchIcon, FilterIcon, ChevronDownIcon, XIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'
import { HISTORY_PRESETS } from '../../shared/utils/history-presets'
import { groups, managements, areas, users, groupTypes } from '@/mocks/data'

const PRESET_ICONS: Record<string, React.ReactNode> = {
  'last-30d': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  'last-90d': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  'this-year': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M2 12h20" />
    </svg>
  ),
  'audits-only': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  'advances-only': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  ),
  'below-goal': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    </svg>
  ),
}

interface V1FilterBarProps {
  api: HistoryFiltersApi
}

export function V1FilterBar({ api }: V1FilterBarProps) {
  const [expanded, setExpanded] = useState(false)
  const { filters, setFilter, applyPreset, activeFilterCount } = api

  const sortLabels: Record<typeof filters.sort, string> = {
    'date-desc': 'Data ↓',
    'date-asc': 'Data ↑',
    'score-desc': 'Score ↓',
    'score-asc': 'Score ↑',
  }

  return (
    <motion.div
      className="sticky top-4 z-20 bg-white/85 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="p-3 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Buscar grupo, aplicador ou membro…"
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none transition placeholder:text-gray-400"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <XIcon size={12} />
            </button>
          )}
        </div>

        {/* Preset chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {HISTORY_PRESETS.map((p) => {
            const active = filters.preset === p.id
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all',
                  active
                    ? 'bg-primary-50 text-primary-700 border border-primary-200 ring-2 ring-primary-400/20 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300',
                )}
                title={p.description}
              >
                {PRESET_ICONS[p.id]}
                <span>{p.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* Expand advanced */}
        <button
          onClick={() => setExpanded((x) => !x)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all',
            expanded || activeFilterCount > 0
              ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
          )}
        >
          <FilterIcon size={13} />
          <span>Mais filtros</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white text-primary-700 text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDownIcon size={12} />
          </motion.span>
        </button>

        {/* Sort */}
        <button
          onClick={() => api.toggleSort()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all"
          title="Alternar ordenação"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M7 12h10M10 18h4" />
          </svg>
          <span>{sortLabels[filters.sort]}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-gradient-to-b from-gray-50/50 to-white">
              <FilterField label="Tipo">
                <select
                  value={filters.type}
                  onChange={(e) => setFilter('type', e.target.value as typeof filters.type)}
                  className={selectClass}
                >
                  <option value="all">Todos</option>
                  <option value="audit">Auditoria</option>
                  <option value="followup">Follow-up</option>
                </select>
              </FilterField>

              <FilterField label="Grupo">
                <select
                  value={filters.groupId}
                  onChange={(e) => setFilter('groupId', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Todos os grupos</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </FilterField>

              <FilterField label="Gerência">
                <select
                  value={filters.managementId}
                  onChange={(e) => setFilter('managementId', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Todas as gerências</option>
                  {managements.filter((m) => m.status === 'active').map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </FilterField>

              <FilterField label="Área">
                <select
                  value={filters.areaId}
                  onChange={(e) => setFilter('areaId', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Todas as áreas</option>
                  {areas
                    .filter((a) => a.status === 'active' && (!filters.managementId || a.managementId === filters.managementId))
                    .map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
              </FilterField>

              <FilterField label="Tipo de grupo">
                <select
                  value={filters.groupTypeName}
                  onChange={(e) => setFilter('groupTypeName', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  {groupTypes.filter((t) => t.status === 'active').map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </FilterField>

              <FilterField label="Aplicador">
                <select
                  value={filters.applicantId}
                  onChange={(e) => setFilter('applicantId', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Todos</option>
                  {users.filter((u) => u.profiles.includes('evaluator') && u.status === 'active').map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </FilterField>

              <FilterField label="Data inicial">
                <input
                  type="date"
                  value={filters.dateFrom ?? ''}
                  onChange={(e) => setFilter('dateFrom', e.target.value || null)}
                  className={selectClass}
                />
              </FilterField>

              <FilterField label="Data final">
                <input
                  type="date"
                  value={filters.dateTo ?? ''}
                  onChange={(e) => setFilter('dateTo', e.target.value || null)}
                  className={selectClass}
                />
              </FilterField>

              <FilterField label={`Score: ${filters.scoreRange[0]}% — ${filters.scoreRange[1]}%`}>
                <div className="flex items-center gap-2 py-1.5">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={filters.scoreRange[0]}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setFilter('scoreRange', [Math.min(v, filters.scoreRange[1]), filters.scoreRange[1]] as [number, number])
                    }}
                    className="flex-1 h-1 accent-primary-600"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={filters.scoreRange[1]}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setFilter('scoreRange', [filters.scoreRange[0], Math.max(v, filters.scoreRange[0])] as [number, number])
                    }}
                    className="flex-1 h-1 accent-primary-600"
                  />
                </div>
              </FilterField>

              <FilterField label="Avançou">
                <div className="inline-flex p-0.5 bg-gray-100 rounded-lg gap-0.5">
                  {(['all', 'yes', 'no'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setFilter('advanced', v)}
                      className={cn(
                        'px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all',
                        filters.advanced === v ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                      )}
                    >
                      {v === 'all' ? 'Todos' : v === 'yes' ? 'Sim' : 'Não'}
                    </button>
                  ))}
                </div>
              </FilterField>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const selectClass =
  'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition cursor-pointer'
