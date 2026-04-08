import { cn } from '@/lib/cn'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  label?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'gradient' | 'score'
  className?: string
}

export function ProgressBar({ value, max = 100, label = false, size = 'md', variant = 'primary', className }: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClass = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  const getBarStyle = () => {
    if (variant === 'gradient') {
      return { background: 'linear-gradient(90deg, #103734 0%, #1E7A73 40%, #00A650 75%, #5EA448 100%)' }
    }
    if (variant === 'score') {
      if (percent >= 80) return { background: '#00A650' }
      if (percent >= 50) return { background: '#DDDD03' }
      return { background: '#CE3C5A' }
    }
    return { background: '#103734' }
  }

  return (
    <div className={cn('w-full', label && 'flex items-center gap-3', className)}>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClass[size])}>
        <motion.div
          className={cn('h-full rounded-full')}
          style={getBarStyle()}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {label && (
        <span className="text-sm font-semibold text-gray-800 min-w-[3rem] text-right tabular-nums">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  )
}
