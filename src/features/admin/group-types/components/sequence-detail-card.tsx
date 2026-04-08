import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, MoreVerticalIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Sequence } from '@/types'

interface SequenceDetailCardProps {
  sequence: Sequence
  defaultGoal: number
  onEdit: () => void
  index?: number
}

export function SequenceDetailCard({
  sequence,
  defaultGoal,
  onEdit,
  index = 0,
}: SequenceDetailCardProps) {
  const goal = sequence.useDefaultGoal ? defaultGoal : sequence.customGoal

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-xl border p-4 transition-all duration-200',
        'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar/Number */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700',
            'text-sm font-bold'
          )}
        >
          {sequence.number}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {sequence.checklistName}
          </h4>

          {/* Meta info */}
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <span>Meta: <strong className="text-gray-700">{goal}%</strong></span>
            {!sequence.useDefaultGoal && (
              <Badge variant="primary" size="sm">Customizada</Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
            title="Editar sequência"
          >
            <EditIcon size={14} />
          </button>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            title="Mais opções"
          >
            <MoreVerticalIcon size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
