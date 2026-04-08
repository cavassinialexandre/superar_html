import type { HistoryEntry } from '@/types'

// ============================================================================
// CONSTANTS
// ============================================================================

export const TYPE_COLORS: Record<HistoryEntry['type'], string> = {
  audit: '#1E7A73',
  followup: '#0369A1',
  sequence_advance: '#10B981',
  milestone: '#F59E0B',
  comment: '#64748B',
}

export const TYPE_LABELS: Record<HistoryEntry['type'], string> = {
  audit: 'Auditoria',
  followup: 'Follow-up',
  sequence_advance: 'Avanco',
  milestone: 'Marco',
  comment: 'Comentario',
}

export const AVATAR_COLORS = [
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#D1FAE5', text: '#065F46' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#E0E7FF', text: '#3730A3' },
  { bg: '#CCFBF1', text: '#134E4A' },
  { bg: '#FEE2E2', text: '#991B1B' },
  { bg: '#F3E8FF', text: '#6B21A8' },
]

// ============================================================================
// SCORE COLORS
// ============================================================================

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#1E7A73'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-primary-600'
  if (score >= 50) return 'text-amber-600'
  return 'text-red-500'
}

export function getScoreBorderColor(score: number): string {
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#1E7A73'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

// ============================================================================
// FORMATTING
// ============================================================================

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  return `${day} ${month}`
}

export function parseDate(dateStr: string) {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, '0')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  const month = months[d.getMonth()]
  const year = d.getFullYear().toString()
  return { day, month, year }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getAvatarColor(name: string) {
  const code = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[code]
}

// ============================================================================
// DELTAS
// ============================================================================

export function computeDeltas(events: HistoryEntry[]): (number | null)[] {
  return events.map((event, i) => {
    if (event.score == null) return null
    for (let j = i + 1; j < events.length; j++) {
      if (events[j].score != null) {
        return event.score - events[j].score!
      }
    }
    return null
  })
}

// ============================================================================
// POINTS & GOAL FORMATTING
// ============================================================================

export function formatPts(pts: number, maxPts: number): string {
  return `${pts}/${maxPts} pts`
}

export function formatGoal(goalPct: number, goalPts?: number): string {
  if (goalPts != null) {
    return `Meta: ${goalPct}% (${goalPts} pts)`
  }
  return `Meta: ${goalPct}%`
}
