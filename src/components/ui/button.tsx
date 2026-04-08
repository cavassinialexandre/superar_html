import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'minimal' | 'premium'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-800 text-white border-primary-800 hover:bg-primary-700 active:bg-primary-900 shadow-sm hover:shadow-md',
  secondary: 'bg-transparent text-primary-800 border-primary-800 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200',
  destructive: 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm',
  success: 'bg-green-500 text-white border-green-500 hover:bg-green-600 active:bg-green-800 shadow-sm',
  minimal: 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
  premium: 'bg-gradient-to-br from-[#155F59] via-[#103734] to-[#0c2926] text-white border-[#155F59]/50 hover:from-[#1E7A73] hover:via-[#155F59] hover:to-[#103734] hover:shadow-lg hover:shadow-[#155F59]/30 active:from-[#103734] active:via-[#0c2926] active:to-[#081c1a] shadow-md shadow-[#103734]/25 hover:ring-1 hover:ring-[#d4af37]/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
  md: 'text-sm px-5 py-2.5 rounded-lg gap-2',
  lg: 'text-base px-6 py-3 rounded-lg gap-2.5',
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, isLoading, leftIcon, rightIcon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold border transition-all duration-150 ease-out cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
)

Button.displayName = 'Button'
