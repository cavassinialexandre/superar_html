import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from '@/assets/icons'
import type { HistoryFiltersApi } from '../../shared/types'

interface V1ActiveChipsProps {
  api: HistoryFiltersApi
}

export function V1ActiveChips({ api }: V1ActiveChipsProps) {
  const { activeChips, clearAll, activeFilterCount } = api

  if (activeChips.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Filtros:</span>
      <AnimatePresence initial={false}>
        {activeChips.map((chip) => (
          <motion.button
            key={`${String(chip.key)}-${chip.label}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-primary-100 hover:border-primary-300 cursor-pointer transition"
            aria-label={`Remover filtro ${chip.label}`}
          >
            <span className="truncate max-w-[240px]">{chip.label}</span>
            <XIcon size={11} className="text-primary-500" />
          </motion.button>
        ))}
      </AnimatePresence>
      {activeFilterCount > 1 && (
        <button
          onClick={clearAll}
          className="text-[11px] font-medium text-gray-500 hover:text-gray-800 underline underline-offset-2 cursor-pointer ml-1"
        >
          Limpar todos
        </button>
      )}
    </motion.div>
  )
}
