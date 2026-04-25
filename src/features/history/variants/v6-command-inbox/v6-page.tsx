import { useState, useEffect, useCallback } from 'react'
import type { VariantPageProps } from '../../shared/types'
import { V6CommandBar } from './v6-command-bar'
import { V6InboxList } from './v6-inbox-list'
import { V6SplitPanel } from './v6-split-panel'
import { V6EmptyState } from './v6-empty-state'

type V6Tab = 'summary' | 'answers' | 'team'

const READ_KEY = 'v6:read-ids'

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw))
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    // ignore
  }
}

export function V6Page({ filters, data }: VariantPageProps) {
  const [tab, setTab] = useState<V6Tab>('summary')
  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds())

  const markRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev)
        next.add(id)
        saveReadIds(next)
        return next
      })
    },
    [],
  )

  const onNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const current = filters.filters.selectedEvalId
      const idx = data.filtered.findIndex((e) => e.id === current)
      if (idx === -1 && data.filtered.length > 0) {
        // Nada selecionado — seleciona primeiro
        filters.openEvaluation(data.filtered[0].id)
        markRead(data.filtered[0].id)
        return
      }
      const next = direction === 'next' ? idx + 1 : idx - 1
      if (next >= 0 && next < data.filtered.length) {
        const target = data.filtered[next]
        filters.openEvaluation(target.id)
        markRead(target.id)
      }
    },
    [filters, data.filtered, markRead],
  )

  // Keyboard nav global (apenas quando V6 está ativa)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      if (inInput) return

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        onNavigate('next')
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        onNavigate('prev')
      } else if (e.key === 'Escape') {
        e.preventDefault()
        filters.closeEvaluation()
      } else if (e.key === '1') {
        e.preventDefault()
        setTab('summary')
      } else if (e.key === '2') {
        e.preventDefault()
        setTab('answers')
      } else if (e.key === '3') {
        e.preventDefault()
        setTab('team')
      } else if (e.key === 'e' && filters.filters.selectedEvalId) {
        e.preventDefault()
        markRead(filters.filters.selectedEvalId)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onNavigate, filters, markRead])

  return (
    <div className="space-y-3">
      {/* Command bar */}
      <V6CommandBar api={filters} />

      {/* Results */}
      {data.isEmpty ? (
        <V6EmptyState hasFilters={!filters.isDefault} onClear={filters.clearAll} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <V6InboxList
            evaluations={data.filtered}
            selectedId={filters.filters.selectedEvalId}
            readIds={readIds}
            onSelect={filters.openEvaluation}
            onMarkRead={markRead}
          />
          <V6SplitPanel
            evaluation={data.selectedEvaluation}
            tab={tab}
            onTabChange={setTab}
          />
        </div>
      )}

      {/* Stats footer */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-2">
        <span>
          <span className="text-gray-600 font-bold tabular-nums">{data.filtered.length}</span> itens
          {readIds.size > 0 && (
            <>
              {' · '}
              <span className="text-gray-600 font-bold tabular-nums">{data.filtered.filter((e) => readIds.has(e.id)).length}</span> lidos
            </>
          )}
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600">?</kbd>
          <span className="ml-1">atalhos</span>
        </span>
      </div>
    </div>
  )
}
