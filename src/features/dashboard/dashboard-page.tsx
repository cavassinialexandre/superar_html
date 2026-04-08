import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/layout/page-header'
import { useUnitStore } from '@/stores/unit-store'
import { staggerContainer } from '@/design-system/animations'
import { gradients } from '@/design-system/tokens'
import { DashboardIcon } from '@/assets/icons'
import { dashboardData } from '@/mocks/data'
import { useDashboardMetrics } from './use-dashboard-metrics'
import { DashboardKPIGrid } from './components/dashboard-kpi-grid'
import { ScoreEvolutionChart } from './components/score-evolution-chart'
import { GroupsByTypeChart } from './components/groups-by-type-chart'
import { ManagementPerformanceChart } from './components/management-performance-chart'
import { SequenceDistributionChart } from './components/sequence-distribution-chart'
import { GroupLeaderboard } from './components/group-leaderboard'
import { ActivityTimeline } from './components/activity-timeline'

const unitNames = { puma: 'Puma', 'monte-alegre': 'Monte Alegre' }

export function DashboardPage() {
  const { selectedUnit } = useUnitStore()
  const metrics = useDashboardMetrics()

  return (
    <div style={{ background: gradients.mesh }} className="min-h-screen">
      <PageContainer maxWidth="full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          <PageHeader
            badge={`Unidade ${selectedUnit ? unitNames[selectedUnit] : ''}`}
            title="Portal Executivo"
            description="Panorama gerencial da implementação Kaizen/TPM. Acompanhe indicadores, evolução das equipes e identifique oportunidades de melhoria."
            icon={DashboardIcon}
          />

          <DashboardKPIGrid
            totalGroups={metrics.totalGroups}
            averageScore={metrics.averageScore}
            completedGroups={metrics.completedGroups}
            totalForCompletion={metrics.totalGroups}
            approvalRate={metrics.approvalRate}
          />

          {/* Charts Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <ScoreEvolutionChart data={metrics.scoreEvolutionByType} />
            <GroupsByTypeChart data={dashboardData.groupsByType} />
            <ManagementPerformanceChart data={metrics.averageScoreByManagement} />
            <SequenceDistributionChart data={metrics.sequenceDistribution} />
            <GroupLeaderboard topGroups={metrics.topGroups} bottomGroups={metrics.bottomGroups} />
            <ActivityTimeline data={metrics.recentActivity} />
          </div>
        </motion.div>
      </PageContainer>
    </div>
  )
}
