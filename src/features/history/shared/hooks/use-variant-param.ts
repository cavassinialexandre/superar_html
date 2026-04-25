import { useNavigate, useSearch } from '@tanstack/react-router'
import type { HistoryVariantId } from '../types'
import { HISTORY_VARIANT_IDS } from '../types'

/**
 * Lê/grava o parâmetro `?v=` da URL para determinar a variante ativa.
 * Default: 'timeline-classica'.
 */
export function useVariantParam(): {
  variant: HistoryVariantId
  setVariant: (v: HistoryVariantId) => void
} {
  const search = useSearch({ from: '/authenticated/history' as never }) as Record<string, unknown>
  const navigate = useNavigate()

  const raw = (search?.v as string) || 'timeline-classica'
  const variant: HistoryVariantId = HISTORY_VARIANT_IDS.includes(raw as HistoryVariantId)
    ? (raw as HistoryVariantId)
    : 'timeline-classica'

  const setVariant = (v: HistoryVariantId) => {
    navigate({
      to: '/history',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: ((prev: Record<string, unknown>) => ({ ...prev, v })) as any,
      replace: false,
    })
  }

  return { variant, setVariant }
}
