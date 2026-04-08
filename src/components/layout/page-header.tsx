import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { staggerItem } from '@/design-system/animations'
import type { ComponentType } from 'react'

interface IconProps { size?: number; className?: string }

interface PageHeaderProps {
  title: string
  description: string
  badge?: string
  icon?: ComponentType<IconProps>
}

export function PageHeader({ title, description, badge, icon: Icon }: PageHeaderProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8"
      style={{ background: 'linear-gradient(135deg, #103734 0%, #155F59 50%, #1E7A73 100%)' }}
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 blur-3xl bg-yellow-500" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-8 blur-2xl bg-green-500" />

      <div className="relative flex items-start gap-4">
        {Icon && (
          <div className="hidden md:flex w-11 h-11 rounded-xl bg-white/10 items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={22} className="text-emerald-400" />
          </div>
        )}
        <div>
          {badge && (
            <Badge variant="success" className="mb-2 bg-white/15 text-white border-0 text-[11px]">
              {badge}
            </Badge>
          )}
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
            {title}
          </h2>
          <p className="text-white/60 text-sm max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
