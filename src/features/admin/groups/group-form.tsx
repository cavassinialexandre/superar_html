import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { GroupsIcon } from '@/assets/icons'
import { groupTypes, areas, managements } from '@/mocks/data'
import type { Group } from '@/types'

interface GroupFormProps {
  group: Group | null
  open: boolean
  onSubmit: (data: {
    name: string
    groupTypeId: string
    groupTypeName: string
    areaId: string
    areaName: string
    managementId: string
    managementName: string
    status: 'active' | 'inactive'
  }) => void
  onCancel: () => void
  loading?: boolean
}

export function GroupForm({
  group,
  open,
  onSubmit,
  onCancel,
  loading = false,
}: GroupFormProps) {
  const [name, setName] = useState('')
  const [groupTypeId, setGroupTypeId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [errors, setErrors] = useState<{ name?: string; groupTypeId?: string; areaId?: string }>({})

  useEffect(() => {
    if (group) {
      setName(group.name)
      setGroupTypeId(group.groupTypeId)
      setAreaId(group.areaId)
      setStatus(group.status)
    } else {
      setName('')
      setGroupTypeId(groupTypes[0]?.id || '')
      setAreaId(areas[0]?.id || '')
      setStatus('active')
    }
    setErrors({})
  }, [group, open])

  const selectedGroupType = groupTypes.find(gt => gt.id === groupTypeId)
  const selectedArea = areas.find(a => a.id === areaId)
  const selectedManagement = selectedArea ? managements.find(m => m.id === selectedArea.managementId) : undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; groupTypeId?: string; areaId?: string } = {}
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    if (!groupTypeId) {
      newErrors.groupTypeId = 'Tipo de grupo é obrigatório'
    }
    if (!areaId) {
      newErrors.areaId = 'Área é obrigatória'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!selectedGroupType || !selectedArea || !selectedManagement) return

    onSubmit({
      name: name.trim(),
      groupTypeId,
      groupTypeName: selectedGroupType.name,
      areaId,
      areaName: selectedArea.name,
      managementId: selectedManagement.id,
      managementName: selectedManagement.name,
      status,
    })
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={group ? 'Editar Grupo' : 'Novo Grupo'}
      subtitle={group
        ? 'Atualize as informações do grupo'
        : 'Preencha as informações para criar um novo grupo'
      }
      headerIcon={<GroupsIcon size={64} />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome do Grupo
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Equipe Alpha"
              error={!!errors.name}
              className={name.trim() && !errors.name ? 'border-primary-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Tipo de Grupo */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Tipo de Grupo
            </label>
            <div className="space-y-2">
              {groupTypes.map((gt) => {
                const isSelected = groupTypeId === gt.id
                return (
                  <motion.button
                    key={gt.id}
                    type="button"
                    onClick={() => setGroupTypeId(gt.id)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-primary-500 bg-white shadow-sm ring-1 ring-primary-100'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'text-sm font-semibold block',
                        isSelected ? 'text-primary-800' : 'text-gray-700'
                      )}>
                        {gt.name}
                      </span>
                      <span className="text-xs text-gray-500">Meta: {gt.defaultGoal}%</span>
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width={12} height={12} viewBox="0 0 24 24"
                          fill="none" stroke="white" strokeWidth={3}
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            {errors.groupTypeId && (
              <p className="text-xs text-red-500">{errors.groupTypeId}</p>
            )}
          </div>

          {/* Área */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Área
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {areas.map((area) => {
                const isSelected = areaId === area.id
                return (
                  <motion.button
                    key={area.id}
                    type="button"
                    onClick={() => setAreaId(area.id)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-primary-500 bg-white shadow-sm ring-1 ring-primary-100'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'text-sm font-semibold block',
                        isSelected ? 'text-primary-800' : 'text-gray-700'
                      )}>
                        {area.name}
                      </span>
                      <span className="text-xs text-gray-500">{area.managementName}</span>
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width={12} height={12} viewBox="0 0 24 24"
                          fill="none" stroke="white" strokeWidth={3}
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            {errors.areaId && (
              <p className="text-xs text-red-500">{errors.areaId}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
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
                  selectedBg: 'bg-white ring-1 ring-primary-100',
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
                  selectedBg: 'bg-white ring-1 ring-rose-100',
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
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
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
              {group ? 'Salvar Alterações' : 'Criar Grupo'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
