import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts'
import type { Evaluation } from '@/types'

interface V5TrendLineProps {
  year: number
  evaluations: Evaluation[]
}

export function V5TrendLine({ year, evaluations }: V5TrendLineProps) {
  // Agrupar por mês
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const byMonth: Array<{ month: string; avg: number; count: number; idx: number }> = months.map((m, i) => ({
    month: m,
    avg: 0,
    count: 0,
    idx: i,
  }))

  for (const ev of evaluations) {
    const d = new Date(ev.date)
    if (d.getFullYear() !== year) continue
    const slot = byMonth[d.getMonth()]
    slot.avg += ev.score
    slot.count += 1
  }

  const data = byMonth.map((m) => ({
    month: m.month,
    avg: m.count > 0 ? Math.round((m.avg / m.count) * 10) / 10 : null,
    count: m.count,
  }))

  return (
    <motion.div
      className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600 to-cyan-400 flex items-center justify-center text-white">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">Média mensal · {year}</h3>
          <p className="text-[11px] text-gray-400">Evolução em relação à meta</p>
        </div>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              formatter={(value: unknown) => {
                const v = value as number | null
                return v != null ? [`${v}%`, 'Média'] : ['—', 'Sem dados']
              }}
            />
            <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="5 5" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#0EA5E9"
              strokeWidth={2.5}
              dot={{ fill: '#0EA5E9', strokeWidth: 0, r: 3 }}
              activeDot={{ fill: '#0EA5E9', r: 5, stroke: '#BAE6FD', strokeWidth: 2 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
