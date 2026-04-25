import type { Evaluation } from '@/types'
import { groups, groupTypes } from '@/mocks/data'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'

const serif = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }

// ---------------------------------------------------------------------------
// Narrative builder — produz parágrafos com tom editorial
// ---------------------------------------------------------------------------

interface Narrative {
  kicker: string
  title: string
  lede: string
  body: string[]
  pullQuote?: { text: string; color: string }
  verdict: { label: string; color: string }
}

function buildNarrative(ev: Evaluation): Narrative {
  const goal = resolveGoalPct(ev) ?? 0
  const group = groups.find((g) => g.id === ev.groupId)
  const groupType = group ? groupTypes.find((t) => t.id === group.groupTypeId) : undefined
  const advanced = ev.type === 'audit' && ev.advancedSequence === true
  const met = ev.score >= goal
  const delta = ev.score - goal

  const date = new Date(ev.date)
  const dateLong = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  const yes = ev.answers.filter((a) => a.answer === 'yes').length
  const no = ev.answers.filter((a) => a.answer === 'no').length
  const partial = ev.answers.filter((a) => a.answer === 'partial').length
  const na = ev.answers.filter((a) => a.answer === 'na').length
  const hasAnswers = ev.answers.length > 0

  const presentCount = ev.presentMembers.length
  const teamSize = group?.team.length ?? 0
  const absent = Math.max(0, teamSize - presentCount)

  const kicker = `${ev.type === 'audit' ? 'Auditoria' : 'Follow-up'} · Passo ${ev.sequenceAtTime}${groupType ? ` · ${groupType.name}` : ''}`

  const title = advanced
    ? 'Avanço conquistado.'
    : met
      ? 'Meta atingida, sem avanço.'
      : 'Abaixo do alvo.'

  const verdict = advanced
    ? { label: `Avançou para sequência ${ev.sequenceAtTime + 1}`, color: '#047857' }
    : met
      ? { label: 'Meta atingida, mantido na sequência', color: '#0F766E' }
      : { label: 'Abaixo da meta, requer plano de ação', color: '#B91C1C' }

  // Lede
  const lede = advanced
    ? `Em ${dateLong}, a equipe ${ev.groupName} consolidou sua evolução: ${ev.score}% contra uma meta de ${goal}%. O avanço para o próximo passo foi confirmado pelo auditor.`
    : met
      ? `Em ${dateLong}, a equipe ${ev.groupName} atingiu a meta estabelecida (${ev.score}% contra ${goal}%). O avanço de sequência, no entanto, dependia de critérios obrigatórios que ainda não foram integralmente satisfeitos.`
      : `Em ${dateLong}, a equipe ${ev.groupName} registrou ${ev.score}% contra uma meta de ${goal}% — ${Math.abs(delta)}pp abaixo do necessário. A análise detalhada das respostas orientará o plano de ação.`

  // Body paragraphs
  const body: string[] = []

  // Parágrafo 1: contexto da avaliação
  body.push(
    `A ${ev.type === 'audit' ? 'auditoria' : 'aplicação de follow-up'} foi conduzida por ` +
    `${ev.applicantName} nas dependências de ${ev.areaName}, sob a ${ev.managementName}. ` +
    (presentCount > 0
      ? `Estavam presentes ${presentCount} pessoa${presentCount > 1 ? 's' : ''}${absent > 0 ? ` — ${absent} membro${absent > 1 ? 's' : ''} da equipe não pôde${absent === 1 ? '' : 'ram'} participar` : ''}.`
      : 'A lista de presentes não ficou registrada.'),
  )

  // Parágrafo 2: respostas do checklist
  if (hasAnswers) {
    const parts: string[] = []
    parts.push(`Foram avaliados ${ev.answers.length} critérios do checklist na revisão ${ev.checklistRevision}`)
    const breakdown: string[] = []
    if (yes > 0) breakdown.push(`${yes} plenamente atendido${yes > 1 ? 's' : ''}`)
    if (partial > 0) breakdown.push(`${partial} parcialmente atendido${partial > 1 ? 's' : ''}`)
    if (no > 0) breakdown.push(`${no} não atendido${no > 1 ? 's' : ''}`)
    if (na > 0) breakdown.push(`${na} não aplicável${na > 1 ? 'is' : ''}`)
    if (breakdown.length > 0) {
      parts[0] += `: ${breakdown.join(', ')}`
    }
    parts[0] += '.'
    body.push(parts[0])
  } else {
    body.push(
      `Esta avaliação foi registrada em versão anterior do checklist, sem o detalhamento de respostas por pergunta. ` +
      `O score final de ${ev.score}% foi preservado como indicador consolidado.`,
    )
  }

  // Parágrafo 3: análise do veredicto
  if (advanced) {
    body.push(
      `O avanço de sequência é fruto de consistência: o grupo cumpriu o limiar quantitativo (${goal}%) ` +
      `e os critérios obrigatórios da etapa. A sequência ${ev.sequenceAtTime + 1} trará exigências mais rigorosas, ` +
      `mas a trajetória construída até aqui sustenta a expectativa de continuidade.`,
    )
  } else if (met) {
    body.push(
      `Apesar do score acima da meta (${ev.score}% vs. ${goal}%), o avanço não se concretizou porque critérios ` +
      `obrigatórios do checklist ainda estão pendentes. A próxima rodada de auditoria poderá consolidar o salto ` +
      `caso esses itens específicos sejam endereçados no intervalo.`,
    )
  } else {
    body.push(
      `O score sinaliza oportunidades concretas de endereçamento. Os ${no > 0 ? no : '—'} item${no === 1 ? '' : 's'} ` +
      `respondidos como "não" devem nortear o plano de ação entre auditorias. Um follow-up intermediário pode ` +
      `acelerar a recuperação antes da próxima janela de avanço.`,
    )
  }

  // Parágrafo 4: grupo context
  if (group && groupType) {
    body.push(
      `A equipe ${group.name}, do tipo ${groupType.name}, está atualmente na sequência ${group.currentSequence} de ` +
      `${group.maxSequence}, contando com ${group.team.length} membros ativos — ` +
      `${group.team.filter((t) => t.role === 'facilitator').length} ` +
      `em função de facilitação e ${group.team.filter((t) => t.role === 'auditor').length} ` +
      `habilitados${group.team.filter((t) => t.role === 'auditor').length === 1 ? '' : 's'} como auditor${group.team.filter((t) => t.role === 'auditor').length === 1 ? '' : 'es'}.`,
    )
  }

  // Pull quote
  let pullQuote: Narrative['pullQuote'] | undefined
  if (advanced) {
    pullQuote = {
      text: '"O avanço é fruto de consistência. A sequência seguinte trará critérios mais exigentes, mas a trajetória sustenta a expectativa."',
      color: '#047857',
    }
  } else if (!met) {
    pullQuote = {
      text: '"Os itens respondidos como \'não\' são o mapa do plano de ação. Cada um deles é uma alavanca específica para a próxima auditoria."',
      color: '#B91C1C',
    }
  }

  return { kicker, title, lede, body, pullQuote, verdict }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface V7ContextNarrativeProps {
  ev: Evaluation
}

export function V7ContextNarrative({ ev }: V7ContextNarrativeProps) {
  const narrative = buildNarrative(ev)

  return (
    <article className="relative rounded-2xl border border-[#E8DEC9] bg-[#FAF7F2]/60 overflow-hidden">
      {/* Top gold rule */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #d4af37 0%, #b8860b 40%, #d4af37 60%, transparent 100%)' }}
      />

      <div className="p-6 md:p-8">
        {/* Kicker */}
        <p
          className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-bold"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {narrative.kicker}
        </p>

        {/* Title */}
        <h2
          className="mt-3 text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight leading-[1.05]"
          style={serif}
        >
          {narrative.title}
        </h2>

        {/* Gold rule */}
        <div className="my-5 h-[1.5px] w-20 bg-gradient-to-r from-[#D4AF37] to-transparent" />

        {/* Lede with drop cap */}
        <p
          className="text-base md:text-[17px] text-[#3A3A3A] leading-[1.75] first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:leading-none first-letter:pr-2 first-letter:pt-1 first-letter:text-[#B8860B]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {narrative.lede}
        </p>

        {/* Body paragraphs */}
        <div className="mt-6 space-y-4">
          {narrative.body.map((p, i) => (
            <p
              key={i}
              className="text-[15px] text-[#3A3A3A] leading-[1.7]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Pull quote */}
        {narrative.pullQuote && (
          <div className="my-8 py-6 border-y border-[#D8C89A]/60 text-center">
            <p
              className="text-xl md:text-2xl italic text-[#0A0A0A] leading-[1.4] max-w-2xl mx-auto"
              style={{ ...serif, color: narrative.pullQuote.color }}
            >
              {narrative.pullQuote.text}
            </p>
          </div>
        )}

        {/* Verdict footer */}
        <div
          className="mt-8 p-5 border-y border-[#D8C89A] bg-[#F5EED8]/40"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-bold">
                Veredicto
              </p>
              <p
                className="mt-1 text-xl font-bold italic"
                style={{ ...serif, color: narrative.verdict.color }}
              >
                {narrative.verdict.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-bold">Nota</p>
              <p className="mt-1 text-3xl font-bold tabular-nums" style={{ ...serif, color: narrative.verdict.color }}>
                {ev.score}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
