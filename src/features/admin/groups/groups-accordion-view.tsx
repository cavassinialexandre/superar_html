import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AccordionCard } from '@/features/admin/components/accordion-card'
import { TeamListSection } from './team-list-section'
import {
  PlusIcon,
  EditIcon,
  ChevronDownIcon,
} from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Group, TeamMember } from '@/types'

interface GroupsAccordionViewProps {
  groups: Group[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddGroup: () => void
  onEditGroup: (group: Group) => void
  onAddMember: (groupId: string) => void
  onEditMember: (groupId: string, member: TeamMember) => void
  onRemoveMember: (groupId: string, memberId: string) => void
  onToggleStatus: (groupId: string) => void
}

// Ícone de grupo
function GroupIcon({ size = 24, className }: { size?: number; className?: string }) {
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
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <circle cx="17" cy="9" r="2" />
      <path d="M21 21v-1.5a3 3 0 00-3-3h-.5" />
    </svg>
  )
}

export function GroupsAccordionView({
  groups,
  searchQuery,
  onSearchChange,
  onAddGroup,
  onEditGroup,
  onAddMember,
  onEditMember,
  onRemoveMember,
  onToggleStatus,
}: GroupsAccordionViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filtra por busca
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups
    return groups.filter(g =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [groups, searchQuery])

  if (groups.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header minimalista */}
        <div className="flex items-center gap-3 justify-end">
          <SearchInput
            placeholder="Buscar grupo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-72"
          />
          <Button variant="premium" onClick={onAddGroup}>
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Novo Grupo</span>
          </Button>
        </div>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GroupIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum grupo encontrado</p>
          <p className="text-sm text-gray-400 mt-1">
            Crie um novo grupo para começar
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
          placeholder="Buscar grupo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          className="w-72"
        />
        <Button variant="premium" onClick={onAddGroup}>
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Novo Grupo</span>
        </Button>
      </div>

      {/* Header da lista */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-4">Grupo</div>
        <div className="col-span-2">Tipo</div>
        <div className="col-span-3">Área</div>
        <div className="col-span-1 text-center">Equipe</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1">Ações</div>
      </div>

      {/* Lista de grupos */}
      {filteredGroups.map((group, index) => {
        const teamCount = group.team.length
        const isActive = group.status === 'active'
        const isExpanded = expandedId === group.id

        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AccordionCard
              id={group.id}
              isActive={isActive}
              isExpanded={isExpanded}
              onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
              showChevron={false}
              header={
                <>
                  {/* Col 1: Nome (4 cols) */}
                  <div className="col-span-12 sm:col-span-4 flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isActive
                          ? 'bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <GroupIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate block">
                        {group.name}
                      </span>
                      <span className="mt-0.5 md:hidden">
                        <StatusTag active={isActive} onChange={() => onToggleStatus(group.id)} />
                      </span>
                    </div>
                  </div>

                  {/* Col 2: Tipo (2 cols) */}
                  <div className="col-span-6 sm:col-span-2">
                    <Badge variant="primary" size="sm">
                      {group.groupTypeName}
                    </Badge>
                  </div>

                  {/* Col 3: Área (3 cols) */}
                  <div className="col-span-6 sm:col-span-3">
                    <span className="text-sm text-gray-600 truncate block" title={group.areaName}>
                      {group.areaName}
                    </span>
                    <span className="text-xs text-gray-400 truncate block">
                      {group.managementName}
                    </span>
                  </div>

                  {/* Col 4: Equipe (1 col) */}
                  <div className="col-span-4 sm:col-span-1 text-center">
                    <span className="text-sm font-bold text-gray-700">{teamCount}</span>
                  </div>

                  {/* Col 5: Status (1 col) */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    <StatusTag active={isActive} onChange={() => onToggleStatus(group.id)} />
                  </div>

                  {/* Col 6: Ações Rápidas (1 col) */}
                  <div className="col-span-6 sm:col-span-1 flex items-center justify-end gap-1">
                    {/* Editar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditGroup(group)
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Editar Grupo"
                    >
                      <EditIcon size={14} />
                    </button>
                    {/* Expandir/Colapsar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === group.id ? null : group.id)
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
              {/* Conteúdo expandido: Lista de Membros */}
              <div className="px-4 pb-5 pt-2">
                <div className="pt-4 border-t border-gray-100">
                  <TeamListSection
                    team={group.team}
                    groupName={group.name}
                    onAddMember={() => onAddMember(group.id)}
                    onEditMember={(member) => onEditMember(group.id, member)}
                    onRemoveMember={(memberId) => onRemoveMember(group.id, memberId)}
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
