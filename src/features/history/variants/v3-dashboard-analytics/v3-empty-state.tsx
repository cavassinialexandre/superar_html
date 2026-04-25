import { motion } from 'framer-motion'
import type { HistoryDataResult } from '../../shared/types'

interface V3EmptyStateProps {
  reason: HistoryDataResult['emptyReason']
  onClear: () => void
}

export function V3EmptyState({ reason, onClear }: V3EmptyStateProps) {
  const config = (() => {
    switch (reason) {
      case 'no-data':
        return {
          title: 'Sem dados neste dataset',
          description: 'Nenhuma avaliação registrada para a unidade ativa. Assim que auditorias e follow-ups forem aplicados, eles aparecerão nos gráficos.',
          actionLabel: null,
        }
      default:
        return {
          title: 'Filtros não retornaram resultados',
          description: 'Os filtros ativos não têm interseção. Tente relaxar critérios para liberar dados para os gráficos.',
          actionLabel: 'Limpar filtros',
        }
    }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-indigo-50/30 to-white py-16 px-8 text-center"
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-800">{config.title}</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{config.description}</p>

      {config.actionLabel && (
        <button
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          {config.actionLabel}
        </button>
      )}
    </motion.div>
  )
}
