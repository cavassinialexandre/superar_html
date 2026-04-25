import { createHashHistory, createRouter, RouterProvider, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/app-shell'
import { UnitSelectionPage } from '@/features/unit-selection/unit-selection-page'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { GroupsPage } from '@/features/groups/groups-page'
import { GroupDetailPage } from '@/features/groups/group-detail-page'
import { EvaluationPageV2 } from '@/features/evaluation/evaluation-page-v2'
import { EvalSidebarShowcasePage } from '@/features/evaluation/eval-sidebar-showcase-page'
import { HistoryPage } from '@/features/history/history-page'
import { AdminPage } from '@/features/admin/admin-page'
import { ChecklistQuestionsPage } from '@/features/admin/checklists/questions-page'
import { useUnitStore } from '@/stores/unit-store'
import { pageTransition } from '@/design-system/animations'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
})

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const unitSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: UnitSelectionPage,
})

const evalSidebarShowcaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/__showcase/eval-sidebar',
  component: EvalSidebarShowcasePage,
})

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: function AuthenticatedLayout() {
    const { selectedUnit } = useUnitStore()
    const navigate = useNavigate()

    if (!selectedUnit) {
      navigate({ to: '/' })
      return null
    }

    return (
      <AppShell>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          <Outlet />
        </motion.div>
      </AppShell>
    )
  },
})

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const groupsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/groups',
  component: GroupsPage,
})

const groupDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/groups/$groupId',
  component: GroupDetailPage,
})

const evaluationRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/evaluation/$groupId',
  component: EvaluationPageV2,
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) || 'audit',
  }),
})

const historyRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/history',
  component: HistoryPage,
  validateSearch: (search: Record<string, unknown>) => ({
    v: (search.v as string) || 'timeline-classica',
    search: (search.search as string) || '',
    type: (search.type as string) || 'all',
    groupId: (search.groupId as string) || '',
    managementId: (search.managementId as string) || '',
    areaId: (search.areaId as string) || '',
    groupTypeName: (search.groupTypeName as string) || '',
    applicantId: (search.applicantId as string) || '',
    checklistRevision: search.checklistRevision != null && search.checklistRevision !== ''
      ? Number(search.checklistRevision)
      : null,
    dateFrom: (search.dateFrom as string) || null,
    dateTo: (search.dateTo as string) || null,
    scoreMin: search.scoreMin != null ? Number(search.scoreMin) : 0,
    scoreMax: search.scoreMax != null ? Number(search.scoreMax) : 100,
    advanced: (search.advanced as string) || 'all',
    sort: (search.sort as string) || 'date-desc',
    preset: (search.preset as string) || null,
    selectedEvalId: (search.selectedEvalId as string) || '',
    drawerTab: (search.drawerTab as string) || 'summary',
  }),
})

const adminRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin',
  component: AdminPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || 'users',
  }),
})

const checklistQuestionsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin/checklists/$checklistId/revisions/$revisionId/questions',
  component: ChecklistQuestionsPage,
})

const routeTree = rootRoute.addChildren([
  unitSelectionRoute,
  evalSidebarShowcaseRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    groupsRoute,
    groupDetailRoute,
    evaluationRoute,
    historyRoute,
    adminRoute,
    checklistQuestionsRoute,
  ]),
])

const hashHistory = createHashHistory()

const router = createRouter({
  routeTree,
  history: hashHistory,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
