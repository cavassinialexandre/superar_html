import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import type { User, UserProfile } from '@/types'

interface UserFormProps {
  user: User | null
  open: boolean
  onSubmit: (data: {
    name: string
    profiles: UserProfile[]
    unitId: 'puma' | 'monte-alegre'
    status: 'active' | 'inactive'
  }) => void
  onCancel: () => void
  loading?: boolean
}

const PROFILE_OPTIONS: { value: UserProfile; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15l-2 5l9-11h-5l2-5l-9 11h5z" />
      </svg>
    ),
  },
  {
    value: 'evaluator',
    label: 'Avaliador',
    description: 'Realiza auditorias e avaliações',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
]

export function UserForm({
  user,
  open,
  onSubmit,
  onCancel,
  loading = false,
}: UserFormProps) {
  const [name, setName] = useState('')
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [unitId, setUnitId] = useState<'puma' | 'monte-alegre'>('puma')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [errors, setErrors] = useState<{ name?: string; profiles?: string }>({})

  useEffect(() => {
    if (user) {
      setName(user.name)
      setProfiles(user.profiles)
      setUnitId(user.unitId)
      setStatus(user.status)
    } else {
      setName('')
      setProfiles([])
      setUnitId('puma')
      setStatus('active')
    }
    setErrors({})
  }, [user, open])

  const toggleProfile = (profile: UserProfile) => {
    setProfiles(prev =>
      prev.includes(profile)
        ? prev.filter(p => p !== profile)
        : [...prev, profile]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; profiles?: string } = {}
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    if (profiles.length === 0) {
      newErrors.profiles = 'Selecione pelo menos um perfil'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      name: name.trim(),
      profiles,
      unitId,
      status,
    })
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={user ? 'Editar Usuário' : 'Novo Usuário'}
      subtitle={user
        ? 'Atualize as informações do usuário'
        : 'Preencha as informações para criar um novo usuário'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              error={!!errors.name}
              className={name.trim() && !errors.name ? 'border-primary-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Perfis — Cards Premium */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Perfis <span className="text-gray-400 text-xs">(selecione um ou mais)</span>
            </label>
            <div className="space-y-2">
              {PROFILE_OPTIONS.map((option) => {
                const isSelected = profiles.includes(option.value)
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => toggleProfile(option.value)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'text-sm font-semibold block',
                        isSelected ? 'text-primary-800' : 'text-gray-700'
                      )}>
                        {option.label}
                      </span>
                      <span className="text-xs text-gray-500">{option.description}</span>
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
                          width={12}
                          height={12}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            {errors.profiles && (
              <p className="text-xs text-red-500">{errors.profiles}</p>
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
                  value: 'active',
                  label: 'Ativo',
                  description: 'Pode acessar o sistema normalmente',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ),
                  selectedBorder: 'border-primary-500',
                  selectedBg: 'bg-primary-50/50',
                  selectedIcon: 'bg-primary-100 text-primary-700',
                  selectedText: 'text-primary-800',
                  selectedCheck: 'border-primary-500 bg-primary-500',
                },
                {
                  value: 'inactive',
                  label: 'Inativo',
                  description: 'Acesso ao sistema bloqueado',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                  ),
                  selectedBorder: 'border-rose-500',
                  selectedBg: 'bg-rose-50/50',
                  selectedIcon: 'bg-rose-100 text-rose-600',
                  selectedText: 'text-rose-800',
                  selectedCheck: 'border-rose-500 bg-rose-500',
                },
              ] as const).map((opt) => {
                const isSelected = status === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value as 'active' | 'inactive')}
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
              {user ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
