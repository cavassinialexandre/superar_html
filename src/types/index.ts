export type UnitId = 'puma' | 'monte-alegre'

export interface Unit {
  id: UnitId
  name: string
  description: string
}

export type UserProfile = 'admin' | 'evaluator' | 'user'

export interface User {
  id: string
  name: string
  profiles: UserProfile[]
  unitId: UnitId
  status: 'active' | 'inactive'
}

export interface Management {
  id: string
  name: string
  status: 'active' | 'inactive'
  unitId: UnitId
}

export interface Area {
  id: string
  name: string
  managementId: string
  managementName: string
  status: 'active' | 'inactive'
  unitId: UnitId
}

export interface GroupType {
  id: string
  name: string
  defaultGoal: number
  status: 'active' | 'inactive'
  sequences: Sequence[]
  unitId: UnitId
}

export interface Sequence {
  id: string
  groupTypeId: string
  number: number
  useDefaultGoal: boolean
  customGoal?: number
  checklistId: string
  checklistName: string
}

export interface ChecklistRevision {
  id: string
  checklistId: string
  revisionNumber: number
  status: 'active' | 'inactive'
  questions: Question[]
}

export interface Checklist {
  id: string
  name: string
  status: 'active' | 'inactive'
  revisions: ChecklistRevision[]
  unitId: UnitId
}

export interface QuestionGroup {
  id: string
  name: string
  description?: string
  order: number
  color?: string
}

export type AnswerType = 'binary' | 'ternary'

export interface Question {
  id: string
  revisionId: string
  groupId?: string
  text: string
  sequence: number
  weight: number
  requiredYesForAdvance: boolean
  answerType?: AnswerType
}

export type TeamMemberRole = 'facilitator' | 'auditor' | 'member'

export interface TeamMember {
  id: string
  name: string
  role: TeamMemberRole
}

export interface Group {
  id: string
  name: string
  groupTypeId: string
  groupTypeName: string
  areaId: string
  areaName: string
  managementId: string
  managementName: string
  currentSequence: number
  maxSequence: number
  team: TeamMember[]
  lastAuditScore?: number
  lastEvaluationDate?: string
  status: 'active' | 'inactive'
  unitId: UnitId
}

export type EvaluationType = 'audit' | 'followup'
export type AnswerValue = 'yes' | 'no' | 'partial' | 'na'

export interface EvaluationAnswer {
  questionId: string
  questionText: string
  answer: AnswerValue
  justification?: string
  attachments?: string[]
  weight: number
  requiredYesForAdvance: boolean
}

export interface Evaluation {
  id: string
  type: EvaluationType
  groupId: string
  groupName: string
  groupTypeName: string
  managementName: string
  areaName: string
  sequenceAtTime: number
  date: string
  applicantId: string
  applicantName: string
  presentMembers: string[]
  otherPeople?: string
  answers: EvaluationAnswer[]
  score: number
  checklistRevision: number
  advancedSequence?: boolean
  unitId: UnitId
}

export interface DashboardData {
  totalGroups: number
  activeGroups: number
  completedGroups: number
  averageScore: number
  advanceRate: number
  pendingAudits: number
  groupsByType: { name: string; count: number }[]
  groupsByStatus: { name: string; count: number; color: string }[]
  scoreEvolution: { month: string; score: number }[]
  groupsNearAdvance: Group[]
  overdueGroups: Group[]
}

export interface TimelineEvent {
  id: string
  type: 'audit' | 'followup' | 'sequence_advance' | 'milestone' | 'comment'
  date: string
  title: string
  description?: string
  score?: number
  appliedBy?: string
  metadata?: Record<string, unknown>
}

export interface HistoryEntry extends TimelineEvent {
  scorePts?: number
  scoreMaxPts?: number
  goalPct?: number
  goalPts?: number
  sequenceNumber?: number
  goalMet?: boolean
  sequenceAdvanced?: boolean
}

export interface GroupAnalytics {
  averageScoreLast6Months: number
  scoreTrend: 'up' | 'down' | 'stable'
  scoreChangePercentage: number
  daysInCurrentSequence: number
  averageDaysPerSequence: number
  estimatedCompletionDate?: string
  complianceRate: number
  requiredItemsCompliance: number
  rankInArea: number
  rankInType: number
  totalGroupsInArea: number
  totalGroupsInType: number
  totalEvaluations: number
  auditsCount: number
  followupsCount: number
  lastAuditDate: string
  daysSinceLastAudit: number
  nextSequenceGoal: number
  questionsPending: number
  timelineEvents: HistoryEntry[]
  answersByGroup: Record<string, { yes: number; total: number }>
  scoreEvolution: { month: string; score: number }[]
}

export interface RankedGroup {
  id: string
  name: string
  score: number
  trend: 'up' | 'down' | 'stable'
  isCurrentGroup: boolean
}

export interface GroupRanking {
  area: {
    position: number
    total: number
    top3: RankedGroup[]
  }
  type: {
    position: number
    total: number
    top3: RankedGroup[]
  }
}

export interface Pagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}
