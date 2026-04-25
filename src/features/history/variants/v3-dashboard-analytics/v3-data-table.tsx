import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, ChevronUpIcon } from '@/assets/icons'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

type Density = 'compact' | 'cozy' | 'comfortable'

interface V3DataTableProps {
  evaluations: Evaluation[]
  selectedId: string
  onSelect: (id: string) => void
  splitOpen?: boolean
}

export function V3DataTable({ evaluations, selectedId, onSelect, splitOpen }: V3DataTableProps) {
  const [density, setDensity] = useState<Density>('cozy')

  const padY = density === 'compact' ? 'py-1.5' : density === 'cozy' ? 'py-2.5' : 'py-3.5'
  const textSize = density === 'compact' ? 'text-xs' : 'text-sm'

  return (
    <motion.div
      className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Avaliações</h3>
            <p className="text-[11px] text-gray-400">
              <span className="tabular-nums">{evaluations.length}</span> resultados
            </p>
          </div>
        </div>

        {/* Density */}
        <div className="inline-flex p-0.5 bg-gray-100 rounded-lg gap-0.5">
          {(['compact', 'cozy', 'comfortable'] as Density[]).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition cursor-pointer',
                density === d ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {d === 'compact' ? '≡' : d === 'cozy' ? '≣' : '▤'}
              <span className="ml-1 hidden sm:inline">{d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="bg-gray-50 border-b border-gray-100 text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
              <th className="text-left px-4 py-2.5 font-semibold w-10">#</th>
              <th className="text-left px-3 py-2.5 font-semibold">Data</th>
              <th className="text-left px-3 py-2.5 font-semibold">Tipo</th>
              <th className="text-left px-3 py-2.5 font-semibold">Grupo</th>
              {!splitOpen && <th className="text-left px-3 py-2.5 font-semibold hidden md:table-cell">Aplicador</th>}
              <th className="text-right px-3 py-2.5 font-semibold">Nota</th>
              <th className="text-right px-3 py-2.5 font-semibold hidden lg:table-cell">Meta</th>
              {!splitOpen && <th className="text-left px-3 py-2.5 font-semibold hidden lg:table-cell">Status</th>}
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev, idx) => {
              const goal = resolveGoalPct(ev) ?? 0
              const met = ev.score >= goal
              const scoreColor = met ? '#10B981' : '#EF4444'
              const isSelected = ev.id === selectedId
              const d = new Date(ev.date)

              return (
                <tr
                  key={ev.id}
                  onClick={() => onSelect(ev.id)}
                  className={cn(
                    'border-b border-gray-50 cursor-pointer transition-all group',
                    isSelected ? 'bg-indigo-50/60' : 'hover:bg-gray-50',
                  )}
                >
                  <td className={cn('px-4 tabular-nums text-gray-400 font-mono text-xs', padY)}>{String(idx + 1).padStart(3, '0')}</td>

                  <td className={cn('px-3', padY, textSize, 'text-gray-700 tabular-nums whitespace-nowrap')}>
                    {d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </td>

                  <td className={cn('px-3', padY)}>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold',
                        ev.type === 'audit' ? 'bg-indigo-50 text-indigo-700' : 'bg-pink-50 text-pink-700',
                      )}
                    >
                      {ev.type === 'audit' ? 'AUD' : 'F-UP'}
                    </span>
                  </td>

                  <td className={cn('px-3', padY)}>
                    <p className={cn('font-semibold text-gray-800 group-hover:text-indigo-700 transition', textSize)}>{ev.groupName}</p>
                    {density !== 'compact' && (
                      <p className="text-[10px] text-gray-400 truncate max-w-[220px]">
                        {ev.managementName} · Passo {ev.sequenceAtTime}
                      </p>
                    )}
                  </td>

                  {!splitOpen && (
                    <td className={cn('px-3', padY, textSize, 'text-gray-600 hidden md:table-cell truncate max-w-[160px]')}>
                      {ev.applicantName}
                    </td>
                  )}

                  <td className={cn('px-3 text-right', padY)}>
                    <span className={cn(textSize, 'font-black tabular-nums')} style={{ color: scoreColor }}>
                      {ev.score}%
                    </span>
                  </td>

                  <td className={cn('px-3 text-right tabular-nums text-gray-500 font-semibold hidden lg:table-cell', padY, textSize)}>
                    {goal}%
                  </td>

                  {!splitOpen && (
                    <td className={cn('px-3 hidden lg:table-cell', padY)}>
                      {ev.type === 'audit' ? (
                        ev.advancedSequence ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <ChevronUpIcon size={12} />Avançou
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                            <ChevronDownIcon size={12} />Manteve
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-gray-300">—</span>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
