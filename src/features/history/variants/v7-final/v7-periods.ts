import { format, subDays, subYears, startOfYear, endOfYear } from 'date-fns'

export type PeriodId = 'last-30' | 'last-60' | 'ytd' | 'last-year' | 'all'

export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: 'last-30', label: 'Últimos 30 dias' },
  { id: 'last-60', label: 'Últimos 60 dias' },
  { id: 'ytd', label: 'Acumulado do ano' },
  { id: 'last-year', label: 'Ano anterior' },
  { id: 'all', label: 'Histórico' },
]

export function buildPeriod(id: PeriodId): { dateFrom: string | null; dateTo: string | null } {
  const today = new Date()
  const todayISO = format(today, 'yyyy-MM-dd')
  switch (id) {
    case 'last-30':
      return { dateFrom: format(subDays(today, 30), 'yyyy-MM-dd'), dateTo: todayISO }
    case 'last-60':
      return { dateFrom: format(subDays(today, 60), 'yyyy-MM-dd'), dateTo: todayISO }
    case 'ytd':
      return { dateFrom: format(startOfYear(today), 'yyyy-MM-dd'), dateTo: todayISO }
    case 'last-year': {
      const ly = subYears(today, 1)
      return {
        dateFrom: format(startOfYear(ly), 'yyyy-MM-dd'),
        dateTo: format(endOfYear(ly), 'yyyy-MM-dd'),
      }
    }
    case 'all':
      return { dateFrom: null, dateTo: null }
  }
}

export function matchPeriod(dateFrom: string | null, dateTo: string | null): PeriodId | '' {
  for (const p of PERIODS) {
    const built = buildPeriod(p.id)
    if (built.dateFrom === dateFrom && built.dateTo === dateTo) return p.id
  }
  return ''
}

export function getPeriodLabel(dateFrom: string | null, dateTo: string | null): string {
  const matched = matchPeriod(dateFrom, dateTo)
  if (matched) {
    const preset = PERIODS.find((p) => p.id === matched)
    if (preset) return preset.label
  }
  const fmt = (s: string | null) => (s ? new Date(s).toLocaleDateString('pt-BR') : '…')
  return `${fmt(dateFrom)} — ${fmt(dateTo)}`
}
