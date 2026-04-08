import { useState, useMemo, useCallback } from 'react'
import { users as initialUsers } from '@/mocks/data'
import type { User, UserProfile } from '@/types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtra usuários por busca (nome ou email)
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users
    const query = searchQuery.toLowerCase()
    return users.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.unitId.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  // Criar novo usuário
  const createUser = useCallback((data: {
    name: string
    profiles: UserProfile[]
    unitId: 'puma' | 'monte-alegre'
    status: 'active' | 'inactive'
  }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
    }
    setUsers(prev => [...prev, newUser])
    return newUser.id
  }, [])

  // Atualizar usuário
  const updateUser = useCallback((id: string, data: {
    name: string
    profiles: UserProfile[]
    unitId: 'puma' | 'monte-alegre'
    status: 'active' | 'inactive'
  }) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? { ...u, ...data }
          : u
      )
    )
  }, [])

  // Toggle status do usuário
  const toggleStatus = useCallback((id: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const }
          : u
      )
    )
  }, [])

  // Deletar usuário
  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    createUser,
    updateUser,
    toggleStatus,
    deleteUser,
  }
}
