import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChecklistsAccordionView } from './checklists-accordion-view'
import { ChecklistForm } from './checklist-form'
import { useChecklists } from './use-checklists'
import { ConfirmDialog, SlideOverDrawer, Button, StatusTag } from '@/components/ui'
import type { Checklist, ChecklistRevision } from '@/types'

// Componente simples para editar revisão (apenas status)
interface RevisionEditFormProps {
  revision: ChecklistRevision
  open: boolean
  onSubmit: (data: { status: 'active' | 'inactive' }) => void
  onCancel: () => void
}

function RevisionEditForm({ revision, open, onSubmit, onCancel }: RevisionEditFormProps) {
  const [status, setStatus] = useState(revision.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ status })
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title="Editar Revisão"
      subtitle={`Revisão #${revision.revisionNumber}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Status da Revisão</label>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <StatusTag
                active={status === 'active'}
                onChange={() => setStatus(status === 'active' ? 'inactive' : 'active')}
              />
              <span className="text-sm text-gray-600">
                {status === 'active' ? 'Revisão ativa e disponível' : 'Revisão inativa'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Informações da Revisão</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><span className="font-medium">ID:</span> {revision.id}</p>
              <p><span className="font-medium">Perguntas:</span> {revision.questions.length}</p>
              <p><span className="font-medium">Pontuação Total:</span> {revision.questions.reduce((acc, q) => acc + q.weight, 0)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-primary-100/60 bg-gradient-to-b from-gray-50/80 to-gray-100/60">
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}

export function ChecklistsTab() {
  const navigate = useNavigate()
  const {
    filteredChecklists,
    searchQuery,
    setSearchQuery,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    toggleChecklistStatus,
    createRevision,
    updateRevision,
    deleteRevision,
  } = useChecklists()

  // Estados dos drawers/forms
  const [checklistFormOpen, setChecklistFormOpen] = useState(false)
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null)
  const [loading, setLoading] = useState(false)

  // Estados para revisões
  const [revisionFormOpen, setRevisionFormOpen] = useState(false)
  const [editingRevision, setEditingRevision] = useState<ChecklistRevision | null>(null)
  const [deletingRevision, setDeletingRevision] = useState<ChecklistRevision | null>(null)

  // ========== HANDLERS CHECKLIST ==========

  const handleOpenNewChecklist = () => {
    setEditingChecklist(null)
    setChecklistFormOpen(true)
  }

  const handleOpenEditChecklist = (checklist: Checklist) => {
    setEditingChecklist(checklist)
    setChecklistFormOpen(true)
  }

  const handleCloseChecklistForm = () => {
    setChecklistFormOpen(false)
    setEditingChecklist(null)
  }

  const handleSubmitChecklist = async (data: {
    name: string
    status: 'active' | 'inactive'
  }) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    if (editingChecklist) {
      updateChecklist(editingChecklist.id, data)
    } else {
      createChecklist(data)
    }

    setLoading(false)
    handleCloseChecklistForm()
  }

  // ========== HANDLERS REVISÕES ==========

  const handleManageQuestions = (checklistId: string, revision: ChecklistRevision) => {
    navigate({
      to: '/admin/checklists/$checklistId/revisions/$revisionId/questions',
      params: { checklistId, revisionId: revision.id },
    })
  }

  const handleAddRevision = (checklistId: string, cloneFromRevisionId?: string) => {
    createRevision(checklistId, { status: 'active' }, cloneFromRevisionId)
  }

  const handleOpenEditRevision = (revision: ChecklistRevision) => {
    setEditingRevision(revision)
    setRevisionFormOpen(true)
  }

  const handleCloseRevisionForm = () => {
    setRevisionFormOpen(false)
    setEditingRevision(null)
  }

  const handleSubmitRevision = async (data: { status: 'active' | 'inactive' }) => {
    if (editingRevision) {
      updateRevision(editingRevision.id, data)
    }
    handleCloseRevisionForm()
  }

  const handleDeleteRevision = (revision: ChecklistRevision) => {
    setDeletingRevision(revision)
  }

  const handleConfirmDeleteRevision = () => {
    if (deletingRevision) {
      deleteRevision(deletingRevision.id)
      setDeletingRevision(null)
    }
  }

  const handleCloneRevisionTrigger = (_revision: ChecklistRevision) => {
    // O modal de clonagem já está integrado no ChecklistsAccordionView
    // Esta função é chamada quando o usuário clica no botão de clonar de uma revisão específica
    // O fluxo real de clonagem acontece via handleAddRevision através do CloneRevisionModal
  }

  return (
    <>
      <ChecklistsAccordionView
        checklists={filteredChecklists}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddChecklist={handleOpenNewChecklist}
        onEditChecklist={handleOpenEditChecklist}
        onToggleStatus={toggleChecklistStatus}
        onManageQuestions={handleManageQuestions}
        onAddRevision={handleAddRevision}
        onEditRevision={handleOpenEditRevision}
        onDeleteRevision={handleDeleteRevision}
        onCloneRevisionTrigger={handleCloneRevisionTrigger}
      />

      {/* Checklist Form Drawer */}
      <ChecklistForm
        checklist={editingChecklist}
        open={checklistFormOpen}
        onSubmit={handleSubmitChecklist}
        onCancel={handleCloseChecklistForm}
        loading={loading}
      />

      {/* Revision Edit Form Drawer - Simplificado para apenas toggle status */}
      {editingRevision && (
        <RevisionEditForm
          revision={editingRevision}
          open={revisionFormOpen}
          onSubmit={handleSubmitRevision}
          onCancel={handleCloseRevisionForm}
        />
      )}

      {/* Confirm Dialog para deletar revisão */}
      <ConfirmDialog
        open={!!deletingRevision}
        onClose={() => setDeletingRevision(null)}
        onConfirm={handleConfirmDeleteRevision}
        title="Excluir Revisão"
        description="Tem certeza que deseja excluir esta revisão?"
        itemName={deletingRevision ? `Revisão #${deletingRevision.revisionNumber}` : ''}
        itemMeta={deletingRevision ? [
          { label: 'Perguntas', value: String(deletingRevision.questions.length) },
          { label: 'Status', value: deletingRevision.status === 'active' ? 'Ativa' : 'Inativa' },
        ] : undefined}
        warning="Esta ação não poderá ser desfeita. Todas as perguntas associadas serão perdidas."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  )
}
