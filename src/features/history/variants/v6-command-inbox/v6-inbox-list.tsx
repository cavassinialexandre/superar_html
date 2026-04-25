import { useRef, useEffect } from 'react'
import type { Evaluation } from '@/types'
import { V6InboxItem } from './v6-inbox-item'

interface V6InboxListProps {
  evaluations: Evaluation[]
  selectedId: string
  readIds: Set<string>
  onSelect: (id: string) => void
  onMarkRead: (id: string) => void
}

export function V6InboxList({ evaluations, selectedId, readIds, onSelect, onMarkRead }: V6InboxListProps) {
  const selectedRef = useRef<HTMLDivElement>(null)

  // Scroll into view ao selecionar
  useEffect(() => {
    if (!selectedId) return
    // Pequeno delay para render terminar
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-eval-id="${selectedId}"]`)
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(t)
  }, [selectedId])

  return (
    <div
      ref={selectedRef as never}
      className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-200 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 260px)' }}
    >
      {evaluations.map((ev) => (
        <div
          key={ev.id}
          data-eval-id={ev.id}
          onClick={() => onMarkRead(ev.id)}
        >
          <V6InboxItem
            ev={ev}
            isSelected={ev.id === selectedId}
            isUnread={!readIds.has(ev.id)}
            onClick={() => {
              onSelect(ev.id)
              onMarkRead(ev.id)
            }}
          />
        </div>
      ))}
    </div>
  )
}
