import { Card, CardHeader, CardTitle } from '@/components/ui'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { DashboardTooltip } from './dashboard-tooltip'
import { colors } from '@/design-system/tokens'

function getBarColor(score: number) {
  if (score >= 80) return colors.green[500]
  if (score >= 50) return colors.yellow[500]
  return colors.rose[500]
}

interface ManagementPerformanceChartProps {
  data: { name: string; score: number }[]
}

export function ManagementPerformanceChart({ data }: ManagementPerformanceChartProps) {
  return (
    <motion.div variants={staggerItem} className="lg:col-span-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Desempenho por Gerência</CardTitle>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nota média da última auditoria</span>
        </CardHeader>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fill: colors.gray[600], fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: colors.gray[100], radius: 6 }}
                content={<DashboardTooltip suffix="%" />}
              />
              <Bar dataKey="score" name="Nota" radius={[0, 6, 6, 0]} barSize={22}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
