import { KPICard } from '@/components/data-display/kpi-card'
import { CircularScoreGauge } from '@/components/data-display/circular-score-gauge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { GroupsIcon, BarChartIcon, CheckCircleIcon, TrendUpIcon } from '@/assets/icons'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'

interface DashboardKPIGridProps {
  totalGroups: number
  averageScore: number
  completedGroups: number
  totalForCompletion: number
  approvalRate: number
}

export function DashboardKPIGrid({
  totalGroups,
  averageScore,
  completedGroups,
  totalForCompletion,
  approvalRate,
}: DashboardKPIGridProps) {
  const completionPercent = Math.round((completedGroups / totalForCompletion) * 100)

  return (
    <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <KPICard
        title="Total de Grupos"
        value={totalGroups}
        icon={<GroupsIcon size={22} />}
        accentColor="linear-gradient(90deg, #103734 0%, #00A650 100%)"
      />

      <KPICard
        title="Nota Média Geral"
        value={averageScore}
        suffix="%"
        icon={<BarChartIcon size={22} />}
        variant="hero"
      />

      <KPICard
        title="Grupos Concluídos"
        value={completedGroups}
        icon={<CheckCircleIcon size={22} />}
        accentColor="#00A650"
      >
        <div className="mt-2">
          <ProgressBar value={completionPercent} size="xs" variant="gradient" />
          <p className="text-[10px] text-gray-400 mt-1 font-medium">{completionPercent}% do total</p>
        </div>
      </KPICard>

      <KPICard
        title="Taxa de Aprovação"
        value={approvalRate}
        suffix="%"
        icon={<TrendUpIcon size={22} />}
        accentColor="#1E7A73"
      >
        <div className="mt-2 flex items-center gap-3">
          <CircularScoreGauge score={approvalRate} size="sm" showMeta={false} />
          <p className="text-[10px] text-gray-400 font-medium leading-tight">
            Grupos acima<br />da meta atual
          </p>
        </div>
      </KPICard>
    </motion.div>
  )
}
