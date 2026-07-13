import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from '@/assets/icons'
import { managements, areas, groupTypes } from '@/mocks/data'
import type { GroupsFilterValues } from './groups-filter-bar'

interface GroupsActiveChipsProps {
  values: GroupsFilterValues
  onChange: <K extends keyof GroupsFilterValues>(key: K, value: GroupsFilterValues[K]) => void
  onClearAll: () => void
  /** Tipo travado pela URL — chip aparece sem botão de remover. */
  lockedType?: string
}

interface Chip {
  key: keyof GroupsFilterValues | 'lockedType'
  label: string
  locked?: boolean
  onRemove?: () => void
}

export function GroupsActiveChips({ values, onChange, onClearAll, lockedType }: GroupsActiveChipsProps) {
  const chips: Chip[] = []

  if (lockedType) {
    const t = groupTypes.find((x) => x.id === lockedType)
    chips.push({
      key: 'lockedType',
      label: `Tipo: ${t?.name ?? lockedType}`,
      locked: true,
    })
  }

  if (values.search) {
    chips.push({
      key: 'search',
      label: `Busca: "${values.search}"`,
      onRemove: () => onChange('search', ''),
    })
  }

  if (values.filterType && !lockedType) {
    const t = groupTypes.find((x) => x.id === values.filterType)
    chips.push({
      key: 'filterType',
      label: `Tipo: ${t?.name ?? values.filterType}`,
      onRemove: () => onChange('filterType', ''),
    })
  }

  if (values.filterMgmt) {
    const m = managements.find((x) => x.id === values.filterMgmt)
    chips.push({
      key: 'filterMgmt',
      label: `Gerência: ${m?.name ?? values.filterMgmt}`,
      onRemove: () => {
        onChange('filterMgmt', '')
        if (values.filterArea) onChange('filterArea', '')
      },
    })
  }

  if (values.filterArea) {
    const a = areas.find((x) => x.id === values.filterArea)
    chips.push({
      key: 'filterArea',
      label: `Área: ${a?.name ?? values.filterArea}`,
      onRemove: () => onChange('filterArea', ''),
    })
  }

  if (chips.length === 0) return null

  const removableCount = chips.filter((c) => !c.locked).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
        Filtros ativos:
      </span>
      <AnimatePresence initial={false}>
        {chips.map((chip) => {
          const motionProps = {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { duration: 0.18 },
          }
          if (chip.locked) {
            return (
              <motion.span
                key={`${String(chip.key)}-${chip.label}`}
                {...motionProps}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold"
              >
                <span className="truncate max-w-[240px]">{chip.label}</span>
              </motion.span>
            )
          }
          return (
            <motion.button
              key={`${String(chip.key)}-${chip.label}`}
              {...motionProps}
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-primary-100 hover:border-primary-300 cursor-pointer transition"
              aria-label={`Remover filtro ${chip.label}`}
            >
              <span className="truncate max-w-[240px]">{chip.label}</span>
              <XIcon size={11} className="text-primary-500" />
            </motion.button>
          )
        })}
      </AnimatePresence>
      {removableCount >= 1 && (
        <button
          onClick={onClearAll}
          className="text-[11px] font-medium text-gray-500 hover:text-gray-800 underline underline-offset-2 cursor-pointer ml-1"
        >
          Limpar todos
        </button>
      )}
    </motion.div>
  )
}
