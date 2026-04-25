import { SearchIcon, XIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'
import { HISTORY_PRESETS } from '../../shared/utils/history-presets'
import { managements, groupTypes } from '@/mocks/data'
import { cn } from '@/lib/cn'

interface V5SidebarFiltersProps {
  api: HistoryFiltersApi
}

export function V5SidebarFilters({ api }: V5SidebarFiltersProps) {
  const { filters, setFilter, applyPreset, clearAll, activeFilterCount } = api

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm h-fit lg:sticky lg:top-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Filtros</h3>
            <p className="text-[11px] text-gray-400">
              {activeFilterCount > 0 ? `${activeFilterCount} ativos` : 'Nenhum ativo'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
          Buscar
        </label>
        <div className="relative">
          <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Grupo, aplicador…"
            className="w-full pl-8 pr-7 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:outline-none transition"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <XIcon size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
          Presets
        </label>
        <div className="flex flex-col gap-1">
          {HISTORY_PRESETS.map((p) => {
            const active = filters.preset === p.id
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={cn(
                  'text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition',
                  active
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-sky-500' : 'bg-gray-300')} />
                  {p.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
          Tipo
        </label>
        <div className="inline-flex p-0.5 bg-gray-100 rounded-lg gap-0.5 w-full">
          {(['all', 'audit', 'followup'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter('type', v)}
              className={cn(
                'flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition cursor-pointer',
                filters.type === v ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {v === 'all' ? 'Todos' : v === 'audit' ? 'Aud.' : 'F-Up'}
            </button>
          ))}
        </div>
      </div>

      {/* Gerência */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
          Gerência
        </label>
        <select
          value={filters.managementId}
          onChange={(e) => setFilter('managementId', e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          <option value="">Todas</option>
          {managements.filter((m) => m.status === 'active').map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Tipo de grupo */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
          Tipo de grupo
        </label>
        <select
          value={filters.groupTypeName}
          onChange={(e) => setFilter('groupTypeName', e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          <option value="">Todos</option>
          {groupTypes.filter((t) => t.status === 'active').map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Score range */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
          Score mínimo
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={filters.scoreRange[0]}
            onChange={(e) => {
              const v = Number(e.target.value)
              setFilter('scoreRange', [Math.min(v, filters.scoreRange[1]), filters.scoreRange[1]] as [number, number])
            }}
            className="flex-1 h-1 accent-sky-600"
          />
          <span className="text-xs font-bold text-sky-700 tabular-nums min-w-[32px] text-right">
            {filters.scoreRange[0]}%
          </span>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline cursor-pointer"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
