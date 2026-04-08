/**
 * Premium answer selector with glow effects, micro-interactions,
 * and animated selection states.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { AnswerValue } from '@/types'

interface EvalAnswerSelectorProps {
  value: AnswerValue | null
  onChange: (value: AnswerValue) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Icons (inline, small)
// ---------------------------------------------------------------------------

function CheckCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertTriangleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function XCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function MinusCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function SmallCheckIcon({ size = 10, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const options: {
  value: AnswerValue
  label: string
  Icon: typeof CheckCircleIcon
  unselected: string
  selected: string
  glow: string
  hex: string
}[] = [
  {
    value: 'yes',
    label: 'Sim',
    Icon: CheckCircleIcon,
    unselected: 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:border-gray-300',
    selected: 'bg-green-500 text-white border-green-500',
    glow: '0 0 16px rgba(0,166,80,0.35)',
    hex: '#00A650',
  },
  {
    value: 'partial',
    label: 'Parcial',
    Icon: AlertTriangleIcon,
    unselected: 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:border-gray-300',
    selected: 'bg-yellow-500 text-white border-yellow-500',
    glow: '0 0 16px rgba(221,221,3,0.35)',
    hex: '#DDDD03',
  },
  {
    value: 'no',
    label: 'Não',
    Icon: XCircleIcon,
    unselected: 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:border-gray-300',
    selected: 'bg-rose-500 text-white border-rose-500',
    glow: '0 0 16px rgba(206,60,90,0.35)',
    hex: '#CE3C5A',
  },
  {
    value: 'na',
    label: 'N/A',
    Icon: MinusCircleIcon,
    unselected: 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:border-gray-300',
    selected: 'bg-gray-400 text-white border-gray-400',
    glow: '0 0 12px rgba(163,173,172,0.25)',
    hex: '#A3ADAC',
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalAnswerSelector({ value, onChange, className }: EvalAnswerSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const isSelected = value === opt.value
        const Icon = opt.Icon

        return (
          <motion.button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-3 py-2.5 cursor-pointer transition-colors',
              'min-w-[72px]',
              isSelected ? opt.selected : opt.unselected,
            )}
            style={isSelected ? { boxShadow: opt.glow } : undefined}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Icon with pop animation */}
            <motion.div
              animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Icon size={14} />
            </motion.div>

            {/* Label */}
            <span className="text-xs font-bold">{opt.label}</span>

            {/* Checkmark overlay */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center"
                >
                  <SmallCheckIcon color={opt.hex} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
