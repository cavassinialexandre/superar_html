import { cn } from '@/lib/cn'

interface StatusTagProps {
  active: boolean
  onChange?: () => void
  activeLabel?: string
  inactiveLabel?: string
}

function TagContent({ active, activeLabel, inactiveLabel }: Pick<StatusTagProps, 'active' | 'activeLabel' | 'inactiveLabel'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[76px] px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full shadow-sm transition-all duration-300',
        active
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200/50 hover:shadow-md hover:shadow-emerald-300/40'
          : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:shadow-md hover:shadow-gray-300/40',
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0', active ? 'bg-emerald-200' : 'bg-gray-300')} />
      {active ? (activeLabel ?? 'Ativo') : (inactiveLabel ?? 'Inativo')}
    </span>
  )
}

export function StatusTag({ active, onChange, activeLabel, inactiveLabel }: StatusTagProps) {
  if (onChange) {
    return (
      <button type="button" onClick={onChange}>
        <TagContent active={active} activeLabel={activeLabel} inactiveLabel={inactiveLabel} />
      </button>
    )
  }
  return <TagContent active={active} activeLabel={activeLabel} inactiveLabel={inactiveLabel} />
}
