import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon } from '@/assets/icons'
import { Button } from './button'

interface FormDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  onSubmit?: () => void
  submitLabel?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function FormDialog({ open, onClose, title, children, onSubmit, submitLabel = 'Salvar', loading, size = 'md' }: FormDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[85vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-heading text-lg font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {children}
            </div>

            {/* Footer */}
            {onSubmit && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button onClick={onSubmit} disabled={loading}>
                  {loading ? 'Salvando...' : submitLabel}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
