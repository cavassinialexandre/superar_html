import { useState } from 'react'
import type { Evaluation } from '@/types'

interface V5HeatmapCellProps {
  date: Date
  evaluations: Evaluation[]
  size: number
  isSelected: boolean
  isOutOfYear: boolean
  onClick: () => void
}

function scoreToColor(avg: number): string {
  if (avg === -1) return '#F1F5F9' // sem dados
  if (avg >= 90) return '#1E7A73'
  if (avg >= 75) return '#3AA39C'
  if (avg >= 60) return '#96D4D0'
  if (avg >= 50) return '#C5E8E6'
  if (avg >= 30) return '#FCA5A5'
  return '#EF4444'
}

export function V5HeatmapCell({ date, evaluations, size, isSelected, isOutOfYear, onClick }: V5HeatmapCellProps) {
  const [hover, setHover] = useState(false)

  const hasData = evaluations.length > 0
  const avgScore = hasData
    ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
    : -1

  const color = isOutOfYear ? '#FFFFFF' : scoreToColor(avgScore)

  const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`block w-full h-full rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-sky-500 hover:ring-offset-1 ${
          isSelected ? 'ring-2 ring-sky-600 ring-offset-1' : ''
        } ${isOutOfYear ? 'opacity-30' : ''}`}
        style={{ background: color }}
        title={`${dateStr} · ${hasData ? `${evaluations.length} avaliação${evaluations.length > 1 ? 'es' : ''} · média ${Math.round(avgScore)}%` : 'sem dados'}`}
        aria-label={`${dateStr}: ${hasData ? `${evaluations.length} avaliações, média ${Math.round(avgScore)}%` : 'sem dados'}`}
      />

      {hover && !isOutOfYear && hasData && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none">
          <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2.5 py-2 shadow-lg whitespace-nowrap">
            <p className="font-bold">{dateStr}</p>
            <p className="text-gray-300 mt-0.5">
              <span className="tabular-nums font-bold">{evaluations.length}</span> avaliação{evaluations.length > 1 ? 'es' : ''}
            </p>
            <p className="text-gray-300">
              Média <span className="tabular-nums font-bold text-sky-300">{Math.round(avgScore)}%</span>
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  )
}
