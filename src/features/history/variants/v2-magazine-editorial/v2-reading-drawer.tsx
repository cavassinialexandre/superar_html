import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon } from '@/assets/icons'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../../shared/utils/evaluation-adapter'
import { groups } from '@/mocks/data'

interface V2ReadingDrawerProps {
  evaluation: Evaluation | null
  neighbors: { prev?: Evaluation; next?: Evaluation }
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
}

const serifStyle = { fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }

export function V2ReadingDrawer({ evaluation, neighbors, onClose, onNavigate }: V2ReadingDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [readProgress, setReadProgress] = useState(0)

  useEffect(() => {
    if (!evaluation) return
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const total = el.scrollHeight - el.clientHeight
      if (total <= 0) return setReadProgress(100)
      setReadProgress(Math.min(100, (el.scrollTop / total) * 100))
    }
    onScroll()
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [evaluation])

  useEffect(() => {
    if (!evaluation) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onNavigate('prev')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNavigate('next')
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [evaluation, onClose, onNavigate])

  return (
    <AnimatePresence>
      {evaluation && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#0A0A0A]/45 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-3xl bg-[#FAF7F2] shadow-2xl flex flex-col"
          >
            {/* Reading progress bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-[#E8DEC9]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                style={{ width: `${readProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#FAF7F2] border border-[#D8C89A] text-[#5A4A0A] hover:bg-[#F5EED8] cursor-pointer"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
              <ReadingContent ev={evaluation} />
            </div>

            {/* Footer navigation */}
            <div className="flex-none bg-[#F5EED8]/70 border-t border-[#D8C89A] px-6 md:px-10 py-4 flex items-center justify-between">
              <NavButton
                direction="prev"
                disabled={!neighbors.prev}
                onClick={() => onNavigate('prev')}
                label={neighbors.prev?.groupName}
              />
              <span className="text-[11px] italic text-[#8A7A4A]" style={{ fontFamily: 'Georgia, serif' }}>
                use ← → para navegar
              </span>
              <NavButton
                direction="next"
                disabled={!neighbors.next}
                onClick={() => onNavigate('next')}
                label={neighbors.next?.groupName}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function NavButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 text-sm italic transition cursor-pointer ${
        disabled ? 'text-[#C9B77D] cursor-not-allowed' : 'text-[#5A4A0A] hover:text-[#0A0A0A]'
      }`}
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {direction === 'prev' && (
        <span className="text-[#D4AF37]">←</span>
      )}
      {label ? (
        <span className="max-w-[180px] truncate">{direction === 'prev' ? 'Anterior' : 'Próximo'}: {label}</span>
      ) : (
        <span>{direction === 'prev' ? 'Anterior' : 'Próximo'}</span>
      )}
      {direction === 'next' && (
        <span className="text-[#D4AF37]">→</span>
      )}
    </button>
  )
}

function ReadingContent({ ev }: { ev: Evaluation }) {
  const goal = resolveGoalPct(ev) ?? 0
  const group = groups.find((g) => g.id === ev.groupId)
  const advanced = ev.type === 'audit' && ev.advancedSequence === true
  const met = ev.score >= goal

  const date = new Date(ev.date)
  const dateStr = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <article className="max-w-[640px] mx-auto px-6 md:px-10 py-14">
      <p
        className="text-[11px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold text-center"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'} · Passo {ev.sequenceAtTime}
      </p>

      <h1 className="mt-6 text-4xl md:text-5xl font-bold text-[#0A0A0A] tracking-tight leading-[1.05] text-center" style={serifStyle}>
        {ev.groupName}
      </h1>

      <div className="flex items-center justify-center gap-2 mt-3">
        <div className="h-[1px] w-8 bg-[#D4AF37]" />
        <span className="text-sm italic text-[#8A7A4A]" style={{ fontFamily: 'Georgia, serif' }}>
          {ev.managementName} · {ev.areaName}
        </span>
        <div className="h-[1px] w-8 bg-[#D4AF37]" />
      </div>

      <p className="mt-5 text-sm italic text-[#5A5A5A] text-center" style={{ fontFamily: 'Georgia, serif' }}>
        por <span className="font-semibold text-[#3A3A3A]">{ev.applicantName}</span> · {dateStr}
      </p>

      {/* Verdict lead */}
      <div className="mt-10 p-6 border-y border-[#D8C89A] bg-[#F5EED8]/30 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold">Veredicto</p>
        <p
          className="mt-2 text-3xl font-bold text-[#0A0A0A]"
          style={serifStyle}
        >
          {advanced ? (
            <em className="italic text-[#538C4E]">Avançou.</em>
          ) : met ? (
            <em className="italic text-[#8A6B1A]">Atingiu a meta.</em>
          ) : (
            <em className="italic text-[#9F3A3A]">Abaixo da meta.</em>
          )}
        </p>
        <p className="mt-3 text-sm text-[#5A5A5A] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
          {ev.score}% obtidos contra {goal}% esperados.
          {advanced && ` A sequência avança para o passo ${ev.sequenceAtTime + 1}.`}
        </p>
      </div>

      {/* Body */}
      <div className="mt-10 prose prose-lg text-[17px] text-[#3A3A3A] leading-[1.75]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:leading-none first-letter:pr-2 first-letter:text-[#B8860B]" style={{ fontFamily: 'Georgia, serif' }}>
          Em {dateStr.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}, a equipe <strong>{ev.groupName}</strong>{' '}
          recebeu a {ev.type === 'audit' ? 'auditoria' : 'aplicação de follow-up'} conduzida por{' '}
          <em>{ev.applicantName}</em> nas dependências de <em>{ev.areaName}</em>. Estavam presentes{' '}
          {ev.presentMembers.slice(0, 3).join(', ')}
          {ev.presentMembers.length > 3 ? ` e mais ${ev.presentMembers.length - 3} membros` : ''}.
        </p>

        {ev.answers.length > 0 ? (
          <p>
            Foram avaliados <strong>{ev.answers.length} critérios</strong> do checklist em sua revisão {ev.checklistRevision}.{' '}
            Do total, <strong>{ev.answers.filter((a) => a.answer === 'yes').length}</strong> foram plenamente atendidos,{' '}
            <strong>{ev.answers.filter((a) => a.answer === 'partial').length}</strong> parcialmente,{' '}
            <strong>{ev.answers.filter((a) => a.answer === 'no').length}</strong> não atendidos, e{' '}
            <strong>{ev.answers.filter((a) => a.answer === 'na').length}</strong> foram considerados não aplicáveis.
          </p>
        ) : (
          <p>
            Esta avaliação foi registrada antes da versão atual do sistema de respostas detalhadas.{' '}
            O score final de <strong>{ev.score}%</strong> preservou-se integralmente.
          </p>
        )}

        {group && (
          <p>
            A equipe <em>{group.name}</em>, do tipo <em>{group.groupTypeName}</em>, está atualmente na sequência{' '}
            <strong>{group.currentSequence}</strong> de <strong>{group.maxSequence}</strong>, contando com{' '}
            {group.team.length} membros ativos — {group.team.filter((t) => t.role === 'facilitator').length} em função de facilitação.
          </p>
        )}

        {advanced ? (
          <p className="text-[#538C4E]">
            <em>
              "O avanço é fruto de consistência. A sequência {ev.sequenceAtTime + 1} trará critérios mais exigentes, mas a trajetória
              construída até aqui sustenta a expectativa de continuidade."
            </em>
          </p>
        ) : !met ? (
          <p className="text-[#9F3A3A]">
            <em>
              "O resultado sinaliza que há endereçamentos a serem feitos antes da próxima rodada de auditoria.
              O plano de ação deve priorizar os itens marcados como 'não' atendidos."
            </em>
          </p>
        ) : null}
      </div>

      {/* Gold rule */}
      <div className="my-14 flex items-center justify-center">
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </div>

      {/* Attendance */}
      <section>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold text-center" style={{ fontFamily: 'Georgia, serif' }}>
          Presentes
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {ev.presentMembers.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#D4AF37]/40 bg-[#FAF7F2] text-[#3A3A3A] text-sm italic"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Answers detail */}
      {ev.answers.length > 0 && (
        <section className="mt-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Respostas detalhadas
          </p>
          <div className="mt-6 space-y-5">
            {ev.answers.map((a, i) => {
              const labels = { yes: 'Sim', no: 'Não', partial: 'Parcial', na: 'N/A' }
              const colors = { yes: '#538C4E', no: '#9F3A3A', partial: '#8A6B1A', na: '#8A7A4A' }
              return (
                <div key={a.questionId} className="flex gap-5 items-start">
                  <span
                    className="text-[28px] font-bold text-[#D4AF37] tabular-nums leading-none min-w-[48px] text-right"
                    style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="text-[15px] text-[#0A0A0A] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {a.questionText}
                    </p>
                    <p
                      className="mt-1.5 text-xs italic"
                      style={{ fontFamily: 'Georgia, serif', color: colors[a.answer] }}
                    >
                      {labels[a.answer]} · peso {a.weight}
                      {a.requiredYesForAdvance && ' · obrigatório Sim'}
                    </p>
                    {a.justification && (
                      <p className="mt-2 text-sm italic text-[#5A5A5A] pl-4 border-l border-[#D4AF37]/40" style={{ fontFamily: 'Georgia, serif' }}>
                        "{a.justification}"
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="mt-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
          Fim da matéria
        </p>
      </div>
    </article>
  )
}
