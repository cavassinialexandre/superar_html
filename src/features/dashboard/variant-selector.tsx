import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { DashboardVariantMeta } from './variant-registry'

interface VariantSelectorProps {
  variants: DashboardVariantMeta[]
  active: string
  onChange: (id: string) => void
}

export function VariantSelector({ variants, active, onChange }: VariantSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="relative"
    >
      <div className="flex items-center justify-between gap-4 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-500">
            Homologação · escolha um modelo
          </span>
          <span className="text-[10px] text-gray-400">/{variants.length}</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.16em] text-gray-400 hidden md:block">
          variante ativa preserva-se ao recarregar
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Variantes do dashboard"
        className="relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/80 shadow-[0_2px_12px_-4px_rgba(16,55,52,0.08)]"
        style={{ gridTemplateColumns: variants.length > 0 ? `repeat(${variants.length}, minmax(0, 1fr))` : undefined }}
      >
        {variants.map((variant) => {
          const isActive = variant.id === active
          return (
            <button
              key={variant.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(variant.id)}
              className={cn(
                'relative group flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer min-w-0',
                isActive
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80',
              )}
              style={isActive ? { background: `linear-gradient(135deg, ${variant.accent} 0%, ${shade(variant.accent, 12)} 100%)` } : undefined}
            >
              <div className="flex items-center justify-between w-full gap-1.5">
                <span className="font-semibold text-[12px] truncate">{variant.label}</span>
                <span
                  className={cn(
                    'text-[8.5px] tracking-[0.12em] font-bold px-1 py-px rounded flex-shrink-0',
                    isActive ? 'bg-white/20 text-white/90' : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {variant.toneLabel}
                </span>
              </div>
              <span
                className={cn(
                  'text-[10px] leading-tight truncate w-full',
                  isActive ? 'text-white/75' : 'text-gray-500',
                )}
              >
                {variant.tagline}
              </span>
              {isActive && (
                <motion.div
                  layoutId="variant-indicator-glow"
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ boxShadow: `0 0 0 1px ${variant.accent}, 0 8px 24px -10px ${variant.accent}` }}
                />
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
