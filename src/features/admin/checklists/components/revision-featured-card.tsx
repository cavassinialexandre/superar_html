import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, CopyIcon, TrashIcon, ListBulletIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { ChecklistRevision, QuestionGroup } from '@/types'

interface RevisionFeaturedCardProps {
  revision: ChecklistRevision
  questionGroups: QuestionGroup[]
  onManageQuestions: () => void
  onEdit: () => void
  onClone: () => void
  onDelete: () => void
}

function getGroupCounts(questions: ChecklistRevision['questions'], groups: QuestionGroup[]) {
  const counts: Record<string, number> = {}
  questions.forEach(q => {
    if (q.groupId) {
      counts[q.groupId] = (counts[q.groupId] || 0) + 1
    }
  })
  return groups
    .filter(g => counts[g.id])
    .map(g => ({ ...g, count: counts[g.id] }))
    .sort((a, b) => b.count - a.count)
}

export function RevisionFeaturedCard({
  revision,
  questionGroups,
  onManageQuestions,
  onEdit,
  onClone,
  onDelete,
}: RevisionFeaturedCardProps) {
  const questionCount = revision.questions.length
  const totalWeight = revision.questions.reduce((acc, q) => acc + q.weight, 0)
  const avgWeight = questionCount > 0 ? (totalWeight / questionCount).toFixed(1) : '0'
  const groupCounts = getGroupCounts(revision.questions, questionGroups)
  const formattedNumber = String(revision.revisionNumber).padStart(2, '0')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      whileHover={{ y: -4 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-white',
        'shadow-lg shadow-gray-900/5',
        'hover:shadow-xl hover:shadow-primary-900/10',
        'transition-shadow duration-300'
      )}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-200/50 via-amber-100/30 to-primary-200/50 p-[1px]">
        <div className="absolute inset-[1px] rounded-2xl bg-white" />
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400/10 via-amber-300/10 to-primary-400/10 rounded-2xl blur-xl opacity-50" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-mono font-bold text-primary-700 tracking-tighter">
              {formattedNumber}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Revisão</p>
              <p className="text-xs text-primary-600 mt-0.5">Ativa</p>
            </div>
          </div>
          <Badge
            variant="success"
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-[10px]"
          >
            Ativa
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{questionCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">Perguntas</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{totalWeight}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">Pontos</div>
          </div>
          <div className="bg-primary-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-primary-700">{avgWeight}</div>
            <div className="text-[10px] uppercase tracking-wider text-primary-600 mt-0.5">Média</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-700">{groupCounts.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-amber-600 mt-0.5">Grupos</div>
          </div>
        </div>

        {/* Group indicators */}
        {groupCounts.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {groupCounts.slice(0, 6).map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50"
                title={`${group.name}: ${group.count}`}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-[10px] font-medium text-gray-600">{group.count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {questionCount > 0 && (
          <div className="mb-5">
            <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100">
              {revision.questions.slice(0, 10).map((q, i) => (
                <div
                  key={q.id}
                  className="h-full"
                  style={{ 
                    width: `${(q.weight / totalWeight) * 100}%`,
                    backgroundColor: questionGroups.find(g => g.id === q.groupId)?.color || '#9CA3AF',
                    opacity: 0.5 + (i % 3) * 0.15
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onManageQuestions}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <ListBulletIcon size={16} />
            Ver Perguntas
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2.5 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <EditIcon size={16} />
            </button>
            <button
              onClick={onClone}
              className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <CopyIcon size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
