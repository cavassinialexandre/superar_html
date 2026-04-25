import { motion } from 'framer-motion'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

interface V2ArticleListProps {
  evaluations: Evaluation[]
  selectedId: string
  onSelect: (id: string) => void
}

export function V2ArticleList({ evaluations, selectedId, onSelect }: V2ArticleListProps) {
  if (evaluations.length === 0) return null

  return (
    <div className="divide-y divide-[#E8DEC9]/70">
      {evaluations.map((ev, idx) => (
        <ArticleItem key={ev.id} ev={ev} index={idx} isSelected={ev.id === selectedId} onClick={() => onSelect(ev.id)} />
      ))}
    </div>
  )
}

function ArticleItem({
  ev,
  index,
  isSelected,
  onClick,
}: {
  ev: Evaluation
  index: number
  isSelected: boolean
  onClick: () => void
}) {
  const goal = resolveGoalPct(ev) ?? 0
  const met = ev.score >= goal
  const advanced = ev.type === 'audit' && ev.advancedSequence === true

  const verdict = advanced ? 'Avançou' : met ? 'Atingiu a meta' : 'Abaixo da meta'
  const verdictColor = advanced ? '#538C4E' : met ? '#8A6B1A' : '#9F3A3A'

  const date = new Date(ev.date)
  const day = date.getDate().toString().padStart(2, '0')
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const snippet = buildSnippet(ev)

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group w-full text-left py-7 md:py-8 transition-colors duration-300 ${
        isSelected ? 'bg-[#F5EED8]/60 -mx-4 px-4 rounded-lg' : 'hover:bg-[#FAF7F2]/60 -mx-4 px-4 rounded-lg'
      }`}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Date column */}
        <div className="flex-shrink-0 md:w-28">
          <div className="text-[#0A0A0A] leading-none" style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }}>
            <p className="text-4xl font-bold tabular-nums">{day}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-[#B8860B] font-semibold mt-2">{month}</p>
            <p className="text-xs tabular-nums text-[#8A7A4A] mt-0.5">{year}</p>
          </div>
          <div className="mt-4 h-[1px] w-10 bg-gradient-to-r from-[#D4AF37] to-transparent" />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap text-[11px]">
            <span
              className="uppercase tracking-[0.2em] font-semibold text-[#B8860B]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'}
            </span>
            <span className="text-[#C9B77D]">·</span>
            <span
              className="italic text-[#5A5A5A]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              passo {ev.sequenceAtTime} · rev. {ev.checklistRevision}
            </span>
          </div>

          <h3
            className="mt-2 text-2xl md:text-3xl font-bold text-[#0A0A0A] leading-tight tracking-tight group-hover:text-[#5A4A0A] transition-colors"
            style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }}
          >
            {ev.groupName}
            <span
              className="ml-2 text-lg italic text-[#8A7A4A] font-normal align-middle"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              — {ev.managementName}
            </span>
          </h3>

          <p
            className="mt-2 text-sm italic text-[#5A5A5A]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            por <span className="font-semibold text-[#3A3A3A]">{ev.applicantName}</span>
            <span className="text-[#C9B77D] mx-2">·</span>
            aplicador
          </p>

          <p
            className="mt-3 text-base text-[#3A3A3A] leading-relaxed line-clamp-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {snippet}
          </p>

          {/* Hover gold underline */}
          <div className="mt-3 h-[1.5px] w-0 group-hover:w-32 bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-400" />
        </div>

        {/* Score column */}
        <div className="flex-shrink-0 md:w-32 flex md:flex-col md:items-end items-baseline gap-3 md:gap-2">
          <div className="flex-1 md:flex-initial">
            <p
              className="text-4xl md:text-5xl font-bold tabular-nums leading-none"
              style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif', color: verdictColor }}
            >
              {ev.score}%
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#8A7A4A]" style={{ fontFamily: 'Georgia, serif' }}>
              de {goal}% meta
            </p>
          </div>
          <div className="md:text-right">
            <span
              className="inline-block px-2 py-0.5 border italic text-[11px]"
              style={{
                borderColor: verdictColor,
                color: verdictColor,
                fontFamily: 'Georgia, serif',
              }}
            >
              {verdict}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function buildSnippet(ev: Evaluation): string {
  const problems = ev.answers.filter((a) => a.answer === 'no').length
  const yes = ev.answers.filter((a) => a.answer === 'yes').length
  const advanced = ev.type === 'audit' && ev.advancedSequence === true

  if (advanced) {
    return `Avançou para a sequência ${ev.sequenceAtTime + 1} após atingir a meta. A equipe demonstrou evolução consistente, com ${yes} critérios plenamente atendidos${problems > 0 ? ` e ${problems} pendências anotadas` : ''}.`
  }

  if (ev.score >= 70 && ev.type === 'audit') {
    return `Resultado sólido — ${yes} critérios plenos, mas obrigatórios ainda pendentes impediram o avanço. A próxima auditoria poderá consolidar o salto se os itens bloqueadores forem endereçados.`
  }

  if (ev.type === 'followup') {
    return `Follow-up aplicado pela equipe. Acompanhamento das ações entre auditorias, com foco em sustentação dos ganhos e endereçamento de ${problems} pontos de atenção.`
  }

  return `Avaliação com score abaixo da meta. ${problems} itens foram respondidos como "não" e requerem plano de ação antes da próxima rodada de auditoria.`
}
