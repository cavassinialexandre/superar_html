import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'
import { StatusTag } from '@/components/ui/status-tag'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AccordionCard } from '@/features/admin/components/accordion-card'
import { AreaListSection } from './components/area-list-section'
import { PlusIcon, EditIcon, BuildingIcon, ChevronDownIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Management, Area } from '@/types'

// Mock data para enriquecer a visualização
import { groups } from '@/mocks/data'

interface ManagementAreasAccordionViewProps {
  managements: Management[]
  areas: Area[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddManagement: () => void
  onEditManagement: (mgmt: Management) => void
  onAddArea: (managementId: string) => void
  onEditArea: (area: Area) => void
}

// Tipo estendido com estatísticas
interface AreaWithStats extends Area {
  groupCount: number
  lastEvaluationScore?: number
  lastEvaluationDate?: string
}

interface ManagementWithStats extends Management {
  areas: AreaWithStats[]
  totalGroups: number
  activeAreasCount: number
}

export function ManagementAreasAccordionView({
  managements,
  areas,
  searchQuery,
  onSearchChange,
  onAddManagement,
  onEditManagement,
  onAddArea,
  onEditArea,
}: ManagementAreasAccordionViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Calcular estatísticas para cada gerência
  const managementsWithStats: ManagementWithStats[] = useMemo(() => {
    return managements.map((mgmt) => {
      const mgmtAreas = areas.filter((area) => area.managementId === mgmt.id)

      const areasWithStats: AreaWithStats[] = mgmtAreas.map((area) => {
        // Contar grupos nesta área
        const areaGroups = groups.filter((g) => g.areaId === area.id)
        const groupCount = areaGroups.length

        // Calcular última avaliação média
        const lastEvaluations = areaGroups
          .filter((g) => g.lastAuditScore !== undefined)
          .map((g) => g.lastAuditScore!)

        const lastEvaluationScore = lastEvaluations.length > 0
          ? Math.round(lastEvaluations.reduce((a, b) => a + b, 0) / lastEvaluations.length)
          : undefined

        const lastEvaluationDate = areaGroups
          .filter((g) => g.lastEvaluationDate)
          .sort((a, b) => new Date(b.lastEvaluationDate!).getTime() - new Date(a.lastEvaluationDate!).getTime())[0]?.lastEvaluationDate

        return {
          ...area,
          groupCount,
          lastEvaluationScore,
          lastEvaluationDate,
        }
      })

      const totalGroups = areasWithStats.reduce((sum, a) => sum + a.groupCount, 0)
      const activeAreasCount = areasWithStats.filter((a) => a.status === 'active').length

      return {
        ...mgmt,
        areas: areasWithStats,
        totalGroups,
        activeAreasCount,
      }
    })
  }, [managements, areas])

  // Filtra por busca
  const filteredManagements = useMemo(() => {
    if (!searchQuery) return managementsWithStats
    return managementsWithStats.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [managementsWithStats, searchQuery])

  if (managements.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header minimalista */}
        <div className="flex items-center gap-3 justify-end">
          <SearchInput
            placeholder="Buscar gerência..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-72"
          />
          <Button variant="premium" onClick={onAddManagement}>
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Nova Gerência</span>
          </Button>
        </div>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Nenhuma gerência encontrada</p>
          <p className="text-sm text-gray-400 mt-1">Crie uma nova gerência para começar</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Header minimalista */}
      <div className="flex items-center gap-3 mb-4 justify-end">
        <SearchInput
          placeholder="Buscar gerência..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          className="w-72"
        />
        <Button variant="premium" onClick={onAddManagement}>
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Nova Gerência</span>
        </Button>
      </div>

      {/* Header da lista */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-5">Gerência</div>
        <div className="col-span-2 text-center">Áreas</div>
        <div className="col-span-2 text-center">Grupos</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-2">Ações</div>
      </div>

      {/* Lista de gerências */}
      {filteredManagements.map((mgmt, index) => {
        const areaCount = mgmt.areas.length
        const isActive = mgmt.status === 'active'
        const isExpanded = expandedId === mgmt.id

        return (
          <motion.div
            key={mgmt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AccordionCard
              id={mgmt.id}
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
                      <BuildingIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate block">
                        {mgmt.name}
                      </span>
                      <span className="mt-0.5 md:hidden">
                        <StatusTag active={isActive} />
                      </span>
                    </div>
                  </div>

                  {/* Col 2: Qtd de Áreas (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 text-center">
                    <span className="text-sm font-bold text-gray-700">{areaCount}</span>
                    <span className="text-xs text-gray-400 ml-1">area{areaCount !== 1 && 's'}</span>
                  </div>

                  {/* Col 3: Qtd de Grupos (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 text-center hidden sm:block">
                    <span className="text-sm font-bold text-gray-700">{mgmt.totalGroups}</span>
                    <span className="text-xs text-gray-400 ml-1">grupo{mgmt.totalGroups !== 1 && 's'}</span>
                  </div>

                  {/* Col 4: Status (1 col) */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    <StatusTag active={isActive} />
                  </div>

                  {/* Col 5: Ações Rápidas (2 cols) */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1">
                    {/* Editar Gerência */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditManagement(mgmt)
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Editar Gerência"
                    >
                      <EditIcon size={14} />
                    </button>
                    {/* Expandir/Colapsar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === mgmt.id ? null : mgmt.id)
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
              {/* Conteúdo expandido: Lista de Áreas */}
              <div className="px-4 pb-5 pt-2">
                <div className="pt-4 border-t border-gray-100">
                  {/* Areas List Section */}
                  <AreaListSection
                    areas={mgmt.areas}
                    onAddArea={() => onAddArea(mgmt.id)}
                    onEditArea={onEditArea}
                    managementName={mgmt.name}
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
