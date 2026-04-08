import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { XIcon, CopyIcon, FileIcon, ChevronDownIcon, CheckIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { ChecklistRevision } from '@/types'

interface CloneRevisionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (cloneFromRevisionId?: string) => void
  revisions: ChecklistRevision[]
  checklistName: string
}

export function CloneRevisionModal({
  isOpen,
  onClose,
  onConfirm,
  revisions,
  checklistName,
}: CloneRevisionModalProps) {
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const selectedRevision = revisions.find(r => r.id === selectedRevisionId)

  const handleClose = () => {
    setSelectedRevisionId(null)
    setShowDropdown(false)
    onClose()
  }

  const handleCreateEmpty = () => {
    onConfirm(undefined)
    handleClose()
  }

  const handleClone = () => {
    if (selectedRevisionId) {
      onConfirm(selectedRevisionId)
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Nova Revisão
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {checklistName}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    <XIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">
                <p className="text-sm text-gray-600">
                  Escolha como deseja criar a nova revisão. Você pode começar com uma revisão vazia ou clonar uma revisão existente.
                </p>

                {/* Opção 1: Revisão Vazia */}
                <button
                  onClick={handleCreateEmpty}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                    'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30',
                    !selectedRevisionId && 'border-primary-500 bg-primary-50/20'
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0">
                    <FileIcon size={24} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Criar Revisão Vazia</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Comece do zero, sem perguntas
                    </p>
                  </div>
                  {!selectedRevisionId && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <CheckIcon size={14} className="text-white" />
                    </div>
                  )}
                </button>

                {/* Opção 2: Clonar */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                      'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30',
                      selectedRevisionId && 'border-blue-500 bg-blue-50/20'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                      <CopyIcon size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">
                        {selectedRevision
                          ? `Clonar Revisão #${selectedRevision.revisionNumber}`
                          : 'Clonar Revisão Existente'
                        }
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {selectedRevision
                          ? `${selectedRevision.questions.length} pergunta${selectedRevision.questions.length !== 1 ? 's' : ''} serão copiadas`
                          : 'Copie todas as perguntas de uma revisão'
                        }
                      </p>
                    </div>
                    <ChevronDownIcon
                      size={18}
                      className={cn(
                        'text-gray-400 transition-transform flex-shrink-0',
                        showDropdown && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Dropdown de seleção */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-10 overflow-hidden"
                      >
                        <div className="max-h-48 overflow-y-auto py-1">
                          {revisions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              Nenhuma revisão disponível para clonar
                            </div>
                          ) : (
                            revisions
                              .sort((a, b) => b.revisionNumber - a.revisionNumber)
                              .map((revision) => (
                                <button
                                  key={revision.id}
                                  onClick={() => {
                                    setSelectedRevisionId(revision.id)
                                    setShowDropdown(false)
                                  }}
                                  className={cn(
                                    'w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left',
                                    selectedRevisionId === revision.id && 'bg-blue-50'
                                  )}
                                >
                                  <div
                                    className={cn(
                                      'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                                      revision.status === 'active'
                                        ? 'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700'
                                        : 'bg-gray-100 text-gray-500'
                                    )}
                                  >
                                    {revision.revisionNumber}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900">
                                      Revisão #{revision.revisionNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {revision.questions.length} pergunta{revision.questions.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                  {selectedRevisionId === revision.id && (
                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                      <CheckIcon size={12} className="text-white" />
                                    </div>
                                  )}
                                </button>
                              ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={selectedRevisionId ? handleClone : handleCreateEmpty}
                  className={selectedRevisionId ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {selectedRevisionId ? (
                    <>
                      <CopyIcon size={16} className="mr-2" />
                      Clonar e Criar
                    </>
                  ) : (
                    <>
                      <FileIcon size={16} className="mr-2" />
                      Criar Vazia
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
