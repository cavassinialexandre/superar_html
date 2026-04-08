import { useEffect } from 'react'
import { Button } from './button'
import { AlertTriangleIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  itemName?: string
  itemMeta?: { label: string; value: string }[]
  warning?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'destructive' | 'warning' | 'info'
}

const variantStyles = {
  destructive: {
    iconBorder: 'border-red-200',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-900',
    buttonHover: 'hover:bg-red-800',
  },
  warning: {
    iconBorder: 'border-amber-200',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    buttonBg: 'bg-amber-600',
    buttonHover: 'hover:bg-amber-700',
  },
  info: {
    iconBorder: 'border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    buttonBg: 'bg-blue-600',
    buttonHover: 'hover:bg-blue-700',
  },
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemMeta,
  warning,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  variant = 'destructive',
}: ConfirmDialogProps) {
  const styles = variantStyles[variant]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full max-w-md',
          'bg-white',
          'rounded-3xl',
          'p-10',
          'text-center',
          'shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_6px_-4px_rgba(0,0,0,0.05),0_20px_40px_-8px_rgba(0,0,0,0.12)]'
        )}
      >
        <div
          className={cn(
            'w-[72px] h-[72px] mx-auto mb-8',
            'rounded-2xl',
            'flex items-center justify-center',
            'border-[1.5px]',
            styles.iconBorder,
            styles.iconBg,
            'shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)]'
          )}
        >
          <AlertTriangleIcon size={32} className={styles.iconColor} />
        </div>

        <div className="mb-6">
          <span
            className={cn(
              'inline-block',
              'text-[11px] font-semibold',
              'tracking-[0.25em] uppercase',
              'text-gray-400',
              'relative',
              'before:absolute before:left-0 before:right-0 before:top-1/2',
              'before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent',
              'before:-translate-y-1/2',
              'px-4'
            )}
          >
            <span className="relative z-10 bg-white px-2">
              Confirmação de Exclusão
            </span>
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[320px] mx-auto">
            {description}
          </p>
        )}

        {(itemName || itemMeta) && (
          <div
            className={cn(
              'bg-gray-50/80',
              'border border-gray-100',
              'rounded-2xl',
              'p-5',
              'mb-6',
              'text-left'
            )}
          >
            {itemName && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-700 text-xs font-bold">
                  {itemName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900">{itemName}</span>
              </div>
            )}

            {itemMeta && itemMeta.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200/60">
                {itemMeta.map((meta, index) => (
                  <div key={index}>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">
                      {meta.label}
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {meta.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {warning && (
          <div className="flex gap-2 items-start mb-6 text-left">
            <span className="text-amber-500 mt-0.5">⚠️</span>
            <p className="text-xs text-amber-600/80 leading-relaxed">
              {warning}
            </p>
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-36 h-12 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            className={cn(
              'w-36 h-12 rounded-xl font-medium text-white',
              styles.buttonBg,
              styles.buttonHover,
              'shadow-lg shadow-red-900/20',
              'transition-all duration-150',
              'hover:shadow-xl hover:shadow-red-900/30',
              'active:translate-y-px'
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
