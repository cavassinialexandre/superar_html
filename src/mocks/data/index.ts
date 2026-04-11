import type { Unit, Management, Area, GroupType, Group, Checklist, ChecklistRevision, Evaluation, DashboardData, User, QuestionGroup, GroupAnalytics, GroupRanking } from '@/types'

export const units: Unit[] = [
  { id: 'puma', name: 'Puma', description: 'Unidade fabril Puma — Operações industriais e logística integrada' },
  { id: 'monte-alegre', name: 'Monte Alegre', description: 'Unidade fabril Monte Alegre — Produção e manufatura avançada' },
]

export const users: User[] = [
  { id: 'user-1', name: 'Carlos Silva', profiles: ['admin', 'evaluator'], unitId: 'puma', status: 'active' },
  { id: 'user-2', name: 'Ana Oliveira', profiles: ['evaluator'], unitId: 'puma', status: 'active' },
  { id: 'user-3', name: 'Pedro Santos', profiles: ['user'], unitId: 'puma', status: 'active' },
  { id: 'user-4', name: 'Maria Costa', profiles: ['admin'], unitId: 'puma', status: 'inactive' },
  { id: 'user-5', name: 'Joao Ferreira', profiles: ['evaluator', 'user'], unitId: 'puma', status: 'active' },
]

export const managements: Management[] = [
  { id: 'mgmt-1', name: 'Gerência de Produção', status: 'active', unitId: 'puma' },
  { id: 'mgmt-2', name: 'Gerência de Manutenção', status: 'active', unitId: 'puma' },
  { id: 'mgmt-3', name: 'Gerência de Qualidade', status: 'active', unitId: 'puma' },
  { id: 'mgmt-4', name: 'Gerência Administrativa', status: 'active', unitId: 'puma' },
  { id: 'mgmt-5', name: 'Gerência de Logística', status: 'inactive', unitId: 'puma' },
]

export const areas: Area[] = [
  { id: 'area-1', name: 'Linha de Montagem A', managementId: 'mgmt-1', managementName: 'Gerência de Produção', status: 'active', unitId: 'puma' },
  { id: 'area-2', name: 'Linha de Montagem B', managementId: 'mgmt-1', managementName: 'Gerência de Produção', status: 'active', unitId: 'puma' },
  { id: 'area-3', name: 'Oficina Central', managementId: 'mgmt-2', managementName: 'Gerência de Manutenção', status: 'active', unitId: 'puma' },
  { id: 'area-4', name: 'Laboratório', managementId: 'mgmt-3', managementName: 'Gerência de Qualidade', status: 'active', unitId: 'puma' },
  { id: 'area-5', name: 'Escritório Central', managementId: 'mgmt-4', managementName: 'Gerência Administrativa', status: 'active', unitId: 'puma' },
  { id: 'area-6', name: 'Almoxarifado', managementId: 'mgmt-2', managementName: 'Gerência de Manutenção', status: 'active', unitId: 'puma' },
]

export const questionGroups: QuestionGroup[] = [
  { id: 'qg-1', name: '5S - Seiri', description: 'Organizacao e eliminacao de itens desnecessarios', order: 1, color: '#3AA39C' },
  { id: 'qg-2', name: '5S - Seiton', description: 'Organizacao sistematica dos itens necessarios', order: 2, color: '#0EA5E9' },
  { id: 'qg-3', name: 'Seguranca', description: 'Condicoes e comportamentos de seguranca', order: 3, color: '#F59E0B' },
  { id: 'qg-4', name: 'Gestao Visual', description: 'Quadros, indicadores e comunicacao visual', order: 4, color: '#8B5CF6' },
  { id: 'qg-5', name: 'Melhoria Continua', description: 'Identificacao e tratamento de anomalias', order: 5, color: '#EC4899' },
]

export const groupTypes: GroupType[] = [
  {
    id: 'type-1', name: 'Operacional', defaultGoal: 80, status: 'active', unitId: 'puma',
    sequences: [
      { id: 'seq-1', groupTypeId: 'type-1', number: 1, useDefaultGoal: true, checklistId: 'cl-1', checklistName: 'Checklist Operacional Passo 1' },
      { id: 'seq-2', groupTypeId: 'type-1', number: 2, useDefaultGoal: true, checklistId: 'cl-1', checklistName: 'Checklist Operacional Passo 2' },
      { id: 'seq-3', groupTypeId: 'type-1', number: 3, useDefaultGoal: false, customGoal: 85, checklistId: 'cl-1', checklistName: 'Checklist Operacional Passo 3' },
      { id: 'seq-4', groupTypeId: 'type-1', number: 4, useDefaultGoal: false, customGoal: 90, checklistId: 'cl-1', checklistName: 'Checklist Operacional Passo 4' },
      { id: 'seq-5', groupTypeId: 'type-1', number: 5, useDefaultGoal: false, customGoal: 95, checklistId: 'cl-1', checklistName: 'Checklist Operacional Passo 5' },
    ],
  },
  {
    id: 'type-2', name: 'Administrativo', defaultGoal: 75, status: 'active', unitId: 'puma',
    sequences: [
      { id: 'seq-6', groupTypeId: 'type-2', number: 1, useDefaultGoal: true, checklistId: 'cl-2', checklistName: 'Checklist Admin Passo 1' },
      { id: 'seq-7', groupTypeId: 'type-2', number: 2, useDefaultGoal: true, checklistId: 'cl-2', checklistName: 'Checklist Admin Passo 2' },
      { id: 'seq-8', groupTypeId: 'type-2', number: 3, useDefaultGoal: false, customGoal: 85, checklistId: 'cl-2', checklistName: 'Checklist Admin Passo 3' },
    ],
  },
  {
    id: 'type-3', name: '5S', defaultGoal: 70, status: 'active', unitId: 'puma',
    sequences: [
      { id: 'seq-9', groupTypeId: 'type-3', number: 1, useDefaultGoal: true, checklistId: 'cl-3', checklistName: 'Checklist 5S Passo 1' },
      { id: 'seq-10', groupTypeId: 'type-3', number: 2, useDefaultGoal: true, checklistId: 'cl-3', checklistName: 'Checklist 5S Passo 2' },
      { id: 'seq-11', groupTypeId: 'type-3', number: 3, useDefaultGoal: true, checklistId: 'cl-3', checklistName: 'Checklist 5S Passo 3' },
      { id: 'seq-12', groupTypeId: 'type-3', number: 4, useDefaultGoal: false, customGoal: 85, checklistId: 'cl-3', checklistName: 'Checklist 5S Passo 4' },
    ],
  },
]

