import { useState, useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { managements, areas } from '@/mocks/data'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import { UsersTab } from './users'
import { GroupTypesTab } from './group-types'
import { ChecklistsTab } from './checklists'
import { GroupsTab } from './groups'
import { ManagementAreasAccordionView } from './management-areas/management-areas-accordion-view'
import { ManagementForm } from './management-areas/management-form'
import { AreaForm } from './management-areas/area-form'
import type { Management, Area, UnitId } from '@/types'

type AdminTab = 'users' | 'management-areas' | 'group-types' | 'checklists' | 'groups'

const tabs: AdminTab[] = ['users', 'management-areas', 'group-types', 'checklists', 'groups']

const tabConfig: Record<AdminTab, { title: string; description: string }> = {
  users: { title: 'Usuários', description: 'Gerencie os usuários do sistema e seus perfis de acesso' },
  'management-areas': { title: 'Gerências e Áreas', description: 'Organize a estrutura de gerências e áreas da unidade' },
  'group-types': { title: 'Tipos de Grupo', description: 'Configure os tipos de grupo, metas e sequências de avaliação' },
  checklists: { title: 'Checklists', description: 'Gerencie os checklists de avaliação e suas revisões' },
  groups: { title: 'Grupos', description: 'Visualize e administre os grupos de trabalho cadastrados' },
}

interface ManagementDrawerState {
  open: boolean
  management?: Management
}

interface AreaDrawerState {
  open: boolean
  area?: Area
  preselectedManagementId?: string
}

export function AdminPage() {
  const { tab } = useSearch({ strict: false }) as { tab?: string }
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>((tab as AdminTab) || 'users')
  const [search, setSearch] = useState('')

  // Estados dos drawers de management-areas
  const [managementDrawer, setManagementDrawer] = useState<ManagementDrawerState>({
    open: false,
    management: undefined,
  })
  const [areaDrawer, setAreaDrawer] = useState<AreaDrawerState>({
    open: false,
    area: undefined,
    preselectedManagementId: undefined,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab && tabs.includes(tab as AdminTab)) {
      setActiveTab(tab as AdminTab)
    }
  }, [tab])

  // Handlers para Management
  const handleOpenNewManagement = () => {
    setManagementDrawer({ open: true, management: undefined })
  }

  const handleOpenEditManagement = (mgmt: Management) => {
    setManagementDrawer({ open: true, management: mgmt })
  }

  const handleCloseManagementDrawer = () => {
    setManagementDrawer({ open: false, management: undefined })
  }

  const handleSubmitManagement = async (data: {
    name: string
    unitId: UnitId
    status: 'active' | 'inactive'
  }) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (managementDrawer.management) {
      console.log('Edit management:', { id: managementDrawer.management.id, ...data })
    } else {
      console.log('Create management:', data)
    }

    setLoading(false)
    handleCloseManagementDrawer()
  }

  // Handlers para Area
  const handleOpenNewArea = (managementId?: string) => {
    setAreaDrawer({
      open: true,
      area: undefined,
      preselectedManagementId: managementId,
    })
  }

  const handleOpenEditArea = (area: Area) => {
    setAreaDrawer({
      open: true,
      area,
      preselectedManagementId: undefined,
    })
  }

  const handleCloseAreaDrawer = () => {
    setAreaDrawer({
      open: false,
      area: undefined,
      preselectedManagementId: undefined,
    })
  }

  const handleSubmitArea = async (data: {
    name: string
    managementId: string
    status: 'active' | 'inactive'
  }) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (areaDrawer.area) {
      console.log('Edit area:', { id: areaDrawer.area.id, ...data })
    } else {
      console.log('Create area:', data)
    }

    setLoading(false)
    handleCloseAreaDrawer()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />

      case 'management-areas':
        return (
          <ManagementAreasAccordionView
            managements={managements.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()))}
            areas={areas}
            searchQuery={search}
            onSearchChange={setSearch}
            onAddManagement={handleOpenNewManagement}
            onEditManagement={handleOpenEditManagement}
            onAddArea={handleOpenNewArea}
            onEditArea={handleOpenEditArea}
          />
        )

      case 'group-types':
        return <GroupTypesTab />

      case 'checklists':
        return <ChecklistsTab />

      case 'groups':
        return <GroupsTab />
    }
  }

  const config = tabConfig[activeTab]

  return (
    <PageContainer>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <Breadcrumb
          items={[{ label: 'Administração', href: '/admin' }, { label: config.title }]}
          title={config.title}
          description={config.description}
        />

        <motion.div variants={staggerItem} key={activeTab}>
          {renderContent()}
        </motion.div>
      </motion.div>

      {/* Management Form Drawer */}
      <ManagementForm
        open={managementDrawer.open}
        management={managementDrawer.management}
        onClose={handleCloseManagementDrawer}
        onSubmit={handleSubmitManagement}
        loading={loading}
      />

      {/* Area Form Drawer */}
      <AreaForm
        open={areaDrawer.open}
        area={areaDrawer.area}
        preselectedManagementId={areaDrawer.preselectedManagementId}
        managements={managements}
        onClose={handleCloseAreaDrawer}
        onSubmit={handleSubmitArea}
        loading={loading}
      />
    </PageContainer>
  )
}
