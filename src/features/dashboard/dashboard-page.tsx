import { Suspense } from 'react'
import { PageContainer } from '@/components/layout/app-shell'
import { useUnitStore } from '@/stores/unit-store'
import { dashboardVariants } from './variant-registry'

const unitNames = { puma: 'Puma', 'monte-alegre': 'Monte Alegre' }

function VariantSkeleton() {
  return (
    <div className="space-y-5 mt-4">
      <div className="h-[420px] rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[120px] rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 h-[280px] rounded-2xl bg-gray-100 animate-pulse" />
        <div className="lg:col-span-4 h-[280px] rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { selectedUnit } = useUnitStore()
  const variant =
    dashboardVariants.find((v) => v.id === 'v8-editorial-cards') ?? dashboardVariants[0]
  const unitLabel = selectedUnit ? unitNames[selectedUnit] : ''

  return (
    <div className="min-h-screen">
      <PageContainer maxWidth="full">
        <div className="space-y-5">
          <Suspense fallback={<VariantSkeleton />}>
            <variant.Component key={variant.id} unitLabel={unitLabel} />
          </Suspense>
        </div>
      </PageContainer>
    </div>
  )
}
