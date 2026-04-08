import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  PlusIcon,
  EditIcon,
} from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Checklist } from '@/types'

interface ChecklistsListViewProps {
  checklists: Checklist[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddChecklist: () => void
  onEditChecklist: (checklist: Checklist) => void
  onViewQuestions: (checklist: Checklist) => void
  onToggleStatus: (checklistId: string) => void
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

// Ícone de lista
function ListBulletIcon({ size = 20, className }: { size?: number; className?: string }) {
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
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

export function ChecklistsListView({
  checklists,
  searchQuery,
  onSearchChange,
  onAddChecklist,
  onEditChecklist,
  onViewQuestions,
  onToggleStatus,
}: ChecklistsListViewProps) {
  // Filtra por busca
  const filteredChecklists = useMemo(() => {
    if (!searchQuery) return checklists
    return checklists.filter(cl =>
      cl.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [checklists, searchQuery])

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
        <div className="col-span-5">Checklist</div>
        <div className="col-span-2 text-center">Revisão</div>
        <div className="col-span-2 text-center">Perguntas</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-2">Ações</div>
      </div>

      {/* Lista de checklists */}
      {filteredChecklists.map((checklist, index) => {
        const questionCount = checklist.questions.length
        const isActive = checklist.status === 'active'

        return (
          <motion.div
            key={checklist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'overflow-hidden transition-all',
                !isActive && 'opacity-60'
              )}
            >
              <div className="px-4 py-3">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Col 1: Nome (5 cols) */}
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
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

                  {/* Col 2: Revisão (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 text-center">
                    <Badge variant="secondary" size="sm">
                      Rev. {checklist.revision}
                    </Badge>
                  </div>

                  {/* Col 3: Qtd de Perguntas (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 text-center">
                    <span className="text-sm font-bold text-gray-700">
                      {questionCount}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      pergunta{questionCount !== 1 && 's'}
                    </span>
                  </div>

                  {/* Col 4: Status (1 col) */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    <StatusTag active={isActive} onChange={() => onToggleStatus(checklist.id)} />
                  </div>

                  {/* Col 5: Ações (2 cols) */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1">
                    {/* Ver Perguntas - BOTÃO LIST */}
                    <button
                      onClick={() => onViewQuestions(checklist)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Ver Perguntas"
                    >
                      <ListBulletIcon size={18} />
                    </button>
                    {/* Editar */}
                    <button
                      onClick={() => onEditChecklist(checklist)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Editar Checklist"
                    >
                      <EditIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
