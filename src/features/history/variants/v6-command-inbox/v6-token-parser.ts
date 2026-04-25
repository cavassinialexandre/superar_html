import type { HistoryFiltersState } from '../../shared/types'
import { groups, users, managements } from '@/mocks/data'

/**
 * Parser simples de tokens estilo Linear: `type:audit group:alpha score:>80 last week`
 * Retorna um patch de filtros + o texto residual para busca full-text.
 */
export interface ParsedQuery {
  patch: Partial<HistoryFiltersState>
  search: string
  tokens: Array<{ key: string; value: string; raw: string }>
}

const OPERATORS = ['type', 'group', 'applicant', 'management', 'score', 'goal', 'passo', 'advanced']

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysAgoISO(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function parseQuery(input: string): ParsedQuery {
  const patch: Partial<HistoryFiltersState> = {}
  const tokens: ParsedQuery['tokens'] = []
  const parts = input.split(/\s+/).filter(Boolean)
  const residual: string[] = []

  let i = 0
  while (i < parts.length) {
    const part = parts[i]

    // Natural: "last week", "last 30 days", "this year", "failed audits", "advances"
    const lower = part.toLowerCase()
    if (lower === 'last' && parts[i + 1]?.toLowerCase() === 'week') {
      patch.dateFrom = daysAgoISO(7)
      patch.dateTo = todayISO()
      tokens.push({ key: 'date', value: 'last week', raw: 'last week' })
      i += 2
      continue
    }
    if (lower === 'last' && parts[i + 1]?.toLowerCase() === '30' && parts[i + 2]?.toLowerCase().startsWith('day')) {
      patch.dateFrom = daysAgoISO(30)
      patch.dateTo = todayISO()
      tokens.push({ key: 'date', value: 'last 30 days', raw: 'last 30 days' })
      i += 3
      continue
    }
    if (lower === 'this' && parts[i + 1]?.toLowerCase() === 'year') {
      const d = new Date()
      patch.dateFrom = `${d.getFullYear()}-01-01`
      patch.dateTo = todayISO()
      tokens.push({ key: 'date', value: 'this year', raw: 'this year' })
      i += 2
      continue
    }
    if (lower === 'failed' && parts[i + 1]?.toLowerCase().startsWith('audit')) {
      patch.type = 'audit'
      patch.advanced = 'no'
      tokens.push({ key: 'filter', value: 'failed audits', raw: 'failed audits' })
      i += 2
      continue
    }
    if (lower === 'advances' || lower === 'avanços') {
      patch.type = 'audit'
      patch.advanced = 'yes'
      tokens.push({ key: 'filter', value: 'advances', raw: lower })
      i++
      continue
    }

    // Key:value
    const match = part.match(/^(\w+):(.+)$/)
    if (match && OPERATORS.includes(match[1].toLowerCase())) {
      const key = match[1].toLowerCase()
      const value = match[2]

      if (key === 'type' && (value === 'audit' || value === 'followup')) {
        patch.type = value
        tokens.push({ key, value, raw: part })
      } else if (key === 'group') {
        const found = groups.find((g) => g.name.toLowerCase().includes(value.toLowerCase()))
        if (found) {
          patch.groupId = found.id
          tokens.push({ key, value: found.name, raw: part })
        } else {
          tokens.push({ key, value, raw: part })
        }
      } else if (key === 'applicant') {
        const found = users.find((u) => u.name.toLowerCase().includes(value.toLowerCase()))
        if (found) {
          patch.applicantId = found.id
          tokens.push({ key, value: found.name, raw: part })
        } else {
          tokens.push({ key, value, raw: part })
        }
      } else if (key === 'management') {
        const found = managements.find((m) => m.name.toLowerCase().includes(value.toLowerCase()))
        if (found) {
          patch.managementId = found.id
          tokens.push({ key, value: found.name, raw: part })
        } else {
          tokens.push({ key, value, raw: part })
        }
      } else if (key === 'score') {
        // Aceita >80, <60, 60-80
        const gt = value.match(/^>=?(\d+)/)
        const lt = value.match(/^<=?(\d+)/)
        const range = value.match(/^(\d+)-(\d+)/)
        if (range) {
          patch.scoreRange = [Number(range[1]), Number(range[2])]
          tokens.push({ key, value: `${range[1]}-${range[2]}`, raw: part })
        } else if (gt) {
          patch.scoreRange = [Number(gt[1]), 100]
          tokens.push({ key, value: `>${gt[1]}`, raw: part })
        } else if (lt) {
          patch.scoreRange = [0, Number(lt[1])]
          tokens.push({ key, value: `<${lt[1]}`, raw: part })
        }
      } else if (key === 'advanced' && (value === 'yes' || value === 'no')) {
        patch.advanced = value
        tokens.push({ key, value, raw: part })
      } else {
        residual.push(part)
      }
      i++
      continue
    }

    residual.push(part)
    i++
  }

  return { patch, search: residual.join(' '), tokens }
}

export const SUGGESTED_OPERATORS = [
  { token: 'type:audit', description: 'Apenas auditorias' },
  { token: 'type:followup', description: 'Apenas follow-ups' },
  { token: 'advanced:yes', description: 'Que avançaram' },
  { token: 'advanced:no', description: 'Que não avançaram' },
  { token: 'score:>80', description: 'Score acima de 80' },
  { token: 'score:<60', description: 'Score abaixo de 60' },
  { token: 'score:60-80', description: 'Score entre 60-80' },
  { token: 'last week', description: 'Última semana' },
  { token: 'last 30 days', description: 'Últimos 30 dias' },
  { token: 'this year', description: 'Este ano' },
  { token: 'failed audits', description: 'Auditorias reprovadas' },
  { token: 'advances', description: 'Apenas avanços' },
]
