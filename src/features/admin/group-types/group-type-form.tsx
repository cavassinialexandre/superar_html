import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui'
import { AlertCircleIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { GroupType } from '@/types'

interface GroupTypeFormProps {
  groupType: GroupType | null
  open: boolean
  onSubmit: (data: { name: string; defaultGoal: number; status: 'active' | 'inactive' }) => void
  onCancel: () => void
  loading?: boolean
}

export function GroupTypeForm({ groupType, open, onSubmit, onCancel, loading = false }: GroupTypeFormProps) {
  const [name, setName] = useState('')
  const [defaultGoal, setDefaultGoal] = useState(80)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [errors, setErrors] = useState<{ name?: string; defaultGoal?: string }>({})
  const [touched, setTouched] = useState<{ name?: boolean; defaultGoal?: boolean }>({})

  const isEditing = !!groupType

  useEffect(() => {
    if (open) {
      if (groupType) {
        setName(groupType.name)
        setDefaultGoal(groupType.defaultGoal)
        setStatus(groupType.status)
      } else {
        setName('')
        setDefaultGoal(80)
        setStatus('active')
      }
      setErrors({})
      setTouched({})
    }
  }, [open, groupType])

  const validate = (): boolean => {
    const newErrors: { name?: string; defaultGoal?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (defaultGoal < 0 || defaultGoal > 100) {
      newErrors.defaultGoal = 'Meta deve estar entre 0 e 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, defaultGoal: true })
    if (validate()) {
      onSubmit({ name: name.trim(), defaultGoal, status })
    }
  }

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setDefaultGoal(value)
    } else if (e.target.value === '') {
      setDefaultGoal(0)
    }
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={isEditing ? 'Editar Tipo de Grupo' : 'Novo Tipo de Grupo'}
      subtitle={isEditing ? `ID: ${groupType?.id}` : 'Preencha os dados do novo tipo de grupo'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome <span className="text-rose-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              placeholder="Ex: Operacional"
              disabled={loading}
              error={!!(errors.name && touched.name)}
              className={cn(
                name.trim() && !errors.name ? 'border-primary-500' : '',
                errors.name && touched.name && 'border-rose-500 focus-visible:ring-rose-500'
              )}
            />
            {errors.name && touched.name && (
              <p className="flex items-center gap-1 text-xs text-rose-500">
                <AlertCircleIcon size={12} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Default Goal */}
          <div className="space-y-2">
            <Label htmlFor="defaultGoal">Meta Padrão (%)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="defaultGoal"
                type="number"
                min={0}
                max={100}
                value={defaultGoal}
                onChange={handleGoalChange}
                disabled={loading}
                className={cn(
                  'w-24',
                  defaultGoal >= 0 && defaultGoal <= 100 && !errors.defaultGoal ? 'border-primary-500' : '',
                  errors.defaultGoal && touched.defaultGoal && 'border-rose-500 focus-visible:ring-rose-500'
                )}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={defaultGoal}
                onChange={(e) => setDefaultGoal(parseInt(e.target.value, 10))}
                disabled={loading}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 w-12">{defaultGoal}%</span>
            </div>
            {errors.defaultGoal && touched.defaultGoal && (
              <p className="flex items-center gap-1 text-xs text-rose-500">
                <AlertCircleIcon size={12} />
                {errors.defaultGoal}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {([
                {
                  value: 'active' as const,
                  label: 'Ativo',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ),
                  selectedBorder: 'border-primary-500',
                  selectedBg: 'bg-primary-50/50',
                  selectedIcon: 'bg-primary-100 text-primary-700',
                  selectedText: 'text-primary-800',
                },
                {
                  value: 'inactive' as const,
                  label: 'Inativo',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                  ),
                  selectedBorder: 'border-rose-500',
                  selectedBg: 'bg-rose-50/50',
                  selectedIcon: 'bg-rose-100 text-rose-600',
                  selectedText: 'text-rose-800',
                },
              ]).map((opt) => {
                const isSelected = status === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer',
                      isSelected
                        ? `${opt.selectedBorder} ${opt.selectedBg} shadow-sm`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected
                          ? opt.selectedIcon
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {opt.icon}
                    </div>
                    <span className={cn(
                      'text-sm font-semibold',
                      isSelected ? opt.selectedText : 'text-gray-700'
                    )}>
                      {opt.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Informação</h4>
                <p className="text-xs text-blue-700 mt-1">
                  {isEditing
                    ? 'As sequências existentes não serão afetadas ao alterar a meta padrão.'
                    : 'Após criar o tipo de grupo, você poderá adicionar sequências clicando em "Nova Sequência" no card do tipo.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-100/60 bg-gradient-to-b from-gray-50/80 to-gray-100/60">
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Tipo'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
