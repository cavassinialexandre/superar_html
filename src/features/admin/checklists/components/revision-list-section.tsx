import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { PlusIcon } from '@/assets/icons'
import { RevisionDetailCard } from './revision-detail-card'
import type { ChecklistRevision } from '@/types'

interface RevisionListSectionProps {
  revisions: ChecklistRevision[]
  checklistName: string
  checklistId: string
  onAddRevision: () => void
  onEditRevision: (revision: ChecklistRevision) => void
  onCloneRevision: (revision: ChecklistRevision) => void
  onDeleteRevision: (revision: ChecklistRevision) => void
  onManageQuestions: (revision: ChecklistRevision) => void
}

export function RevisionListSection({
  revisions,
  checklistName,
  checklistId,
  onAddRevision,
  onEditRevision,
  onCloneRevision,
  onDeleteRevision,
  onManageQuestions,
}: RevisionListSectionProps) {
  const hasRevisions = revisions.length > 0
  
  // Ordenar revisões por número (decrescente - mais recente primeiro)
  const sortedRevisions = [...revisions].sort((a, b) => b.revisionNumber - a.revisionNumber)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Revisões
          </h5>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasRevisions
              ? `${revisions.length} revisão${revisions.length !== 1 ? 'es' : ''} cadastrada${revisions.length !== 1 ? 's' : ''}`
              : `Nenhuma revisão cadastrada em ${checklistName}`
            }
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onAddRevision}>
          <PlusIcon size={14} className="mr-1" />
          Nova Revisão
        </Button>
      </div>

      {/* Lista de Revisões */}
      {hasRevisions ? (
        <div className="grid gap-2.5">
          {sortedRevisions.map((revision, index) => (
            <RevisionDetailCard
              key={revision.id}
              revision={revision}
              onManageQuestions={() => onManageQuestions(revision)}
              onEdit={() => onEditRevision(revision)}
              onClone={() => onCloneRevision(revision)}
              onDelete={() => onDeleteRevision(revision)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <PlusIcon size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Nenhuma revisão cadastrada</p>
          <p className="text-xs text-gray-400 mb-3">
            Adicione a primeira revisão para este checklist
          </p>
          <Button size="sm" variant="ghost" onClick={onAddRevision}>
            <PlusIcon size={14} className="mr-1" />
            Adicionar primeira revisão
          </Button>
        </motion.div>
      )}
    </div>
  )
}
