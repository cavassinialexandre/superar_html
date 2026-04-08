import { motion } from 'framer-motion'
import { ArrowAdvanceIcon, CheckCircleIcon } from '@/assets/icons'
import type { Group } from '@/types'

interface AdvanceDialogProps {
  group: Group
  score: number
  meta: number
  onDecision: (decision: 'advance' | 'maintain') => void
}

export function AdvanceDialog({ group, score, meta, onDecision }: AdvanceDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <ArrowAdvanceIcon size={32} className="text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 text-center">
          Grupo Elegível para Avanço
        </h3>
        <p className="text-sm text-gray-500 text-center mb-2">
          O grupo <strong>{group.name}</strong> atingiu todos os critérios para avançar de sequência.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">Nota: <strong>{score.toFixed(0)}%</strong></span>
            <span className="text-green-700">Meta: <strong>{meta}%</strong></span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Passo atual: {group.currentSequence} → Proximo: {group.currentSequence + 1} de {group.maxSequence}
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center mb-4 font-medium">
          Escolha obrigatoriamente uma opção antes de finalizar:
        </p>

        <div className="space-y-2">
          <button
            onClick={() => onDecision('advance')}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400 transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <ArrowAdvanceIcon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Avançar para próxima sequência</p>
              <p className="text-xs text-green-600">O grupo passará para o passo {group.currentSequence + 1}</p>
            </div>
          </button>

          <button
            onClick={() => onDecision('maintain')}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Manter na sequência atual</p>
              <p className="text-xs text-gray-500">O grupo permanecerá no passo {group.currentSequence}</p>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
