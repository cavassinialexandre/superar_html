import { forwardRef, type InputHTMLAttributes } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, onClear, value, ...props }, ref) => {
    const hasValue = value && String(value).length > 0
    const showClear = onClear && hasValue

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          className={cn(
            'w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-base text-gray-700',
            'placeholder:text-gray-400',
            'hover:border-gray-300',
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            'transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            icon && 'pl-10',
            showClear && 'pr-9',
            className,
          )}
          {...props}
        />
        <AnimatePresence>
          {showClear && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              type="button"
              onClick={onClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

interface SearchInputProps extends Omit<InputProps, 'icon'> {
  placeholder?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      }
      className={cn('', className)}
      {...props}
    />
  )
)

SearchInput.displayName = 'SearchInput'

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('block text-sm font-medium text-gray-600 mb-1.5', className)} {...props}>
      {children}
    </label>
  )
}

export function Textarea({ className, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      className={cn(
        'w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-base text-gray-700 min-h-[80px] resize-y',
        'placeholder:text-gray-400',
        'hover:border-gray-300',
        'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        'transition-all duration-150',
        error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
        className,
      )}
      {...props}
    />
  )
}
