import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import type { Group, EvaluationType } from '@/types'

interface EvaluationResultModalProps {
  group: Group
  evalType: EvaluationType | string
  score: number
  meta: number
  advanceDecision: 'advance' | 'maintain' | null
  eligibility: { eligible: boolean; reasons: string[] }
  onNavigateGroup: () => void
  onNavigateDashboard: () => void
}

export function EvaluationResultModal({
  group,
  evalType,
  score,
  meta,
  advanceDecision,
  eligibility,
  onNavigateGroup,
  onNavigateDashboard,
}: EvaluationResultModalProps) {
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
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
          <CheckCircleIcon size={32} className="text-primary-700" />
        </div>
        <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
          Avaliação Finalizada
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {evalType === 'audit' ? 'Auditoria' : 'Follow-up'} — {group.name}
        </p>

        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Nota Final</p>
          <div className="font-heading text-5xl font-extrabold" style={{ color: score >= 80 ? '#00A650' : score >= 50 ? '#867F06' : '#CE3C5A' }}>
            {score.toFixed(0)}%
          </div>
          <p className="text-xs text-gray-400 mt-1">Meta: {meta}%</p>
        </div>

        {evalType === 'audit' && advanceDecision && (
          <div className={`mb-4 p-3 rounded-lg border ${
            advanceDecision === 'advance'
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-sm font-semibold ${advanceDecision === 'advance' ? 'text-green-700' : 'text-gray-600'}`}>
              {advanceDecision === 'advance'
                ? `Avançou para o passo ${group.currentSequence + 1}`
                : 'Mantido na sequência atual'
              }
            </p>
          </div>
        )}

        {evalType === 'audit' && !eligibility.eligible && eligibility.reasons.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-left">
            <p className="text-xs font-semibold text-gray-600 mb-1">Critérios não atendidos para avanço:</p>
            <ul className="text-xs text-gray-500 space-y-0.5">
              {eligibility.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-400 mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onNavigateGroup}>
            Voltar ao Grupo
          </Button>
          <Button className="flex-1" onClick={onNavigateDashboard}>
            Dashboard
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
