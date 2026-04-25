import { motion } from 'framer-motion'

interface V5EmptyStateProps {
  year: number
  onClear: () => void
  hasFilters: boolean
}

export function V5EmptyState({ year, onClear, hasFilters }: V5EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 py-12 px-8 text-center"
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-sky-200 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800">Nenhuma avaliação em {year}</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        {hasFilters
          ? 'Relaxe os filtros ou navegue para outro ano — o heatmap revelará os padrões temporais.'
          : 'Quando avaliações forem registradas neste ano, cada dia ganhará uma cor proporcional ao score médio.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition cursor-pointer shadow-sm"
        >
          Limpar filtros
        </button>
      )}
    </motion.div>
  )
}
