import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { motion } from 'framer-motion'
import { staggerItem } from '@/design-system/animations'
import { ScoreBadge } from '@/components/data-display/score-badge'
import type { Evaluation } from '@/types'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AuditIcon, FollowupIcon } from '@/assets/icons'

interface ActivityTimelineProps {
  data: Evaluation[]
}

export function ActivityTimeline({ data }: ActivityTimelineProps) {
  return (
    <motion.div variants={staggerItem} className="lg:col-span-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Últimas avaliações</span>
        </CardHeader>
        <div className="relative pl-3">
          {/* Vertical dashed line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px border-l border-dashed border-gray-200" />
          <div className="space-y-4">
            {data.map((ev, idx) => {
              const isAudit = ev.type === 'audit'
              const dateLabel = formatDistanceToNow(parseISO(ev.date), { addSuffix: true, locale: ptBR })
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative flex items-start gap-4"
                >
                  <div
                    className={
                      'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ' +
                      (isAudit ? 'bg-primary-500 text-white' : 'bg-blue-400 text-white')
                    }
                  >
                    {isAudit ? <AuditIcon size={14} /> : <FollowupIcon size={14} />}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800 truncate">{ev.groupName}</span>
                      <Badge variant={isAudit ? 'primary' : 'info'} className="text-[10px] px-1.5 py-0">
                        {isAudit ? 'Auditoria' : 'Follow-up'}
                      </Badge>
                      {ev.advancedSequence && (
                        <Badge variant="success" dot className="text-[10px] px-1.5 py-0">Avançou</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <ScoreBadge score={ev.score} size="sm" />
                      <span className="text-xs text-gray-400">{ev.applicantName}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-xs text-gray-400">{dateLabel}</span>
                    </div>
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
