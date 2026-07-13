import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { groups, areas } from '@/mocks/data'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import { GroupCardGrid, GroupsTable } from './group-views'
import { AreaAccordionView, AreaKanbanView, AreaTimelineView } from './area-views'
import { GroupsPageHeader } from './components/groups-page-header'
import { GroupsFilterBar, type GroupsFilterValues } from './components/groups-filter-bar'
import { GroupsActiveChips } from './components/groups-active-chips'
import {
  GroupsToggle,
  GROUPS_VIEW_OPTIONS,
  GROUPS_GERAL_OPTIONS,
  type GroupsViewMode,
  type GroupsGeralLayout,
} from './components/groups-view-toggle'
import type { Group } from '@/types'

const geralComponents: Record<GroupsGeralLayout, React.ComponentType<{ groups: Group[]; onGroupClick: (id: string) => void }>> = {
  accordion: AreaAccordionView,
  kanban: AreaKanbanView,
  timeline: AreaTimelineView,
}

export function GroupsPage() {
  const navigate = useNavigate()
  const [filterValues, setFilterValues] = useState<GroupsFilterValues>({
    search: '',
    filterType: '',
    filterMgmt: '',
    filterArea: '',
  })
  const [viewMode, setViewMode] = useState<GroupsViewMode>('cards')
  const [geralLayout, setGeralLayout] = useState<GroupsGeralLayout>('accordion')

  const searchType = new URLSearchParams(window.location.hash.split('?')[1] || '').get('type') || ''
  const isGeralView = !searchType

  const updateFilter = <K extends keyof GroupsFilterValues>(key: K, value: GroupsFilterValues[K]) => {
    setFilterValues((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'filterMgmt') {
        const newMgmt = value as string
        if (next.filterArea) {
          const area = areas.find((a) => a.id === next.filterArea)
          if (!area || area.managementId !== newMgmt) {
            next.filterArea = ''
          }
        }
      }
      return next
    })
  }

  const clearAllFilters = () => {
    setFilterValues({ search: '', filterType: '', filterMgmt: '', filterArea: '' })
  }

  const filtered = groups.filter((g) => {
    const { search, filterType, filterMgmt, filterArea } = filterValues
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterMgmt && g.managementId !== filterMgmt) return false
    if (filterArea && g.areaId !== filterArea) return false
    if (filterType && g.groupTypeId !== filterType) return false
    if (searchType && g.groupTypeId !== searchType) return false
    return true
  })

  const uniqueAreaCount = new Set(filtered.map(g => g.areaId)).size
  const typesCount = new Set(filtered.map(g => g.groupTypeId)).size
  const membersCount = filtered.reduce((acc, g) => acc + g.team.length, 0)
  const handleGroupClick = (id: string) => navigate({ to: '/groups/$groupId', params: { groupId: id } })

  const GeralComponent = geralComponents[geralLayout]

  return (
    <PageContainer>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-5"
      >
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <GroupsPageHeader
            searchType={searchType}
            total={filtered.length}
            typesCount={typesCount}
            membersCount={membersCount}
            isGeralView={isGeralView}
          />
          <GroupsFilterBar
            values={filterValues}
            onChange={updateFilter}
            lockedType={searchType || undefined}
          />
        </div>

        <GroupsActiveChips
          values={filterValues}
          onChange={updateFilter}
          onClearAll={clearAllFilters}
          lockedType={searchType || undefined}
        />

        <motion.div
          variants={staggerItem}
          className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <p className="text-sm text-gray-500 flex-shrink-0">
            <span className="font-semibold text-gray-800">{filtered.length}</span> grupos
            {isGeralView && (
              <> em <span className="font-semibold text-gray-800">{uniqueAreaCount}</span> áreas</>
            )}
          </p>
          <div className="flex justify-end">
            {isGeralView ? (
              <GroupsToggle
                value={geralLayout}
                onChange={setGeralLayout}
                options={GROUPS_GERAL_OPTIONS}
                ariaLabel="Layout de visão geral"
                layoutId="groupsGeralPill"
              />
            ) : (
              <GroupsToggle
                value={viewMode}
                onChange={setViewMode}
                options={GROUPS_VIEW_OPTIONS}
                ariaLabel="Modo de visualização"
                layoutId="groupsViewPill"
              />
            )}
          </div>
        </motion.div>

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
