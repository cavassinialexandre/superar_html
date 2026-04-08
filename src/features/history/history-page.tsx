import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/app-shell'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { Card, Badge, Input } from '@/components/ui'
import { ScoreBadge } from '@/components/data-display/score-badge'
import { SearchIcon, EyeIcon, XIcon } from '@/assets/icons'
import { evaluations, groups, managements, groupTypes } from '@/mocks/data'
import { staggerContainer, staggerItem } from '@/design-system/animations'
import type { Evaluation } from '@/types'

export function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterGroup, setFilterGroup] = useState<string>('')
  const [filterMgmt, setFilterMgmt] = useState<string>('')
  const [filterGroupType, setFilterGroupType] = useState<string>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null)

  const filtered = evaluations.filter((e) => {
    if (search && !e.groupName.toLowerCase().includes(search.toLowerCase()) && !e.applicantName.toLowerCase().includes(search.toLowerCase())) return false
    if (filterType && e.type !== filterType) return false
    if (filterGroup && e.groupId !== filterGroup) return false
    if (filterMgmt && e.managementName !== managements.find(m => m.id === filterMgmt)?.name) return false
    if (filterGroupType && e.groupTypeName !== groupTypes.find(t => t.id === filterGroupType)?.name) return false
    if (dateFrom) {
      const from = new Date(dateFrom)
      if (new Date(e.date) < from) return false
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59)
      if (new Date(e.date) > to) return false
    }
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const selectClass = "bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"

  return (
    <PageContainer>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <Breadcrumb
          items={[{ label: 'Histórico' }]}
          title="Histórico"
          description="Consulte o histórico completo de auditorias e followups realizados."
        />

        {/* Filters */}
        <motion.div variants={staggerItem} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por grupo ou aplicador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<SearchIcon size={16} />}
              />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectClass}>
              <option value="">Todos Tipos</option>
              <option value="audit">Auditoria</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className={selectClass + ' flex-1'}>
              <option value="">Todos Grupos</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <select value={filterMgmt} onChange={(e) => setFilterMgmt(e.target.value)} className={selectClass + ' flex-1'}>
              <option value="">Todas Gerências</option>
              {managements.filter(m => m.status === 'active').map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={filterGroupType} onChange={(e) => setFilterGroupType(e.target.value)} className={selectClass + ' flex-1'}>
              <option value="">Todos Tipos Grupo</option>
              {groupTypes.filter(t => t.status === 'active').map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Data Inicial</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className={selectClass + ' w-full'} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Data Final</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className={selectClass + ' w-full'} />
            </div>
            <button
              onClick={() => { setSearch(''); setFilterType(''); setFilterGroup(''); setFilterMgmt(''); setFilterGroupType(''); setDateFrom(''); setDateTo('') }}
              className="text-xs text-primary-600 hover:text-primary-800 font-medium px-3 py-2.5 cursor-pointer whitespace-nowrap"
            >
              Limpar filtros
            </button>
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filtered.length}</span> avaliações encontradas
          </p>
        </motion.div>

        {/* Table */}
        <motion.div variants={staggerItem}>
          <Card padding="sm" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Passo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nota</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aplicador</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avanço</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev) => (
                    <tr key={ev.id} className="border-b border-gray-100 hover:bg-primary-50/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800">{ev.groupName}</p>
                        <p className="text-xs text-gray-400">{ev.areaName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ev.type === 'audit' ? 'primary' : 'info'}>
                          {ev.type === 'audit' ? 'Auditoria' : 'Follow-up'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 tabular-nums">{ev.sequenceAtTime}</td>
                      <td className="px-4 py-3"><ScoreBadge score={ev.score} size="sm" /></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ev.applicantName}</td>
                      <td className="px-4 py-3">
                        {ev.type === 'audit' && (
                          ev.advancedSequence
                            ? <Badge variant="success" dot>Sim</Badge>
                            : <span className="text-xs text-gray-400">Não</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedEval(ev)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-primary-700 hover:bg-primary-50 transition-all cursor-pointer"
                        >
                          <EyeIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">Nenhuma avaliação encontrada.</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Detail Modal */}
        {selectedEval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedEval(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900">Detalhe da Avaliação</h3>
                  <p className="text-sm text-gray-500">{selectedEval.groupName}</p>
                </div>
                <button onClick={() => setSelectedEval(null)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer">
                  <XIcon size={18} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tipo</p>
                    <Badge variant={selectedEval.type === 'audit' ? 'primary' : 'info'}>
                      {selectedEval.type === 'audit' ? 'Auditoria' : 'Follow-up'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Data</p>
                    <p className="text-sm font-medium text-gray-700">{new Date(selectedEval.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Passo</p>
                    <p className="text-sm font-medium text-gray-700">{selectedEval.sequenceAtTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Nota</p>
                    <ScoreBadge score={selectedEval.score} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Aplicador</p>
                    <p className="text-sm font-medium text-gray-700">{selectedEval.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Revisão do Checklist</p>
                    <Badge>Rev. {selectedEval.checklistRevision}</Badge>
                  </div>
                </div>

                {selectedEval.type === 'audit' && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Decisão de Avanço</p>
                    {selectedEval.advancedSequence
                      ? <Badge variant="success" dot>Avançou de sequência</Badge>
                      : <Badge variant="default">Mantido na sequência</Badge>
                    }
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-400 mb-1">Presentes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEval.presentMembers.map((name) => (
                      <Badge key={name}>{name}</Badge>
                    ))}
                  </div>
                </div>

                {selectedEval.answers.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-3">Respostas</p>
                    <div className="space-y-2">
                      {selectedEval.answers.map((a, i) => (
                        <div key={a.questionId} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-gray-300 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{a.questionText}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant={
                                  a.answer === 'yes' ? 'success' :
                                  a.answer === 'partial' ? 'warning' :
                                  a.answer === 'no' ? 'error' : 'default'
                                }>
                                  {a.answer === 'yes' ? 'Sim' : a.answer === 'partial' ? 'Parcial' : a.answer === 'no' ? 'Não' : 'N/A'}
                                </Badge>
                                <span className="text-[10px] text-gray-400">Peso: {a.weight}</span>
                                {a.requiredYesForAdvance && <Badge variant="warning" className="text-[9px] px-1.5 py-0">Obrig. Sim</Badge>}
                              </div>
                              {a.justification && (
                                <p className="text-xs text-gray-500 mt-1.5 italic">"{a.justification}"</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  )
}
