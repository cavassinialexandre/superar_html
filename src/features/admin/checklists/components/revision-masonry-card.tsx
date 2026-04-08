import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, CopyIcon, TrashIcon, ListBulletIcon, SparklesIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { ChecklistRevision, QuestionGroup } from '@/types'

interface RevisionMasonryCardProps {
  revision: ChecklistRevision
  questionGroups: QuestionGroup[]
  onManageQuestions: () => void
  onEdit: () => void
  onClone: () => void
  onDelete: () => void
  index?: number
  isFeatured?: boolean // Se é o card em destaque (revisão ativa)
}

// Agrupa perguntas por grupo e conta
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
    .slice(0, 4) // Máximo 4 grupos
}

export function RevisionMasonryCard({
  revision,
  questionGroups,
  onManageQuestions,
  onEdit,
  onClone,
  onDelete,
  index = 0,
  isFeatured = false,
}: RevisionMasonryCardProps) {
  const questionCount = revision.questions.length
  const isActive = revision.status === 'active'
  const totalWeight = revision.questions.reduce((acc, q) => acc + q.weight, 0)
  const groupCounts = getGroupCounts(revision.questions, questionGroups)
  
  // Formata número com zero à esquerda (01, 02, 03...)
  const formattedNumber = String(revision.revisionNumber).padStart(2, '0')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'group relative rounded-2xl overflow-hidden transition-all duration-500',
        'border',
        isFeatured 
          ? 'col-span-2 row-span-1' 
          : 'col-span-1',
        isActive
          ? cn(
              'bg-gradient-to-br from-white via-white to-primary-50/30',
              'border-primary-200/60',
              'shadow-xl shadow-primary-900/10',
              'backdrop-blur-sm'
            )
          : cn(
              'bg-white',
              'border-gray-200/80',
              'shadow-lg shadow-gray-900/5',
              'hover:border-gray-300',
              'hover:shadow-xl hover:shadow-gray-900/10'
            )
      )}
    >
      {/* Gradient border effect para ativo */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary-300/50 via-amber-200/30 to-primary-300/50 pointer-events-none" />
      )}
      
      {/* Glow effect para ativo */}
      {isActive && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400/20 via-amber-300/20 to-primary-400/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 -z-10" />
      )}

      <div className={cn('relative', isFeatured ? 'p-6' : 'p-5')}>
        {/* Header com número grande estilo editorial */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-baseline gap-3">
            {/* Número grande estilo editorial */}
            <span 
              className={cn(
                'font-mono font-bold tracking-tighter leading-none',
                isFeatured ? 'text-5xl' : 'text-4xl',
                isActive 
                  ? 'text-primary-700' 
                  : 'text-gray-300'
              )}
            >
              {formattedNumber}
            </span>
            <div className="flex flex-col">
              <span className={cn(
                'text-sm font-medium uppercase tracking-wider',
                isActive ? 'text-primary-700' : 'text-gray-600'
              )}>
                Revisão
              </span>
              {isActive && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium mt-0.5">
                  <SparklesIcon size={12} />
                  Ativa
                </span>
              )}
            </div>
          </div>

          {/* Badge de status */}
          <Badge
            variant={isActive ? 'success' : 'default'}
            size="sm"
            className={cn(
              'text-[10px] px-2 py-0.5 rounded-full',
              isActive && 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
            )}
          >
            {isActive ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>

        {/* Mini Dashboard Grid */}
        <div className={cn(
          'grid gap-3 mb-4',
          isFeatured ? 'grid-cols-4' : 'grid-cols-2'
        )}>
          {/* Estatística: Perguntas */}
          <div className={cn(
            'rounded-xl p-3 text-center',
            'bg-gradient-to-br from-gray-50 to-white',
            'border border-gray-100'
          )}>
            <div className="text-xl font-bold text-gray-800">{questionCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              Perguntas
            </div>
          </div>

          {/* Estatística: Pontos */}
          <div className={cn(
            'rounded-xl p-3 text-center',
            'bg-gradient-to-br from-gray-50 to-white',
            'border border-gray-100'
          )}>
            <div className="text-xl font-bold text-gray-800">{totalWeight}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              Pontos
            </div>
          </div>

          {/* Estatística: Média (apenas em featured) */}
          {isFeatured && (
            <div className={cn(
              'rounded-xl p-3 text-center',
              'bg-gradient-to-br from-primary-50 to-white',
              'border border-primary-100'
            )}>
              <div className="text-xl font-bold text-primary-700">
                {questionCount > 0 ? Math.round(totalWeight / questionCount) : 0}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-primary-600 font-medium">
                Média
              </div>
            </div>
          )}

          {/* Estatística: Grupos (apenas em featured) */}
          {isFeatured && (
            <div className={cn(
              'rounded-xl p-3 text-center',
              'bg-gradient-to-br from-amber-50 to-white',
              'border border-amber-100'
            )}>
              <div className="text-xl font-bold text-amber-700">{groupCounts.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-amber-600 font-medium">
                Grupos
              </div>
            </div>
          )}
        </div>

        {/* Indicadores de grupos (cores) */}
        {groupCounts.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Grupos:</span>
            <div className="flex items-center gap-1.5">
              {groupCounts.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100"
                  title={`${group.name}: ${group.count} perguntas`}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="text-[10px] font-medium text-gray-600">{group.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barra de progresso visual (distribuição de pesos) */}
        {questionCount > 0 && (
          <div className="mb-4">
            <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100">
              {revision.questions.slice(0, 8).map((q, i) => (
                <div
                  key={q.id}
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${(q.weight / totalWeight) * 100}%`,
                    backgroundColor: questionGroups.find(g => g.id === q.groupId)?.color || '#9CA3AF',
                    opacity: 0.6 + (i % 3) * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {/* Gerenciar Perguntas - Principal */}
          <button
            onClick={onManageQuestions}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              'flex-1 justify-center',
              isActive
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 hover:scale-[1.02]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <ListBulletIcon size={14} />
            Perguntas
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Ações secundárias */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
              title="Editar"
            >
              <EditIcon size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClone}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title="Clonar"
            >
              <CopyIcon size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Deletar"
            >
              <TrashIcon size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
