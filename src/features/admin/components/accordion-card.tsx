import { useState, ReactNode } from 'react'
import { Card } from '@/components/ui'
import { ChevronDownIcon } from '@/assets/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

interface AccordionCardProps {
  id: string
  header: ReactNode
  children: ReactNode
  isActive?: boolean
  className?: string
  onToggle?: (id: string) => void
  isExpanded?: boolean
  showChevron?: boolean
}

export function AccordionCard({
  id,
  header,
  children,
  isActive = true,
  className,
  onToggle,
  isExpanded: controlledExpanded,
  showChevron = true,
}: AccordionCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    if (onToggle) {
      onToggle(id)
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        !isActive && 'opacity-60',
        className
      )}
    >
      {/* Header clicável */}
      <div
        onClick={handleToggle}
        className="px-4 py-1.5 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {header}

          {showChevron && (
            <div className="col-span-12 sm:col-span-1 flex justify-end">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                <ChevronDownIcon size={16} />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
