/**
 * TeamSection - Equipe colapsavel com visual premium
 * Watermark SVG, gradient header icon, avatares com glow
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import type { TeamMember } from '@/types'
import { cn } from '@/lib/cn'

// ============================================================================
// ICONES
// ============================================================================

const Icons = {
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  TeamWatermark: () => (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-primary-500/[0.04]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
}

// ============================================================================
// HELPERS
// ============================================================================

function getRoleLabel(role: TeamMember['role']) {
  switch (role) {
    case 'facilitator': return 'Facilitador'
    case 'auditor': return 'Auditor'
    case 'member': return 'Membro'
    default: return 'Membro'
  }
}

function getRoleBadgeVariant(role: TeamMember['role']): 'primary' | 'success' | 'default' {
  switch (role) {
    case 'facilitator': return 'primary'
    case 'auditor': return 'success'
    case 'member': return 'default'
    default: return 'default'
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getAvatarColor(name: string) {
  const colors = [
    { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
    { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-200' },
    { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
    { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
    { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-200' },
    { bg: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-200' },
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function TeamSection({ team }: { team: TeamMember[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const sortedTeam = [...team].sort((a, b) => {
    const order = { facilitator: 0, auditor: 1, member: 2 }
    return order[a.role] - order[b.role]
  })

  const facilitators = sortedTeam.filter(m => m.role === 'facilitator')
  const auditors = sortedTeam.filter(m => m.role === 'auditor')
  const members = sortedTeam.filter(m => m.role === 'member')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute -top-4 -right-4 pointer-events-none opacity-100">
          <Icons.TeamWatermark />
        </div>

        <div className="relative p-5 sm:p-6">
          {/* Header - Clickable */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1E7A73 0%, #3AA39C 100%)' }}
              >
                <span className="text-white"><Icons.Users /></span>
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Equipe</h3>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                  {facilitators.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Icons.Star />
                      {facilitators.length} Facilitador{facilitators.length > 1 ? 'es' : ''}
                    </span>
                  )}
                  {auditors.length > 0 && (
                    <span>{auditors.length} Auditor{auditors.length > 1 ? 'es' : ''}</span>
                  )}
                  {members.length > 0 && (
                    <span>{members.length} Membro{members.length > 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-200 transition-all"
            >
              <Icons.ChevronDown />
            </motion.div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="pt-5 mt-5 border-t border-gray-100">
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                  >
                    {sortedTeam.map((member) => {
                      const avatarStyle = getAvatarColor(member.name)
                      return (
                        <motion.div
                          key={member.id}
                          variants={staggerItem}
                          className="flex flex-col items-center p-3 rounded-xl border border-gray-100 hover:shadow-md hover:border-primary-200/50 hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <div className="relative mb-2">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ring-2',
                              avatarStyle.bg, avatarStyle.text, avatarStyle.ring
                            )}>
                              {getInitials(member.name)}
                            </div>
                            {member.role === 'facilitator' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full flex items-center justify-center shadow-sm">
                                <Icons.Star />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-700 text-center truncate max-w-full">
                            {member.name}
                          </p>
                          <Badge variant={getRoleBadgeVariant(member.role)} className="mt-1 text-[10px]">
                            {getRoleLabel(member.role)}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}