export const groups: Group[] = [
  {
    id: 'grp-1', name: 'Equipe Alpha', groupTypeId: 'type-1', groupTypeName: 'Operacional',
    areaId: 'area-1', areaName: 'Linha de Montagem A', managementId: 'mgmt-1', managementName: 'Gerência de Produção',
    currentSequence: 3, maxSequence: 5, lastAuditScore: 87, lastEvaluationDate: '2026-03-10',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-1', name: 'Roberto Lima', role: 'facilitator' },
      { id: 'tm-2', name: 'Fernanda Souza', role: 'auditor' },
      { id: 'tm-50', name: 'Carlos Silva', role: 'auditor' },
      { id: 'tm-3', name: 'Lucas Almeida', role: 'member' },
      { id: 'tm-4', name: 'Patricia Nunes', role: 'member' },
      { id: 'tm-30', name: 'Marcos Oliveira', role: 'member' },
      { id: 'tm-31', name: 'Ana Carolina Santos', role: 'member' },
      { id: 'tm-32', name: 'Thiago Ferreira', role: 'member' },
      { id: 'tm-33', name: 'Juliana Costa', role: 'member' },
      { id: 'tm-34', name: 'Eduardo Martins', role: 'member' },
      { id: 'tm-35', name: 'Camila Rodrigues', role: 'member' },
      { id: 'tm-36', name: 'Felipe Nascimento', role: 'member' },
      { id: 'tm-37', name: 'Larissa Mendes', role: 'member' },
      { id: 'tm-38', name: 'Bruno Cardoso', role: 'member' },
      { id: 'tm-39', name: 'Isabela Gomes', role: 'member' },
      { id: 'tm-40', name: 'Diego Pereira', role: 'member' },
      { id: 'tm-41', name: 'Renata Dias', role: 'member' },
      { id: 'tm-42', name: 'Gustavo Ribeiro', role: 'member' },
      { id: 'tm-43', name: 'Aline Vieira', role: 'member' },
      { id: 'tm-44', name: 'Daniel Barbosa', role: 'member' },
    ],
  },
  {
    id: 'grp-2', name: 'Equipe Beta', groupTypeId: 'type-1', groupTypeName: 'Operacional',
    areaId: 'area-2', areaName: 'Linha de Montagem B', managementId: 'mgmt-1', managementName: 'Gerência de Produção',
    currentSequence: 2, maxSequence: 5, lastAuditScore: 72, lastEvaluationDate: '2026-03-05',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-5', name: 'Andre Martins', role: 'facilitator' },
      { id: 'tm-6', name: 'Juliana Rocha', role: 'auditor' },
      { id: 'tm-7', name: 'Diego Ferreira', role: 'member' },
    ],
  },
  {
    id: 'grp-3', name: 'Equipe Gamma', groupTypeId: 'type-2', groupTypeName: 'Administrativo',
    areaId: 'area-5', areaName: 'Escritório Central', managementId: 'mgmt-4', managementName: 'Gerência Administrativa',
    currentSequence: 1, maxSequence: 3, lastAuditScore: 65, lastEvaluationDate: '2026-02-28',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-8', name: 'Camila Barbosa', role: 'facilitator' },
      { id: 'tm-9', name: 'Rafael Torres', role: 'member' },
    ],
  },
  {
    id: 'grp-4', name: 'Equipe Delta', groupTypeId: 'type-3', groupTypeName: '5S',
    areaId: 'area-3', areaName: 'Oficina Central', managementId: 'mgmt-2', managementName: 'Gerência de Manutenção',
    currentSequence: 4, maxSequence: 4, lastAuditScore: 93, lastEvaluationDate: '2026-03-12',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-10', name: 'Thiago Ribeiro', role: 'facilitator' },
      { id: 'tm-11', name: 'Isabela Gomes', role: 'auditor' },
      { id: 'tm-12', name: 'Marcos Oliveira', role: 'member' },
      { id: 'tm-13', name: 'Larissa Mendes', role: 'member' },
      { id: 'tm-14', name: 'Bruno Cardoso', role: 'member' },
    ],
  },
  {
    id: 'grp-5', name: 'Equipe Epsilon', groupTypeId: 'type-1', groupTypeName: 'Operacional',
    areaId: 'area-6', areaName: 'Almoxarifado', managementId: 'mgmt-2', managementName: 'Gerência de Manutenção',
    currentSequence: 1, maxSequence: 4, lastAuditScore: 45, lastEvaluationDate: '2026-01-15',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-15', name: 'Gustavo Pereira', role: 'facilitator' },
      { id: 'tm-16', name: 'Aline Vieira', role: 'member' },
    ],
  },
  {
    id: 'grp-6', name: 'Equipe Zeta', groupTypeId: 'type-3', groupTypeName: '5S',
    areaId: 'area-4', areaName: 'Laboratório', managementId: 'mgmt-3', managementName: 'Gerência de Qualidade',
    currentSequence: 2, maxSequence: 4, lastAuditScore: 78, lastEvaluationDate: '2026-03-08',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-17', name: 'Renata Dias', role: 'facilitator' },
      { id: 'tm-18', name: 'Felipe Santos', role: 'auditor' },
      { id: 'tm-19', name: 'Carolina Lima', role: 'member' },
    ],
  },
  {
    id: 'grp-7', name: 'Equipe Eta', groupTypeId: 'type-2', groupTypeName: 'Administrativo',
    areaId: 'area-5', areaName: 'Escritório Central', managementId: 'mgmt-4', managementName: 'Gerência Administrativa',
    currentSequence: 2, maxSequence: 3, lastAuditScore: 82, lastEvaluationDate: '2026-03-14',
    status: 'active', unitId: 'puma',
    team: [
      { id: 'tm-20', name: 'Daniel Costa', role: 'facilitator' },
      { id: 'tm-21', name: 'Mariana Alves', role: 'member' },
      { id: 'tm-22', name: 'Eduardo Pinto', role: 'member' },
    ],
  },
]

