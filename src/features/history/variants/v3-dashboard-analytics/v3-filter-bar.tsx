import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SearchIcon, XIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'
import { groups, managements, users, groupTypes } from '@/mocks/data'

interface V3FilterBarProps {
  api: HistoryFiltersApi
}

export function V3FilterBar({ api }: V3FilterBarProps) {
  const { filters, setFilter } = api

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Buscar grupo, aplicador ou membro…"
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none transition placeholder:text-gray-400"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <XIcon size={11} />
            </button>
          )}
        </div>

        {/* Segmented: tipo */}
        <Segmented
          value={filters.type}
          onChange={(v) => setFilter('type', v as typeof filters.type)}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'audit', label: 'Auditoria' },
            { value: 'followup', label: 'Follow-up' },
          ]}
        />

        <Select
          value={filters.groupId}
          onChange={(v) => setFilter('groupId', v)}
          placeholder="Todos os grupos"
          options={groups.map((g) => ({ value: g.id, label: g.name }))}
        />

        <Select
          value={filters.managementId}
          onChange={(v) => setFilter('managementId', v)}
          placeholder="Todas as gerências"
          options={managements.filter((m) => m.status === 'active').map((m) => ({ value: m.id, label: m.name }))}
        />

        <Select
          value={filters.applicantId}
          onChange={(v) => setFilter('applicantId', v)}
          placeholder="Todos os aplicadores"
          options={users.filter((u) => u.profiles.includes('evaluator') && u.status === 'active').map((u) => ({ value: u.id, label: u.name }))}
        />

        <Select
          value={filters.groupTypeName}
          onChange={(v) => setFilter('groupTypeName', v)}
          placeholder="Todos os tipos"
          options={groupTypes.filter((t) => t.status === 'active').map((t) => ({ value: t.name, label: t.name }))}
        />
      </div>

      {/* Date range + score */}
      <div className="mt-3 flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
        <DateField label="De" value={filters.dateFrom ?? ''} onChange={(v) => setFilter('dateFrom', v || null)} />
        <DateField label="Até" value={filters.dateTo ?? ''} onChange={(v) => setFilter('dateTo', v || null)} />
        <ScoreRange
          value={filters.scoreRange}
          onChange={(v) => setFilter('scoreRange', v)}
        />
      </div>
    </motion.div>
  )
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="inline-flex p-0.5 bg-gray-100 rounded-lg gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition',
            value === o.value ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 hover:border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer max-w-[180px]"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-gray-500">
      <span className="font-semibold">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 hover:border-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
      />
    </label>
  )
}

function ScoreRange({
  value,
  onChange,
}: {
  value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
      <span className="text-[11px] font-semibold text-gray-500">Score</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value[0]}
        onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
        className="w-16 h-1 accent-indigo-600"
      />
      <input
        type="range"
        min={0}
        max={100}
        value={value[1]}
        onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
        className="w-16 h-1 accent-indigo-600"
      />
      <span className="text-xs font-bold text-indigo-700 tabular-nums">
        {value[0]}–{value[1]}%
      </span>
    </div>
  )
}
