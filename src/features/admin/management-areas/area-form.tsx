import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button, Input, Badge } from '@/components/ui'
import { AlertCircleIcon, SearchIcon, FactoryIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { Area, Management, UnitId } from '@/types'

interface AreaFormData {
  name: string
  managementId: string
  status: 'active' | 'inactive'
}

interface AreaFormProps {
  area?: Area
  preselectedManagementId?: string
  managements: Management[]
  open: boolean
  onClose: () => void
  onSubmit: (data: AreaFormData) => void
  loading?: boolean
}

export function AreaForm({
  area,
  preselectedManagementId,
  managements,
  open,
  onClose,
  onSubmit,
  loading = false,
}: AreaFormProps) {
  const isEditing = !!area

  const [formData, setFormData] = useState<AreaFormData>({
    name: '',
    managementId: '',
    status: 'active',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AreaFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AreaFormData, boolean>>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showManagementSelect, setShowManagementSelect] = useState(false)

  useEffect(() => {
    if (open) {
      if (area) {
        setFormData({
          name: area.name,
          managementId: area.managementId,
          status: area.status,
        })
      } else {
        setFormData({
          name: '',
          managementId: preselectedManagementId || '',
          status: 'active',
        })
      }
      setErrors({})
      setTouched({})
      setSearchQuery('')
      setShowManagementSelect(false)
    }
  }, [open, area, preselectedManagementId])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AreaFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da área é obrigatório'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.managementId) {
      newErrors.managementId = 'Selecione uma gerência'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, managementId: true })
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = <K extends keyof AreaFormData>(
    field: K,
    value: AreaFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validate()
    }
  }

  const filteredManagements = managements.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedManagement = managements.find(m => m.id === formData.managementId)

  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Área' : 'Nova Área'}
      subtitle={isEditing ? `ID: ${area?.id}` : 'Preencha os dados da nova área'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nome da Área <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              placeholder="Ex: Linha de Montagem A"
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

          {/* Management Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gerência <span className="text-rose-500">*</span>
            </label>

            {!showManagementSelect && selectedManagement ? (
              <div className="relative">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                    <FactoryIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {selectedManagement.name}
                    </p>
                    <Badge variant={selectedManagement.status === 'active' ? 'success' : 'default'} size="sm">
                      {selectedManagement.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowManagementSelect(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Alterar
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar gerência..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-100 rounded-xl p-1">
                  {filteredManagements.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhuma gerência encontrada
                    </p>
                  ) : (
                    filteredManagements.map((mgmt) => (
                      <button
                        key={mgmt.id}
                        type="button"
                        onClick={() => {
                          handleChange('managementId', mgmt.id)
                          setShowManagementSelect(false)
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                          formData.managementId === mgmt.id
                            ? 'bg-primary-50 text-primary-900'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                          mgmt.status === 'active'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-500'
                        )}>
                          {mgmt.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{mgmt.name}</p>
                        </div>
                        {formData.managementId === mgmt.id && (
                          <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))
                  )}
                </div>

                {selectedManagement && (
                  <button
                    type="button"
                    onClick={() => setShowManagementSelect(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancelar alteração
                  </button>
                )}
              </div>
            )}

            {errors.managementId && touched.managementId && !selectedManagement && (
              <p className="flex items-center gap-1 text-xs text-rose-500">
                <AlertCircleIcon size={12} />
                {errors.managementId}
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
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-emerald-900">Informação</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  {isEditing
                    ? 'Alterar a gerência de uma área pode afetar os grupos vinculados a ela.'
                    : 'A área será criada vinculada à gerência selecionada e poderá ser associada a grupos posteriormente.'}
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
              {isEditing ? 'Salvar Alterações' : 'Criar Área'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
