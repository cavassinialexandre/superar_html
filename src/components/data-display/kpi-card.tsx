import type { ReactNode } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

interface KPICardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  icon: ReactNode
  accentColor?: string
  className?: string
  children?: ReactNode
  variant?: 'default' | 'hero'
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const motionVal = useMotionValue(0)

  useEffect(() => {
    const unsubscribe = motionVal.on('change', (v) => setDisplay(Math.round(v)))
    animate(motionVal, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] })
    return () => { unsubscribe() }
  }, [value, motionVal])

  return (
    <span className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  )
}

export function KPICard({ title, value, suffix, prefix, icon, accentColor, className, children, variant = 'default' }: KPICardProps) {
  const isHero = variant === 'hero'

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        isHero
          ? 'bg-gradient-to-br from-primary-800 to-primary-700 border-primary-700 text-white shadow-lg shadow-primary-800/20'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-card-hover',
        className,
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      {!isHero && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: accentColor || 'linear-gradient(90deg, #103734 0%, #1E7A73 100%)' }}
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <span className={cn(
              'text-xs font-semibold uppercase tracking-wider',
              isHero ? 'text-white/70' : 'text-gray-500',
            )}>
              {title}
            </span>
            <div className={cn(
              'mt-2 font-heading text-4xl font-extrabold tracking-tight',
              isHero ? 'text-white' : 'text-gray-900',
            )}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </div>
            {children && <div className="mt-3">{children}</div>}
          </div>
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            isHero ? 'bg-white/10 text-white' : 'bg-primary-50 text-primary-700',
          )}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
