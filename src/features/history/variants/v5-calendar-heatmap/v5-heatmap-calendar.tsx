import { motion } from 'framer-motion'
import type { Evaluation } from '@/types'
import { V5HeatmapCell } from './v5-heatmap-cell'

interface V5HeatmapCalendarProps {
  year: number
  groupedByDay: Record<string, Evaluation[]>
  selectedDay: string | null
  onSelectDay: (dayKey: string | null) => void
}

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function V5HeatmapCalendar({ year, groupedByDay, selectedDay, onSelectDay }: V5HeatmapCalendarProps) {
  const CELL = 13
  const GAP = 3

  // Construir grid de semanas do ano
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)

  // Recuar até o domingo anterior
  const gridStart = new Date(start)
  while (gridStart.getDay() !== 0) {
    gridStart.setDate(gridStart.getDate() - 1)
  }

  // Avançar até o sábado após o fim
  const gridEnd = new Date(end)
  while (gridEnd.getDay() !== 6) {
    gridEnd.setDate(gridEnd.getDate() + 1)
  }

  // Construir matriz week×day
  const weeks: Date[][] = []
  let cursor = new Date(gridStart)
  while (cursor <= gridEnd) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  // Calcular as posições de labels de mês (primeira semana do mês)
  const monthLabels: { monthIdx: number; weekIdx: number }[] = []
  weeks.forEach((week, wIdx) => {
    const firstDayOfYear = week.find((d) => d.getFullYear() === year)
    if (firstDayOfYear && firstDayOfYear.getDate() <= 7) {
      const monthIdx = firstDayOfYear.getMonth()
      if (!monthLabels.some((m) => m.monthIdx === monthIdx)) {
        monthLabels.push({ monthIdx, weekIdx: wIdx })
      }
    }
  })

  const totalEvals = Object.values(groupedByDay).reduce((sum, v) => sum + v.length, 0)

  return (
    <motion.div
      className="relative rounded-2xl bg-white border border-gray-200 p-6 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Atividade em {year}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            <span className="tabular-nums font-bold text-gray-600">{totalEvals}</span> avaliações · cor representa score médio do dia
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span>Menor</span>
          <div className="flex gap-0.5">
            {['#EF4444', '#FCA5A5', '#C5E8E6', '#96D4D0', '#3AA39C', '#1E7A73'].map((c) => (
              <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          <span>Maior</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex ml-6" style={{ gap: GAP }}>
            {weeks.map((_, wIdx) => {
              const label = monthLabels.find((m) => m.weekIdx === wIdx)
              return (
                <div key={wIdx} className="flex-shrink-0 text-[9px] uppercase tracking-wider font-bold text-gray-500" style={{ width: CELL }}>
                  {label ? MONTHS[label.monthIdx] : ''}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className="flex items-start mt-1">
            {/* Day labels */}
            <div className="flex flex-col mr-1.5" style={{ gap: GAP }}>
              {DAYS.map((d, i) => (
                <div key={i} className="text-[9px] text-gray-400 font-semibold" style={{ width: 14, height: CELL, lineHeight: `${CELL}px`, textAlign: 'right' }}>
                  {i === 1 || i === 3 || i === 5 ? d : ''}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((day, dIdx) => {
                    const key = toKey(day)
                    const isOutOfYear = day.getFullYear() !== year
                    const evs = groupedByDay[key] ?? []
                    return (
                      <V5HeatmapCell
                        key={`${wIdx}-${dIdx}`}
                        date={day}
                        evaluations={evs}
                        size={CELL}
                        isSelected={selectedDay === key}
                        isOutOfYear={isOutOfYear}
                        onClick={() => onSelectDay(selectedDay === key ? null : key)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
