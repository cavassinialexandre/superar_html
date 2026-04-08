import { Card, CardHeader, CardTitle } from '@/components/ui'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { DashboardTooltip } from './dashboard-tooltip'
import { colors } from '@/design-system/tokens'

const TYPE_COLORS: Record<string, string> = {
  Operacional: colors.primary[500],
  Administrativo: colors.yellow[500],
  '5S': colors.green[500],
}

interface ScoreEvolutionChartProps {
  data: Array<{ month: string; [key: string]: number | string }>
}

export function ScoreEvolutionChart({ data }: ScoreEvolutionChartProps) {
  const types = Object.keys(data[0] ?? {}).filter((k) => k !== 'month')

  return (
    <motion.div variants={staggerItem} className="lg:col-span-8">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Evolução das Notas por Tipo</CardTitle>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Últimos 6 meses</span>
        </CardHeader>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                {types.map((type) => (
                  <linearGradient key={type} id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TYPE_COLORS[type] || colors.gray[400]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={TYPE_COLORS[type] || colors.gray[400]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.gray[500], fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.gray[500], fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<DashboardTooltip suffix="%" />} />
              {types.map((type) => (
                <Area
                  key={type}
                  type="monotone"
                  dataKey={type}
                  name={type}
                  stroke={TYPE_COLORS[type] || colors.gray[400]}
                  strokeWidth={2.5}
                  fill={`url(#grad-${type})`}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
