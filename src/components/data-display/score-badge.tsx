import { cn } from '@/lib/cn'
import { getScoreBgClass } from '@/design-system/tokens'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-bold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full tabular-nums',
        getScoreBgClass(score),
        sizeClasses[size],
        className,
      )}
    >
      {score.toFixed(0)}%
    </span>
  )
}
