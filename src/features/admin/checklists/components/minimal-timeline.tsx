import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface MinimalTimelineProps {
  total: number
  current: number // índice do item ativo (0-based)
  className?: string
}

export function MinimalTimeline({ total, current, className }: MinimalTimelineProps) {
  const items = Array.from({ length: total }, (_, i) => i)
  
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {items.map((index) => {
        const isActive = index === current
        const isPast = index < current
        
        return (
          <div key={index} className="flex items-center">
            {/* Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
              className="group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  Rev. {index + 1}
                </span>
              </div>
              
              {/* Dot */}
              <div
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300 cursor-pointer',
                  isActive
                    ? 'bg-primary-500 scale-125 shadow-sm shadow-primary-500/50'
                    : isPast
                      ? 'bg-primary-300'
                      : 'bg-gray-200 hover:bg-gray-300'
                )}
              />
            </motion.div>
            
            {/* Connector line */}
            {index < total - 1 && (
              <div
                className={cn(
                  'w-6 h-[1px] transition-colors duration-300',
                  index < current ? 'bg-primary-200' : 'bg-gray-100'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
