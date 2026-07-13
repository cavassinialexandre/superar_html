import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ToggleOption<T extends string> {
  id: T
  label: string
  icon?: ReactNode
}

interface GroupsToggleProps<T extends string> {
  value: T
  onChange: (next: T) => void
  options: ToggleOption<T>[]
  ariaLabel: string
  layoutId: string
}

export function GroupsToggle<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  layoutId,
}: GroupsToggleProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-full shadow-sm"
    >
      {options.map((opt) => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              'relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40',
              active ? 'text-white' : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 bg-primary-600 rounded-full -z-0"
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const cardsIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const tableIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
)

const accordionIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const kanbanIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="18" rx="1" />
    <rect x="9.5" y="3" width="5" height="12" rx="1" />
    <rect x="16" y="3" width="5" height="15" rx="1" />
  </svg>
)

const timelineIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <rect x="3" y="4" width="7" height="5" rx="1" />
    <rect x="14" y="10" width="7" height="5" rx="1" />
    <rect x="3" y="17" width="7" height="5" rx="1" />
  </svg>
)

export type GroupsViewMode = 'cards' | 'table'
export const GROUPS_VIEW_OPTIONS: ToggleOption<GroupsViewMode>[] = [
  { id: 'cards', label: 'Cards', icon: cardsIcon },
  { id: 'table', label: 'Tabela', icon: tableIcon },
]

export type GroupsGeralLayout = 'accordion' | 'kanban' | 'timeline'
export const GROUPS_GERAL_OPTIONS: ToggleOption<GroupsGeralLayout>[] = [
  { id: 'accordion', label: 'Accordion', icon: accordionIcon },
  { id: 'kanban', label: 'Kanban', icon: kanbanIcon },
  { id: 'timeline', label: 'Timeline', icon: timelineIcon },
]
