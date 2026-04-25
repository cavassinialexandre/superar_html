import { motion, AnimatePresence } from 'framer-motion'

type DateSort = 'date-desc' | 'date-asc'

interface V7SortButtonProps {
  sort: DateSort
  onToggle: () => void
}

function SortDescIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h13" />
      <path d="M3 12h9" />
      <path d="M3 18h5" />
      <path d="M17 16l4 4 4-4" />
      <path d="M21 20V8" />
    </svg>
  )
}

function SortAscIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h5" />
      <path d="M3 12h9" />
      <path d="M3 18h13" />
      <path d="M17 8l4-4 4 4" />
      <path d="M21 4v12" />
    </svg>
  )
}

export function V7SortButton({ sort, onToggle }: V7SortButtonProps) {
  const label =
    sort === 'date-desc'
      ? 'Ordenar por data: do mais recente para o mais antigo. Clique para inverter.'
      : 'Ordenar por data: do mais antigo para o mais recente. Clique para inverter.'
  const announce =
    sort === 'date-desc'
      ? 'Lista ordenada do mais recente para o mais antigo'
      : 'Lista ordenada do mais antigo para o mais recente'

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        title={label}
        className="h-8 inline-flex items-center gap-1.5 pl-3 pr-2.5 bg-white border border-gray-200 rounded-full shadow-sm text-xs font-semibold text-gray-600 hover:text-primary-700 hover:border-gray-300 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40"
      >
        <span>Data</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={sort}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            {sort === 'date-desc' ? <SortDescIcon /> : <SortAscIcon />}
          </motion.span>
        </AnimatePresence>
      </button>
      <span aria-live="polite" className="sr-only">
        {announce}
      </span>
    </>
  )
}
