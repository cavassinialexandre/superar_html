import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-50 text-primary-800',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-rose-50 text-rose-600',
  info: 'bg-primary-50 text-primary-500',
  secondary: 'bg-blue-50 text-blue-600',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export function Badge({ className, variant = 'default', size = 'md', dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full leading-relaxed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}
