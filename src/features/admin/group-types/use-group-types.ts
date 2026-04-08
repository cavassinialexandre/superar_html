import { useState, useCallback, useMemo } from 'react'
import type { GroupType, Sequence } from '@/types'
import { groupTypes as initialGroupTypes, checklists } from '@/mocks/data'

export type GroupTypeFormData = {
  name: string
  defaultGoal: number
  status: 'active' | 'inactive'
}

export type SequenceFormData = {
  number: number
  useDefaultGoal: boolean
  customGoal?: number
  checklistId: string
}

export function useGroupTypes() {
  const [groupTypes, setGroupTypes] = useState<GroupType[]>(initialGroupTypes)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtrar tipos de grupo
  const filteredGroupTypes = useMemo(() => {
    return groupTypes.filter((gt) => {
      const matchesSearch = !searchQuery ||
        gt.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [groupTypes, searchQuery])

  // Criar novo tipo de grupo
  const createGroupType = useCallback((data: GroupTypeFormData) => {
    const newGroupType: GroupType = {
      id: `type-${Date.now()}`,
      name: data.name,
      defaultGoal: data.defaultGoal,
      status: data.status,
      sequences: [],
      unitId: 'puma',
    }
    setGroupTypes((prev) => [...prev, newGroupType])
    return newGroupType
  }, [])

  // Atualizar tipo de grupo
  const updateGroupType = useCallback((id: string, data: GroupTypeFormData) => {
    setGroupTypes((prev) =>
      prev.map((gt) =>
        gt.id === id
          ? { ...gt, name: data.name, defaultGoal: data.defaultGoal, status: data.status }
          : gt
      )
    )
  }, [])

  // Excluir tipo de grupo
  const deleteGroupType = useCallback((id: string) => {
    setGroupTypes((prev) => prev.filter((gt) => gt.id !== id))
  }, [])

  // Ativar/Inativar tipo de grupo
  const toggleGroupTypeStatus = useCallback((id: string) => {
    setGroupTypes((prev) =>
      prev.map((gt) =>
        gt.id === id
          ? { ...gt, status: gt.status === 'active' ? 'inactive' : 'active' }
          : gt
      )
    )
  }, [])

  // Buscar tipo de grupo por ID
  const getGroupTypeById = useCallback(
    (id: string) => groupTypes.find((gt) => gt.id === id),
    [groupTypes]
  )

  // Adicionar sequência a um tipo de grupo
  const addSequence = useCallback(
    (groupTypeId: string, data: SequenceFormData) => {
      const checklist = checklists.find((c) => c.id === data.checklistId)
      if (!checklist) return

      const newSequence: Sequence = {
        id: `seq-${Date.now()}`,
        groupTypeId,
        number: data.number,
        useDefaultGoal: data.useDefaultGoal,
        customGoal: data.useDefaultGoal ? undefined : data.customGoal,
        checklistId: data.checklistId,
        checklistName: checklist.name,
      }

      setGroupTypes((prev) =>
        prev.map((gt) =>
          gt.id === groupTypeId
            ? { ...gt, sequences: [...gt.sequences, newSequence].sort((a, b) => a.number - b.number) }
            : gt
        )
      )
    },
    []
  )

  // Atualizar sequência
  const updateSequence = useCallback(
    (groupTypeId: string, sequenceId: string, data: SequenceFormData) => {
      const checklist = checklists.find((c) => c.id === data.checklistId)
      if (!checklist) return

      setGroupTypes((prev) =>
        prev.map((gt) =>
          gt.id === groupTypeId
            ? {
                ...gt,
                sequences: gt.sequences
                  .map((s) =>
                    s.id === sequenceId
                      ? {
                          ...s,
                          number: data.number,
                          useDefaultGoal: data.useDefaultGoal,
                          customGoal: data.useDefaultGoal ? undefined : data.customGoal,
                          checklistId: data.checklistId,
                          checklistName: checklist.name,
                        }
                      : s
                  )
                  .sort((a, b) => a.number - b.number),
              }
            : gt
        )
      )
    },
    []
  )

  // Remover sequência
  const removeSequence = useCallback((groupTypeId: string, sequenceId: string) => {
    setGroupTypes((prev) =>
      prev.map((gt) =>
        gt.id === groupTypeId
          ? { ...gt, sequences: gt.sequences.filter((s) => s.id !== sequenceId) }
          : gt
      )
    )
  }, [])

  // Buscar checklists ativos para seleção
  const activeChecklists = useMemo(
    () => checklists.filter((c) => c.status === 'active'),
    []
  )

  return {
    groupTypes,
    filteredGroupTypes,
    searchQuery,
    setSearchQuery,
    createGroupType,
    updateGroupType,
    deleteGroupType,
    toggleGroupTypeStatus,
    getGroupTypeById,
    addSequence,
    updateSequence,
    removeSequence,
    activeChecklists,
  }
}
