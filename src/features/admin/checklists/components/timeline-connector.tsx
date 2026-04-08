import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface TimelineConnectorProps {
  itemCount: number
  activeIndex?: number // índice do item ativo (0-based, de baixo para cima)
  className?: string
}

export function TimelineConnector({ 
  itemCount, 
  activeIndex = 0, 
  className 
}: TimelineConnectorProps) {
  const items = Array.from({ length: itemCount }, (_, i) => i)
  
  // Calcula a altura total baseada no número de itens
  const lineHeight = itemCount * 100 // aproximadamente 100px por item

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Linha de fundo (cinza) */}
      <div 
        className="absolute w-0.5 bg-gray-200 rounded-full"
        style={{ height: `${lineHeight}px` }}
      />
      
      {/* Linha gradiente animada */}
      <motion.div
        className="absolute w-0.5 bg-gradient-to-b from-primary-400 via-amber-300 to-gray-300 rounded-full"
        initial={{ height: 0 }}
        animate={{ height: `${lineHeight}px` }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Nós da timeline */}
      <div className="relative flex flex-col justify-between z-10" style={{ height: `${lineHeight}px` }}>
        {items.map((index) => {
          const isActive = index === activeIndex
          const isAboveActive = index < activeIndex
          
          return (
            <motion.div
              key={index}
              className="relative flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.15, 
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
            >
              {/* Glow effect para o nó ativo */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary-400/30"
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
              
              {/* Nó principal */}
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all duration-500',
                  isActive 
                    ? 'bg-primary-500 border-primary-500 shadow-lg shadow-primary-500/40 scale-125'
                    : isAboveActive
                      ? 'bg-primary-300 border-primary-300'
                      : 'bg-white border-gray-300'
                )}
              >
                {/* Inner dot para nó ativo */}
                {isActive && (
                  <div className="absolute inset-1 rounded-full bg-white/90" />
                )}
              </div>

              {/* Conector horizontal para o card */}
              <motion.div
                className={cn(
                  'absolute left-4 h-0.5 rounded-full',
                  isActive 
                    ? 'bg-gradient-to-r from-primary-400 to-transparent w-8'
                    : 'bg-gray-200 w-6'
                )}
                initial={{ width: 0 }}
                animate={{ width: isActive ? 32 : 24 }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
