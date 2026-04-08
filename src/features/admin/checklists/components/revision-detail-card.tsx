import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, CopyIcon, TrashIcon, ListBulletIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { ChecklistRevision } from '@/types'

interface RevisionDetailCardProps {
  revision: ChecklistRevision
  onManageQuestions: () => void
  onEdit: () => void
  onClone: () => void
  onDelete: () => void
  index?: number
}

export function RevisionDetailCard({
  revision,
  onManageQuestions,
  onEdit,
  onClone,
  onDelete,
  index = 0,
}: RevisionDetailCardProps) {
  const questionCount = revision.questions.length
  const isActive = revision.status === 'active'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-xl border p-3.5 transition-all duration-200',
        'bg-white border-gray-200 hover:border-primary-300 hover:shadow-sm',
        !isActive && 'opacity-70 bg-gray-50/50'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Badge de Revisão com gradiente */}
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-br text-sm font-bold shadow-sm',
            isActive
              ? 'from-primary-100 to-primary-50 text-primary-700'
              : 'from-gray-200 to-gray-100 text-gray-500'
          )}
        >
          <span className="text-xs font-medium opacity-70 mr-0.5">#</span>
          {revision.revisionNumber}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Revisão {revision.revisionNumber}
            </h4>
            <Badge
              variant={isActive ? 'success' : 'default'}
              size="sm"
              className="text-[10px] px-1.5 py-0"
            >
              {isActive ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>

          {/* Meta info */}
          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-gray-700">{questionCount}</span>
              <span>pergunta{questionCount !== 1 && 's'}</span>
            </span>
            {questionCount > 0 && (
              <span className="text-gray-300">|</span>
            )}
            {questionCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">
                  {revision.questions.reduce((acc, q) => acc + q.weight, 0)}
                </span>
                <span>pontos</span>
              </span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1">
          {/* Gerenciar Perguntas - Botão Principal */}
          <button
            onClick={onManageQuestions}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              'bg-primary-50 text-primary-700 hover:bg-primary-100',
              'border border-primary-200 hover:border-primary-300'
            )}
            title="Gerenciar Perguntas"
          >
            <ListBulletIcon size={14} />
            <span className="hidden sm:inline">Perguntas</span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Editar */}
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
            title="Editar revisão"
          >
            <EditIcon size={14} />
          </button>

          {/* Clonar */}
          <button
            onClick={onClone}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Clonar revisão"
          >
            <CopyIcon size={14} />
          </button>

          {/* Deletar */}
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Deletar revisão"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
