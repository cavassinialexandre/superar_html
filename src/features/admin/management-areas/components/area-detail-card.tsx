import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, MoreVerticalIcon, FactoryIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Area } from '@/types'

interface AreaDetailCardProps {
  area: Area & {
    groupCount?: number
    lastEvaluationScore?: number
    lastEvaluationDate?: string
  }
  onEdit: () => void
  index?: number
}

export function AreaDetailCard({ area, onEdit, index = 0 }: AreaDetailCardProps) {
  const isActive = area.status === 'active'
  const hasData = area.groupCount !== undefined && area.groupCount > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-xl border p-4 transition-all duration-200',
        isActive
          ? 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
          : 'bg-gray-50/50 border-gray-100 hover:border-gray-200'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar/Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
            isActive
              ? 'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600'
              : 'bg-gray-100 text-gray-400'
          )}
        >
          <FactoryIcon size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-semibold text-sm truncate',
            isActive ? 'text-gray-900' : 'text-gray-500'
          )}>
            {area.name}
          </h4>

          {/* Stats row */}
          {hasData && (
            <div className="mt-0.5 text-xs text-gray-500">
              <span>{area.groupCount} grupo{area.groupCount !== 1 && 's'}</span>
            </div>
          )}
        </div>

        {/* Status Badge - Right side */}
        <div className="flex items-center gap-2">
          <Badge
            variant={isActive ? 'success' : 'default'}
            size="sm"
          >
            {isActive ? 'Ativa' : 'Inativa'}
          </Badge>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
              title="Editar área"
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
      </div>
    </motion.div>
  )
}
