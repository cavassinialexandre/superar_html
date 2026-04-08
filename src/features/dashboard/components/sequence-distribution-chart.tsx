import { Card, CardHeader, CardTitle } from '@/components/ui'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { DashboardTooltip } from './dashboard-tooltip'
import { colors } from '@/design-system/tokens'

interface SequenceDistributionChartProps {
  data: { step: string; count: number }[]
}

export function SequenceDistributionChart({ data }: SequenceDistributionChartProps) {
  return (
    <motion.div variants={staggerItem} className="lg:col-span-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Distribuição por Sequência</CardTitle>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Grupos em cada passo</span>
        </CardHeader>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="seqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary[500]} />
                  <stop offset="100%" stopColor={colors.primary[700]} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray[200]} vertical={false} />
              <XAxis
                dataKey="step"
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.gray[500], fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.gray[500], fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip content={<DashboardTooltip suffix="" />} />
              <Bar dataKey="count" name="Grupos" fill="url(#seqGradient)" radius={[8, 8, 0, 0]} barSize={36}>
                <LabelList dataKey="count" position="top" className="fill-gray-600 text-xs font-bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
