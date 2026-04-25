import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GroupsIcon, BarChartIcon, CheckCircleIcon, TrendUpIcon } from '@/assets/icons'
import { dashboardData } from '@/mocks/data'
import { useDashboardMetrics } from '../../use-dashboard-metrics'
import { CinematicHero } from './cinematic-hero'
import { CinematicKpiGrid } from './cinematic-kpi-grid'
import { CinematicCharts } from './cinematic-charts'
import { cinematic } from './cinematic-tokens'

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

export default function CinematicDashboard({ unitLabel }: VariantProps) {
  const metrics = useDashboardMetrics()

  const kpis = useMemo(() => {
    const totalSpark = deriveSparkline(metrics.totalGroups, 6, 1.5)
    const avgSpark = deriveSparkline(metrics.averageScore, 6, 5)
    const completedSpark = deriveSparkline(metrics.completedGroups, 6, 1)
    const apprSpark = deriveSparkline(metrics.approvalRate, 6, 6)
    return [
      {
        id: 'totalGroups',
        label: 'Total de grupos',
        value: metrics.totalGroups,
        delta: deriveDelta(totalSpark),
        deltaUnit: '',
        sparkline: totalSpark,
        Icon: GroupsIcon,
      },
      {
        id: 'avgScore',
        label: 'Nota média geral',
        value: metrics.averageScore,
        suffix: '%',
        delta: deriveDelta(avgSpark),
        deltaUnit: ' pp',
        sparkline: avgSpark,
        Icon: BarChartIcon,
      },
      {
        id: 'completed',
        label: 'Grupos concluídos',
        value: metrics.completedGroups,
        suffix: `/${metrics.totalGroups}`,
        delta: deriveDelta(completedSpark),
        deltaUnit: '',
        sparkline: completedSpark,
        Icon: CheckCircleIcon,
      },
      {
        id: 'approval',
        label: 'Taxa de aprovação',
        value: metrics.approvalRate,
        suffix: '%',
        delta: deriveDelta(apprSpark),
        deltaUnit: ' pp',
        sparkline: apprSpark,
        Icon: TrendUpIcon,
      },
    ]
  }, [metrics])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <CinematicHero
        unitLabel={unitLabel}
        topGroups={metrics.topGroups}
        totalGroups={metrics.totalGroups}
        averageScore={metrics.averageScore}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <span
            className="uppercase tracking-[0.16em] font-semibold"
            style={{ fontSize: 10, color: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }}
          >
            indicadores · {dashboardData.totalGroups} grupos avaliados
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <CinematicKpiGrid kpis={kpis} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <span
            className="uppercase tracking-[0.16em] font-semibold"
            style={{ fontSize: 10, color: cinematic.text.onLightSubtle, fontFamily: cinematic.font.mono }}
          >
            análise · evolução, distribuição & atividade
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <CinematicCharts
          scoreEvolution={metrics.scoreEvolutionByType}
          groupsByType={dashboardData.groupsByType}
          managementPerformance={metrics.averageScoreByManagement}
          sequenceDistribution={metrics.sequenceDistribution}
          recentActivity={metrics.recentActivity}
          bottomGroups={metrics.bottomGroups}
        />
      </motion.div>
    </motion.div>
  )
}
