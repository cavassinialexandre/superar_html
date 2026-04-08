import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangleIcon, XIcon } from '@/assets/icons'

interface AccessDeniedToastProps {
  message: string | null
  onDismiss: () => void
}

export function AccessDeniedToast({ message, onDismiss }: AccessDeniedToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-6 left-1/2 z-[100] w-full max-w-lg"
        >
          <div className="bg-white border border-rose-200 rounded-xl shadow-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangleIcon size={18} className="text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Acesso Negado</p>
              <p className="text-xs text-gray-500 mt-0.5">{message}</p>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
            >
              <XIcon size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
