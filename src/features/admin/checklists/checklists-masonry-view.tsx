import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MinimalTimeline } from './components/minimal-timeline'
import { RevisionFeaturedCard } from './components/revision-featured-card'
import { RevisionCompactCard } from './components/revision-compact-card'
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

interface ChecklistsMasonryViewProps {
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

export function ChecklistsMasonryView({
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
}: ChecklistsMasonryViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [cloneModalOpen, setCloneModalOpen] = useState(false)
  const [selectedChecklistForClone, setSelectedChecklistForClone] = useState<Checklist | null>(null)

  const filteredChecklists = useMemo(() => {
    if (!searchQuery) return checklists
    return checklists.filter(cl =>
      cl.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [checklists, searchQuery])

  const handleOpenNewRevision = (checklist: Checklist) => {
    setSelectedChecklistForClone(checklist)
    setCloneModalOpen(true)
  }

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
          <p className="text-sm text-gray-400 mt-1">Crie um novo checklist para começar</p>
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

          const sortedRevisions = [...checklist.revisions].sort((a, b) => b.revisionNumber - a.revisionNumber)
          const activeRevisionIndex = sortedRevisions.findIndex(r => r.status === 'active')

          return (
            <motion.div
              key={checklist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: checklistIndex * 0.1 }}
            >
              <Card className={cn('overflow-hidden', !isActive && 'opacity-70')}>
                {/* Header */}
                <div 
                  onClick={() => setExpandedId(expandedId === checklist.id ? null : checklist.id)}
                  className="px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      isActive ? 'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'
                    )}>
                      <FileCheckIcon size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{checklist.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><LayersIcon size={14} />{revisionCount} revisões</span>
                        <span>•</span>
                        <span>{totalQuestions} perguntas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusTag active={isActive} onChange={() => onToggleStatus(checklist.id)} />
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditChecklist(checklist) }}
                        className="p-2 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === checklist.id ? null : checklist.id) }}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                      >
                        <ChevronDownIcon size={18} className={cn('transform transition-transform duration-300', isExpanded && 'rotate-180')} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Masonry Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 bg-gray-50/30">
                        <div className="p-6">
                          {/* Timeline Minimalista */}
                          {sortedRevisions.length > 1 && (
                            <div className="mb-6">
                              <MinimalTimeline 
                                total={sortedRevisions.length} 
                                current={activeRevisionIndex >= 0 ? activeRevisionIndex : 0}
                              />
                            </div>
                          )}

                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Revisões</h4>
                              <p className="text-xs text-gray-500 mt-0.5">Grid masonry com revisão ativa em destaque</p>
                            </div>
                            <Button size="sm" variant="secondary" onClick={() => handleOpenNewRevision(checklist)}>
                              <PlusIcon size={14} className="mr-1" />
                              Nova Revisão
                            </Button>
                          </div>

                          {/* Masonry Grid */}
                          {sortedRevisions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {sortedRevisions.map((revision, index) => {
                                const isFeatured = index === 0 // Primeira é a featured
                                
                                if (isFeatured) {
                                  return (
                                    <div key={revision.id} className="md:col-span-2">
                                      <RevisionFeaturedCard
                                        revision={revision}
                                        questionGroups={questionGroups}
                                        onManageQuestions={() => onManageQuestions(checklist.id, revision)}
                                        onEdit={() => onEditRevision(revision)}
                                        onClone={() => onDeleteRevision(revision)}
                                        onDelete={() => onDeleteRevision(revision)}
                                      />
                                    </div>
                                  )
                                }
                                
                                return (
                                  <RevisionCompactCard
                                    key={revision.id}
                                    revision={revision}
                                    onManageQuestions={() => onManageQuestions(checklist.id, revision)}
                                    onEdit={() => onEditRevision(revision)}
                                    onClone={() => onDeleteRevision(revision)}
                                    onDelete={() => onDeleteRevision(revision)}
                                    index={index}
                                  />
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                              <p className="text-sm text-gray-500 mb-1">Nenhuma revisão cadastrada</p>
                              <Button size="sm" variant="ghost" onClick={() => handleOpenNewRevision(checklist)}>
                                <PlusIcon size={14} className="mr-1" />
                                Adicionar primeira revisão
                              </Button>
                            </div>
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

      <CloneRevisionModal
        isOpen={cloneModalOpen}
        onClose={() => { setCloneModalOpen(false); setSelectedChecklistForClone(null) }}
        onConfirm={handleConfirmNewRevision}
        revisions={selectedChecklistForClone?.revisions || []}
        checklistName={selectedChecklistForClone?.name || ''}
      />
    </div>
  )
}
