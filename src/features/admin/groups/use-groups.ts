import { useState, useMemo, useCallback } from 'react'
import { groups as initialGroups } from '@/mocks/data'
import type { Group, TeamMember } from '@/types'

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtra grupos por busca
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups
    return groups.filter(g =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [groups, searchQuery])

  // Criar novo grupo
  const createGroup = useCallback((data: {
    name: string
    groupTypeId: string
    groupTypeName: string
    areaId: string
    areaName: string
    managementId: string
    managementName: string
    status: 'active' | 'inactive'
  }) => {
    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      ...data,
      currentSequence: 1,
      maxSequence: 1,
      team: [],
      unitId: 'puma',
    }
    setGroups(prev => [...prev, newGroup])
    return newGroup.id
  }, [])

  // Atualizar grupo
  const updateGroup = useCallback((id: string, data: {
    name: string
    groupTypeId: string
    groupTypeName: string
    areaId: string
    areaName: string
    managementId: string
    managementName: string
    status: 'active' | 'inactive'
  }) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, ...data }
          : g
      )
    )
  }, [])

  // Deletar grupo
  const deleteGroup = useCallback((id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id))
  }, [])

  // Toggle status
  const toggleGroupStatus = useCallback((id: string) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' }
          : g
      )
    )
  }, [])

  // Adicionar membro à equipe
  const addTeamMember = useCallback((groupId: string, data: {
    name: string
    role: 'facilitator' | 'auditor' | 'member'
  }) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id !== groupId) return g
        const newMember: TeamMember = {
          id: `tm-${Date.now()}`,
          name: data.name,
          role: data.role,
        }
        return { ...g, team: [...g.team, newMember] }
      })
    )
  }, [])

  // Remover membro da equipe
  const removeTeamMember = useCallback((groupId: string, memberId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id !== groupId) return g
        return {
          ...g,
          team: g.team.filter(m => m.id !== memberId)
        }
      })
    )
  }, [])

  return {
    groups,
    filteredGroups,
    searchQuery,
    setSearchQuery,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleGroupStatus,
    addTeamMember,
    removeTeamMember,
  }
}