// Revisões de checklists - dados separados
export const checklistRevisions: ChecklistRevision[] = [
  // Checklist Operacional Passo 1 - Rev 1 (antiga, inativa)
  {
    id: 'rev-1-1',
    checklistId: 'cl-1',
    revisionNumber: 1,
    status: 'inactive',
    questions: [
      { id: 'q-old-1', revisionId: 'rev-1-1', text: 'A área está organizada?', sequence: 1, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-old-2', revisionId: 'rev-1-1', text: 'Os EPIs estão sendo utilizados?', sequence: 2, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
    ],
  },
  // Checklist Operacional Passo 1 - Rev 2 (antiga, inativa)
  {
    id: 'rev-1-2',
    checklistId: 'cl-1',
    revisionNumber: 2,
    status: 'inactive',
    questions: [
      { id: 'q-old-3', revisionId: 'rev-1-2', text: 'A área está limpa e organizada?', sequence: 1, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-old-4', revisionId: 'rev-1-2', text: 'Os EPIs estão sendo utilizados corretamente?', sequence: 2, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-old-5', revisionId: 'rev-1-2', text: 'Os procedimentos estão atualizados?', sequence: 3, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
    ],
  },
  // Checklist Operacional Passo 1 - Rev 3 (atual, ativa)
  {
    id: 'rev-1-3',
    checklistId: 'cl-1',
    revisionNumber: 3,
    status: 'active',
    questions: [
      // Organização e Limpeza (1-8)
      { id: 'q-1', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'A área está limpa e organizada?', sequence: 1, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-2', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'Os EPIs estão sendo utilizados corretamente?', sequence: 2, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-3', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'Os procedimentos operacionais estão atualizados?', sequence: 3, weight: 10, requiredYesForAdvance: false, answerType: 'ternary' },
      { id: 'q-4', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'Os materiais estão armazenados adequadamente?', sequence: 4, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-5', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'As lixeiras estão identificadas e em bom estado?', sequence: 5, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-6', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'O piso está limpo e sem obstáculos?', sequence: 6, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-7', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'As áreas de circulação estão desobstruídas?', sequence: 7, weight: 12, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-8', revisionId: 'rev-1-3', groupId: 'qg-1', text: 'Os itens desnecessários foram removidos?', sequence: 8, weight: 10, requiredYesForAdvance: false, answerType: 'ternary' },
      // Gestão Visual e Indicadores (9-16)
      { id: 'q-9', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'Existe quadro de gestão visual atualizado?', sequence: 9, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-10', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'Os indicadores de produção estão visíveis?', sequence: 10, weight: 12, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-11', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'Os gráficos de desempenho estão atualizados?', sequence: 11, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-12', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'As metas estão expostas de forma clara?', sequence: 12, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-13', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'As sinalizações de segurança estão corretas?', sequence: 13, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-14', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'Os painéis informativos estão legíveis?', sequence: 14, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-15', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'As etiquetas de identificação estão presentes?', sequence: 15, weight: 10, requiredYesForAdvance: false, answerType: 'ternary' },
      { id: 'q-16', revisionId: 'rev-1-3', groupId: 'qg-4', text: 'O quadro de comunicação está atualizado?', sequence: 16, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
      // Participação e Melhoria (17-23)
      { id: 'q-17', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'A equipe participa ativamente das reuniões?', sequence: 17, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-18', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'Existe plano de ação para melhorias identificadas?', sequence: 18, weight: 15, requiredYesForAdvance: false, answerType: 'ternary' },
      { id: 'q-19', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'As sugestões de melhoria são registradas?', sequence: 19, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-20', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'O time conhece os resultados do grupo?', sequence: 20, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-21', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'Há registro de lições aprendidas?', sequence: 21, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-22', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'As ações corretivas são implementadas no prazo?', sequence: 22, weight: 12, requiredYesForAdvance: false, answerType: 'ternary' },
      { id: 'q-23', revisionId: 'rev-1-3', groupId: 'qg-5', text: 'A participação é registrada em ata?', sequence: 23, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      // Equipamentos e Anomalias (24-30)
      { id: 'q-24', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'Os equipamentos estão em bom estado de conservação?', sequence: 24, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-25', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'As anomalias são registradas e tratadas?', sequence: 25, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-26', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'Existe plano de manutenção preventiva?', sequence: 26, weight: 15, requiredYesForAdvance: false, answerType: 'ternary' },
      { id: 'q-27', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'Os check-lists de equipamentos estão atualizados?', sequence: 27, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-28', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'As calibrações estão dentro do prazo?', sequence: 28, weight: 12, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-29', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'As etiquetas de manutenção estão visíveis?', sequence: 29, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-30', revisionId: 'rev-1-3', groupId: 'qg-3', text: 'Os alarmes e dispositivos de segurança funcionam?', sequence: 30, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
    ],
  },
  // Checklist Admin Passo 1 - Rev 1 (ativa)
  {
    id: 'rev-2-1',
    checklistId: 'cl-2',
    revisionNumber: 1,
    status: 'active',
    questions: [
      { id: 'q-admin-1', revisionId: 'rev-2-1', text: 'A mesa está organizada?', sequence: 1, weight: 10, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-admin-2', revisionId: 'rev-2-1', text: 'Os documentos estão arquivados corretamente?', sequence: 2, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-admin-3', revisionId: 'rev-2-1', text: 'Existe controle de entrada e saída?', sequence: 3, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-admin-4', revisionId: 'rev-2-1', text: 'O ambiente está adequado?', sequence: 4, weight: 8, requiredYesForAdvance: false, answerType: 'binary' },
    ],
  },
  // Checklist 5S Passo 1 - Rev 1 (ativa)
  {
    id: 'rev-3-1',
    checklistId: 'cl-3',
    revisionNumber: 1,
    status: 'active',
    questions: [
      { id: 'q-5s-1', revisionId: 'rev-3-1', text: 'Itens desnecessários foram removidos?', sequence: 1, weight: 20, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-5s-2', revisionId: 'rev-3-1', text: 'Existe etiquetagem adequada?', sequence: 2, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-5s-3', revisionId: 'rev-3-1', text: 'O piso está limpo?', sequence: 3, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
    ],
  },
  // Checklist 5S Passo 1 - Rev 2 (ativa - exemplo de múltiplas revisões ativas)
  {
    id: 'rev-3-2',
    checklistId: 'cl-3',
    revisionNumber: 2,
    status: 'active',
    questions: [
      { id: 'q-5s-4', revisionId: 'rev-3-2', text: 'Itens desnecessários foram removidos da área?', sequence: 1, weight: 20, requiredYesForAdvance: true, answerType: 'ternary' },
      { id: 'q-5s-5', revisionId: 'rev-3-2', text: 'Existe etiquetagem adequada e visível?', sequence: 2, weight: 15, requiredYesForAdvance: true, answerType: 'binary' },
      { id: 'q-5s-6', revisionId: 'rev-3-2', text: 'O piso está limpo e sem obstáculos?', sequence: 3, weight: 10, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-5s-7', revisionId: 'rev-3-2', text: 'Há identificação visual clara?', sequence: 4, weight: 12, requiredYesForAdvance: false, answerType: 'binary' },
      { id: 'q-5s-8', revisionId: 'rev-3-2', text: 'Os itens estão em seus lugares definidos?', sequence: 5, weight: 18, requiredYesForAdvance: true, answerType: 'ternary' },
    ],
  },
]

// Checklists - agora com referência às revisões
export const checklists: Checklist[] = [
  {
    id: 'cl-1',
    name: 'Checklist Operacional Passo 1',
    status: 'active',
    unitId: 'puma',
    revisions: checklistRevisions.filter(r => r.checklistId === 'cl-1'),
  },
  {
    id: 'cl-2',
    name: 'Checklist Admin Passo 1',
    status: 'active',
    unitId: 'puma',
    revisions: checklistRevisions.filter(r => r.checklistId === 'cl-2'),
  },
  {
    id: 'cl-3',
    name: 'Checklist 5S Passo 1',
    status: 'active',
    unitId: 'puma',
    revisions: checklistRevisions.filter(r => r.checklistId === 'cl-3'),
  },
]

export const evaluations: Evaluation[] = [
  // Equipe Alpha - Operacional
  { id: 'eval-alpha-oct', type: 'audit', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 2, date: '2025-10-12T09:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Roberto Lima'], score: 68, checklistRevision: 2, advancedSequence: true, unitId: 'puma', answers: [] },
  { id: 'eval-alpha-nov', type: 'audit', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 3, date: '2025-11-15T09:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Roberto Lima'], score: 74, checklistRevision: 3, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-alpha-dez', type: 'audit', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 3, date: '2025-12-10T09:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Roberto Lima'], score: 79, checklistRevision: 3, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-alpha-jan', type: 'audit', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 3, date: '2026-01-14T09:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Roberto Lima'], score: 83, checklistRevision: 3, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-alpha-fev', type: 'audit', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 3, date: '2026-02-11T09:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Roberto Lima'], score: 85, checklistRevision: 3, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-1', type: 'audit', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 3, date: '2026-03-10T14:30:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Roberto Lima', 'Fernanda Souza', 'Lucas Almeida'], score: 87, checklistRevision: 3, advancedSequence: false, unitId: 'puma', answers: [{ questionId: 'q-1', questionText: 'A área está limpa e organizada?', answer: 'yes', weight: 10, requiredYesForAdvance: true }, { questionId: 'q-2', questionText: 'Os EPIs estão sendo utilizados corretamente?', answer: 'yes', weight: 15, requiredYesForAdvance: true }, { questionId: 'q-3', questionText: 'Os procedimentos operacionais estão atualizados?', answer: 'partial', justification: 'Alguns procedimentos precisam de revisão', weight: 10, requiredYesForAdvance: false }, { questionId: 'q-4', questionText: 'Existe quadro de gestão visual atualizado?', answer: 'yes', weight: 8, requiredYesForAdvance: false }, { questionId: 'q-5', questionText: 'Os indicadores de produção estão visíveis?', answer: 'yes', weight: 12, requiredYesForAdvance: false }, { questionId: 'q-6', questionText: 'A equipe participa ativamente das reuniões?', answer: 'yes', weight: 10, requiredYesForAdvance: true }, { questionId: 'q-7', questionText: 'Existe plano de ação para melhorias identificadas?', answer: 'no', justification: 'Plano não foi atualizado este mês', weight: 15, requiredYesForAdvance: false }, { questionId: 'q-8', questionText: 'Os equipamentos estão em bom estado de conservação?', answer: 'yes', weight: 10, requiredYesForAdvance: true }, { questionId: 'q-9', questionText: 'As anomalias são registradas e tratadas?', answer: 'yes', weight: 10, requiredYesForAdvance: false }] },
  { id: 'eval-2', type: 'followup', groupId: 'grp-1', groupName: 'Equipe Alpha', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem A', sequenceAtTime: 3, date: '2026-03-01T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Roberto Lima', 'Patricia Nunes'], score: 82, checklistRevision: 3, unitId: 'puma', answers: [] },

  // Equipe Beta - Operacional
  { id: 'eval-beta-oct', type: 'audit', groupId: 'grp-2', groupName: 'Equipe Beta', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem B', sequenceAtTime: 1, date: '2025-10-20T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Andre Martins'], score: 58, checklistRevision: 1, advancedSequence: true, unitId: 'puma', answers: [] },
  { id: 'eval-beta-nov', type: 'audit', groupId: 'grp-2', groupName: 'Equipe Beta', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem B', sequenceAtTime: 2, date: '2025-11-22T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Andre Martins'], score: 64, checklistRevision: 2, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-beta-dez', type: 'audit', groupId: 'grp-2', groupName: 'Equipe Beta', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem B', sequenceAtTime: 2, date: '2025-12-18T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Andre Martins'], score: 68, checklistRevision: 2, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-beta-jan', type: 'audit', groupId: 'grp-2', groupName: 'Equipe Beta', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem B', sequenceAtTime: 2, date: '2026-01-20T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Andre Martins'], score: 70, checklistRevision: 2, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-beta-fev', type: 'audit', groupId: 'grp-2', groupName: 'Equipe Beta', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem B', sequenceAtTime: 2, date: '2026-02-15T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Andre Martins'], score: 71, checklistRevision: 2, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-3', type: 'audit', groupId: 'grp-2', groupName: 'Equipe Beta', groupTypeName: 'Operacional', managementName: 'Gerência de Produção', areaName: 'Linha de Montagem B', sequenceAtTime: 2, date: '2026-03-05T09:15:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Andre Martins', 'Juliana Rocha'], score: 72, checklistRevision: 2, advancedSequence: false, unitId: 'puma', answers: [] },

  // Equipe Gamma - Administrativo
  { id: 'eval-gamma-nov', type: 'audit', groupId: 'grp-3', groupName: 'Equipe Gamma', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 1, date: '2025-11-05T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Camila Barbosa'], score: 55, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-gamma-dez', type: 'audit', groupId: 'grp-3', groupName: 'Equipe Gamma', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 1, date: '2025-12-08T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Camila Barbosa'], score: 60, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-gamma-jan', type: 'audit', groupId: 'grp-3', groupName: 'Equipe Gamma', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 1, date: '2026-01-10T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Camila Barbosa'], score: 62, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-gamma-fev', type: 'audit', groupId: 'grp-3', groupName: 'Equipe Gamma', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 1, date: '2026-02-12T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Camila Barbosa'], score: 64, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-gamma-mar', type: 'audit', groupId: 'grp-3', groupName: 'Equipe Gamma', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 1, date: '2026-02-28T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Camila Barbosa'], score: 65, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },

  // Equipe Delta - 5S
  { id: 'eval-delta-out', type: 'audit', groupId: 'grp-4', groupName: 'Equipe Delta', groupTypeName: '5S', managementName: 'Gerência de Manutenção', areaName: 'Oficina Central', sequenceAtTime: 3, date: '2025-10-14T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Thiago Ribeiro'], score: 82, checklistRevision: 1, advancedSequence: true, unitId: 'puma', answers: [] },
  { id: 'eval-delta-nov', type: 'audit', groupId: 'grp-4', groupName: 'Equipe Delta', groupTypeName: '5S', managementName: 'Gerência de Manutenção', areaName: 'Oficina Central', sequenceAtTime: 4, date: '2025-11-18T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Thiago Ribeiro'], score: 86, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-delta-dez', type: 'audit', groupId: 'grp-4', groupName: 'Equipe Delta', groupTypeName: '5S', managementName: 'Gerência de Manutenção', areaName: 'Oficina Central', sequenceAtTime: 4, date: '2025-12-12T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Thiago Ribeiro'], score: 89, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-delta-jan', type: 'audit', groupId: 'grp-4', groupName: 'Equipe Delta', groupTypeName: '5S', managementName: 'Gerência de Manutenção', areaName: 'Oficina Central', sequenceAtTime: 4, date: '2026-01-16T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Thiago Ribeiro'], score: 91, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-delta-fev', type: 'audit', groupId: 'grp-4', groupName: 'Equipe Delta', groupTypeName: '5S', managementName: 'Gerência de Manutenção', areaName: 'Oficina Central', sequenceAtTime: 4, date: '2026-02-14T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Thiago Ribeiro'], score: 92, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-4', type: 'audit', groupId: 'grp-4', groupName: 'Equipe Delta', groupTypeName: '5S', managementName: 'Gerência de Manutenção', areaName: 'Oficina Central', sequenceAtTime: 4, date: '2026-03-12T16:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Thiago Ribeiro', 'Isabela Gomes', 'Marcos Oliveira'], score: 93, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },

  // Equipe Epsilon - Operacional
  { id: 'eval-epsilon-out', type: 'audit', groupId: 'grp-5', groupName: 'Equipe Epsilon', groupTypeName: 'Operacional', managementName: 'Gerência de Manutenção', areaName: 'Almoxarifado', sequenceAtTime: 1, date: '2025-10-08T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Gustavo Pereira'], score: 38, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-epsilon-dez', type: 'audit', groupId: 'grp-5', groupName: 'Equipe Epsilon', groupTypeName: 'Operacional', managementName: 'Gerência de Manutenção', areaName: 'Almoxarifado', sequenceAtTime: 1, date: '2025-12-10T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Gustavo Pereira'], score: 42, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-epsilon-jan', type: 'audit', groupId: 'grp-5', groupName: 'Equipe Epsilon', groupTypeName: 'Operacional', managementName: 'Gerência de Manutenção', areaName: 'Almoxarifado', sequenceAtTime: 1, date: '2026-01-15T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Gustavo Pereira'], score: 45, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },

  // Equipe Zeta - 5S
  { id: 'eval-zeta-out', type: 'audit', groupId: 'grp-6', groupName: 'Equipe Zeta', groupTypeName: '5S', managementName: 'Gerência de Qualidade', areaName: 'Laboratório', sequenceAtTime: 1, date: '2025-10-25T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Renata Dias'], score: 70, checklistRevision: 1, advancedSequence: true, unitId: 'puma', answers: [] },
  { id: 'eval-zeta-nov', type: 'audit', groupId: 'grp-6', groupName: 'Equipe Zeta', groupTypeName: '5S', managementName: 'Gerência de Qualidade', areaName: 'Laboratório', sequenceAtTime: 2, date: '2025-11-28T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Renata Dias'], score: 73, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-zeta-dez', type: 'audit', groupId: 'grp-6', groupName: 'Equipe Zeta', groupTypeName: '5S', managementName: 'Gerência de Qualidade', areaName: 'Laboratório', sequenceAtTime: 2, date: '2025-12-20T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Renata Dias'], score: 75, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-zeta-jan', type: 'audit', groupId: 'grp-6', groupName: 'Equipe Zeta', groupTypeName: '5S', managementName: 'Gerência de Qualidade', areaName: 'Laboratório', sequenceAtTime: 2, date: '2026-01-22T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Renata Dias'], score: 76, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-zeta-fev', type: 'audit', groupId: 'grp-6', groupName: 'Equipe Zeta', groupTypeName: '5S', managementName: 'Gerência de Qualidade', areaName: 'Laboratório', sequenceAtTime: 2, date: '2026-02-18T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Renata Dias'], score: 77, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-zeta-mar', type: 'audit', groupId: 'grp-6', groupName: 'Equipe Zeta', groupTypeName: '5S', managementName: 'Gerência de Qualidade', areaName: 'Laboratório', sequenceAtTime: 2, date: '2026-03-08T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Renata Dias'], score: 78, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },

  // Equipe Eta - Administrativo
  { id: 'eval-eta-out', type: 'audit', groupId: 'grp-7', groupName: 'Equipe Eta', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 1, date: '2025-10-16T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Daniel Costa'], score: 72, checklistRevision: 1, advancedSequence: true, unitId: 'puma', answers: [] },
  { id: 'eval-eta-nov', type: 'audit', groupId: 'grp-7', groupName: 'Equipe Eta', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 2, date: '2025-11-20T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Daniel Costa'], score: 76, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-eta-dez', type: 'audit', groupId: 'grp-7', groupName: 'Equipe Eta', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 2, date: '2025-12-15T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Daniel Costa'], score: 78, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-eta-jan', type: 'audit', groupId: 'grp-7', groupName: 'Equipe Eta', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 2, date: '2026-01-18T10:00:00', applicantId: 'user-2', applicantName: 'Ana Oliveira', presentMembers: ['Daniel Costa'], score: 80, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-eta-fev', type: 'audit', groupId: 'grp-7', groupName: 'Equipe Eta', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 2, date: '2026-02-16T10:00:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Daniel Costa'], score: 81, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
  { id: 'eval-5', type: 'audit', groupId: 'grp-7', groupName: 'Equipe Eta', groupTypeName: 'Administrativo', managementName: 'Gerência Administrativa', areaName: 'Escritório Central', sequenceAtTime: 2, date: '2026-03-14T11:30:00', applicantId: 'user-1', applicantName: 'Carlos Silva', presentMembers: ['Daniel Costa', 'Mariana Alves'], score: 82, checklistRevision: 1, advancedSequence: false, unitId: 'puma', answers: [] },
]

