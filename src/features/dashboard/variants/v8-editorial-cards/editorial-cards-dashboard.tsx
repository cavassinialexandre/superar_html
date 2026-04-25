import { useMemo } from 'react'
import { UserIcon, AuditIcon, CheckCircleIcon } from '@/assets/icons'
import { dashboardData } from '@/mocks/data'
import { useDashboardMetrics } from '../../use-dashboard-metrics'
import { EditorialCardsHero } from './editorial-cards-hero'
import { EditorialCardsKpiGrid } from './editorial-cards-kpi-card'
import { EditorialCardsAnalytics } from './editorial-cards-analytics'

interface VariantProps {
  unitLabel: string
}

export default function EditorialCardsDashboard({ unitLabel }: VariantProps) {
  const metrics = useDashboardMetrics()

  const kpis = useMemo(
    () => [
      {
        id: 'totalGroups',
        titleStart: 'Grupo',
        titleSerif: 'ativo',
        value: `${metrics.totalGroups}`,
        Icon: UserIcon,
      },
      {
        id: 'avgScore',
        titleStart: 'Nota',
        titleSerif: 'média global',
        value: `${metrics.averageScore}%`,
        Icon: AuditIcon,
      },
      {
        id: 'approval',
        titleStart: 'Acima da',
        titleSerif: 'meta',
        value: `${metrics.approvalRate}%`,
        Icon: CheckCircleIcon,
      },
    ],
    [metrics],
  )

  return (
    <div className="space-y-4">
      <EditorialCardsHero topGroups={metrics.topGroups} unitLabel={unitLabel} />

      <EditorialCardsKpiGrid kpis={kpis} />

      <EditorialCardsAnalytics
        scoreEvolution={metrics.scoreEvolutionByType}
        groupsByType={dashboardData.groupsByType}
        managementPerformance={metrics.averageScoreByManagement}
        sequenceDistribution={metrics.sequenceDistribution}
        recentActivity={metrics.recentActivity}
        bottomGroups={metrics.bottomGroups}
      />
    </div>
  )
}
