import type { AnswerValue, Question } from '@/types'

interface AnswerState {
  answer: AnswerValue | null
  justification: string
}

interface EligibilityResult {
  eligible: boolean
  reasons: string[]
}

export function checkAdvanceEligibility(
  answers: Record<string, AnswerState>,
  questions: Question[],
  score: number,
  meta: number,
  currentSequence: number,
  maxSequence: number,
): EligibilityResult {
  const reasons: string[] = []

  // Criteria 1: Score meets or exceeds the goal
  const scoreOk = score >= meta
  if (!scoreOk) {
    reasons.push(`Nota ${score.toFixed(0)}% abaixo da meta de ${meta}%`)
  }

  // Criteria 2: All required-yes questions answered with "Sim"
  const requiredQuestions = questions.filter((q) => q.requiredYesForAdvance)
  const allRequiredYes = requiredQuestions.every((q) => answers[q.id]?.answer === 'yes')
  if (!allRequiredYes) {
    const failedCount = requiredQuestions.filter((q) => answers[q.id]?.answer !== 'yes').length
    reasons.push(`${failedCount} pergunta(s) obrigatória(s) não respondida(s) com "Sim"`)
  }

  // Criteria 3: Group is not at max sequence
  const notAtMax = currentSequence < maxSequence
  if (!notAtMax) {
    reasons.push('Grupo já está na sequência máxima')
  }

  return {
    eligible: scoreOk && allRequiredYes && notAtMax,
    reasons,
  }
}

export function getMetaForSequence(
  groupTypeId: string,
  currentSequence: number,
  groupTypes: { id: string; defaultGoal: number; sequences: { number: number; useDefaultGoal: boolean; customGoal?: number }[] }[],
): number {
  const groupType = groupTypes.find((gt) => gt.id === groupTypeId)
  if (!groupType) return 80

  const sequence = groupType.sequences.find((s) => s.number === currentSequence)
  if (!sequence) return groupType.defaultGoal

  return sequence.useDefaultGoal ? groupType.defaultGoal : (sequence.customGoal ?? groupType.defaultGoal)
}
