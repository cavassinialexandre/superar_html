import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import { UserIcon } from '@/assets/icons'
import type { TeamMember } from '@/types'

interface TeamMemberFormProps {
  member: TeamMember | null
  open: boolean
  onSubmit: (data: {
    name: string
    role: 'facilitator' | 'auditor' | 'member'
  }) => void
  onCancel: () => void
  loading?: boolean
}

const ROLE_OPTIONS: { value: 'facilitator' | 'auditor' | 'member'; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'facilitator',
    label: 'Facilitador',
    description: 'Conduz e organiza as atividades',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    value: 'auditor',
    label: 'Auditor',
    description: 'Verifica e valida os processos',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    value: 'member',
    label: 'Membro',
    description: 'Participa das atividades do grupo',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 10-16 0" />
      </svg>
    ),
  },
]

export function TeamMemberForm({
  member,
  open,
  onSubmit,
  onCancel,
  loading = false,
}: TeamMemberFormProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState<'facilitator' | 'auditor' | 'member'>('member')
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (member) {
      setName(member.name)
      setRole(member.role)
    } else {
      setName('')
      setRole('member')
    }
    setErrors({})
  }, [member, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrors({ name: 'Nome é obrigatório' })
      return
    }

    onSubmit({
      name: name.trim(),
      role,
    })
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={member ? 'Editar Membro' : 'Novo Membro'}
      subtitle={member
        ? 'Atualize as informações do membro'
        : 'Adicione um novo membro à equipe'
      }
      headerIcon={<UserIcon size={64} />}
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

          {/* Função */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Função
            </label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((option) => {
                const isSelected = role === option.value
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
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
              {member ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
