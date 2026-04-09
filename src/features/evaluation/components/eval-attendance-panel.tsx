/**
 * Compact attendance panel with avatar grid, role-grouped detail view,
 * and quick action links.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from '@/assets/icons'
import { Input, Label } from '@/components/ui'
import type { TeamMember } from '@/types'

interface EvalAttendancePanelProps {
  members: TeamMember[]
  presentMembers: string[]
  otherPeople: string
  onToggleMember: (name: string) => void
  onSetOtherPeople: (value: string) => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Avatar button
// ---------------------------------------------------------------------------

function MemberAvatar({
  member,
  isPresent,
  onToggle,
  size = 'md',
}: {
  member: TeamMember
  isPresent: boolean
  onToggle: () => void
  size?: 'sm' | 'md'
}) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-[9px]' : 'w-9 h-9 text-[10px]'

  return (
    <motion.button
      onClick={onToggle}
      title={member.name}
      className={cn(
        'relative rounded-full flex items-center justify-center font-bold cursor-pointer transition-colors',
        sizeClass,
        isPresent
          ? 'bg-primary-800 text-white ring-2 ring-green-400 ring-offset-1 shadow-sm'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500',
      )}
      whileTap={{ scale: 0.92 }}
    >
      {getInitials(member.name)}
      {/* Role indicator for facilitators */}
      {member.role === 'facilitator' && isPresent && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-white">
          <StarIcon />
        </span>
      )}
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Role groups for detail view
// ---------------------------------------------------------------------------

const roleConfig: Record<string, { label: string; color: string }> = {
  facilitator: { label: 'Facilitadores', color: 'text-amber-600' },
  auditor: { label: 'Auditores', color: 'text-blue-600' },
  member: { label: 'Membros', color: 'text-gray-600' },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalAttendancePanel({
  members,
  presentMembers,
  otherPeople,
  onToggleMember,
  onSetOtherPeople,
}: EvalAttendancePanelProps) {
  const [showDetails, setShowDetails] = useState(false)
  const presentCount = presentMembers.length

  // Group members by role
  const grouped = {
    facilitator: members.filter((m) => m.role === 'facilitator'),
    auditor: members.filter((m) => m.role === 'auditor'),
    member: members.filter((m) => m.role === 'member'),
  }

  const handleSelectAll = () => {
    for (const m of members) {
      if (!presentMembers.includes(m.name)) {
        onToggleMember(m.name)
      }
    }
  }

  const handleClearAll = () => {
    for (const m of members) {
      if (presentMembers.includes(m.name)) {
        onToggleMember(m.name)
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Section label */}
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
        Equipe Presente
      </p>

      {/* Summary bar — right below title */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        {presentCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
        )}
        <span className="tabular-nums">
          {presentCount}/{members.length} presentes
        </span>
        <span className="text-gray-200">|</span>
        <button
          onClick={handleSelectAll}
          className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
        >
          Selecionar todos
        </button>
        <button
          onClick={handleClearAll}
          className="text-gray-400 hover:text-gray-500 cursor-pointer font-medium"
        >
          Limpar
        </button>
      </div>

      {/* Avatar grid */}
      <div className="flex flex-wrap gap-2 items-center">
        {members.map((member) => (
          <MemberAvatar
            key={member.id}
            member={member}
            isPresent={presentMembers.includes(member.name)}
            onToggle={() => onToggleMember(member.name)}
          />
        ))}
      </div>

      {/* Toggle details — centered */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon size={12} />
          </motion.div>
          {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
        </button>
      </div>

      {/* Expandable detail panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="max-h-[200px] overflow-y-auto space-y-3 py-2">
              {(['facilitator', 'auditor', 'member'] as const).map((role) => {
                const group = grouped[role]
                if (group.length === 0) return null
                const config = roleConfig[role]
                return (
                  <div key={role}>
                    <p className={cn('text-[10px] font-bold uppercase tracking-wider mb-1', config.color)}>
                      {config.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.map((m) => {
                        const isPresent = presentMembers.includes(m.name)
                        return (
                          <button
                            key={m.id}
                            onClick={() => onToggleMember(m.name)}
                            className={cn(
                              'w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs cursor-pointer transition-colors',
                              isPresent
                                ? 'bg-primary-50/50 text-gray-700'
                                : 'text-gray-400 hover:bg-gray-50',
                            )}
                          >
                            <span
                              className={cn(
                                'w-2 h-2 rounded-full flex-shrink-0',
                                isPresent ? 'bg-green-400' : 'bg-gray-300',
                              )}
                            />
                            <span className="truncate">{m.name}</span>
                            {role === 'facilitator' && (
                              <span className="text-amber-400 ml-auto">
                                <StarIcon />
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other people input — no divider */}
      <div>
        <Label>Outras pessoas (não cadastradas)</Label>
        <Input
          placeholder="Ex: João da equipe externa, Maria visitante..."
          value={otherPeople}
          onChange={(e) => onSetOtherPeople(e.target.value)}
        />
      </div>
    </div>
  )
}
