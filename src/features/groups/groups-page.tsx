import { useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { PageContainer } from '@/components/layout/app-shell'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { Input } from '@/components/ui'
import { SearchIcon, GridIcon, ListIcon } from '@/assets/icons'
import { groups, managements, areas, groupTypes } from '@/mocks/data'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import { GroupCardGrid, GroupsTable } from './group-views'
import { AreaAccordionView, AreaKanbanView, AreaTimelineView } from './area-views'
import type { ViewMode } from './group-views'
import type { Group } from '@/types'

type GeralLayout = 'accordion' | 'kanban' | 'timeline'

const geralLayouts: { mode: GeralLayout; label: string }[] = [
  { mode: 'accordion', label: 'Accordion' },
  { mode: 'kanban', label: 'Kanban' },
  { mode: 'timeline', label: 'Timeline' },
]

function GeralLayoutSelector({ layout, onChange }: { layout: GeralLayout; onChange: (l: GeralLayout) => void }) {
  return (
    <div className="flex items-center bg-gray-100/80 rounded-lg p-1 gap-0.5 overflow-x-auto">
      {geralLayouts.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
            layout === mode
              ? 'text-primary-800'
              : 'text-gray-400 hover:text-gray-600',
          )}
        >
          {layout === mode && (
            <motion.div
              layoutId="geralLayout"
              className="absolute inset-0 bg-white rounded-md shadow-sm ring-1 ring-gray-200/60"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  )
}

function ViewToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (v: ViewMode) => void }) {
  const views: { mode: ViewMode; icon: typeof GridIcon; label: string }[] = [
    { mode: 'cards', icon: GridIcon, label: 'Cards' },
    { mode: 'table', icon: ListIcon, label: 'Tabela' },
  ]

  return (
    <div className="flex items-center bg-gray-100/80 rounded-lg p-1 gap-0.5">
      {views.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer',
            viewMode === mode
              ? 'text-primary-800'
              : 'text-gray-400 hover:text-gray-600',
          )}
          title={label}
        >
          {viewMode === mode && (
            <motion.div
              layoutId="viewToggle"
              className="absolute inset-0 bg-white rounded-md shadow-sm ring-1 ring-gray-200/60"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Icon size={16} className="relative z-10" />
          <span className="relative z-10 hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

function FilterButton({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-[38px] h-[38px] rounded-[10px] transition-all duration-200 cursor-pointer flex-shrink-0',
        isActive
          ? 'bg-gradient-to-br from-[#103734] to-[#155F59] shadow-[0_2px_8px_rgba(16,55,52,0.18)]'
          : 'bg-white border-[1.5px] border-gray-300 hover:border-gray-400',
      )}
      title="Filtros"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? 'white' : '#7A8584'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    </button>
  )
}

const geralComponents: Record<GeralLayout, React.ComponentType<{ groups: Group[]; onGroupClick: (id: string) => void }>> = {
  accordion: AreaAccordionView,
  kanban: AreaKanbanView,
  timeline: AreaTimelineView,
}

export function GroupsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [filterMgmt, setFilterMgmt] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [geralLayout, setGeralLayout] = useState<GeralLayout>('accordion')

  const searchType = new URLSearchParams(window.location.hash.split('?')[1] || '').get('type') || ''
  const isGeralView = !searchType

  const filteredAreas = filterMgmt
    ? areas.filter(a => a.managementId === filterMgmt && a.status === 'active')
    : areas.filter(a => a.status === 'active')

  const filtered = groups.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterMgmt && g.managementId !== filterMgmt) return false
    if (filterArea && g.areaId !== filterArea) return false
    if (filterType && g.groupTypeId !== filterType) return false
    if (searchType && g.groupTypeId !== searchType) return false
    return true
  })

  const hasActiveFilters = !!filterMgmt || !!filterArea || !!filterType
  const isFilterBtnActive = showFilters || hasActiveFilters

  const clearFilters = () => {
    setFilterMgmt('')
    setFilterArea('')
    setFilterType('')
  }

  const uniqueAreaCount = new Set(filtered.map(g => g.areaId)).size
  const handleGroupClick = (id: string) => navigate({ to: '/groups/$groupId', params: { groupId: id } })

  const GeralComponent = geralComponents[geralLayout]

  return (
    <PageContainer>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <Breadcrumb
          items={[{ label: 'Grupos' }]}
          title={isGeralView ? 'Todos os Grupos' : 'Grupos'}
          description={isGeralView
            ? 'Visão geral de todos os grupos organizados por área.'
            : 'Visualize e gerencie todos os grupos Kaizen/TPM da unidade.'
          }
        />

        {/* Search + Filter Button + Layout Selector */}
        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <Input
              placeholder="Buscar grupo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<SearchIcon size={16} />}
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <FilterButton isActive={isFilterBtnActive} onClick={() => setShowFilters(!showFilters)} />
            {isGeralView ? (
              <GeralLayoutSelector layout={geralLayout} onChange={setGeralLayout} />
            ) : (
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            )}
          </div>
        </motion.div>

        {/* Collapsible Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { type: 'spring', stiffness: 500, damping: 40 }, opacity: { duration: 0.2 } }}
              style={{ overflow: 'hidden' }}
            >
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Filtrar por:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer flex-1 min-w-[160px]"
                >
                  <option value="">Todos os Tipos</option>
                  {groupTypes.filter(t => t.status === 'active').map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <select
                  value={filterMgmt}
                  onChange={(e) => { setFilterMgmt(e.target.value); setFilterArea('') }}
                  className="bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer flex-1 min-w-[160px]"
                >
                  <option value="">Todas Gerências</option>
                  {managements.filter(m => m.status === 'active').map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <select
                  value={filterArea}
                  onChange={(e) => setFilterArea(e.target.value)}
                  disabled={!filterMgmt}
                  className={cn(
                    "bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer flex-1 min-w-[160px]",
                    !filterMgmt && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <option value="">{filterMgmt ? 'Todas Áreas' : 'Selecione gerência primeiro'}</option>
                  {filteredAreas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors cursor-pointer whitespace-nowrap px-2 py-1"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div variants={staggerItem} className="flex items-center gap-4">
          <p className="text-sm text-gray-500 flex-shrink-0">
            <span className="font-semibold text-gray-800">{filtered.length}</span> grupos
            {isGeralView && (
              <> em <span className="font-semibold text-gray-800">{uniqueAreaCount}</span> áreas</>
            )}
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isGeralView ? (
            <motion.div
              key={`geral-${geralLayout}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <GeralComponent groups={filtered} onGroupClick={handleGroupClick} />
            </motion.div>
          ) : viewMode === 'cards' ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <GroupCardGrid groups={filtered} onGroupClick={handleGroupClick} />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <GroupsTable groups={filtered} onRowClick={handleGroupClick} />
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">Nenhum grupo encontrado com os filtros selecionados.</p>
          </div>
        )}
      </motion.div>
    </PageContainer>
  )
}
