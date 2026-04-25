import { motion } from 'framer-motion'
import type { HistoryDataResult } from '../../shared/types'

interface V2EmptyStateProps {
  reason: HistoryDataResult['emptyReason']
  onClear: () => void
}

export function V2EmptyState({ reason, onClear }: V2EmptyStateProps) {
  const title = reason === 'no-data' ? 'Sem matérias nesta edição' : 'Nada a dizer com estes filtros'
  const desc = reason === 'no-data'
    ? 'Quando novas auditorias e follow-ups forem registrados, eles ocuparão estas páginas.'
    : 'Relaxe os filtros para deixar a redação publicar os números.'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative border border-[#D8C89A] bg-[#FAF7F2] py-20 px-10 text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
        Editorial
      </p>
      <h3 className="mt-4 text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight" style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }}>
        {title}
      </h3>
      <div className="my-5 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
      <p className="text-base italic text-[#5A5A5A] max-w-lg mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        {desc}
      </p>
      {reason !== 'no-data' && (
        <button
          onClick={onClear}
          className="mt-8 inline-block px-5 py-2 border border-[#B8860B] text-[#B8860B] text-sm italic hover:bg-[#B8860B] hover:text-white transition cursor-pointer"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Limpar filtros
        </button>
      )}
    </motion.div>
  )
}
