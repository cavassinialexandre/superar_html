import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export type V7View = 'table' | 'timeline'

interface V7ViewToggleProps {
  value: V7View
  onChange: (view: V7View) => void
}

const OPTIONS: { id: V7View; label: string; icon: ReactNode }[] = [
  {
    id: 'table',
    label: 'Tabela',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <rect x="3" y="4" width="7" height="5" rx="1" />
        <rect x="14" y="10" width="7" height="5" rx="1" />
        <rect x="3" y="17" width="7" height="5" rx="1" />
      </svg>
    ),
  },
]

export function V7ViewToggle({ value, onChange }: V7ViewToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Modo de visualização"
      className="inline-flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-full shadow-sm"
    >
      {OPTIONS.map((opt) => {
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
                layoutId="v7-view-pill"
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
