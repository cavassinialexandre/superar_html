import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { PlusIcon } from '@/assets/icons'
import { AreaDetailCard } from './area-detail-card'
import type { Area } from '@/types'

interface AreaListSectionProps {
  areas: (Area & {
    groupCount?: number
    lastEvaluationScore?: number
    lastEvaluationDate?: string
  })[]
  onAddArea: () => void
  onEditArea: (area: Area) => void
  managementName: string
}

export function AreaListSection({
  areas,
  onAddArea,
  onEditArea,
  managementName,
}: AreaListSectionProps) {
  const hasAreas = areas.length > 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Áreas da Gerência
          </h5>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasAreas
              ? `${areas.length} área${areas.length !== 1 ? 's' : ''} cadastrada${areas.length !== 1 ? 's' : ''}`
              : `Nenhuma área cadastrada em ${managementName}`}
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onAddArea}>
          <PlusIcon size={14} className="mr-1" />
          Nova Área
        </Button>
      </div>

      {/* Areas Grid */}
      {hasAreas ? (
        <div className="grid gap-3">
          {areas.map((area, index) => (
            <AreaDetailCard
              key={area.id}
              area={area}
              onEdit={() => onEditArea(area)}
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
          <p className="text-sm text-gray-500 mb-1">Nenhuma área cadastrada</p>
          <p className="text-xs text-gray-400 mb-3">
            Adicione a primeira área para esta gerência
          </p>
          <Button size="sm" variant="ghost" onClick={onAddArea}>
            <PlusIcon size={14} className="mr-1" />
            Adicionar primeira área
          </Button>
        </motion.div>
      )}
    </div>
  )
}
