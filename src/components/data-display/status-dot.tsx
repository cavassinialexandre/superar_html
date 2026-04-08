import { cn } from '@/lib/cn'

interface StatusDotProps {
  status: 'active' | 'inactive' | 'warning'
  label?: string
  className?: string
}

const statusColors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-300',
  warning: 'bg-yellow-500',
}

export function StatusDot({ status, label, className }: StatusDotProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        statusColors[status],
        status === 'active' && 'animate-pulse',
      )} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  )
}
