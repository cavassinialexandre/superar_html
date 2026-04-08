import { useState } from 'react'
import { GroupTypesAccordionView } from './group-types-accordion-view'
import { GroupTypeForm } from './group-type-form'
import { SequenceForm } from './sequence-form'
import { useGroupTypes } from './use-group-types'
import type { GroupType, Sequence } from '@/types'

export function GroupTypesTab() {
  const {
    filteredGroupTypes,
    searchQuery,
    setSearchQuery,
    createGroupType,
    updateGroupType,
    deleteGroupType,
    toggleGroupTypeStatus,
    addSequence,
    updateSequence,
    removeSequence,
    activeChecklists,
  } = useGroupTypes()

  // Estados dos drawers
  const [groupTypeFormOpen, setGroupTypeFormOpen] = useState(false)
  const [editingGroupType, setEditingGroupType] = useState<GroupType | null>(null)

  const [sequenceFormOpen, setSequenceFormOpen] = useState(false)
  const [selectedGroupTypeId, setSelectedGroupTypeId] = useState<string | null>(null)
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null)

  const [loading, setLoading] = useState(false)

  // Handlers para GroupType
  const handleOpenNewGroupType = () => {
    setEditingGroupType(null)
    setGroupTypeFormOpen(true)
  }

  const handleOpenEditGroupType = (groupType: GroupType) => {
    setEditingGroupType(groupType)
    setGroupTypeFormOpen(true)
  }

  const handleCloseGroupTypeForm = () => {
    setGroupTypeFormOpen(false)
    setEditingGroupType(null)
  }

  const handleSubmitGroupType = async (data: {
    name: string
    defaultGoal: number
    status: 'active' | 'inactive'
  }) => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    if (editingGroupType) {
      updateGroupType(editingGroupType.id, data)
    } else {
      createGroupType(data)
    }

    setLoading(false)
    handleCloseGroupTypeForm()
  }

  // Handlers para Sequence
  const handleOpenNewSequence = (groupTypeId: string) => {
    setSelectedGroupTypeId(groupTypeId)
    setEditingSequence(null)
    setSequenceFormOpen(true)
  }

  const handleOpenEditSequence = (groupTypeId: string, sequence: Sequence) => {
    setSelectedGroupTypeId(groupTypeId)
    setEditingSequence(sequence)
    setSequenceFormOpen(true)
  }

  const handleCloseSequenceForm = () => {
    setSequenceFormOpen(false)
    setSelectedGroupTypeId(null)
    setEditingSequence(null)
  }

  const handleSubmitSequence = async (data: {
    number: number
    useDefaultGoal: boolean
    customGoal?: number
    checklistId: string
  }) => {
    if (!selectedGroupTypeId) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))

    if (editingSequence) {
      updateSequence(selectedGroupTypeId, editingSequence.id, data)
    } else {
      addSequence(selectedGroupTypeId, data)
    }

    setLoading(false)
    handleCloseSequenceForm()
  }

  const selectedGroupType = filteredGroupTypes.find(gt => gt.id === selectedGroupTypeId)

  return (
    <>
      <GroupTypesAccordionView
        groupTypes={filteredGroupTypes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddGroupType={handleOpenNewGroupType}
        onEditGroupType={handleOpenEditGroupType}
        onAddSequence={handleOpenNewSequence}
        onEditSequence={handleOpenEditSequence}
        onToggleStatus={toggleGroupTypeStatus}
      />

      {/* GroupType Form Drawer */}
      <GroupTypeForm
        groupType={editingGroupType}
        open={groupTypeFormOpen}
        onSubmit={handleSubmitGroupType}
        onCancel={handleCloseGroupTypeForm}
        loading={loading}
      />

      {/* Sequence Form Drawer */}
      {selectedGroupType && (
        <SequenceForm
          sequence={editingSequence}
          open={sequenceFormOpen}
          defaultGoal={selectedGroupType.defaultGoal}
          nextNumber={selectedGroupType.sequences.length + 1}
          activeChecklists={activeChecklists}
          existingNumbers={selectedGroupType.sequences.map(s => s.number)}
          onSubmit={handleSubmitSequence}
          onCancel={handleCloseSequenceForm}
          loading={loading}
        />
      )}
    </>
  )
}
