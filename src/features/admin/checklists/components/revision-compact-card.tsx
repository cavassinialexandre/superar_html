import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, CopyIcon, TrashIcon, ListBulletIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { ChecklistRevision } from '@/types'

interface RevisionCompactCardProps {
  revision: ChecklistRevision
  onManageQuestions: () => void
  onEdit: () => void
  onClone: () => void
  onDelete: () => void
  index?: number
}

export function RevisionCompactCard({
  revision,
  onManageQuestions,
  onEdit,
  onClone,
  onDelete,
  index = 0,
}: RevisionCompactCardProps) {
  const questionCount = revision.questions.length
  const totalWeight = revision.questions.reduce((acc, q) => acc + q.weight, 0)
  const isActive = revision.status === 'active'
  const formattedNumber = String(revision.revisionNumber).padStart(2, '0')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 100, damping: 15 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className={cn(
        'group relative rounded-xl overflow-hidden',
        'bg-white',
        'border border-gray-100',
        'shadow-sm',
        'hover:shadow-md hover:border-gray-200',
        'transition-all duration-200',
        !isActive && 'opacity-80'
      )}
    >
      <div className="p-4">
        {/* Header compact */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              'text-3xl font-mono font-bold tracking-tighter',
              isActive ? 'text-primary-600' : 'text-gray-300'
            )}>
              {formattedNumber}
            </span>
            {isActive && (
              <Badge
                variant="success"
                size="sm"
                className="text-[9px] px-1.5 py-0"
              >
                Ativa
              </Badge>
            )}
          </div>
        </div>

        {/* Simple stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{questionCount}</div>
            <div className="text-[9px] uppercase tracking-wider text-gray-400">perguntas</div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{totalWeight}</div>
            <div className="text-[9px] uppercase tracking-wider text-gray-400">pontos</div>
          </div>
        </div>

        {/* Compact progress */}
        {questionCount > 0 && (
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div 
              className={cn(
                'h-full rounded-full',
                isActive ? 'bg-primary-400' : 'bg-gray-300'
              )}
              style={{ width: '60%' }}
            />
          </div>
        )}

        {/* Actions - minimal */}
        <div className="flex items-center gap-1 pt-3 border-t border-gray-50">
          <button
            onClick={onManageQuestions}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            )}
          >
            <ListBulletIcon size={12} />
            Ver
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <EditIcon size={12} />
          </button>
          <button
            onClick={onClone}
            className="p-1.5 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <CopyIcon size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <TrashIcon size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
