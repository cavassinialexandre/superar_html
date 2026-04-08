import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: {
    track: 'w-9 h-5',
    thumb: 'w-3.5 h-3.5',
    translate: 16,
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 20,
  },
  lg: {
    track: 'w-14 h-8',
    thumb: 'w-6 h-6',
    translate: 24,
  },
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}: ToggleSwitchProps) {
  const styles = sizeStyles[size]

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label className="block text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer',
          styles.track,
          checked ? 'bg-primary-600' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <motion.span
          animate={{ x: checked ? styles.translate : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn('inline-block rounded-full bg-white shadow-sm', styles.thumb)}
        />
      </button>
    </div>
  )
}
