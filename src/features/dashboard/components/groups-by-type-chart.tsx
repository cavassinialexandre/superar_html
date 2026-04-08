import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardTooltip } from './dashboard-tooltip'
import { colors } from '@/design-system/tokens'

const CHART_COLORS = [colors.primary[500], colors.green[500], colors.yellow[700]]

interface GroupsByTypeChartProps {
  data: { name: string; count: number }[]
}

export function GroupsByTypeChart({ data }: GroupsByTypeChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <motion.div variants={staggerItem} className="lg:col-span-4">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Grupos por Tipo</CardTitle>
        </CardHeader>
        <div className="h-64 flex flex-col items-center">
          <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<DashboardTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-heading font-extrabold text-gray-800 tabular-nums">
                {activeIndex !== null ? data[activeIndex].count : total}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                {activeIndex !== null ? data[activeIndex].name : 'Total'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {data.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-xs font-medium text-gray-600">{item.name}</span>
                <span className="text-xs font-bold text-gray-800 tabular-nums">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
