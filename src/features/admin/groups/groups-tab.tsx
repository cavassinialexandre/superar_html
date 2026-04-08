import { useState } from 'react'
import { GroupsAccordionView } from './groups-accordion-view'
import { GroupForm } from './group-form'
import { TeamMemberForm } from './team-member-form'
import { useGroups } from './use-groups'
import type { Group, TeamMember } from '@/types'

export function GroupsTab() {
  const {
    filteredGroups,
    searchQuery,
    setSearchQuery,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleGroupStatus,
    addTeamMember,
    removeTeamMember,
  } = useGroups()

  // Estados dos drawers
  const [groupFormOpen, setGroupFormOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)

  const [memberFormOpen, setMemberFormOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  const [loading, setLoading] = useState(false)

  // Handlers para Group
  const handleOpenNewGroup = () => {
    setEditingGroup(null)
    setGroupFormOpen(true)
  }

  const handleOpenEditGroup = (group: Group) => {
    setEditingGroup(group)
    setGroupFormOpen(true)
  }

  const handleCloseGroupForm = () => {
    setGroupFormOpen(false)
    setEditingGroup(null)
  }

  const handleSubmitGroup = async (data: {
    name: string
    groupTypeId: string
    groupTypeName: string
    areaId: string
    areaName: string
    managementId: string
    managementName: string
    status: 'active' | 'inactive'
  }) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    if (editingGroup) {
      updateGroup(editingGroup.id, data)
    } else {
      createGroup(data)
    }

    setLoading(false)
    handleCloseGroupForm()
  }

  // Handlers para Team Member
  const handleOpenAddMember = (groupId: string) => {
    setSelectedGroupId(groupId)
    setEditingMember(null)
    setMemberFormOpen(true)
  }

  const handleOpenEditMember = (groupId: string, member: TeamMember) => {
    setSelectedGroupId(groupId)
    setEditingMember(member)
    setMemberFormOpen(true)
  }

  const handleCloseMemberForm = () => {
    setMemberFormOpen(false)
    setSelectedGroupId(null)
    setEditingMember(null)
  }

  const handleSubmitMember = async (data: {
    name: string
    role: 'facilitator' | 'auditor' | 'member'
  }) => {
    if (!selectedGroupId) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    if (editingMember) {
      // Para edição, remover e adicionar novamente (simplificado)
      removeTeamMember(selectedGroupId, editingMember.id)
      addTeamMember(selectedGroupId, data)
    } else {
      addTeamMember(selectedGroupId, data)
    }

    setLoading(false)
    handleCloseMemberForm()
  }

  const handleRemoveMember = (groupId: string, memberId: string) => {
    removeTeamMember(groupId, memberId)
  }

  return (
    <>
      <GroupsAccordionView
        groups={filteredGroups}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddGroup={handleOpenNewGroup}
        onEditGroup={handleOpenEditGroup}
        onAddMember={handleOpenAddMember}
        onEditMember={handleOpenEditMember}
        onRemoveMember={handleRemoveMember}
        onToggleStatus={toggleGroupStatus}
      />

      {/* Group Form Drawer */}
      <GroupForm
        group={editingGroup}
        open={groupFormOpen}
        onSubmit={handleSubmitGroup}
        onCancel={handleCloseGroupForm}
        loading={loading}
      />

      {/* Team Member Form Drawer */}
      <TeamMemberForm
        member={editingMember}
        open={memberFormOpen}
        onSubmit={handleSubmitMember}
        onCancel={handleCloseMemberForm}
        loading={loading}
      />
    </>
  )
}
