import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TimelineConnector } from './components/timeline-connector'
import { RevisionMasonryCard } from './components/revision-masonry-card'
import { CloneRevisionModal } from './components/clone-revision-modal'
import {
  PlusIcon,
  EditIcon,
  ChevronDownIcon,
  LayersIcon,
} from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Checklist, ChecklistRevision } from '@/types'
import { questionGroups } from '@/mocks/data'

interface ChecklistsTimelineViewProps {
  checklists: Checklist[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddChecklist: () => void
  onEditChecklist: (checklist: Checklist) => void
  onToggleStatus: (checklistId: string) => void
  onManageQuestions: (checklistId: string, revision: ChecklistRevision) => void
  onAddRevision: (checklistId: string, cloneFromRevisionId?: string) => void
  onEditRevision: (revision: ChecklistRevision) => void
  onDeleteRevision: (revision: ChecklistRevision) => void
}

// Ícone de arquivo/documento para checklists
function FileCheckIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  )
}

export function ChecklistsTimelineView({
  checklists,
  searchQuery,
  onSearchChange,
  onAddChecklist,
  onEditChecklist,
  onToggleStatus,
  onManageQuestions,
  onAddRevision,
  onEditRevision,
  onDeleteRevision,
}: ChecklistsTimelineViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [cloneModalOpen, setCloneModalOpen] = useState(false)
  const [selectedChecklistForClone, setSelectedChecklistForClone] = useState<Checklist | null>(null)

  // Filtra por busca
  const filteredChecklists = useMemo(() => {
    if (!searchQuery) return checklists
    return checklists.filter(cl =>
      cl.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [checklists, searchQuery])

  // Handler para abrir modal de nova revisão
  const handleOpenNewRevision = (checklist: Checklist) => {
    setSelectedChecklistForClone(checklist)
    setCloneModalOpen(true)
  }

  // Handler para confirmar criação de revisão
  const handleConfirmNewRevision = (cloneFromRevisionId?: string) => {
    if (selectedChecklistForClone) {
      onAddRevision(selectedChecklistForClone.id, cloneFromRevisionId)
    }
    setCloneModalOpen(false)
    setSelectedChecklistForClone(null)
  }

  if (checklists.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 justify-end">
          <SearchInput
            placeholder="Buscar checklist..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-72"
          />
          <Button variant="premium" onClick={onAddChecklist}>
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Novo Checklist</span>
          </Button>
        </div>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheckIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum checklist encontrado</p>
          <p className="text-sm text-gray-400 mt-1">
            Crie um novo checklist para começar
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 justify-end">
        <SearchInput
          placeholder="Buscar checklist..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          className="w-72"
        />
        <Button variant="premium" onClick={onAddChecklist}>
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Novo Checklist</span>
        </Button>
      </div>

      {/* Lista de Checklists */}
      <div className="space-y-4">
        {filteredChecklists.map((checklist, checklistIndex) => {
          const revisionCount = checklist.revisions.length
          const totalQuestions = checklist.revisions.reduce((acc, r) => acc + r.questions.length, 0)
          const isActive = checklist.status === 'active'
          const isExpanded = expandedId === checklist.id

          // Encontrar índice da revisão ativa (para timeline)
          const sortedRevisions = [...checklist.revisions].sort((a, b) => b.revisionNumber - a.revisionNumber)
          const activeRevisionIndex = sortedRevisions.findIndex(r => r.status === 'active')

          return (
            <motion.div
              key={checklist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: checklistIndex * 0.1 }}
              className="relative"
            >
              {/* Card Principal do Checklist */}
              <Card
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  !isActive && 'opacity-70'
                )}
              >
                {/* Header do Checklist */}
                <div 
                  onClick={() => setExpandedId(expandedId === checklist.id ? null : checklist.id)}
                  className="px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Ícone */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isActive
                          ? 'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <FileCheckIcon size={24} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {checklist.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <LayersIcon size={14} />
                          {revisionCount} revisões
                        </span>
                        <span>•</span>
                        <span>{totalQuestions} perguntas</span>
                      </div>
                    </div>

                    {/* Status e Ações */}
                    <div className="flex items-center gap-3">
                      <StatusTag active={isActive} onChange={() => onToggleStatus(checklist.id)} />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditChecklist(checklist)
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      >
                        <EditIcon size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedId(expandedId === checklist.id ? null : checklist.id)
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                      >
                        <ChevronDownIcon
                          size={18}
                          className={cn(
                            'transform transition-transform duration-300',
                            isExpanded ? 'rotate-180' : ''
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conteúdo Expandido - Timeline + Masonry */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
                        <div className="p-6">
                          {/* Header das Revisões */}
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Histórico de Revisões
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Timeline de evolução do checklist
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => handleOpenNewRevision(checklist)}
                            >
                              <PlusIcon size={14} className="mr-1" />
                              Nova Revisão
                            </Button>
                          </div>

                          {/* Layout Timeline + Masonry */}
                          {sortedRevisions.length > 0 ? (
                            <div className="flex gap-6">
                              {/* Timeline (lado esquerdo) */}
                              <div className="flex-shrink-0 pt-4 pb-8">
                                <TimelineConnector 
                                  itemCount={sortedRevisions.length}
                                  activeIndex={activeRevisionIndex >= 0 ? activeRevisionIndex : 0}
                                />
                              </div>

                              {/* Grid Masonry (lado direito) */}
                              <div className="flex-1 min-w-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {sortedRevisions.map((revision, index) => (
                                    <RevisionMasonryCard
                                      key={revision.id}
                                      revision={revision}
                                      questionGroups={questionGroups}
                                      onManageQuestions={() => onManageQuestions(checklist.id, revision)}
                                      onEdit={() => onEditRevision(revision)}
                                      onClone={() => onDeleteRevision(revision)}
                                      onDelete={() => onDeleteRevision(revision)}
                                      index={index}
                                      isFeatured={index === 0} // Primeira (mais recente) é featured
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <PlusIcon size={20} className="text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500 mb-1">Nenhuma revisão cadastrada</p>
                              <p className="text-xs text-gray-400 mb-3">
                                Adicione a primeira revisão para este checklist
                              </p>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleOpenNewRevision(checklist)}
                              >
                                <PlusIcon size={14} className="mr-1" />
                                Adicionar primeira revisão
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Modal de Clonagem */}
      <CloneRevisionModal
        isOpen={cloneModalOpen}
        onClose={() => {
          setCloneModalOpen(false)
          setSelectedChecklistForClone(null)
        }}
        onConfirm={handleConfirmNewRevision}
        revisions={selectedChecklistForClone?.revisions || []}
        checklistName={selectedChecklistForClone?.name || ''}
      />
    </div>
  )
}
