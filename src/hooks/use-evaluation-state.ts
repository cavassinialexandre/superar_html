import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useAccessControl } from '@/hooks/use-access-control'
import { checkAdvanceEligibility, getMetaForSequence } from '@/lib/advance-eligibility'
import { groups, checklists, groupTypes } from '@/mocks/data'
import type { AnswerValue, Question } from '@/types'

export interface QuestionState {
  answer: AnswerValue | null
  justification: string
  comment: string
  attachments: File[]
}

export function useEvaluationState() {
  const { groupId } = useParams({ strict: false })
  const search = useSearch({ strict: false }) as { type?: string }
  const navigate = useNavigate()
  const { userName } = useAuthStore()
  const { checkAccess, deniedMessage, dismissDenied } = useAccessControl()

  const evalType = search?.type === 'followup' ? 'followup' : 'audit'
  const group = groups.find((g) => g.id === groupId)
  const checklist = checklists[0]

  const [answers, setAnswers] = useState<Record<string, QuestionState>>({})
  const [showResult, setShowResult] = useState(false)
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false)
  const [advanceDecision, setAdvanceDecision] = useState<'advance' | 'maintain' | null>(null)
  const [presentMembers, setPresentMembers] = useState<string[]>([])
  const [otherPeople, setOtherPeople] = useState('')
  const [evaluationDate, setEvaluationDate] = useState(
    () => new Date().toISOString().split('T')[0],
  )

  // Pega a revisão ativa do checklist (ou a primeira revisão disponível)
  const activeRevision = checklist?.revisions?.find(r => r.status === 'active') || checklist?.revisions?.[0]
  const questions: Question[] = activeRevision?.questions || []
  const answeredCount = questions.filter((q: Question) => answers[q.id]?.answer).length
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  const score = useMemo(() => {
    let totalWeight = 0
    let earnedWeight = 0
    questions.forEach((q: Question) => {
      const a = answers[q.id]?.answer
      if (a === 'na' || !a) return
      totalWeight += q.weight
      if (a === 'yes') earnedWeight += q.weight
      if (a === 'partial') earnedWeight += q.weight * 0.5
    })
    return totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0
  }, [answers, questions])

  const meta = group ? getMetaForSequence(group.groupTypeId, group.currentSequence, groupTypes) : 80

  const eligibility = useMemo(() => {
    if (!group) return { eligible: false, reasons: [] as string[] }
    return checkAdvanceEligibility(answers, questions, score, meta, group.currentSequence, group.maxSequence)
  }, [answers, questions, score, meta, group])

  const canFinalize = answeredCount === totalQuestions

  const setAnswer = useCallback((questionId: string, answer: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer,
        justification: prev[questionId]?.justification || '',
        comment: prev[questionId]?.comment || '',
        attachments: prev[questionId]?.attachments || [],
      },
    }))
  }, [])

  const setJustification = useCallback((questionId: string, justification: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: prev[questionId]?.answer || null,
        justification,
        comment: prev[questionId]?.comment || '',
        attachments: prev[questionId]?.attachments || [],
      },
    }))
  }, [])

  const setComment = useCallback((questionId: string, comment: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: prev[questionId]?.answer || null,
        justification: prev[questionId]?.justification || '',
        comment,
        attachments: prev[questionId]?.attachments || [],
      },
    }))
  }, [])

  const addAttachments = useCallback((questionId: string, files: File[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: prev[questionId]?.answer || null,
        justification: prev[questionId]?.justification || '',
        comment: prev[questionId]?.comment || '',
        attachments: [...(prev[questionId]?.attachments || []), ...files],
      },
    }))
  }, [])

  const removeAttachment = useCallback((questionId: string, index: number) => {
    setAnswers((prev) => {
      const current = prev[questionId]
      if (!current) return prev
      const newAttachments = [...current.attachments]
      newAttachments.splice(index, 1)
      return {
        ...prev,
        [questionId]: { ...current, attachments: newAttachments },
      }
    })
  }, [])

  const toggleMember = useCallback((name: string) => {
    setPresentMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }, [])

  const handleFinalize = useCallback(() => {
    if (!checkAccess('evaluator')) return
    if (evalType === 'audit' && eligibility.eligible) {
      setShowAdvanceDialog(true)
    } else {
      setShowResult(true)
    }
  }, [checkAccess, evalType, eligibility.eligible])

  const handleAdvanceDecision = useCallback((decision: 'advance' | 'maintain') => {
    setAdvanceDecision(decision)
    setShowAdvanceDialog(false)
    setShowResult(true)
  }, [])

  return {
    // Data
    group,
    checklist,
    questions,
    evalType,
    userName,
    groupId,
    navigate,

    // State
    answers,
    presentMembers,
    otherPeople,
    evaluationDate,
    showResult,
    showAdvanceDialog,
    advanceDecision,

    // Computed
    answeredCount,
    totalQuestions,
    progress,
    score,
    meta,
    eligibility,
    canFinalize,

    // Actions
    setAnswer,
    setJustification,
    setComment,
    addAttachments,
    removeAttachment,
    toggleMember,
    setOtherPeople,
    setEvaluationDate,
    handleFinalize,
    handleAdvanceDecision,
    setShowResult,
    setShowAdvanceDialog,

    // Access control
    deniedMessage,
    dismissDenied,
  }
}
