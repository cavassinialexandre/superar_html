import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GroupsIcon, BarChartIcon, CheckCircleIcon, TrendUpIcon } from '@/assets/icons'
import { dashboardData } from '@/mocks/data'
import { useDashboardMetrics } from '../../use-dashboard-metrics'
import { BentoHeroTile } from './bento-hero-tile'
import { BentoKpiTiles } from './bento-kpi-tiles'
import { BentoPodiumBlock } from './bento-podium-block'
import { BentoChartTiles } from './bento-chart-tiles'
import { bento } from './bento-tokens'

interface VariantProps {
  unitLabel: string
}

function deriveSparkline(end: number, length = 6, variance = 8): number[] {
  const arr: number[] = []
  let prev = Math.max(0, end - 6 - Math.random() * 4)
  for (let i = 0; i < length - 1; i++) {
    const drift = (Math.random() - 0.45) * variance
    prev = Math.max(0, Math.min(100, prev + drift))
    arr.push(Math.round(prev))
  }
  arr.push(end)
  return arr
}

function deriveDelta(values: number[]): number {
  if (values.length < 2) return 0
  return values[values.length - 1] - values[values.length - 2]
}

export default function BentoDashboard({ unitLabel }: VariantProps) {
  const metrics = useDashboardMetrics()

  const kpis = useMemo(() => {
    const totalSpark = deriveSparkline(metrics.totalGroups, 6, 1.5)
    const avgSpark = deriveSparkline(metrics.averageScore, 6, 5)
    const completedSpark = deriveSparkline(metrics.completedGroups, 6, 1)
    const apprSpark = deriveSparkline(metrics.approvalRate, 6, 6)
    return [
      {
        id: 'totalGroups',
        label: 'Total',
        value: metrics.totalGroups,
        delta: 0,
        deltaUnit: '',
        sparkline: totalSpark,
        Icon: GroupsIcon,
        accent: bento.category.kpi.tint,
        soft: bento.category.kpi.soft,
      },
      {
        id: 'avgScore',
        label: 'Média',
        value: metrics.averageScore,
        suffix: '%',
        delta: deriveDelta(avgSpark),
        deltaUnit: 'pp',
        sparkline: avgSpark,
        Icon: BarChartIcon,
        accent: bento.category.chart.tint,
        soft: bento.category.chart.soft,
      },
      {
        id: 'completed',
        label: 'Concluídos',
        value: metrics.completedGroups,
        suffix: `/${metrics.totalGroups}`,
        delta: deriveDelta(completedSpark),
        deltaUnit: '',
        sparkline: completedSpark,
        Icon: CheckCircleIcon,
        accent: bento.category.activity.tint,
        soft: bento.category.activity.soft,
      },
      {
        id: 'approval',
        label: 'Aprovação',
        value: metrics.approvalRate,
        suffix: '%',
        delta: deriveDelta(apprSpark),
        deltaUnit: 'pp',
        sparkline: apprSpark,
        Icon: TrendUpIcon,
        accent: bento.category.podium.icon,
        soft: bento.category.podium.soft,
      },
    ]
  }, [metrics])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl p-4 md:p-5"
      style={{
        background: bento.surface.canvas,
        border: `1px solid ${bento.surface.tileBorder}`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 auto-rows-min">
        <div className="lg:col-span-6">
          <BentoHeroTile
            unitLabel={unitLabel}
            totalGroups={metrics.totalGroups}
            averageScore={metrics.averageScore}
          />
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 gap-3">
          <BentoKpiTiles kpis={kpis} />
        </div>

        <BentoPodiumBlock topGroups={metrics.topGroups} />

        <BentoChartTiles
          scoreEvolution={metrics.scoreEvolutionByType}
          groupsByType={dashboardData.groupsByType}
          managementPerformance={metrics.averageScoreByManagement}
          sequenceDistribution={metrics.sequenceDistribution}
          recentActivity={metrics.recentActivity}
          bottomGroups={metrics.bottomGroups}
        />
      </div>
    </motion.div>
  )
}
