import { useState, useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { Card, Badge, Button } from '@/components/ui'
import { SearchInput } from '@/components/ui/input'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Textarea } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  ArrowLeftIcon,
} from '@/assets/icons'
import { checklists as allChecklists, checklistRevisions as allRevisions, questionGroups as allQuestionGroups } from '@/mocks/data'
import { cn } from '@/lib/cn'
import type { Question, QuestionGroup, AnswerType, ChecklistRevision } from '@/types'

function ListBulletIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

// ============================================================
// QUESTION FORM
// ============================================================

interface QuestionFormProps {
  question: Question | null
  open: boolean
  questionGroups: QuestionGroup[]
  onSubmit: (data: { text: string; groupId: string; weight: number; requiredYesForAdvance: boolean; answerType: AnswerType }) => void
  onCancel: () => void
  onAddGroup: () => void
}

function QuestionForm({ question, open, questionGroups, onSubmit, onCancel, onAddGroup }: QuestionFormProps) {
  const [text, setText] = useState(question?.text ?? '')
  const [groupId, setGroupId] = useState(question?.groupId ?? questionGroups[0]?.id ?? '')
  const [weight, setWeight] = useState(question?.weight ?? 10)
  const [requiredYesForAdvance, setRequiredYesForAdvance] = useState(question?.requiredYesForAdvance ?? false)
  const [answerType, setAnswerType] = useState<AnswerType>(question?.answerType ?? 'binary')
  const [errors, setErrors] = useState<{ text?: string; groupId?: string }>({})

  // Sincronizar com `question` quando o drawer abre
  const stableQuestion = JSON.stringify(question)
  useMemo(() => {
    if (question) {
      setText(question.text)
      setGroupId(question.groupId ?? questionGroups[0]?.id ?? '')
      setWeight(question.weight)
      setRequiredYesForAdvance(question.requiredYesForAdvance)
      setAnswerType(question.answerType ?? 'binary')
    } else {
      setText('')
      setGroupId(questionGroups[0]?.id ?? '')
      setWeight(10)
      setRequiredYesForAdvance(false)
      setAnswerType('binary')
    }
    setErrors({})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableQuestion, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { text?: string; groupId?: string } = {}
    if (!text.trim()) newErrors.text = 'Texto da pergunta é obrigatório'
    if (!groupId) newErrors.groupId = 'Grupo é obrigatório'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onSubmit({ text: text.trim(), groupId, weight, requiredYesForAdvance, answerType })
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={question ? 'Editar Pergunta' : 'Nova Pergunta'}
      subtitle={question ? 'Atualize as informações da pergunta' : 'Adicione uma nova pergunta ao checklist'}
    >
      <form id="question-form" onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Texto */}
          <div className="space-y-2">
            <label htmlFor="text" className="text-sm font-medium text-gray-700">
              Texto da Pergunta <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: A área está limpa e organizada?"
              rows={3}
              error={!!errors.text}
              className={text.trim() && !errors.text ? 'border-primary-500' : ''}
            />
            {errors.text && <p className="text-xs text-red-500">{errors.text}</p>}
          </div>

          {/* Grupo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Grupo <span className="text-red-500">*</span>
              </label>
              <button type="button" onClick={onAddGroup} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                + Novo Grupo
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {questionGroups.map((g) => {
                const isSelected = groupId === g.id
                return (
                  <motion.button
                    key={g.id}
                    type="button"
                    onClick={() => setGroupId(g.id)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        backgroundColor: isSelected ? `${g.color}20` : undefined,
                        color: isSelected ? g.color : undefined,
                      }}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          !isSelected && 'bg-gray-100 text-gray-400'
                        )}
                        style={isSelected ? { backgroundColor: `${g.color}20`, color: g.color } : undefined}
                      >
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'text-sm font-semibold block',
                        isSelected ? 'text-primary-800' : 'text-gray-700'
                      )}>
                        {g.name}
                      </span>
                      {g.description && <span className="text-xs text-gray-500">{g.description}</span>}
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            {errors.groupId && <p className="text-xs text-red-500">{errors.groupId}</p>}
          </div>

          {/* Peso */}
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium text-gray-700">Peso/Pontuação</label>
            <Input
              id="weight"
              type="number"
              min={1}
              max={100}
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
              className={weight >= 1 ? 'border-primary-500' : ''}
            />
            <p className="text-xs text-gray-500">Valor da pontuação desta pergunta na avaliação</p>
          </div>

          {/* Tipo de alternativas */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Alternativas de Resposta</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                {
                  value: 'binary' as AnswerType,
                  label: 'Sim / Não',
                  description: 'Duas opções',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ),
                },
                {
                  value: 'ternary' as AnswerType,
                  label: 'Sim / Parcial / Não',
                  description: 'Três opções',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ),
                },
              ]).map((opt) => {
                const isSelected = answerType === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswerType(opt.value)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {opt.icon}
                    </div>
                    <span className={cn('text-sm font-semibold', isSelected ? 'text-primary-800' : 'text-gray-700')}>
                      {opt.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Obrigatória para avanço */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Obrigatória para Avanço</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                {
                  value: true,
                  label: 'Sim',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ),
                  selectedBorder: 'border-primary-500',
                  selectedBg: 'bg-primary-50/50',
                  selectedIcon: 'bg-primary-100 text-primary-700',
                  selectedText: 'text-primary-800',
                },
                {
                  value: false,
                  label: 'Não',
                  icon: (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                  ),
                  selectedBorder: 'border-gray-400',
                  selectedBg: 'bg-gray-50',
                  selectedIcon: 'bg-gray-200 text-gray-600',
                  selectedText: 'text-gray-800',
                },
              ]).map((opt) => {
                const isSelected = requiredYesForAdvance === opt.value
                return (
                  <motion.button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setRequiredYesForAdvance(opt.value)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer',
                      isSelected
                        ? `${opt.selectedBorder} ${opt.selectedBg} shadow-sm`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected ? opt.selectedIcon : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {opt.icon}
                    </div>
                    <span className={cn('text-sm font-semibold', isSelected ? opt.selectedText : 'text-gray-700')}>
                      {opt.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-100/60 bg-gradient-to-b from-gray-50/80 to-gray-100/60">
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">{question ? 'Salvar Alterações' : 'Adicionar Pergunta'}</Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}

// ============================================================
// GROUP FORM
// ============================================================

const PRESET_COLORS = ['#3AA39C', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#10B981', '#EF4444', '#6B7280']

function GroupForm({ open, onSubmit, onCancel }: { open: boolean; onSubmit: (d: { name: string; description: string; color: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [errors, setErrors] = useState<{ name?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setErrors({ name: 'Nome do grupo é obrigatório' }); return }
    onSubmit({ name: name.trim(), description, color })
    setName(''); setDescription(''); setColor(PRESET_COLORS[0]); setErrors({})
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title="Novo Grupo"
      subtitle="Crie um novo grupo de perguntas"
    >
      <form id="group-form" onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="groupName" className="text-sm font-medium text-gray-700">Nome <span className="text-red-500">*</span></label>
            <Input
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: 5S — Seiri"
              error={!!errors.name}
              className={name.trim() && !errors.name ? 'border-primary-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="groupDesc" className="text-sm font-medium text-gray-700">Descrição</label>
            <Textarea
              id="groupDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional do grupo"
              rows={2}
              className={description.trim() ? 'border-primary-500' : ''}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn('w-8 h-8 rounded-full transition-all', color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-105')}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-100/60 bg-gradient-to-b from-gray-50/80 to-gray-100/60">
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Criar Grupo</Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}

// ============================================================
// QUESTION ROW
// ============================================================

function QuestionRow({ question, questionGroup, index, onEdit, onDelete }: {
  question: Question; questionGroup: QuestionGroup | undefined; index: number; onEdit: () => void; onDelete: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
      <Card className="overflow-hidden">
        <div className="px-4 py-3 hover:bg-gray-50/50 transition-colors group">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex justify-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 text-primary-700 text-sm font-bold">
                {question.sequence}
              </div>
            </div>

            <div className="col-span-5 min-w-0">
              <span className="text-sm font-semibold text-gray-800 truncate block" title={question.text}>
                {question.text}
              </span>
            </div>

            <div className="col-span-2 flex justify-center">
              {questionGroup ? (
                <Badge size="sm" style={{ backgroundColor: `${questionGroup.color}20`, color: questionGroup.color }}>
                  {questionGroup.name}
                </Badge>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </div>

            <div className="col-span-1 text-center">
              <Badge variant="secondary" size="sm">{question.weight}</Badge>
            </div>

            <div className="col-span-2 flex justify-center">
              {question.requiredYesForAdvance
                ? <Badge variant="success" size="sm">Sim</Badge>
                : <Badge variant="default" size="sm">Não</Badge>
              }
            </div>

            <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Editar">
                <EditIcon size={14} />
              </button>
              <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Excluir">
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export function ChecklistQuestionsPage() {
  const params = useParams({ strict: false })
  const checklistId = params.checklistId as string
  const revisionId = params.revisionId as string
  const navigate = useNavigate()

  const [checklists, setChecklists] = useState(allChecklists)
  const [revisions, setRevisions] = useState<ChecklistRevision[]>(allRevisions)
  const [questionGroups, setQuestionGroups] = useState(allQuestionGroups)
  const [searchQuery, setSearchQuery] = useState('')
  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [groupFormOpen, setGroupFormOpen] = useState(false)

  // Buscar checklist e revisão
  const checklist = useMemo(() => checklists.find(c => c.id === checklistId), [checklists, checklistId])
  const revision = useMemo(() => revisions.find(r => r.id === revisionId), [revisions, revisionId])

  const filteredQuestions = useMemo(() => {
    if (!revision) return []
    if (!searchQuery) return revision.questions
    return revision.questions.filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [revision, searchQuery])

  const getQuestionGroup = (groupId?: string) => questionGroups.find(g => g.id === groupId)

  const handleBack = () => navigate({ to: '/admin', search: { tab: 'checklists' } })

  const handleSubmitQuestion = (data: { text: string; groupId: string; weight: number; requiredYesForAdvance: boolean; answerType: AnswerType }) => {
    if (!revision) return

    // Atualiza nas revisões
    setRevisions(prev => prev.map(r => {
      if (r.id !== revisionId) return r
      if (editingQuestion) {
        return { ...r, questions: r.questions.map(q => q.id === editingQuestion.id ? { ...q, ...data } : q) }
      }
      const newQ: Question = {
        id: `q-${Date.now()}`,
        revisionId,
        sequence: r.questions.length + 1,
        ...data,
      }
      return { ...r, questions: [...r.questions, newQ] }
    }))

    // Atualiza nos checklists (para manter sincronizado)
    setChecklists(prev => prev.map(cl => ({
      ...cl,
      revisions: cl.revisions.map(r => {
        if (r.id !== revisionId) return r
        if (editingQuestion) {
          return { ...r, questions: r.questions.map(q => q.id === editingQuestion.id ? { ...q, ...data } : q) }
        }
        const newQ: Question = {
          id: `q-${Date.now()}`,
          revisionId,
          sequence: r.questions.length + 1,
          ...data,
        }
        return { ...r, questions: [...r.questions, newQ] }
      })
    })))

    setQuestionFormOpen(false)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return
    
    // Atualiza nas revisões
    setRevisions(prev => prev.map(r => {
      if (r.id !== revisionId) return r
      return { ...r, questions: r.questions.filter(q => q.id !== questionId) }
    }))

    // Atualiza nos checklists
    setChecklists(prev => prev.map(cl => ({
      ...cl,
      revisions: cl.revisions.map(r => {
        if (r.id !== revisionId) return r
        return { ...r, questions: r.questions.filter(q => q.id !== questionId) }
      })
    })))
  }

  const handleAddGroup = (data: { name: string; description: string; color: string }) => {
    const newGroup: QuestionGroup = {
      id: `qg-${Date.now()}`,
      name: data.name,
      description: data.description,
      order: questionGroups.length + 1,
      color: data.color,
    }
    setQuestionGroups(prev => [...prev, newGroup])
    setGroupFormOpen(false)
  }

  if (!checklist || !revision) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-500">{!checklist ? 'Checklist não encontrado' : 'Revisão não encontrada'}</p>
          <Button variant="secondary" onClick={handleBack} className="mt-4">
            <ArrowLeftIcon size={16} className="mr-2" />
            Voltar
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeftIcon size={16} />
              Voltar para Checklists
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{checklist.name}</h1>
            <p className="text-gray-500 mt-1">
              Gerencie as perguntas da <span className="font-medium text-gray-700">Revisão #{revision.revisionNumber}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Rev. {revision.revisionNumber}</Badge>
            <Badge variant={revision.status === 'active' ? 'success' : 'default'}>
              {revision.status === 'active' ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Buscar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>
          <Button onClick={() => { setEditingQuestion(null); setQuestionFormOpen(true) }}>
            <PlusIcon size={16} className="mr-2" />
            Nova Pergunta
          </Button>
        </div>

        {/* Lista */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-1">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-1 text-center">Seq.</div>
              <div className="col-span-5">Pergunta</div>
              <div className="col-span-2 text-center">Grupo</div>
              <div className="col-span-1 text-center">Peso</div>
              <div className="col-span-2 text-center">Obrigatória</div>
              <div className="col-span-1" />
            </div>
            {[...filteredQuestions]
              .sort((a, b) => a.sequence - b.sequence)
              .map((q, i) => (
                <QuestionRow
                  key={q.id}
                  question={q}
                  questionGroup={getQuestionGroup(q.groupId)}
                  index={i}
                  onEdit={() => { setEditingQuestion(q); setQuestionFormOpen(true) }}
                  onDelete={() => handleDeleteQuestion(q.id)}
                />
              ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListBulletIcon size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery ? 'Nenhuma pergunta encontrada' : 'Nenhuma pergunta cadastrada'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? 'Tente uma busca diferente' : 'Adicione a primeira pergunta para começar'}
            </p>
            {!searchQuery && (
              <Button onClick={() => { setEditingQuestion(null); setQuestionFormOpen(true) }} className="mt-4">
                <PlusIcon size={16} className="mr-2" />
                Adicionar Pergunta
              </Button>
            )}
          </Card>
        )}
      </div>

      <QuestionForm
        question={editingQuestion}
        open={questionFormOpen}
        questionGroups={questionGroups}
        onSubmit={handleSubmitQuestion}
        onCancel={() => { setQuestionFormOpen(false); setEditingQuestion(null) }}
        onAddGroup={() => setGroupFormOpen(true)}
      />

      <GroupForm
        open={groupFormOpen}
        onSubmit={handleAddGroup}
        onCancel={() => setGroupFormOpen(false)}
      />
    </PageContainer>
  )
}
