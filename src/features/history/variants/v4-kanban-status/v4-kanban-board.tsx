import type { StatusBuckets } from '../../shared/types'
import { V4KanbanColumn } from './v4-kanban-column'

interface V4KanbanBoardProps {
  buckets: StatusBuckets
  selectedId: string
  onSelect: (id: string) => void
}

export function V4KanbanBoard({ buckets, selectedId, onSelect }: V4KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:overflow-visible overflow-x-auto">
      <V4KanbanColumn
        title="Avançaram"
        caption="Auditorias com avanço de sequência"
        evaluations={buckets.avancou}
        accent="#10B981"
        accentLight="#34D399"
        bgTint="linear-gradient(135deg, #D1FAE530 0%, #FFFFFF 100%)"
        selectedId={selectedId}
        onSelect={onSelect}
        delay={0}
      />
      <V4KanbanColumn
        title="Meta atingida"
        caption="Acima da meta, sem avanço"
        evaluations={buckets.meta}
        accent="#14B8A6"
        accentLight="#2DD4BF"
        bgTint="linear-gradient(135deg, #CCFBF130 0%, #FFFFFF 100%)"
        selectedId={selectedId}
        onSelect={onSelect}
        delay={0.08}
      />
      <V4KanbanColumn
        title="Abaixo da meta"
        caption="Requerem plano de ação"
        evaluations={buckets.abaixo}
        accent="#EF4444"
        accentLight="#F87171"
        bgTint="linear-gradient(135deg, #FEE2E230 0%, #FFFFFF 100%)"
        selectedId={selectedId}
        onSelect={onSelect}
        delay={0.16}
      />
    </div>
  )
}
