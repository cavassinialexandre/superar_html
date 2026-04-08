import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlideOverDrawer } from '@/components/ui/slide-over-drawer'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui'
import { AlertCircleIcon } from '@/assets/icons'
import type { Sequence, Checklist } from '@/types'
import { cn } from '@/lib/cn'

interface SequenceFormProps {
  sequence: Sequence | null
  open: boolean
  defaultGoal: number
  nextNumber: number
  activeChecklists: Checklist[]
  existingNumbers: number[]
  onSubmit: (data: {
    number: number
    useDefaultGoal: boolean
    customGoal?: number
    checklistId: string
  }) => void
  onCancel: () => void
  loading?: boolean
}

export function SequenceForm({
  sequence,
  open,
  defaultGoal,
  nextNumber,
  activeChecklists,
  existingNumbers,
  onSubmit,
  onCancel,
  loading = false,
}: SequenceFormProps) {
  const [number, setNumber] = useState(nextNumber)
  const [useDefaultGoal, setUseDefaultGoal] = useState(true)
  const [customGoal, setCustomGoal] = useState(defaultGoal)
  const [checklistId, setChecklistId] = useState('')
  const [errors, setErrors] = useState<{
    number?: string
    checklistId?: string
    customGoal?: string
  }>({})
  const [touched, setTouched] = useState<{
    number?: boolean
    checklistId?: boolean
  }>({})

  const isEditing = !!sequence

  useEffect(() => {
    if (open) {
      if (sequence) {
        setNumber(sequence.number)
        setUseDefaultGoal(sequence.useDefaultGoal)
        setCustomGoal(sequence.customGoal ?? defaultGoal)
        setChecklistId(sequence.checklistId)
      } else {
        setNumber(nextNumber)
        setUseDefaultGoal(true)
        setCustomGoal(defaultGoal)
        setChecklistId('')
      }
      setErrors({})
      setTouched({})
    }
  }, [open, sequence, defaultGoal, nextNumber])

  const validate = (): boolean => {
    const newErrors: {
      number?: string
      checklistId?: string
      customGoal?: string
    } = {}

    if (!number || number < 1) {
      newErrors.number = 'Número deve ser maior que 0'
    } else if (!isEditing && existingNumbers.includes(number)) {
      newErrors.number = 'Este número de sequência já existe'
    } else if (isEditing && sequence && number !== sequence.number && existingNumbers.includes(number)) {
      newErrors.number = 'Este número de sequência já existe'
    }

    if (!checklistId) {
      newErrors.checklistId = 'Selecione um checklist'
    }

    if (!useDefaultGoal) {
      if (customGoal < 0 || customGoal > 100) {
        newErrors.customGoal = 'Meta deve estar entre 0 e 100'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ number: true, checklistId: true })
    if (validate()) {
      onSubmit({
        number,
        useDefaultGoal,
        customGoal: useDefaultGoal ? undefined : customGoal,
        checklistId,
      })
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1) {
      setNumber(value)
    } else if (e.target.value === '') {
      setNumber(0)
    }
  }

  const handleCustomGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setCustomGoal(value)
    } else if (e.target.value === '') {
      setCustomGoal(0)
    }
  }

  return (
    <SlideOverDrawer
      open={open}
      onClose={onCancel}
      title={isEditing ? 'Editar Sequência' : 'Nova Sequência'}
      subtitle={isEditing ? `Passo ${sequence?.number}` : `Adicionar passo ${nextNumber}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Number */}
          <div className="space-y-2">
            <Label htmlFor="number">Número da Sequência <span className="text-rose-500">*</span></Label>
            <Input
              id="number"
              type="number"
              min={1}
              value={number}
              onChange={handleNumberChange}
              onBlur={() => setTouched(prev => ({ ...prev, number: true }))}
              disabled={loading || isEditing}
              className={cn(
                number >= 1 && !errors.number ? 'border-primary-500' : '',
                errors.number && touched.number && 'border-rose-500 focus-visible:ring-rose-500'
              )}
            />
            {errors.number && touched.number && (
              <p className="flex items-center gap-1 text-xs text-rose-500">
                <AlertCircleIcon size={12} />
                {errors.number}
              </p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-500">O número não pode ser alterado ao editar.</p>
            )}
          </div>

          {/* Goal Selection */}
          <div className="space-y-3">
            <Label>Meta de Aprovação</Label>
            <div className="space-y-2">
              {/* Use Default Goal */}
              <motion.button
                type="button"
                onClick={() => setUseDefaultGoal(true)}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  useDefaultGoal
                    ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                    useDefaultGoal
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn('text-sm font-semibold block', useDefaultGoal ? 'text-primary-800' : 'text-gray-700')}>
                    Usar meta padrão
                  </span>
                  <span className="text-xs text-gray-500">Meta: {defaultGoal}%</span>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    useDefaultGoal ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                  )}
                >
                  {useDefaultGoal && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                  )}
                </div>
              </motion.button>

              {/* Custom Goal */}
              <motion.button
                type="button"
                onClick={() => setUseDefaultGoal(false)}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  !useDefaultGoal
                    ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                    !useDefaultGoal
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn('text-sm font-semibold block', !useDefaultGoal ? 'text-primary-800' : 'text-gray-700')}>
                    Meta personalizada
                  </span>
                  <span className="text-xs text-gray-500">Defina uma meta específica</span>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                    !useDefaultGoal ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                  )}
                >
                  {!useDefaultGoal && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                  )}
                </div>
              </motion.button>

              {/* Custom Goal Input */}
              {!useDefaultGoal && (
                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={customGoal}
                      onChange={handleCustomGoalChange}
                      disabled={loading}
                      className={cn(
                        'w-24',
                        customGoal >= 0 && customGoal <= 100 && !errors.customGoal ? 'border-primary-500' : '',
                        errors.customGoal && 'border-rose-500 focus-visible:ring-rose-500'
                      )}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={customGoal}
                      onChange={(e) => setCustomGoal(parseInt(e.target.value, 10))}
                      disabled={loading}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 w-12">{customGoal}%</span>
                  </div>
                  {errors.customGoal && (
                    <p className="flex items-center gap-1 text-xs text-rose-500 mt-1">
                      <AlertCircleIcon size={12} />
                      {errors.customGoal}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Checklist Selection */}
          <div className="space-y-3">
            <Label>Checklist <span className="text-rose-500">*</span></Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeChecklists.map((checklist) => {
                const isSelected = checklistId === checklist.id
                return (
                  <motion.button
                    key={checklist.id}
                    type="button"
                    onClick={() => setChecklistId(checklist.id)}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'text-sm font-semibold block',
                        isSelected ? 'text-primary-800' : 'text-gray-700'
                      )}>
                        {checklist.name}
                      </span>
                      <span className="text-xs text-gray-500">{checklist.revisions?.length || 0} revisões</span>
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      )}
                    >
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width={12} height={12} viewBox="0 0 24 24"
                          fill="none" stroke="white" strokeWidth={3}
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
            {errors.checklistId && touched.checklistId && (
              <p className="flex items-center gap-1 text-xs text-rose-500">
                <AlertCircleIcon size={12} />
                {errors.checklistId}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-emerald-900">Informação</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  {isEditing
                    ? 'Ao editar, o número da sequência não pode ser alterado. Para reorganizar, exclua e recrie a sequência.'
                    : 'A sequência será adicionada ao tipo de grupo e poderá ser usada na criação de grupos.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-100/60 bg-gradient-to-b from-gray-50/80 to-gray-100/60">
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar Sequência'}
            </Button>
          </div>
        </div>
      </form>
    </SlideOverDrawer>
  )
}
