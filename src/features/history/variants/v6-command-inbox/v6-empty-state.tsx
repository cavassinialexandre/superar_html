import { motion } from 'framer-motion'

interface V6EmptyStateProps {
  hasFilters: boolean
  onClear: () => void
}

export function V6EmptyState({ hasFilters, onClear }: V6EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-20 px-8 text-center bg-white rounded-2xl border border-gray-200"
    >
      <div className="max-w-md">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="mx-auto w-14 h-14 rounded-2xl bg-gray-950 text-white flex items-center justify-center mb-4"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </motion.div>
        <h3 className="text-base font-bold text-gray-800 font-mono">
          Inbox zero
        </h3>
        <p className="text-sm text-gray-500 mt-2 font-mono">
          {hasFilters
            ? 'Sua query não retornou resultados. Tente relaxar tokens.'
            : 'Parabéns — você processou tudo.'}
        </p>
        {hasFilters && (
          <button
            onClick={onClear}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-950 text-white text-xs font-mono hover:bg-gray-800 transition cursor-pointer"
          >
            clear filters
          </button>
        )}
      </div>
    </motion.div>
  )
}
