import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, ConfirmDialog } from '@/components/ui'
import { SearchInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
} from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { User, UserProfile } from '@/types'

interface UsersAccordionViewProps {
  users: User[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddUser: () => void
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onToggleStatus: (userId: string) => void
}

const profileLabels: Record<UserProfile, string> = {
  admin: 'Admin',
  evaluator: 'Avaliador',
  user: 'Usuário'
}

const profileGradients: Record<UserProfile, string> = {
  admin: 'bg-gradient-to-r from-violet-500/85 to-indigo-500/85 text-white',
  evaluator: 'bg-gradient-to-r from-blue-500/85 to-indigo-400/85 text-white',
  user: 'bg-gradient-to-r from-slate-400 to-gray-500 text-white',
}

// Tag unificada para perfis e status
function GradientTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[76px] px-3 py-1 text-[11px] font-bold uppercase tracking-wide rounded-full shadow-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}

// Ícone de usuário
function UserAvatarIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  )
}

// Gerar iniciais do nome
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UsersAccordionView({
  users,
  searchQuery,
  onSearchChange,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
}: UsersAccordionViewProps) {
  // Estado do modal de confirmação
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete)
      setDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  // Filtra por busca
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users
    const query = searchQuery.toLowerCase()
    return users.filter(u =>
      u.name.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  if (users.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header minimalista */}
        <div className="flex items-center gap-3 justify-end">
          <SearchInput
            placeholder="Buscar usuário..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            className="w-72"
          />
          <Button variant="premium" onClick={onAddUser}>
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Novo Usuário</span>
          </Button>
        </div>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserAvatarIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum usuário encontrado</p>
          <p className="text-sm text-gray-400 mt-1">
            Crie um novo usuário para começar
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {/* Header minimalista */}
      <div className="flex items-center gap-3 mb-4 justify-end">
        <SearchInput
          placeholder="Buscar usuário..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          className="w-72"
        />
        <Button variant="premium" onClick={onAddUser}>
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Novo Usuário</span>
        </Button>
      </div>

      {/* Header da lista */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-5">Usuário</div>
        <div className="col-span-3">Perfis</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2">Ações</div>
      </div>

      {/* Lista de usuários */}
      {filteredUsers.map((user, index) => {
        const isActive = user.status === 'active'

        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'overflow-hidden transition-all',
                !isActive && 'opacity-60',
              )}
            >
              <div className="px-4 py-2.5">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Col 1: Usuário (5 cols) */}
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700 text-sm font-bold">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-800 truncate block">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate block">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>

                  {/* Col 2: Perfis (3 cols) */}
                  <div className="col-span-6 sm:col-span-3 flex flex-wrap gap-1.5">
                    {user.profiles.filter(p => p !== 'user').map((profile) => (
                      <GradientTag key={profile} className={profileGradients[profile]}>
                        {profileLabels[profile]}
                      </GradientTag>
                    ))}
                  </div>

                  {/* Col 3: Status (2 cols) */}
                  <div className="col-span-4 sm:col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user.id)}
                      className="group"
                    >
                      <GradientTag
                        className={cn(
                          'cursor-pointer transition-all duration-300',
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200/50 hover:shadow-md hover:shadow-emerald-300/40'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:shadow-md hover:shadow-gray-300/40',
                        )}
                      >
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0',
                          isActive ? 'bg-emerald-200' : 'bg-gray-300',
                        )} />
                        {isActive ? 'Ativo' : 'Inativo'}
                      </GradientTag>
                    </button>
                  </div>

                  {/* Col 4: Ações (2 cols) */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all"
                      title="Editar Usuário"
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Excluir Usuário"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}

      {/* Modal de Confirmação de Exclusão Ultra Premium */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Ação Irreversível"
        description="Você está prestes a excluir permanentemente o seguinte usuário e todos os seus dados associados:"
        itemName={userToDelete?.name}
        itemMeta={userToDelete ? [
          { label: 'ID', value: userToDelete.id },
          { label: 'Perfil', value: userToDelete.profiles.map(p => profileLabels[p]).join(', ') },
          { label: 'Unidade', value: userToDelete.unitId === 'puma' ? 'Puma' : 'Monte Alegre' },
        ] : undefined}
        warning="Esta ação não poderá ser desfeita. Todos os registros de auditoria e avaliações serão perdidos."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}
