import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { PlusIcon } from '@/assets/icons'
import { SequenceDetailCard } from './sequence-detail-card'
import type { Sequence } from '@/types'

interface SequenceListSectionProps {
  sequences: Sequence[]
  defaultGoal: number
  onAddSequence: () => void
  onEditSequence: (sequence: Sequence) => void
  groupTypeName: string
}

export function SequenceListSection({
  sequences,
  defaultGoal,
  onAddSequence,
  onEditSequence,
  groupTypeName,
}: SequenceListSectionProps) {
  const hasSequences = sequences.length > 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Sequências
          </h5>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasSequences
              ? `${sequences.length} sequência${sequences.length !== 1 ? 's' : ''} cadastrada${sequences.length !== 1 ? 's' : ''}`
              : `Nenhuma sequência cadastrada em ${groupTypeName}`}
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onAddSequence}>
          <PlusIcon size={14} className="mr-1" />
          Nova Sequência
        </Button>
      </div>

      {/* Sequences Grid */}
      {hasSequences ? (
        <div className="grid gap-3">
          {sequences.map((seq, index) => (
            <SequenceDetailCard
              key={seq.id}
              sequence={seq}
              defaultGoal={defaultGoal}
              onEdit={() => onEditSequence(seq)}
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
          <p className="text-sm text-gray-500 mb-1">Nenhuma sequência cadastrada</p>
          <p className="text-xs text-gray-400 mb-3">
            Adicione a primeira sequência para este tipo de grupo
          </p>
          <Button size="sm" variant="ghost" onClick={onAddSequence}>
            <PlusIcon size={14} className="mr-1" />
            Adicionar primeira sequência
          </Button>
        </motion.div>
      )}
    </div>
  )
}
