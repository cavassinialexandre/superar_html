import { motion } from 'framer-motion'
import type { HistoryDataResult } from '../../shared/types'

interface V4EmptyStateProps {
  reason: HistoryDataResult['emptyReason']
  onClear: () => void
}

export function V4EmptyState({ reason, onClear }: V4EmptyStateProps) {
  const title = reason === 'no-data' ? 'Quadro vazio' : 'Sem cartões com estes filtros'
  const desc = reason === 'no-data'
    ? 'As avaliações registradas aparecerão automaticamente na coluna correspondente ao status.'
    : 'Ajuste os filtros para redistribuir os cartões nas três colunas de status.'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 py-16 px-8 text-center"
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="5" height="16" rx="1" />
          <rect x="9.5" y="4" width="5" height="10" rx="1" />
          <rect x="16" y="4" width="5" height="13" rx="1" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{desc}</p>
      {reason !== 'no-data' && (
        <button
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer shadow-sm"
        >
          Limpar filtros
        </button>
      )}
    </motion.div>
  )
}
