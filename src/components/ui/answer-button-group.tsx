import { cn } from '@/lib/cn'
import { CheckCircleIcon, XIcon, AlertTriangleIcon } from '@/assets/icons'
import type { AnswerValue } from '@/types'

interface AnswerButtonGroupProps {
  value: AnswerValue | null
  onChange: (value: AnswerValue) => void
  variant?: 'buttons' | 'segmented' | 'large-cards'
  className?: string
}

const answerOptions: { value: AnswerValue; label: string; shortLabel: string; description: string; color: string; selectedColor: string }[] = [
  { value: 'yes', label: 'Sim', shortLabel: 'S', description: 'Requisito atendido', color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100', selectedColor: 'bg-green-500 text-white border-green-500' },
  { value: 'partial', label: 'Parcial', shortLabel: 'P', description: 'Parcialmente atendido', color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100', selectedColor: 'bg-yellow-500 text-white border-yellow-500' },
  { value: 'no', label: 'Não', shortLabel: 'N', description: 'Não atendido', color: 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100', selectedColor: 'bg-rose-500 text-white border-rose-500' },
  { value: 'na', label: 'N/A', shortLabel: '-', description: 'Não aplicável', color: 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100', selectedColor: 'bg-gray-400 text-white border-gray-400' },
]

const answerIcons: Record<AnswerValue, typeof CheckCircleIcon> = {
  yes: CheckCircleIcon,
  partial: AlertTriangleIcon,
  no: XIcon,
  na: XIcon,
}

function ButtonsVariant({ value, onChange, className }: Omit<AnswerButtonGroupProps, 'variant'>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {answerOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer',
            value === opt.value ? opt.selectedColor : opt.color
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function SegmentedVariant({ value, onChange, className }: Omit<AnswerButtonGroupProps, 'variant'>) {
  return (
    <div className={cn('inline-flex rounded-lg border border-gray-200 overflow-hidden', className)}>
      {answerOptions.map((opt, i) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer',
            i > 0 && 'border-l border-gray-200',
            value === opt.value ? opt.selectedColor : 'bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function LargeCardsVariant({ value, onChange, className }: Omit<AnswerButtonGroupProps, 'variant'>) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3', className)}>
      {answerOptions.map((opt) => {
        const Icon = answerIcons[opt.value]
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer min-h-[80px]',
              isSelected
                ? `${opt.selectedColor} border-current shadow-md scale-[1.02]`
                : `${opt.color} hover:scale-[1.01]`
            )}
          >
            <Icon size={24} />
            <span className="text-sm font-bold">{opt.label}</span>
            <span className={cn('text-[10px] font-medium', isSelected ? 'text-white/80' : 'opacity-60')}>
              {opt.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function AnswerButtonGroup({ variant = 'buttons', ...props }: AnswerButtonGroupProps) {
  switch (variant) {
    case 'segmented':
      return <SegmentedVariant {...props} />
    case 'large-cards':
      return <LargeCardsVariant {...props} />
    default:
      return <ButtonsVariant {...props} />
  }
}
