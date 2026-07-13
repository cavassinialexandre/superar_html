import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from '@/assets/icons'
import type { HistoryFiltersApi, HistoryFiltersState } from '../../shared/types'
import { getPeriodLabel } from './v7-periods'

interface V7ActiveChipsProps {
  api: HistoryFiltersApi
  lockedKeys?: Array<keyof HistoryFiltersState>
  onClearAll?: () => void
}

export function V7ActiveChips({ api, lockedKeys = [], onClearAll }: V7ActiveChipsProps) {
  const { activeChips, clearAll, filters } = api
  const removableCount = activeChips.filter((c) => !lockedKeys.includes(c.key)).length

  const resolveLabel = (key: keyof HistoryFiltersState, original: string): string => {
    if (key === 'dateFrom') {
      return `Período: ${getPeriodLabel(filters.dateFrom, filters.dateTo)}`
    }
    return original
  }

  if (activeChips.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Filtros ativos:</span>
      <AnimatePresence initial={false}>
        {activeChips.map((chip) => {
          const locked = lockedKeys.includes(chip.key)
          const label = resolveLabel(chip.key, chip.label)
          const commonMotion = {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { duration: 0.18 },
          }
          if (locked) {
            return (
              <motion.span
                key={`${String(chip.key)}-${label}`}
                {...commonMotion}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold"
              >
                <span className="truncate max-w-[240px]">{label}</span>
              </motion.span>
            )
          }
          return (
            <motion.button
              key={`${String(chip.key)}-${label}`}
              {...commonMotion}
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-primary-100 hover:border-primary-300 cursor-pointer transition"
              aria-label={`Remover filtro ${label}`}
            >
              <span className="truncate max-w-[240px]">{label}</span>
              <XIcon size={11} className="text-primary-500" />
            </motion.button>
          )
        })}
      </AnimatePresence>
      {removableCount >= 1 && (
        <button
          onClick={onClearAll ?? clearAll}
          className="text-[11px] font-medium text-gray-500 hover:text-gray-800 underline underline-offset-2 cursor-pointer ml-1"
        >
          Limpar todos
        </button>
      )}
    </motion.div>
  )
}
