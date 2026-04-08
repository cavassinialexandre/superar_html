import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'
import { ScoreBadge } from '@/components/data-display/score-badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { Group } from '@/types'
import { cn } from '@/lib/cn'

interface GroupLeaderboardProps {
  topGroups: Group[]
  bottomGroups: Group[]
}

type Tab = 'top' | 'bottom'

export function GroupLeaderboard({ topGroups, bottomGroups }: GroupLeaderboardProps) {
  const [tab, setTab] = useState<Tab>('top')
  const data = tab === 'top' ? topGroups : bottomGroups

  return (
    <motion.div variants={staggerItem} className="lg:col-span-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Ranking de Grupos</CardTitle>
          <div className="flex items-center bg-gray-100/80 rounded-lg p-1 gap-0.5">
            {(['top', 'bottom'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'relative px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
                  tab === t ? 'text-primary-800' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {tab === t && (
                  <motion.div
                    layoutId="leaderboardTab"
                    className="absolute inset-0 bg-white rounded-md shadow-sm ring-1 ring-gray-200/60"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t === 'top' ? 'Top Performers' : 'Precisam de Atenção'}</span>
              </button>
            ))}
          </div>
        </CardHeader>
        <div className="space-y-2">
          {data.map((group, idx) => {
            const progress = Math.round((group.currentSequence / group.maxSequence) * 100)
            return (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                  tab === 'top'
                    ? idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                    : 'bg-rose-50 text-rose-600'
                )}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{group.name}</p>
                  <div className="mt-1.5">
                    <ProgressBar value={progress} size="xs" variant="primary" />
                  </div>
                </div>
                <ScoreBadge score={group.lastAuditScore ?? 0} size="sm" />
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
