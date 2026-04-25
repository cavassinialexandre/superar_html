import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { ScoreBadge } from '@/components/data-display/score-badge'
import { SequenceProgress } from '@/components/data-display/sequence-progress'
import { AuditIcon, FollowupIcon, HistoryIcon, GroupsIcon } from '@/assets/icons'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import type { Group } from '@/types'

export type ViewMode = 'cards' | 'table'

export function getTypeBadgeVariant(typeName: string) {
  if (typeName === 'Operacional') return 'primary' as const
  if (typeName === '5S') return 'success' as const
  return 'info' as const
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export function GroupActions({ group }: { group: Group }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => { e.stopPropagation(); navigate({ to: '/evaluation/$groupId', params: { groupId: group.id }, search: { type: 'audit' } }) }}
        className="p-1.5 rounded-md text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all cursor-pointer"
        title="Aplicar Auditoria"
      >
        <AuditIcon size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); navigate({ to: '/evaluation/$groupId', params: { groupId: group.id }, search: { type: 'followup' } }) }}
        className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all cursor-pointer"
        title="Aplicar Follow-up"
      >
        <FollowupIcon size={16} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); navigate({ to: '/history', search: ((prev: Record<string, unknown>) => ({ ...prev, groupId: group.id })) as never }) }}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
        title="Ver Histórico"
      >
        <HistoryIcon size={16} />
      </button>
    </div>
  )
}

export function GroupCardGrid({ groups, onGroupClick }: { groups: Group[]; onGroupClick: (id: string) => void }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {groups.map((group) => (
        <motion.div key={group.id} variants={staggerItem}>
          <Card
            hover
            className="group"
            onClick={() => onGroupClick(group.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-base font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {group.managementName} — {group.areaName}
                </p>
              </div>
              <Badge variant={getTypeBadgeVariant(group.groupTypeName)}>
                {group.groupTypeName}
              </Badge>
            </div>

            <div className="flex items-center justify-between mb-4">
              <SequenceProgress current={group.currentSequence} max={group.maxSequence} size="sm" />
              {group.lastAuditScore !== undefined && (
                <ScoreBadge score={group.lastAuditScore} size="sm" />
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Ultima: {formatDate(group.lastEvaluationDate)}
              </span>
              <GroupActions group={group} />
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export function GroupsTable({ groups: data, onRowClick }: { groups: Group[]; onRowClick: (id: string) => void }) {
  return (
    <Card className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200/60">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Grupo</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Tipo</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Progresso</th>
              <th className="text-center px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Nota</th>
              <th className="text-left px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Última Avaliação</th>
              <th className="text-center px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Equipe</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group, index) => (
              <motion.tr
                key={group.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
                onClick={() => onRowClick(group.id)}
                className="border-b border-gray-100 last:border-0 hover:bg-primary-50/30 transition-colors duration-150 cursor-pointer group"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {group.managementName} — {group.areaName}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge variant={getTypeBadgeVariant(group.groupTypeName)}>
                    {group.groupTypeName}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <SequenceProgress current={group.currentSequence} max={group.maxSequence} size="sm" />
                </td>
                <td className="px-4 py-4 text-center">
                  {group.lastAuditScore !== undefined ? (
                    <ScoreBadge score={group.lastAuditScore} size="sm" />
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">{formatDate(group.lastEvaluationDate)}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <GroupsIcon size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">{group.team.length}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <GroupActions group={group} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
