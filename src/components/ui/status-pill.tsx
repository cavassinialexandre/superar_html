import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

interface StatusPillProps {
  active: boolean
  onChange?: (active: boolean) => void
  activeLabel?: string
  inactiveLabel?: string
  disabled?: boolean
}

export function StatusPill({
  active,
  onChange,
  activeLabel = 'Ativo',
  inactiveLabel = 'Inativo',
  disabled = false,
}: StatusPillProps) {
  const isInteractive = !!onChange && !disabled

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (isInteractive) onChange(!active)
      }}
      disabled={disabled || !onChange}
      className={cn(
        'relative inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase transition-all duration-300 overflow-hidden',
        active
          ? 'bg-gradient-to-r from-green-50 to-green-100/80 text-green-700 shadow-[inset_0_0_0_1px_rgba(0,166,80,0.15)]'
          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-500 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]',
        isInteractive && 'cursor-pointer hover:shadow-md',
        isInteractive && active && 'hover:from-green-100 hover:to-green-50 hover:shadow-green-200/50',
        isInteractive && !active && 'hover:from-gray-200 hover:to-gray-100 hover:text-gray-600',
        (!onChange || disabled) && 'cursor-default opacity-80',
      )}
    >
      {/* Dot indicator */}
      <motion.span
        animate={{
          backgroundColor: active ? '#00A650' : '#A3ADAC',
          scale: active ? 1 : 0.85,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
      />

      {/* Glow behind dot when active */}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute left-[11px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-green-400/20 blur-[3px]"
          />
        )}
      </AnimatePresence>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={active ? 'active' : 'inactive'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {active ? activeLabel : inactiveLabel}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
