import { useState } from 'react'
import { UsersAccordionView } from './users-accordion-view'
import { UserForm } from './user-form'
import { useUsers } from './use-users'
import type { User } from '@/types'

export function UsersTab() {
  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    createUser,
    updateUser,
    toggleStatus,
    deleteUser,
  } = useUsers()

  // Estados dos drawers
  const [userFormOpen, setUserFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [loading, setLoading] = useState(false)

  // Handlers para User
  const handleOpenNewUser = () => {
    setEditingUser(null)
    setUserFormOpen(true)
  }

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user)
    setUserFormOpen(true)
  }

  const handleCloseUserForm = () => {
    setUserFormOpen(false)
    setEditingUser(null)
  }

  const handleSubmitUser = async (data: {
    name: string
    profiles: ('admin' | 'evaluator' | 'user')[]
    unitId: 'puma' | 'monte-alegre'
    status: 'active' | 'inactive'
  }) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    if (editingUser) {
      updateUser(editingUser.id, data)
    } else {
      createUser(data)
    }

    setLoading(false)
    handleCloseUserForm()
  }

  const handleDeleteUser = (user: User) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      deleteUser(user.id)
    }
  }

  return (
    <>
      <UsersAccordionView
        users={filteredUsers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddUser={handleOpenNewUser}
        onEditUser={handleOpenEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={toggleStatus}
      />

      {/* User Form Drawer */}
      <UserForm
        user={editingUser}
        open={userFormOpen}
        onSubmit={handleSubmitUser}
        onCancel={handleCloseUserForm}
        loading={loading}
      />
    </>
  )
}
