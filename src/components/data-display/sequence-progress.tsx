import { cn } from '@/lib/cn'

interface SequenceProgressProps {
  current: number
  max: number
  size?: 'sm' | 'md'
  className?: string
}

export function SequenceProgress({ current, max, size = 'md', className }: SequenceProgressProps) {
  const steps = Array.from({ length: max }, (_, i) => i + 1)
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
  const lineH = size === 'sm' ? 'h-0.5' : 'h-0.5'

  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              dotSize,
              'rounded-full transition-all duration-300 flex-shrink-0',
              step < current && 'bg-primary-800',
              step === current && 'bg-green-500 ring-2 ring-green-200',
              step > current && 'bg-gray-200 border border-gray-300',
            )}
          />
          {i < steps.length - 1 && (
            <div
              className={cn(
                lineH,
                size === 'sm' ? 'w-3' : 'w-5',
                'transition-all duration-300',
                step < current ? 'bg-primary-800' : 'bg-gray-200',
              )}
            />
          )}
        </div>
      ))}
      <span className={cn(
        'ml-2 font-medium tabular-nums',
        size === 'sm' ? 'text-xs text-gray-500' : 'text-sm text-gray-600',
      )}>
        {current}/{max}
      </span>
    </div>
  )
}
