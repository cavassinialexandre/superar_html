import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Card, Badge } from '@/components/ui'
import { ScoreBadge } from '@/components/data-display/score-badge'
import { SequenceProgress } from '@/components/data-display/sequence-progress'
import { FactoryIcon, ChevronDownIcon, GroupsIcon, UserIcon } from '@/assets/icons'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import { GroupCardGrid, getTypeBadgeVariant, formatDate, GroupActions } from './group-views'
import type { Group } from '@/types'

// ─── Shared utilities ───

const mgmtColors: Record<string, string> = {
  'mgmt-1': '#1E7A73',
  'mgmt-2': '#b8860b',
  'mgmt-3': '#00A650',
  'mgmt-4': '#6366f1',
}

function getMgmtColor(managementId: string) {
  return mgmtColors[managementId] || '#A3ADAC'
}

interface AreaGroup {
  areaId: string
  areaName: string
  managementId: string
  managementName: string
  groups: Group[]
}

function computeAreaStats(groups: Group[]) {
  const totalMembers = groups.reduce((sum, g) => sum + g.team.length, 0)
  const scores = groups.filter(g => g.lastAuditScore !== undefined).map(g => g.lastAuditScore!)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : undefined
  return { totalMembers, avgScore, totalGroups: groups.length }
}

function useAreaGroups(groups: Group[]) {
  return useMemo(() => {
    const map = new Map<string, AreaGroup>()
    for (const g of groups) {
      if (!map.has(g.areaId)) {
        map.set(g.areaId, { areaId: g.areaId, areaName: g.areaName, managementId: g.managementId, managementName: g.managementName, groups: [] })
      }
      map.get(g.areaId)!.groups.push(g)
    }
    return Array.from(map.values()).sort((a, b) => a.managementName.localeCompare(b.managementName) || a.areaName.localeCompare(b.areaName))
  }, [groups])
}

interface AreaViewProps {
  groups: Group[]
  onGroupClick: (id: string) => void
}

// ─── 1. Accordion ───

export function AreaAccordionView({ groups, onGroupClick }: AreaViewProps) {
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set())
  const areaGroups = useAreaGroups(groups)

  useEffect(() => {
    if (areaGroups.length === 1) setExpandedAreas(new Set([areaGroups[0].areaId]))
  }, [areaGroups])

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => { const next = new Set(prev); next.has(areaId) ? next.delete(areaId) : next.add(areaId); return next })
  }

  const allExpanded = areaGroups.length > 0 && areaGroups.every(a => expandedAreas.has(a.areaId))
  const toggleAll = () => setExpandedAreas(allExpanded ? new Set() : new Set(areaGroups.map(a => a.areaId)))

  return (
    <div className="space-y-3">
      {areaGroups.length > 1 && (
        <div className="flex justify-end">
          <button onClick={toggleAll} className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors cursor-pointer">
            {allExpanded ? 'Recolher todos' : 'Expandir todos'}
          </button>
        </div>
      )}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {areaGroups.map((area) => {
          const color = getMgmtColor(area.managementId)
          const stats = computeAreaStats(area.groups)
          const isExpanded = expandedAreas.has(area.areaId)
          return (
            <motion.div key={area.areaId} variants={staggerItem}>
              <Card className="!p-0 overflow-hidden" style={{ borderLeft: `3px solid ${color}` }}>
                <button onClick={() => toggleArea(area.areaId)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors duration-150 cursor-pointer group/header text-left">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                    <FactoryIcon size={20} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-[15px] font-semibold text-gray-800 truncate">{area.areaName}</h3>
                      <Badge variant="default">{stats.totalGroups}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{area.managementName}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-5 mr-2">
                    <div className="flex items-center gap-1.5 text-gray-500"><GroupsIcon size={14} className="text-gray-400" /><span className="text-xs font-medium">{stats.totalGroups} grupos</span></div>
                    <div className="flex items-center gap-1.5 text-gray-500"><UserIcon size={14} className="text-gray-400" /><span className="text-xs font-medium">{stats.totalMembers} membros</span></div>
                    {stats.avgScore !== undefined && <ScoreBadge score={stats.avgScore} size="sm" />}
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="text-gray-400 group-hover/header:text-gray-600 transition-colors flex-shrink-0">
                    <ChevronDownIcon size={18} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { type: 'spring', stiffness: 500, damping: 40 }, opacity: { duration: 0.25 } }} style={{ overflow: 'hidden' }}>
                      <div className="px-5 pb-5 pt-4 border-t border-gray-100">
                        <GroupCardGrid groups={area.groups} onGroupClick={onGroupClick} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─── 2. Kanban ───

export function AreaKanbanView({ groups, onGroupClick }: AreaViewProps) {
  const areaGroups = useAreaGroups(groups)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
      {areaGroups.map((area) => {
        const color = getMgmtColor(area.managementId)
        const stats = computeAreaStats(area.groups)
        return (
          <motion.div
            key={area.areaId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 flex-shrink-0"
          >
            <div className="rounded-xl bg-gray-50/70 border border-gray-200/60 overflow-hidden">
              {/* Column header */}
              <div className="px-4 py-3.5 border-b border-gray-200/40" style={{ borderTop: `3px solid ${color}` }}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-heading text-sm font-semibold text-gray-800">{area.areaName}</h3>
                  <Badge variant="default">{stats.totalGroups}</Badge>
                </div>
                <p className="text-[11px] text-gray-400">{area.managementName}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-gray-500">{stats.totalMembers} membros</span>
                  {stats.avgScore !== undefined && <ScoreBadge score={stats.avgScore} size="sm" />}
                </div>
              </div>
              {/* Cards stack */}
              <div className="p-3 space-y-2.5 max-h-[520px] overflow-y-auto">
                {area.groups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onGroupClick(group.id)}
                    className="bg-white rounded-lg border border-gray-200/60 p-3.5 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800 leading-tight">{group.name}</h4>
                      <Badge variant={getTypeBadgeVariant(group.groupTypeName)}>{group.groupTypeName}</Badge>
                    </div>
                    <SequenceProgress current={group.currentSequence} max={group.maxSequence} size="sm" />
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[11px] text-gray-400">{group.team.length} membros</span>
                      {group.lastAuditScore !== undefined && <ScoreBadge score={group.lastAuditScore} size="sm" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── 3. Timeline ───

export function AreaTimelineView({ groups, onGroupClick }: AreaViewProps) {
  const areaGroups = useAreaGroups(groups)

  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
        {areaGroups.map((area) => {
          const color = getMgmtColor(area.managementId)
          const stats = computeAreaStats(area.groups)
          return (
            <motion.div key={area.areaId} variants={staggerItem} className="relative">
              {/* Dot */}
              <div className="absolute -left-8 top-1 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center" style={{ backgroundColor: color }}>
                  <FactoryIcon size={12} className="text-white" />
                </div>
              </div>

              {/* Area header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-semibold text-gray-800 leading-tight">{area.areaName}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{area.managementName}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-gray-200/60 shadow-sm">
                    <GroupsIcon size={12} className="text-gray-500" />
                    <span className="text-[11px] font-medium text-gray-600">{stats.totalGroups} grupos</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-gray-200/60 shadow-sm">
                    <UserIcon size={12} className="text-gray-500" />
                    <span className="text-[11px] font-medium text-gray-600">{stats.totalMembers} membros</span>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <GroupCardGrid groups={area.groups} onGroupClick={onGroupClick} />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

