import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { ChevronRightIcon } from '@/assets/icons'
import { staggerItem } from '@/design-system/animations'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  title: string
  description?: string
}

export function Breadcrumb({ items, title, description }: BreadcrumbProps) {
  const navigate = useNavigate()

  return (
    <motion.div variants={staggerItem} className="space-y-1">
      <nav className="flex items-center gap-1.5 text-[13px]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRightIcon size={12} className="text-gray-300" />}
            {item.href ? (
              <button
                onClick={() => navigate({ to: item.href })}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-gray-500 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="font-heading text-2xl font-bold text-gray-900">{title}</h1>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </motion.div>
  )
}
