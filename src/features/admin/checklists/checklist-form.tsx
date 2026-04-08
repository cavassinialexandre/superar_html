import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import type { Checklist } from '@/types'

interface ChecklistFormProps {
  checklist: Checklist | null
  open: boolean
  onSubmit: (data: {
    name: string
    status: 'active' | 'inactive'
  }) => void
  onCancel: () => void
  loading?: boolean
}

export function ChecklistForm({
  checklist,
  open,
  onSubmit,
  onCancel,
  loading = false,
}: ChecklistFormProps) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (checklist) {
      setName(checklist.name)
      setStatus(checklist.status)
    } else {
      setName('')
      setStatus('active')
    }
    setErrors({})
  }, [checklist, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string } = {}
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: name.trim(),
      status,
    })
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={checklist ? 'Editar Checklist' : 'Novo Checklist'}
      subtitle={checklist
        ? 'Atualize as informações do checklist'
        : 'Preencha as informações para criar um novo checklist'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome do Checklist
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Checklist Operacional"
              error={!!errors.name}
              className={name.trim() && !errors.name ? 'border-primary-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Info sobre revisões */}
          {checklist && (
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Informações do Checklist</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><span className="font-medium">ID:</span> {checklist.id}</p>
                <p><span className="font-medium">Revisões:</span> {checklist.revisions.length}</p>
                <p><span className="font-medium">Total de Perguntas:</span> {checklist.revisions.reduce((acc, r) => acc + r.questions.length, 0)}</p>
              </div>
            </div>
          )}

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
              {checklist ? 'Salvar Alterações' : 'Criar Checklist'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
