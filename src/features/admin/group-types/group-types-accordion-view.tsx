import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AccordionCard } from '@/features/admin/components/accordion-card'
import { SequenceListSection } from './components/sequence-list-section'
import { PlusIcon, EditIcon, LayersIcon, ChevronDownIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { GroupType, Sequence } from '@/types'

interface GroupTypesAccordionViewProps {
  groupTypes: GroupType[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddGroupType: () => void
  onEditGroupType: (groupType: GroupType) => void
  onAddSequence: (groupTypeId: string) => void
  onEditSequence: (groupTypeId: string, sequence: Sequence) => void
  onToggleStatus: (groupTypeId: string) => void
}

export function GroupTypesAccordionView({
  groupTypes,
  searchQuery,
  onSearchChange,
  onAddGroupType,
  onEditGroupType,
  onAddSequence,
  onEditSequence,
  onToggleStatus,
}: GroupTypesAccordionViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filtra por busca
  const filteredGroupTypes = useMemo(() => {
    if (!searchQuery) return groupTypes
    return groupTypes.filter(gt =>
      gt.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [groupTypes, searchQuery])

  if (groupTypes.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header minimalista */}
        <div className="flex items-center gap-3 justify-end">
          <SearchInput
            placeholder="Buscar tipo de grupo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-72"
          />
          <Button variant="premium" onClick={onAddGroupType}>
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Novo Tipo</span>
          </Button>
        </div>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayersIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum tipo de grupo encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Crie um novo tipo de grupo para começar</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Header minimalista */}
      <div className="flex items-center gap-3 mb-4 justify-end">
        <SearchInput
          placeholder="Buscar tipo de grupo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          className="w-72"
        />
        <Button variant="premium" onClick={onAddGroupType}>
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Novo Tipo</span>
        </Button>
      </div>

      {/* Header da lista */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-5">Tipo de Grupo</div>
        <div className="col-span-2 text-center">Sequências</div>
        <div className="col-span-2 text-center">Meta Padrão</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-2">Ações</div>
      </div>

      {/* Lista de tipos de grupo */}
      {filteredGroupTypes.map((groupType, index) => {
        const sequenceCount = groupType.sequences.length
        const isActive = groupType.status === 'active'
        const isExpanded = expandedId === groupType.id

        return (
          <motion.div
            key={groupType.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AccordionCard
              id={groupType.id}
              isActive={isActive}
              isExpanded={isExpanded}
              onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
              showChevron={false}
              header={
                <>
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
                      <LayersIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate block">
                        {groupType.name}
                      </span>
                      <span className="mt-0.5 md:hidden">
                        <StatusTag active={isActive} onChange={() => onToggleStatus(groupType.id)} />
                      </span>
                    </div>
                  </div>

                  {/* Col 2: Qtd de Sequências (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 text-center">
                    <span className="text-sm font-bold text-gray-700">{sequenceCount}</span>
                    <span className="text-xs text-gray-400 ml-1">
                      sequência{sequenceCount !== 1 && 's'}
                    </span>
                  </div>

                  {/* Col 3: Meta Padrão (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 text-center hidden sm:block">
                    <span className="text-sm font-bold text-gray-700">{groupType.defaultGoal}%</span>
                  </div>

                  {/* Col 4: Status (1 col) */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    <StatusTag active={isActive} onChange={() => onToggleStatus(groupType.id)} />
                  </div>

                  {/* Col 5: Ações Rápidas (2 cols) */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1">
                    {/* Editar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditGroupType(groupType)
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Editar Tipo de Grupo"
                    >
                      <EditIcon size={14} />
                    </button>
                    {/* Expandir/Colapsar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === groupType.id ? null : groupType.id)
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
              {/* Conteúdo expandido: Lista de Sequências */}
              <div className="px-4 pb-5 pt-2">
                <div className="pt-4 border-t border-gray-100">
                  <SequenceListSection
                    sequences={groupType.sequences}
                    defaultGoal={groupType.defaultGoal}
                    onAddSequence={() => onAddSequence(groupType.id)}
                    onEditSequence={(seq) => onEditSequence(groupType.id, seq)}
                    groupTypeName={groupType.name}
                  />
                </div>
              </div>
            </AccordionCard>
          </motion.div>
        )
      })}
    </div>
  )
}
