import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GroupsIcon, BarChartIcon, TrendUpIcon } from '@/assets/icons'
import { dashboardData } from '@/mocks/data'
import { useDashboardMetrics } from '../../use-dashboard-metrics'
import { EditorialCinemaHeader } from './editorial-cinema-header'
import { EditorialCinemaHero } from './editorial-cinema-hero'
import { EditorialCinemaKpiStrip } from './editorial-cinema-kpi-strip'
import { EditorialCinemaAnalytics } from './editorial-cinema-analytics'
import { ec } from './editorial-cinema-tokens'

interface VariantProps {
  unitLabel: string
}

export default function EditorialCinemaDashboard({ unitLabel }: VariantProps) {
  const metrics = useDashboardMetrics()

  const kpis = useMemo(
    () => [
      {
        id: 'totalGroups',
        label: 'Grupos ativos',
        value: `${metrics.totalGroups}`,
        Icon: GroupsIcon,
      },
      {
        id: 'avgScore',
        label: 'Nota média global',
        value: `${metrics.averageScore}%`,
        Icon: BarChartIcon,
      },
      {
        id: 'approval',
        label: 'Percentual acima da Meta',
        value: `${metrics.approvalRate}%`,
        Icon: TrendUpIcon,
      },
    ],
    [metrics],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-5"
    >
      <EditorialCinemaHero
        topGroups={metrics.topGroups}
        averageScore={metrics.averageScore}
        totalGroups={metrics.totalGroups}
      />

      <article
        className="rounded-3xl overflow-hidden"
        style={{
          background: ec.surface.canvas,
          border: `1px solid ${ec.surface.rule}`,
          boxShadow: '0 1px 0 rgba(16,55,52,0.04)',
        }}
      >
      <div className="px-6 md:px-10 lg:px-12 py-1">
        <EditorialCinemaHeader
          unitLabel={unitLabel}
          totalGroups={metrics.totalGroups}
          averageScore={metrics.averageScore}
          groupTypesCount={dashboardData.groupsByType.length}
        />

        <EditorialCinemaKpiStrip kpis={kpis} />

        <EditorialCinemaAnalytics
          scoreEvolution={metrics.scoreEvolutionByType}
          groupsByType={dashboardData.groupsByType}
          managementPerformance={metrics.averageScoreByManagement}
          sequenceDistribution={metrics.sequenceDistribution}
          recentActivity={metrics.recentActivity}
          bottomGroups={metrics.bottomGroups}
        />
      </div>

      <footer
        className="px-6 md:px-10 lg:px-12 py-5 border-t flex items-center justify-between flex-wrap gap-3"
        style={{ borderColor: ec.surface.rule, background: 'rgba(16,55,52,0.025)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="uppercase font-bold"
            style={{
              fontFamily: ec.font.sans,
              fontSize: ec.scale.kicker,
              letterSpacing: ec.letter.kicker,
              color: ec.accent.teal,
            }}
          >
            SUPERAR DIGITAL
          </span>
          <span className="w-px h-3" style={{ background: ec.surface.ruleStrong }} />
          <span
            className="uppercase"
            style={{
              fontFamily: ec.font.sans,
              fontSize: ec.scale.kicker,
              letterSpacing: ec.letter.kicker,
              color: ec.surface.inkMuted,
            }}
          >
            KAIZEN/TPM 4.0
          </span>
        </div>
        <div
          className="italic"
          style={{
            fontFamily: ec.font.body,
            fontSize: '11px',
            color: ec.surface.inkSubtle,
          }}
        >
          Edição executiva · publicado para a unidade {unitLabel}
        </div>
      </footer>
      </article>
    </motion.div>
  )
}
