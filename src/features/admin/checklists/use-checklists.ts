import { useState, useMemo, useCallback } from 'react'
import { checklists as initialChecklists, checklistRevisions as initialRevisions, questionGroups } from '@/mocks/data'
import type { Checklist, ChecklistRevision, Question } from '@/types'

export function useChecklists() {
  const [checklists, setChecklists] = useState<Checklist[]>(initialChecklists)
  const [revisions, setRevisions] = useState<ChecklistRevision[]>(initialRevisions)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtra checklists por busca
  const filteredChecklists = useMemo(() => {
    if (!searchQuery) return checklists
    return checklists.filter(cl =>
      cl.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [checklists, searchQuery])

  // Checklists ativos para referência
  const activeChecklists = useMemo(() =>
    checklists.filter(cl => cl.status === 'active'),
    [checklists]
  )

  // Criar novo checklist
  const createChecklist = useCallback((data: {
    name: string
    status: 'active' | 'inactive'
  }) => {
    const newChecklist: Checklist = {
      id: `cl-${Date.now()}`,
      name: data.name,
      status: data.status,
      unitId: 'puma',
      revisions: [],
    }
    setChecklists(prev => [...prev, newChecklist])
    return newChecklist.id
  }, [])

  // Atualizar checklist
  const updateChecklist = useCallback((id: string, data: {
    name: string
    status: 'active' | 'inactive'
  }) => {
    setChecklists(prev =>
      prev.map(cl =>
        cl.id === id
          ? { ...cl, ...data }
          : cl
      )
    )
  }, [])

  // Deletar checklist
  const deleteChecklist = useCallback((id: string) => {
    setChecklists(prev => prev.filter(cl => cl.id !== id))
    // Também remove todas as revisões associadas
    setRevisions(prev => prev.filter(r => r.checklistId !== id))
  }, [])

  // Toggle status do checklist
  const toggleChecklistStatus = useCallback((id: string) => {
    setChecklists(prev =>
      prev.map(cl =>
        cl.id === id
          ? { ...cl, status: cl.status === 'active' ? 'inactive' : 'active' }
          : cl
      )
    )
  }, [])

  // ========== REVISÕES ==========

  // Criar nova revisão
  const createRevision = useCallback((checklistId: string, data: {
    status: 'active' | 'inactive'
  }, cloneFromRevisionId?: string) => {
    const checklist = checklists.find(cl => cl.id === checklistId)
    if (!checklist) return null

    const nextRevisionNumber = checklist.revisions.length > 0
      ? Math.max(...checklist.revisions.map(r => r.revisionNumber)) + 1
      : 1

    let questions: Question[] = []

    // Se for para clonar, copia as perguntas da revisão de origem
    if (cloneFromRevisionId) {
      const sourceRevision = revisions.find(r => r.id === cloneFromRevisionId)
      if (sourceRevision) {
        questions = sourceRevision.questions.map(q => ({
          ...q,
          id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          revisionId: '', // será preenchido abaixo
        }))
      }
    }

    const newRevision: ChecklistRevision = {
      id: `rev-${Date.now()}`,
      checklistId,
      revisionNumber: nextRevisionNumber,
      status: data.status,
      questions: questions.map(q => ({ ...q, revisionId: `rev-${Date.now()}` })),
    }

    setRevisions(prev => [...prev, newRevision])
    setChecklists(prev =>
      prev.map(cl =>
        cl.id === checklistId
          ? { ...cl, revisions: [...cl.revisions, newRevision] }
          : cl
      )
    )

    return newRevision.id
  }, [checklists, revisions])

  // Atualizar revisão
  const updateRevision = useCallback((revisionId: string, data: {
    status?: 'active' | 'inactive'
  }) => {
    setRevisions(prev =>
      prev.map(r =>
        r.id === revisionId
          ? { ...r, ...data }
          : r
      )
    )
    // Atualiza também na referência do checklist
    setChecklists(prev =>
      prev.map(cl => ({
        ...cl,
        revisions: cl.revisions.map(r =>
          r.id === revisionId
            ? { ...r, ...data }
            : r
        )
      }))
    )
  }, [])

  // Deletar revisão
  const deleteRevision = useCallback((revisionId: string) => {
    const revision = revisions.find(r => r.id === revisionId)
    if (!revision) return

    setRevisions(prev => prev.filter(r => r.id !== revisionId))
    setChecklists(prev =>
      prev.map(cl =>
        cl.id === revision.checklistId
          ? { ...cl, revisions: cl.revisions.filter(r => r.id !== revisionId) }
          : cl
      )
    )
  }, [revisions])

  // Toggle status da revisão
  const toggleRevisionStatus = useCallback((revisionId: string) => {
    setRevisions(prev =>
      prev.map(r =>
        r.id === revisionId
          ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' }
          : r
      )
    )
    // Atualiza também na referência do checklist
    setChecklists(prev =>
      prev.map(cl => ({
        ...cl,
        revisions: cl.revisions.map(r =>
          r.id === revisionId
            ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' }
            : r
        )
      }))
    )
  }, [])

  // ========== PERGUNTAS ==========

  // Adicionar pergunta
  const addQuestion = useCallback((revisionId: string, data: {
    text: string
    groupId: string
    weight: number
    requiredYesForAdvance: boolean
    answerType: 'binary' | 'ternary'
  }) => {
    setRevisions(prev =>
      prev.map(r => {
        if (r.id !== revisionId) return r
        const newQuestion: Question = {
          id: `q-${Date.now()}`,
          revisionId,
          groupId: data.groupId,
          text: data.text,
          sequence: r.questions.length + 1,
          weight: data.weight,
          requiredYesForAdvance: data.requiredYesForAdvance,
          answerType: data.answerType,
        }
        return { ...r, questions: [...r.questions, newQuestion] }
      })
    )
    // Atualiza também na referência do checklist
    setChecklists(prev =>
      prev.map(cl => ({
        ...cl,
        revisions: cl.revisions.map(r => {
          if (r.id !== revisionId) return r
          const newQuestion: Question = {
            id: `q-${Date.now()}`,
            revisionId,
            groupId: data.groupId,
            text: data.text,
            sequence: r.questions.length + 1,
            weight: data.weight,
            requiredYesForAdvance: data.requiredYesForAdvance,
            answerType: data.answerType,
          }
          return { ...r, questions: [...r.questions, newQuestion] }
        })
      }))
    )
  }, [])

  // Atualizar pergunta
  const updateQuestion = useCallback((revisionId: string, questionId: string, data: {
    text: string
    groupId: string
    weight: number
    requiredYesForAdvance: boolean
    answerType: 'binary' | 'ternary'
  }) => {
    setRevisions(prev =>
      prev.map(r => {
        if (r.id !== revisionId) return r
        return {
          ...r,
          questions: r.questions.map(q =>
            q.id === questionId
              ? { ...q, ...data }
              : q
          )
        }
      })
    )
    // Atualiza também na referência do checklist
    setChecklists(prev =>
      prev.map(cl => ({
        ...cl,
        revisions: cl.revisions.map(r => {
          if (r.id !== revisionId) return r
          return {
            ...r,
            questions: r.questions.map(q =>
              q.id === questionId
                ? { ...q, ...data }
                : q
            )
          }
        })
      }))
    )
  }, [])

  // Remover pergunta
  const removeQuestion = useCallback((revisionId: string, questionId: string) => {
    setRevisions(prev =>
      prev.map(r => {
        if (r.id !== revisionId) return r
        return {
          ...r,
          questions: r.questions.filter(q => q.id !== questionId)
        }
      })
    )
    // Atualiza também na referência do checklist
    setChecklists(prev =>
      prev.map(cl => ({
        ...cl,
        revisions: cl.revisions.map(r => {
          if (r.id !== revisionId) return r
          return {
            ...r,
            questions: r.questions.filter(q => q.id !== questionId)
          }
        })
      }))
    )
  }, [])

  return {
    checklists,
    filteredChecklists,
    searchQuery,
    setSearchQuery,
    activeChecklists,
    questionGroups,
    // Checklist operations
    createChecklist,
    updateChecklist,
    deleteChecklist,
    toggleChecklistStatus,
    // Revision operations
    revisions,
    createRevision,
    updateRevision,
    deleteRevision,
    toggleRevisionStatus,
    // Question operations
    addQuestion,
    updateQuestion,
    removeQuestion,
  }
}
