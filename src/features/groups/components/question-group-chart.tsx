/**
 * QuestionGroupChart - Barras horizontais premium
 * Gradient header, watermark SVG, barras com glow sutil
 */

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import type { QuestionGroup } from '@/types'
import { cn } from '@/lib/cn'

// ============================================================================
// ICONES
// ============================================================================

const Icons = {
  BarChartWatermark: () => (
    <svg width="130" height="130" viewBox="0 0 24 24" fill="none" className="text-primary-500/[0.03]">
      <rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1"/>
      <rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1"/>
      <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  Layers: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
}

// ============================================================================
// TIPOS
// ============================================================================

interface QuestionGroupData {
  groupId: string
  groupName: string
  compliance: number
  color?: string
}

interface QuestionGroupChartProps {
  groups: QuestionGroup[]
  data: QuestionGroupData[]
  maxGroups?: number
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function QuestionGroupChart({ groups, data, maxGroups = 5 }: QuestionGroupChartProps) {
  const sortedData = [...data]
    .sort((a, b) => a.compliance - b.compliance)
    .slice(0, maxGroups)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-full relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute -bottom-4 -right-4 pointer-events-none">
          <Icons.BarChartWatermark />
        </div>

        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)' }} />

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}
            >
              <span className="text-white"><Icons.Layers /></span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Atendimento por Categoria</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Percentual de itens respondidos como "Sim"
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-3.5">
            {sortedData.map((item, index) => {
              const group = groups.find(g => g.id === item.groupId)
              const color = item.color || group?.color || '#1E7A73'

              const statusColor = item.compliance >= 80
                ? 'bg-green-500'
                : item.compliance >= 50
                  ? 'bg-amber-500'
                  : 'bg-red-500'

              return (
                <motion.div
                  key={item.groupId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 group/bar">
                    {/* Status dot + Label */}
                    <div className="w-32 sm:w-40 flex-shrink-0 flex items-center gap-2.5">
                      <div className={cn(
                        'w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-1',
                        statusColor,
                        item.compliance >= 80 ? 'ring-green-200' : item.compliance >= 50 ? 'ring-amber-200' : 'ring-red-200'
                      )} />
                      <p className="text-xs font-medium text-gray-600 truncate" title={item.groupName}>
                        {item.groupName}
                      </p>
                    </div>

                    {/* Bar */}
                    <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden group-hover/bar:bg-gray-200 transition-colors">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.compliance}%` }}
                        transition={{ delay: 0.3 + index * 0.08 + 0.15, duration: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-lg flex items-center justify-end pr-2.5"
                        style={{
                          background: `linear-gradient(90deg, ${color}CC 0%, ${color} 100%)`,
                          boxShadow: item.compliance > 0 ? `0 2px 8px ${color}30` : 'none',
                        }}
                      >
                        {item.compliance > 25 && (
                          <span className="text-[10px] font-bold text-white drop-shadow-sm">
                            {item.compliance}%
                          </span>
                        )}
                      </motion.div>
                    </div>

                    {/* Percentage outside */}
                    {item.compliance <= 25 && (
                      <span className={cn(
                        'text-xs font-bold w-10 text-right tabular-nums',
                        item.compliance < 50 ? 'text-red-500' : 'text-amber-500'
                      )}>
                        {item.compliance}%
                      </span>
                    )}
                    {item.compliance > 25 && <div className="w-10" />}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
