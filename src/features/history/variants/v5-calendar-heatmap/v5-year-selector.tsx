import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons'

interface V5YearSelectorProps {
  year: number
  availableYears: number[]
  onChange: (year: number) => void
}

export function V5YearSelector({ year, availableYears, onChange }: V5YearSelectorProps) {
  const sorted = [...availableYears].sort((a, b) => a - b)
  const currentIdx = sorted.indexOf(year)

  const canPrev = currentIdx > 0
  const canNext = currentIdx >= 0 && currentIdx < sorted.length - 1

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => canPrev && onChange(sorted[currentIdx - 1])}
        disabled={!canPrev}
        className={`w-9 h-9 rounded-xl border transition flex items-center justify-center cursor-pointer ${
          canPrev ? 'border-sky-200 text-sky-700 hover:bg-sky-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        <ChevronLeftIcon size={16} />
      </button>

      <motion.div
        key={year}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-baseline gap-3 px-5 py-2 rounded-xl bg-white border border-sky-200 shadow-sm"
      >
        <p className="text-[10px] uppercase tracking-widest text-sky-600 font-bold">Ano</p>
        <p className="text-2xl font-black text-gray-800 tabular-nums leading-none">{year}</p>
      </motion.div>

      <button
        onClick={() => canNext && onChange(sorted[currentIdx + 1])}
        disabled={!canNext}
        className={`w-9 h-9 rounded-xl border transition flex items-center justify-center cursor-pointer ${
          canNext ? 'border-sky-200 text-sky-700 hover:bg-sky-50' : 'border-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        <ChevronRightIcon size={16} />
      </button>

      {/* Small pills for quick nav */}
      <div className="hidden md:flex items-center gap-1 ml-3">
        {sorted.map((y) => (
          <button
            key={y}
            onClick={() => onChange(y)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer tabular-nums ${
              y === year ? 'bg-sky-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  )
}
