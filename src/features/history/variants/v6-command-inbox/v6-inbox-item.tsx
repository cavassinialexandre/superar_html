import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

interface V6InboxItemProps {
  ev: Evaluation
  isSelected: boolean
  isUnread: boolean
  onClick: () => void
}

function relativeDate(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `${days}d`
  if (days < 30) return `${Math.floor(days / 7)}sem`
  if (days < 365) return `${Math.floor(days / 30)}m`
  return `${Math.floor(days / 365)}a`
}

function avatarColor(name: string) {
  const seed = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  const palette = [
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-emerald-500', text: 'text-white' },
    { bg: 'bg-purple-500', text: 'text-white' },
    { bg: 'bg-amber-500', text: 'text-white' },
    { bg: 'bg-rose-500', text: 'text-white' },
    { bg: 'bg-indigo-500', text: 'text-white' },
  ]
  return palette[seed % palette.length]
}

export function V6InboxItem({ ev, isSelected, isUnread, onClick }: V6InboxItemProps) {
  const goal = resolveGoalPct(ev) ?? 0
  const met = ev.score >= goal
  const advanced = ev.type === 'audit' && ev.advancedSequence === true
  const status = advanced ? 'Avançou' : met ? 'Meta atingida' : 'Abaixo da meta'
  const statusColor = advanced ? 'text-emerald-600' : met ? 'text-teal-600' : 'text-rose-500'
  const trend = met ? '↗' : '↘'
  const avatar = avatarColor(ev.applicantName)

  const firstFailing = ev.answers.find((a) => a.answer === 'no')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left px-4 py-3 border-l-2 transition group relative',
          isSelected
            ? 'bg-gray-950 border-sky-500 text-white'
            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200',
        )}
      >
        <div className="flex items-start gap-3">
          {/* Unread dot + avatar */}
          <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                isUnread ? 'bg-sky-500' : 'bg-transparent',
              )}
            />
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold', avatar.bg, avatar.text)}>
              {ev.applicantName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Line 1: grupo + score + trend */}
            <div className="flex items-center gap-2">
              <p className={cn('text-sm font-bold truncate', isSelected ? 'text-white' : isUnread ? 'text-gray-900' : 'text-gray-700')}>
                {ev.groupName}
              </p>
              <span className={cn('text-xs font-mono tabular-nums flex-shrink-0', isSelected ? 'text-sky-300' : 'text-gray-600 font-bold')}>
                {ev.score}%
              </span>
              <span className={cn('text-xs flex-shrink-0', isSelected ? 'text-emerald-400' : statusColor)}>{trend}</span>
            </div>

            {/* Line 2: aplicador · data · tipo */}
            <div className={cn('flex items-center gap-2 mt-0.5 text-[11px]', isSelected ? 'text-gray-400' : 'text-gray-500')}>
              <span className="truncate">{ev.applicantName.split(' ')[0]}</span>
              <span className="text-gray-400">·</span>
              <span className="tabular-nums font-mono">{relativeDate(ev.date)}</span>
              <span className="text-gray-400">·</span>
              <span className={cn('uppercase tracking-wider font-bold text-[9px]', isSelected ? 'text-sky-300' : 'text-gray-400')}>
                {ev.type === 'audit' ? 'AUD' : 'F-UP'}
              </span>
              <span className="text-gray-400">·</span>
              <span className="font-mono tabular-nums">seq.{ev.sequenceAtTime}</span>
            </div>

            {/* Line 3: snippet */}
            <p className={cn('mt-1 text-[11px] italic truncate', isSelected ? 'text-gray-400' : 'text-gray-500')}>
              <span className={cn('font-semibold', isSelected ? 'text-gray-300' : statusColor, 'not-italic')}>
                {status}
              </span>
              {firstFailing && (
                <>
                  {' — '}
                  <span>{firstFailing.questionText}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  )
}
