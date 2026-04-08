import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-xl shadow-sm',
        paddingMap[padding],
        hover && 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-heading text-lg font-semibold text-gray-800', className)} {...props}>
      {children}
    </h3>
  )
}

interface CardAccentProps extends HTMLAttributes<HTMLDivElement> {
  color?: string
}

export function CardAccent({ className, color, children, ...props }: CardAccentProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden',
        className,
      )}
      {...props}
    >
      <div
        className="h-0.5"
        style={{
          background: color || 'linear-gradient(90deg, #103734 0%, #1E7A73 50%, #DDDD03 100%)',
        }}
      />
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
