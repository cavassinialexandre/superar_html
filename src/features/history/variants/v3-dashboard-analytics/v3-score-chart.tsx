import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Evaluation } from '@/types'

interface V3ScoreChartProps {
  evaluations: Evaluation[]
}

interface Point {
  key: string
  label: string
  avgScore: number
  count: number
  rawDate: Date
}

function buildMonthlyPoints(evaluations: Evaluation[]): Point[] {
  const map = new Map<string, { sum: number; count: number; date: Date }>()
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  for (const ev of evaluations) {
    const d = new Date(ev.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const cur = map.get(key) ?? { sum: 0, count: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) }
    cur.sum += ev.score
    cur.count += 1
    map.set(key, cur)
  }

  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([key, v]) => {
      const [, month] = key.split('-')
      return {
        key,
        label: `${months[Number(month) - 1]}`,
        avgScore: Math.round((v.sum / v.count) * 10) / 10,
        count: v.count,
        rawDate: v.date,
      }
    })
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: Point }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{d.label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-black text-indigo-600 tabular-nums">{d.avgScore}</span>
        <span className="text-xs text-gray-400">% médio</span>
      </div>
      <p className="text-[10px] text-gray-500 mt-0.5">{d.count} avaliação{d.count > 1 ? 'es' : ''}</p>
    </div>
  )
}

export function V3ScoreChart({ evaluations }: V3ScoreChartProps) {
  const points = buildMonthlyPoints(evaluations)

  return (
    <motion.div
      className="relative h-full rounded-2xl bg-white border border-gray-200 p-5 overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-purple-400" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Evolução do score médio</h3>
              <p className="text-[11px] text-gray-400">Mensal, com base nas avaliações filtradas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-60">
        {points.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-400">
            Sem dados suficientes para o gráfico.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="v3ScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="#818CF8" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#C7D2FE" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={1.5} label={{ value: 'Meta 75%', position: 'right', fill: '#D97706', fontSize: 10, fontWeight: 500 }} />
              <Area
                type="monotone"
                dataKey="avgScore"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#v3ScoreGrad)"
                dot={{ fill: '#6366F1', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: '#6366F1', r: 6, stroke: '#C7D2FE', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}
