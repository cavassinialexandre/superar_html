import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { EditIcon, TrashIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import type { TeamMember } from '@/types'

interface TeamMemberCardProps {
  member: TeamMember
  onEdit: () => void
  onRemove: () => void
  index?: number
}

// Gerar iniciais do nome
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Cor do badge baseada na função
function getRoleBadge(role: TeamMember['role']) {
  switch (role) {
    case 'facilitator':
      return { variant: 'primary' as const, label: 'Facilitador' }
    case 'auditor':
      return { variant: 'secondary' as const, label: 'Auditor' }
    case 'member':
      return { variant: 'default' as const, label: 'Membro' }
  }
}

export function TeamMemberCard({
  member,
  onEdit,
  onRemove,
  index = 0,
}: TeamMemberCardProps) {
  const roleBadge = getRoleBadge(member.role)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative rounded-xl border p-4 transition-all duration-200',
        'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700 text-sm font-bold">
          {getInitials(member.name)}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {member.name}
          </h4>
          <Badge variant={roleBadge.variant} size="sm" className="mt-1">
            {roleBadge.label}
          </Badge>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
            title="Editar"
          >
            <EditIcon size={14} />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Remover"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
