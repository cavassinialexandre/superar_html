import { cn } from '@/lib/cn'
import { TrendUpIcon, TrendDownIcon } from '@/assets/icons'

interface TrendIndicatorProps {
  value: number
  positive: boolean
  label?: string
  className?: string
}

export function TrendIndicator({ value, positive, label, className }: TrendIndicatorProps) {
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {positive ? (
        <TrendUpIcon size={14} className="text-green-500" />
      ) : (
        <TrendDownIcon size={14} className="text-rose-500" />
      )}
      <span className={cn(
        'text-xs font-semibold tabular-nums',
        positive ? 'text-green-600' : 'text-rose-500',
      )}>
        {value}%
      </span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  )
}
