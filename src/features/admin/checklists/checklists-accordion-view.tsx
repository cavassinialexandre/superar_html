import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AccordionCard } from '@/features/admin/components/accordion-card'
import { RevisionListSection } from './components/revision-list-section'
import { CloneRevisionModal } from './components/clone-revision-modal'
import {
  PlusIcon,
  EditIcon,
  ChevronDownIcon,
} from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Checklist, ChecklistRevision } from '@/types'

interface ChecklistsAccordionViewProps {
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
  onCloneRevisionTrigger: (revision: ChecklistRevision) => void
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

export function ChecklistsAccordionView({
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
  onCloneRevisionTrigger,
}: ChecklistsAccordionViewProps) {
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
        {/* Header minimalista */}
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
    <div className="space-y-1">
      {/* Header minimalista */}
      <div className="flex items-center gap-3 mb-4 justify-end">
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

      {/* Header da lista */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-6">Checklist</div>
        <div className="col-span-3 text-center">Revisões</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-2">Ações</div>
      </div>

      {/* Lista de checklists */}
      {filteredChecklists.map((checklist, index) => {
        const revisionCount = checklist.revisions.length
        const totalQuestions = checklist.revisions.reduce((acc, r) => acc + r.questions.length, 0)
        const isActive = checklist.status === 'active'
        const isExpanded = expandedId === checklist.id

        return (
          <motion.div
            key={checklist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AccordionCard
              id={checklist.id}
              isActive={isActive}
              isExpanded={isExpanded}
              onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
              showChevron={false}
              header={
                <>
                  {/* Col 1: Nome (6 cols) */}
                  <div className="col-span-12 sm:col-span-6 flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isActive
                          ? 'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <FileCheckIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate block">
                        {checklist.name}
                      </span>
                      <span className="mt-0.5 md:hidden">
                        <StatusTag active={isActive} onChange={() => onToggleStatus(checklist.id)} />
                      </span>
                    </div>
                  </div>

                  {/* Col 2: Qtd de Revisões (3 cols) */}
                  <div className="col-span-4 sm:col-span-3 text-center">
                    <span className="text-sm font-bold text-gray-700">
                      {revisionCount}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      revisão{revisionCount !== 1 ? 'es' : ''}
                    </span>
                  </div>

                  {/* Col 3: Status (1 col) */}
                  <div className="col-span-4 sm:col-span-1 flex justify-center">
                    <StatusTag active={isActive} onChange={() => onToggleStatus(checklist.id)} />
                  </div>

                  {/* Col 4: Ações Rápidas (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-1">
                    {/* Editar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditChecklist(checklist)
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Editar Checklist"
                    >
                      <EditIcon size={14} />
                    </button>
                    {/* Expandir/Colapsar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === checklist.id ? null : checklist.id)
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                      title={isExpanded ? 'Recolher' : 'Expandir'}
                    >
                      <ChevronDownIcon
                        size={16}
                        className={cn(
                          'transform transition-transform duration-200',
                          isExpanded ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                  </div>
                </>
              }
            >
              {/* Conteúdo expandido: Lista de Revisões */}
              <div className="px-4 pb-5 pt-2">
                <div className="pt-4 border-t border-gray-100">
                  <RevisionListSection
                    revisions={checklist.revisions}
                    checklistName={checklist.name}
                    checklistId={checklist.id}
                    onAddRevision={() => handleOpenNewRevision(checklist)}
                    onEditRevision={onEditRevision}
                    onCloneRevision={onCloneRevisionTrigger}
                    onDeleteRevision={onDeleteRevision}
                    onManageQuestions={(revision) => onManageQuestions(checklist.id, revision)}
                  />
                </div>
              </div>
            </AccordionCard>
          </motion.div>
        )
      })}

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
