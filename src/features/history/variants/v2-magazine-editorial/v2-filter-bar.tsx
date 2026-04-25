import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { SearchIcon, XIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'
import { HISTORY_PRESETS } from '../../shared/utils/history-presets'
import { groups, managements, users } from '@/mocks/data'

interface V2FilterBarProps {
  api: HistoryFiltersApi
}

export function V2FilterBar({ api }: V2FilterBarProps) {
  const [advOpen, setAdvOpen] = useState(false)
  const { filters, setFilter, applyPreset, clearAll, activeChips } = api

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search underlined */}
        <div className="relative flex-1 min-w-[240px] border-b border-[#C9B77D] focus-within:border-[#B8860B] transition-colors pb-2">
          <SearchIcon size={14} className="absolute left-0 top-1 text-[#8A7A4A]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Buscar…"
            className="w-full pl-6 pr-6 bg-transparent text-base text-[#0A0A0A] placeholder:text-[#9A8B5A]/70 focus:outline-none"
            style={{ fontFamily: 'Georgia, serif' }}
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-0 top-1 text-[#8A7A4A] hover:text-[#0A0A0A] cursor-pointer"
            >
              <XIcon size={12} />
            </button>
          )}
        </div>

        {/* Preset as text links with middots */}
        <div className="flex items-center gap-2 text-[13px] flex-wrap" style={{ fontFamily: 'Georgia, serif' }}>
          {HISTORY_PRESETS.map((p, i) => {
            const active = filters.preset === p.id
            return (
              <>
                {i > 0 && <span className="text-[#C9B77D]">·</span>}
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`transition cursor-pointer hover:text-[#0A0A0A] ${
                    active ? 'text-[#B8860B] font-semibold underline decoration-[#D4AF37] decoration-2 underline-offset-4' : 'text-[#5A5A5A] italic'
                  }`}
                >
                  {p.label}
                </button>
              </>
            )
          })}
        </div>

        <button
          onClick={() => setAdvOpen((x) => !x)}
          className="text-[12px] italic text-[#B8860B] underline decoration-[#D4AF37] decoration-[0.5px] underline-offset-4 hover:decoration-2 cursor-pointer"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {advOpen ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
        </button>
      </div>

      {/* Advanced */}
      <AnimatePresence>
        {advOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 pb-4 pt-2 border-t border-[#E8DEC9]">
              <SelectField
                label="Tipo"
                value={filters.type}
                onChange={(v) => setFilter('type', v as typeof filters.type)}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'audit', label: 'Auditoria' },
                  { value: 'followup', label: 'Follow-up' },
                ]}
              />
              <SelectField
                label="Grupo"
                value={filters.groupId}
                onChange={(v) => setFilter('groupId', v)}
                options={[{ value: '', label: 'Todos' }, ...groups.map((g) => ({ value: g.id, label: g.name }))]}
              />
              <SelectField
                label="Gerência"
                value={filters.managementId}
                onChange={(v) => setFilter('managementId', v)}
                options={[{ value: '', label: 'Todas' }, ...managements.filter((m) => m.status === 'active').map((m) => ({ value: m.id, label: m.name }))]}
              />
              <SelectField
                label="Aplicador"
                value={filters.applicantId}
                onChange={(v) => setFilter('applicantId', v)}
                options={[{ value: '', label: 'Todos' }, ...users.filter((u) => u.profiles.includes('evaluator')).map((u) => ({ value: u.id, label: u.name }))]}
              />
              <DateField label="Data inicial" value={filters.dateFrom ?? ''} onChange={(v) => setFilter('dateFrom', v || null)} />
              <DateField label="Data final" value={filters.dateTo ?? ''} onChange={(v) => setFilter('dateTo', v || null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <button
              key={`${String(c.key)}-${c.label}`}
              onClick={c.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#D4AF37]/40 bg-[#FAF7F2] text-[#5A4A0A] text-[11px] italic hover:bg-[#F5EED8] cursor-pointer transition"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {c.label}
              <XIcon size={10} className="text-[#B8860B]" />
            </button>
          ))}
          {activeChips.length > 1 && (
            <button
              onClick={clearAll}
              className="text-[11px] italic text-[#8A7A4A] underline underline-offset-2 cursor-pointer"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              limpar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8A7A4A] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#C9B77D] py-1.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8860B] transition cursor-pointer"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8A7A4A] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#C9B77D] py-1.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#B8860B] transition cursor-pointer"
        style={{ fontFamily: 'Georgia, serif' }}
      />
    </div>
  )
}
