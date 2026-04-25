import { motion } from 'framer-motion'
import type { HistoryDataResult } from '../../shared/types'

interface V7EmptyStateProps {
  reason: HistoryDataResult['emptyReason']
  onClear: () => void
}

export function V7EmptyState({ reason, onClear }: V7EmptyStateProps) {
  const config = (() => {
    switch (reason) {
      case 'no-data':
        return {
          title: 'Nenhuma avaliação nesta unidade ainda',
          description:
            'Quando auditorias e follow-ups forem aplicados a grupos desta unidade, eles aparecerão aqui, agrupados por mês.',
          actionLabel: null,
        }
      case 'date-out-of-range':
        return {
          title: 'Nada dentro deste período',
          description: 'Não encontramos avaliações no intervalo de datas selecionado. Tente ampliar as datas ou limpar os filtros.',
          actionLabel: 'Limpar filtros',
        }
      case 'filters-too-tight':
      default:
        return {
          title: 'Os filtros estão restritivos demais',
          description:
            'Não encontramos avaliações que correspondam a todos os filtros ativos. Relaxe um ou mais critérios para ver resultados.',
          actionLabel: 'Limpar filtros',
        }
    }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white py-16 px-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </motion.div>

      <h3 className="relative text-lg font-bold text-gray-800">{config.title}</h3>
      <p className="relative text-sm text-gray-500 mt-2 max-w-md mx-auto">{config.description}</p>

      {config.actionLabel && (
        <button
          onClick={onClear}
          className="relative mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition cursor-pointer shadow-sm"
        >
          {config.actionLabel}
        </button>
      )}
    </motion.div>
  )
}
