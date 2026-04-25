import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import { useHistoryFilters } from './shared/hooks/use-history-filters'
import { useHistoryData } from './shared/hooks/use-history-data'

const VFinalPage = lazy(() =>
  import('./variants/v7-final').then((m) => ({ default: m.VFinalPage })),
)

function VariantFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-400">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin"
        >
          <circle cx="12" cy="12" r="10" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <span className="text-sm">Carregando…</span>
      </div>
    </div>
  )
}

export function HistoryPage() {
  const filters = useHistoryFilters()
  const data = useHistoryData(filters.filters)

  return (
    <PageContainer>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-5"
      >
        <motion.div variants={staggerItem}>
          <Breadcrumb items={[{ label: 'Histórico' }]} />
        </motion.div>

        <motion.div variants={staggerItem}>
          <Suspense fallback={<VariantFallback />}>
            <VFinalPage filters={filters} data={data} />
          </Suspense>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
