import { SearchIcon, XIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'
import { HISTORY_PRESETS } from '../../shared/utils/history-presets'
import { cn } from '@/lib/cn'

interface V4FilterBarProps {
  api: HistoryFiltersApi
}

export function V4FilterBar({ api }: V4FilterBarProps) {
  const { filters, setFilter, applyPreset, clearAll, activeChips } = api
  const show30 = ['last-30d', 'last-90d', 'this-year', 'audits-only']

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Buscar…"
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition placeholder:text-gray-400"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <XIcon size={11} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {HISTORY_PRESETS.filter((p) => show30.includes(p.id)).map((p) => {
            const active = filters.preset === p.id
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={cn(
                  'px-2.5 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition',
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
              >
                {p.shortLabel}
              </button>
            )
          })}
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <button
              key={`${String(c.key)}-${c.label}`}
              onClick={c.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 cursor-pointer"
            >
              {c.label}
              <XIcon size={10} />
            </button>
          ))}
          {activeChips.length > 1 && (
            <button onClick={clearAll} className="text-[11px] text-gray-500 hover:text-gray-800 underline cursor-pointer">
              Limpar todos
            </button>
          )}
        </div>
      )}
    </div>
  )
}
