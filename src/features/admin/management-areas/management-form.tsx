import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button, Input } from '@/components/ui'
import { AlertCircleIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Management, UnitId } from '@/types'

interface ManagementFormData {
  name: string
  unitId: UnitId
  status: 'active' | 'inactive'
}

interface ManagementFormProps {
  management?: Management
  open: boolean
  onClose: () => void
  onSubmit: (data: ManagementFormData) => void
  loading?: boolean
}

export function ManagementForm({
  management,
  open,
  onClose,
  onSubmit,
  loading = false,
}: ManagementFormProps) {
  const isEditing = !!management

  const [formData, setFormData] = useState<ManagementFormData>({
    name: '',
    unitId: 'puma',
    status: 'active',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ManagementFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ManagementFormData, boolean>>>({})

  useEffect(() => {
    if (open) {
      if (management) {
        setFormData({
          name: management.name,
          unitId: management.unitId,
          status: management.status,
        })
      } else {
        setFormData({
          name: '',
          unitId: 'puma',
          status: 'active',
        })
      }
      setErrors({})
      setTouched({})
    }
  }, [open, management])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ManagementFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da gerência é obrigatório'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true })
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = <K extends keyof ManagementFormData>(
    field: K,
    value: ManagementFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validate()
    }
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Gerência' : 'Nova Gerência'}
      subtitle={isEditing ? `ID: ${management?.id}` : 'Preencha os dados da nova gerência'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nome da Gerência <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              placeholder="Ex: Gerência de Produção"
              error={!!errors.name}
              disabled={loading}
              className={formData.name.trim() && !errors.name ? 'border-primary-500' : ''}
            />
            {errors.name && touched.name && (
              <p className="flex items-center gap-1 text-xs text-rose-500">
                <AlertCircleIcon size={12} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                {
                  value: 'active' as const,
                  label: 'Ativa',
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
                  label: 'Inativa',
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
                const isSelected = formData.status === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('status', opt.value)}
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
                <h4 className="text-sm font-medium text-blue-900">Dica</h4>
                <p className="text-xs text-blue-700 mt-1">
                  {isEditing
                    ? 'As áreas vinculadas a esta gerência não serão afetadas ao alterar o status.'
                    : 'Após criar a gerência, você poderá adicionar áreas clicando em "Nova Área" no card da gerência.'}
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
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Gerência'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
