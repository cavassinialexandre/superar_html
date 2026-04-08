import { useParams, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { Button } from '@/components/ui'
import { groups, groupAnalytics, questionGroups } from '@/mocks/data'
import { HeroSection, CardsLayout, HistoryCardV10 } from './components'

// ============================================================================
// ICONES
// ============================================================================

const Icons = {
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function GroupDetailPage() {
  const { groupId } = useParams({ strict: false })
  const navigate = useNavigate()
  const group = groups.find((g) => g.id === groupId)
  const analytics = group ? groupAnalytics[group.id] : null

  if (!group) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-gray-400">Grupo não encontrado.</p>
          <Button variant="ghost" onClick={() => navigate({ to: '/groups' })} className="mt-4">Voltar</Button>
        </div>
      </PageContainer>
    )
  }

  const questionGroupData = analytics
    ? Object.entries(analytics.answersByGroup).map(([groupId, data]) => {
        const qGroup = questionGroups.find(g => g.id === groupId)
        return {
          groupId,
          groupName: qGroup?.name || 'Desconhecido',
          compliance: Math.round((data.yes / data.total) * 100),
          color: qGroup?.color,
        }
      })
    : []

  const handleAudit = () => {
    navigate({
      to: '/evaluation/$groupId',
      params: { groupId: group.id },
      search: { type: 'audit' },
    })
  }

  const handleFollowup = () => {
    navigate({
      to: '/evaluation/$groupId',
      params: { groupId: group.id },
      search: { type: 'followup' },
    })
  }

  return (
    <PageContainer>
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate({ to: '/groups' })}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-4 transition-colors cursor-pointer"
      >
        <Icons.ChevronLeft /> Voltar aos grupos
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Hero */}
        {analytics && (
          <HeroSection
            group={group}
            analytics={analytics}
            onAudit={handleAudit}
            onFollowup={handleFollowup}
          />
        )}

        {/* Cards: Team sidebar + Charts */}
        {analytics && (
          <CardsLayout
            team={group.team}
            analytics={analytics}
            scoreEvolutionData={analytics.scoreEvolution}
            questionGroupData={questionGroupData}
            questionGroups={questionGroups}
          />
        )}

        {/* History */}
        {analytics && (
          <HistoryCardV10 events={analytics.timelineEvents} />
        )}
      </motion.div>

      <div className="h-20" />
    </PageContainer>
  )
}
