import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { PlusIcon } from '@/assets/icons'
import { TeamMemberCard } from './team-member-card'
import type { TeamMember } from '@/types'

interface TeamListSectionProps {
  team: TeamMember[]
  groupName: string
  onAddMember: () => void
  onEditMember: (member: TeamMember) => void
  onRemoveMember: (memberId: string) => void
}

export function TeamListSection({
  team,
  groupName,
  onAddMember,
  onEditMember,
  onRemoveMember,
}: TeamListSectionProps) {
  const hasTeam = team.length > 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Equipe
          </h5>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasTeam
              ? `${team.length} membro${team.length !== 1 ? 's' : ''}`
              : `Nenhum membro em ${groupName}`
            }
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onAddMember}>
          <PlusIcon size={14} className="mr-1" />
          Adicionar Membro
        </Button>
      </div>

      {/* Lista de Membros */}
      {hasTeam ? (
        <div className="grid gap-2">
          {team.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={() => onEditMember(member)}
              onRemove={() => onRemoveMember(member.id)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <PlusIcon size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Nenhum membro na equipe</p>
          <p className="text-xs text-gray-400 mb-3">
            Adicione o primeiro membro a este grupo
          </p>
          <Button size="sm" variant="ghost" onClick={onAddMember}>
            <PlusIcon size={14} className="mr-1" />
            Adicionar primeiro membro
          </Button>
        </motion.div>
      )}
    </div>
  )
}
