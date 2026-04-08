import { cn } from '@/lib/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton animate-pulse',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className,
      )}
    />
  )
}
