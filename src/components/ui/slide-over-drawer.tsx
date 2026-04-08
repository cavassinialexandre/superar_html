import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon } from '@/assets/icons'

interface SlideOverDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  footer?: ReactNode
  headerIcon?: ReactNode
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function SlideOverDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  headerIcon,
}: SlideOverDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            className={`absolute top-0 right-0 bottom-0 w-full ${sizeClasses[size]} bg-[#FCFCFC] shadow-2xl flex flex-col`}
          >
            {/* Header Premium */}
            <div className="flex-none relative overflow-hidden">
              {/* Base gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #0C2B28 0%, #103734 45%, #155F59 100%)',
                }}
              />

              {/* Dot grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Ambient glow orbs */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary-400/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-green-500/8 blur-xl" />

              {/* Decorative icon (large, faded) */}
              {headerIcon && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-white/[0.06]">
                  <div className="w-16 h-16 [&_svg]:w-full [&_svg]:h-full">
                    {headerIcon}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative flex items-start justify-between px-6 py-5">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white font-heading tracking-tight">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-primary-200/80 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 p-2 rounded-lg text-primary-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex-shrink-0"
                    aria-label="Fechar"
                  >
                    <XIcon size={20} />
                  </button>
                )}
              </div>

              {/* Gold accent line */}
              <div
                className="relative h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #d4af37 0%, #b8860b 40%, #d4af37 60%, transparent 100%)',
                }}
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer Premium */}
            {footer && (
              <div className="flex-none relative">
                {/* Gradiente sutil de separação */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50/80 to-transparent pointer-events-none" />

                {/* Container do footer */}
                <div className="px-6 py-5 bg-gradient-to-b from-gray-50/80 to-gray-100/60 border-t border-primary-100/60">
                  {footer}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
