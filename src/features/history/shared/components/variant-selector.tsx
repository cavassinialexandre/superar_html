import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { HistoryVariantId } from '../types'
import { HISTORY_VARIANT_IDS } from '../types'

interface VariantMetaLite {
  id: HistoryVariantId
  shortLabel: string
  longLabel: string
  tagline: string
  accent: string
  icon: React.ReactNode
}

const ICON_SIZE = 14

const Icons = {
  Timeline: () => (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <rect x="3" y="4" width="7" height="5" rx="1" />
      <rect x="14" y="10" width="7" height="5" rx="1" />
      <rect x="3" y="17" width="7" height="5" rx="1" />
    </svg>
  ),
  Magazine: () => (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M4 10h16" />
      <path d="M10 10v10" />
    </svg>
  ),
  Bento: () => (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="4" rx="1" />
      <rect x="13" y="9" width="8" height="12" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
    </svg>
  ),
  Kanban: () => (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="9.5" y="4" width="5" height="10" rx="1" />
      <rect x="16" y="4" width="5" height="13" rx="1" />
    </svg>
  ),
  Calendar: () => (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  ),
  Command: () => (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
}

const IconStar = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const VARIANTS_META: VariantMetaLite[] = [
  { id: 'final', shortLabel: 'Final', longLabel: 'Versão Final', tagline: 'Síntese curada das melhores ideias', accent: '#155F59', icon: <IconStar /> },
  { id: 'timeline-classica', shortLabel: 'Timeline', longLabel: 'Timeline Clássica', tagline: 'Narrativa cronológica editorial', accent: '#1E7A73', icon: <Icons.Timeline /> },
  { id: 'magazine-editorial', shortLabel: 'Editorial', longLabel: 'Magazine Editorial', tagline: 'Luxo serif ink & gold', accent: '#D4AF37', icon: <Icons.Magazine /> },
  { id: 'dashboard-analytics', shortLabel: 'Analytics', longLabel: 'Dashboard Analytics', tagline: 'BI bento grid com cross-filter', accent: '#6366F1', icon: <Icons.Bento /> },
  { id: 'kanban-status', shortLabel: 'Kanban', longLabel: 'Kanban por Status', tagline: 'Triagem visual 3 colunas', accent: '#10B981', icon: <Icons.Kanban /> },
  { id: 'calendar-heatmap', shortLabel: 'Calendar', longLabel: 'Calendar Heatmap', tagline: 'Descoberta de padrões temporais', accent: '#0EA5E9', icon: <Icons.Calendar /> },
  { id: 'command-inbox', shortLabel: 'Command', longLabel: 'Command Inbox', tagline: 'Keyboard-driven power user', accent: '#0F172A', icon: <Icons.Command /> },
]

interface VariantSelectorProps {
  active: HistoryVariantId
  onChange: (v: HistoryVariantId) => void
}

export function VariantSelector({ active, onChange }: VariantSelectorProps) {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="flex items-center gap-2 p-1.5 bg-gradient-to-br from-white to-gray-50/80 border border-gray-200 rounded-2xl shadow-sm overflow-x-auto scrollbar-thin">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-3 whitespace-nowrap hidden md:inline">
          Variante
        </span>

        <div className="flex items-center gap-1 flex-1 min-w-0">
          {VARIANTS_META.map((v) => {
            const isActive = v.id === active
            return (
              <motion.button
                key={v.id}
                onClick={() => onChange(v.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-700',
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                title={`${v.longLabel} — ${v.tagline}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="variant-active-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${v.accent} 0%, ${v.accent}dd 100%)`,
                      boxShadow: `0 4px 14px ${v.accent}33`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{v.icon}</span>
                  <span className="hidden sm:inline">{v.shortLabel}</span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <button
          onClick={() => setInfoOpen((o) => !o)}
          className={cn(
            'flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer',
            infoOpen && 'text-gray-700 bg-gray-100',
          )}
          title="Comparativo das variantes"
        >
          <Icons.Info />
          <span className="hidden sm:inline font-medium">Info</span>
        </button>
      </div>

      <AnimatePresence>
        {infoOpen && <VariantInfoPopover onClose={() => setInfoOpen(false)} active={active} onSelect={onChange} />}
      </AnimatePresence>

      {/* Verifica se as variantes expostas cobrem todas definidas no tipo */}
      {HISTORY_VARIANT_IDS.length !== VARIANTS_META.length && (
        <span className="hidden">variant-count-mismatch</span>
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Info popover
// ---------------------------------------------------------------------------

function VariantInfoPopover({
  onClose,
  active,
  onSelect,
}: {
  onClose: () => void
  active: HistoryVariantId
  onSelect: (v: HistoryVariantId) => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="absolute right-0 top-full mt-2 z-50 w-[540px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-5 py-4 text-white">
          <p className="text-[10px] uppercase tracking-widest text-primary-200">Explorar variantes</p>
          <h3 className="text-base font-bold mt-0.5">6 propostas de histórico</h3>
          <p className="text-xs text-primary-100/80 mt-1">Cada uma com identidade visual e interação próprias. Clique para experimentar.</p>
        </div>
        <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
          {VARIANTS_META.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onSelect(v.id)
                onClose()
              }}
              className={cn(
                'w-full text-left flex items-start gap-3 p-4 hover:bg-gray-50 transition group cursor-pointer',
                active === v.id && 'bg-primary-50/60',
              )}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                style={{ background: `linear-gradient(135deg, ${v.accent} 0%, ${v.accent}dd 100%)` }}
              >
                {v.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-800">{v.longLabel}</p>
                  {active === v.id && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{v.tagline}</p>
              </div>
              <span className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  )
}
