/**
 * ScoreEvolutionChart - Grafico premium com visual refinado
 * Gradient header icon, watermark SVG, tooltip estilizado
 */

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/cn'

// ============================================================================
// ICONES
// ============================================================================

const Icons = {
  ChartWatermark: () => (
    <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="text-primary-500/[0.03]">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
}

// ============================================================================
// TIPOS
// ============================================================================

interface ScoreEvolutionChartProps {
  data: { month: string; score: number }[]
  averageScore: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
  goal: number
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-primary-600">{payload[0].value}</span>
        <span className="text-xs text-gray-400">%</span>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function ScoreEvolutionChart({
  data,
  averageScore,
  trend,
  trendPercentage,
  goal,
}: ScoreEvolutionChartProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-full relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute -bottom-6 -right-6 pointer-events-none">
          <Icons.ChartWatermark />
        </div>

        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #1E7A73 0%, #3AA39C 50%, #96D4D0 100%)' }} />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}
              >
                <span className="text-white"><Icons.TrendUp /></span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Evolucao de Notas</h3>
                <p className="text-xs text-gray-400 mt-0.5">Historico dos ultimos 6 meses</p>
              </div>
            </div>
            <Badge
              variant={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'default'}
              dot
            >
              {trendIcon} {Math.abs(trendPercentage)}%
            </Badge>
          </div>

          {/* Chart */}
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E7A73" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#3AA39C" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#96D4D0" stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />

                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }} />

                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(v) => `${v}%`} />

                <Tooltip content={<CustomTooltip />} />

                <ReferenceLine y={goal} stroke="#D97706" strokeDasharray="5 5" strokeWidth={1.5}
                  label={{ value: `Meta ${goal}%`, position: 'right', fill: '#D97706', fontSize: 11, fontWeight: 500 }} />

                <Area type="monotone" dataKey="score"
                  stroke="#1E7A73" strokeWidth={2.5}
                  fill="url(#scoreAreaGradient)"
                  dot={{ fill: '#1E7A73', strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: '#1E7A73', r: 7, stroke: '#C5E8E6', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-400" />
              <span className="text-xs text-gray-400">
                Media 6 meses: <strong className="text-gray-700">{averageScore}%</strong>
              </span>
            </div>
            <span className={cn('text-xs font-medium', trendColor)}>
              {trendIcon} {Math.abs(trendPercentage)}% vs mes anterior
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