export const dashboardData: DashboardData = {
  totalGroups: 7,
  activeGroups: 7,
  completedGroups: 1,
  averageScore: 78,
  advanceRate: 35,
  pendingAudits: 2,
  groupsByType: [
    { name: 'Operacional', count: 3 },
    { name: 'Administrativo', count: 2 },
    { name: '5S', count: 2 },
  ],
  groupsByStatus: [
    { name: 'Em Andamento', count: 6, color: '#1E7A73' },
    { name: 'Sequência Máxima', count: 1, color: '#00A650' },
  ],
  scoreEvolution: [
    { month: 'Out', score: 62 },
    { month: 'Nov', score: 68 },
    { month: 'Dez', score: 71 },
    { month: 'Jan', score: 74 },
    { month: 'Fev', score: 76 },
    { month: 'Mar', score: 78 },
  ],
  groupsNearAdvance: [],
  overdueGroups: [],
}

// ============================================================================
// GROUP ANALYTICS
// ============================================================================

export const groupAnalytics: Record<string, GroupAnalytics> = {
  'grp-1': {
    averageScoreLast6Months: 82,
    scoreTrend: 'up',
    scoreChangePercentage: 8,
    daysInCurrentSequence: 45,
    averageDaysPerSequence: 38,
    complianceRate: 78,
    requiredItemsCompliance: 80,
    rankInArea: 2,
    rankInType: 3,
    totalGroupsInArea: 4,
    totalGroupsInType: 7,
    totalEvaluations: 20,
    auditsCount: 12,
    followupsCount: 4,
    lastAuditDate: '2026-04-02',
    daysSinceLastAudit: 4,
    nextSequenceGoal: 85,
    questionsPending: 2,
    timelineEvents: [
      { id: 'ev-1', type: 'audit', date: '2026-04-02', title: 'Auditoria Seq. 3', description: 'Nota acima da meta, permanece no passo 3', score: 87, appliedBy: 'Carlos Silva', scorePts: 96, scoreMaxPts: 110, goalPct: 85, goalPts: 94, sequenceNumber: 3, goalMet: true, sequenceAdvanced: false },
      { id: 'ev-2', type: 'followup', date: '2026-03-25', title: 'Follow-up Seq. 3', description: 'Acompanhamento pos-avanco de passo', score: 84, appliedBy: 'Ana Oliveira', scorePts: 92, scoreMaxPts: 110, goalPct: 85, goalPts: 94, sequenceNumber: 3, goalMet: false, sequenceAdvanced: false },
      { id: 'ev-3', type: 'audit', date: '2026-03-18', title: 'Auditoria Seq. 3', description: 'Primeira auditoria no passo 3, abaixo da meta', score: 82, appliedBy: 'Carlos Silva', scorePts: 90, scoreMaxPts: 110, goalPct: 85, goalPts: 94, sequenceNumber: 3, goalMet: false, sequenceAdvanced: false },
      { id: 'ev-4', type: 'milestone', date: '2026-03-10', title: 'Segundo Avanco', description: 'Equipe alcancou o passo 3 da sequencia' },
      { id: 'ev-5', type: 'sequence_advance', date: '2026-03-09', title: 'Avanco de Sequencia', description: 'Passo 2 → Passo 3', sequenceNumber: 2 },
      { id: 'ev-6', type: 'audit', date: '2026-03-08', title: 'Auditoria Seq. 2', description: 'Meta batida, avancou de passo', score: 86, appliedBy: 'Ana Oliveira', scorePts: 95, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: true, sequenceAdvanced: true },
      { id: 'ev-7', type: 'audit', date: '2026-03-03', title: 'Auditoria Seq. 2', description: 'Acima da meta mas sem avanco de passo', score: 84, appliedBy: 'Carlos Silva', scorePts: 92, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: true, sequenceAdvanced: false },
      { id: 'ev-8', type: 'comment', date: '2026-02-25', title: 'Observacao do Gestor', description: 'Equipe vem batendo meta consistentemente mas ainda nao avancou de passo. Manter o ritmo.' },
      { id: 'ev-9', type: 'audit', date: '2026-02-22', title: 'Auditoria Seq. 2', description: 'Terceira consecutiva acima da meta, permanece no passo 2', score: 83, appliedBy: 'Ana Oliveira', scorePts: 91, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: true, sequenceAdvanced: false },
      { id: 'ev-10', type: 'audit', date: '2026-02-15', title: 'Auditoria Seq. 2', description: 'Novamente acima da meta, sem avanco', score: 82, appliedBy: 'Carlos Silva', scorePts: 90, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: true, sequenceAdvanced: false },
      { id: 'ev-11', type: 'followup', date: '2026-02-10', title: 'Follow-up Seq. 2', description: 'Verificacao de plano de acao', score: 79, appliedBy: 'Ana Oliveira', scorePts: 87, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: false, sequenceAdvanced: false },
      { id: 'ev-12', type: 'audit', date: '2026-02-05', title: 'Auditoria Seq. 2', description: 'Acima da meta pela primeira vez no passo 2', score: 81, appliedBy: 'Carlos Silva', scorePts: 89, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: true, sequenceAdvanced: false },
      { id: 'ev-13', type: 'audit', date: '2026-02-01', title: 'Auditoria Seq. 2', description: 'Abaixo da meta do passo 2', score: 74, appliedBy: 'Ana Oliveira', scorePts: 81, scoreMaxPts: 110, goalPct: 80, goalPts: 88, sequenceNumber: 2, goalMet: false, sequenceAdvanced: false },
      { id: 'ev-14', type: 'milestone', date: '2026-01-28', title: 'Primeiro Avanco', description: 'Equipe saiu do passo 1 para o passo 2' },
      { id: 'ev-15', type: 'sequence_advance', date: '2026-01-27', title: 'Avanco de Sequencia', description: 'Passo 1 → Passo 2', sequenceNumber: 1 },
      { id: 'ev-16', type: 'audit', date: '2026-01-25', title: 'Auditoria Seq. 1', description: 'Meta batida, avancou de passo', score: 78, appliedBy: 'Carlos Silva', scorePts: 86, scoreMaxPts: 110, goalPct: 75, goalPts: 83, sequenceNumber: 1, goalMet: true, sequenceAdvanced: true },
      { id: 'ev-17', type: 'followup', date: '2026-01-18', title: 'Follow-up Seq. 1', description: 'Acompanhamento de acoes corretivas', score: 70, appliedBy: 'Ana Oliveira', scorePts: 77, scoreMaxPts: 110, goalPct: 75, goalPts: 83, sequenceNumber: 1, goalMet: false, sequenceAdvanced: false },
      { id: 'ev-18', type: 'audit', date: '2026-01-12', title: 'Auditoria Seq. 1', description: 'Score abaixo da meta do passo', score: 68, appliedBy: 'Carlos Silva', scorePts: 75, scoreMaxPts: 110, goalPct: 75, goalPts: 83, sequenceNumber: 1, goalMet: false, sequenceAdvanced: false },
      { id: 'ev-19', type: 'comment', date: '2026-01-08', title: 'Plano de Acao Definido', description: 'Gestor definiu plano de acao com foco em organizacao e limpeza das areas criticas.' },
      { id: 'ev-20', type: 'audit', date: '2026-01-05', title: 'Auditoria Seq. 1', description: 'Primeira auditoria da equipe', score: 62, appliedBy: 'Ana Oliveira', scorePts: 68, scoreMaxPts: 110, goalPct: 75, goalPts: 83, sequenceNumber: 1, goalMet: false, sequenceAdvanced: false },
    ],
    answersByGroup: {
      'qg-1': { yes: 2, total: 2 },
      'qg-2': { yes: 1, total: 2 },
      'qg-3': { yes: 2, total: 2 },
      'qg-4': { yes: 2, total: 2 },
      'qg-5': { yes: 0, total: 2 },
    },
    scoreEvolution: [
      { month: 'Jan', score: 69 },
      { month: 'Fev', score: 81 },
      { month: 'Mar', score: 84 },
      { month: 'Abr', score: 87 },
    ],
  },
}

// ============================================================================
// GROUP RANKINGS
// ============================================================================

export const groupRankings: Record<string, GroupRanking> = {
  'grp-1': {
    area: {
      position: 2,
      total: 4,
      top3: [
        { id: 'grp-4', name: 'Equipe Delta', score: 93, trend: 'stable', isCurrentGroup: false },
        { id: 'grp-1', name: 'Equipe Alpha', score: 87, trend: 'up', isCurrentGroup: true },
        { id: 'grp-6', name: 'Equipe Zeta', score: 78, trend: 'down', isCurrentGroup: false },
      ]
    },
    type: {
      position: 3,
      total: 7,
      top3: [
        { id: 'grp-4', name: 'Equipe Delta', score: 93, trend: 'stable', isCurrentGroup: false },
        { id: 'grp-7', name: 'Equipe Eta', score: 82, trend: 'up', isCurrentGroup: false },
        { id: 'grp-1', name: 'Equipe Alpha', score: 87, trend: 'up', isCurrentGroup: true },
      ]
    }
  },
}
