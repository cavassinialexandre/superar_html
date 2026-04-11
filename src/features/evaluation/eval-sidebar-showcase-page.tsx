/**
 * Sidebar variants showcase page.
 * Shows all 8 EvalSidebarVariants side-by-side with mock data for visual comparison.
 * Dev-only route: #/__showcase/eval-sidebar
 */

import { useState } from 'react'
import {
  EvalSidebarVariants,
  type EvalSidebarVariant,
  type EvalSidebarVariantsProps,
  type SectionNavItemWithPoints,
} from './components'
import type { TeamMember } from '@/types'

// ---------------------------------------------------------------------------
// Mock data (exercises all visual states: complete/partial/empty, score<meta, etc)
// ---------------------------------------------------------------------------

function createShowcaseMock(): Omit<EvalSidebarVariantsProps, 'variant' | 'className'> {
  const mockSections: SectionNavItemWithPoints[] = [
    {
      title: 'Organização e Limpeza',
      color: '#0D9488',
      answeredCount: 7,
      totalCount: 8,
      status: 'partial',
      pointsEarned: 55,
      pointsMax: 80,
      pointsMeta: 64,
      percentageOfMax: 68.8,
      sectionScore: 78.6,
    },
    {
      title: 'Gestão Visual e Indicadores',
      color: '#6366F1',
      answeredCount: 5,
      totalCount: 8,
      status: 'partial',
      pointsEarned: 35,
      pointsMax: 80,
      pointsMeta: 64,
      percentageOfMax: 43.8,
      sectionScore: 70,
    },
    {
      title: 'Participação e Melhoria',
      color: '#F59E0B',
      answeredCount: 4,
      totalCount: 7,
      status: 'partial',
      pointsEarned: 30,
      pointsMax: 70,
      pointsMeta: 56,
      percentageOfMax: 42.9,
      sectionScore: 75,
    },
    {
      title: 'Equipamentos e Anomalias',
      color: '#EF4444',
      answeredCount: 2,
      totalCount: 7,
      status: 'partial',
      pointsEarned: 10,
      pointsMax: 70,
      pointsMeta: 56,
      percentageOfMax: 14.3,
      sectionScore: 50,
    },
  ]

  const teamMembers: TeamMember[] = [
    { id: 'tm-1', name: 'Roberto Lima', role: 'facilitator' },
    { id: 'tm-2', name: 'Fernanda Souza', role: 'auditor' },
    { id: 'tm-3', name: 'Carlos Silva', role: 'auditor' },
    { id: 'tm-4', name: 'Lucas Almeida', role: 'member' },
    { id: 'tm-5', name: 'Paula Nunes', role: 'member' },
    { id: 'tm-6', name: 'Marcos Oliveira', role: 'member' },
    { id: 'tm-7', name: 'Ana Costa', role: 'member' },
    { id: 'tm-8', name: 'Thiago Ferreira', role: 'member' },
    { id: 'tm-9', name: 'Juliana Castro', role: 'member' },
    { id: 'tm-10', name: 'Eduardo Melo', role: 'member' },
    { id: 'tm-11', name: 'Camila Rocha', role: 'member' },
    { id: 'tm-12', name: 'Fábio Moraes', role: 'member' },
    { id: 'tm-13', name: 'Larissa Martins', role: 'member' },
    { id: 'tm-14', name: 'Bruno Carvalho', role: 'member' },
    { id: 'tm-15', name: 'Isabela Gomes', role: 'member' },
    { id: 'tm-16', name: 'Diego Pereira', role: 'member' },
    { id: 'tm-17', name: 'Rafaela Dias', role: 'member' },
    { id: 'tm-18', name: 'Gabriel Ribeiro', role: 'member' },
    { id: 'tm-19', name: 'Amanda Vieira', role: 'member' },
    { id: 'tm-20', name: 'Daniel Barbosa', role: 'member' },
  ]

  // 30 question answers — mix of yes/partial/no/na/null for visual variety
  const mockQuestionAnswers: Array<'yes' | 'partial' | 'no' | 'na' | null> = [
    // Org e Limpeza (8): 7 respondidas
    'yes', 'yes', 'partial', 'yes', 'no', 'yes', 'yes', null,
    // Gestão Visual (8): 5 respondidas
    'yes', 'partial', 'no', 'yes', 'na', null, null, null,
    // Participação (7): 4 respondidas
    'yes', 'yes', 'partial', 'no', null, null, null,
    // Equipamentos (7): 2 respondidas
    'yes', 'no', null, null, null, null, null,
  ]

  return {
    score: 43,
    meta: 80,
    progress: 60,
    answeredCount: 18,
    totalQuestions: 30,
    presentMembers: ['Roberto Lima', 'Fernanda Souza', 'Carlos Silva', 'Lucas Almeida', 'Paula Nunes'],
    teamMembers,
    evalType: 'audit',
    eligibility: {
      eligible: false,
      reasons: ['Nota 43% abaixo da meta de 80%', '2 pergunta(s) obrigatória(s) não respondida(s) com "Sim"'],
    },
    sections: mockSections,
    pointsBreakdown: { earned: 130, max: 300, percentage: 43.3 },
    pointsMeta: 240,
    questionAnswers: mockQuestionAnswers,
    canFinalize: false,
    onScrollToSection: () => {},
    onFinalize: () => {},
    disableEntrance: true,
  }
}

// ---------------------------------------------------------------------------
// Variant catalog — used to render each card in the grid
// ---------------------------------------------------------------------------

const VARIANTS: Array<{ id: EvalSidebarVariant; label: string; notes: string }> = [
  { id: 'S1', label: 'Refined Baseline', notes: 'pixel-port atual + dados de pontos' },
  { id: 'S2', label: 'Executive Whitespace', notes: 'premium minimal tipográfico' },
  { id: 'S3', label: 'Editorial Magazine', notes: 'big-type + baseline grid' },
  { id: 'S3a', label: 'Editorial Dossier', notes: 'dossiê formal + dual-ring + label rotacionado' },
  { id: 'S3b', label: 'Editorial Broadsheet', notes: 'jornal broadsheet + big-number asymmetric' },
  { id: 'S3c', label: 'Editorial Hybrid Hero', notes: 'rulers editoriais + hero gauge protagonista' },
  { id: 'S3d', label: 'Editorial Sketch', notes: 'papel manuscrito + traços hand-drawn' },
  { id: 'S4', label: 'Aurora Glass', notes: 'glassmorphism refinado' },
  { id: 'S5', label: 'Gauge Hero Stack', notes: 'dual-ring como protagonista' },
  { id: 'S6', label: 'Soft Depth Neo', notes: 'neumorfismo refinado 2025' },
  { id: 'S7', label: 'Chromatic Pulse', notes: 'multi-color harmony' },
  { id: 'S8', label: 'Midnight Obsidian', notes: 'dark luxury teal-esmerald' },
]

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

type GridMode = '2-col' | '4-col'
type BgMode = 'light' | 'muted' | 'dark'

export function EvalSidebarShowcasePage() {
  const [gridMode, setGridMode] = useState<GridMode>('4-col')
  const [bgMode, setBgMode] = useState<BgMode>('light')
  const [copied, setCopied] = useState<EvalSidebarVariant | null>(null)

  const mock = createShowcaseMock()

  const bgClass =
    bgMode === 'light' ? 'bg-gradient-to-b from-gray-50 to-white'
    : bgMode === 'muted' ? 'bg-[#EEF2F1]'
    : 'bg-[#0A1211]'

  const textColor = bgMode === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedText = bgMode === 'dark' ? 'text-white/60' : 'text-gray-500'

  const gridClass =
    gridMode === '2-col'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'

  function copyLink(variant: EvalSidebarVariant) {
    const url = `${window.location.origin}/#/evaluation/grp-1?type=audit&sidebar=${variant}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(variant)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <div className={`min-h-screen ${bgClass} transition-colors`}>
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className={`text-3xl font-bold ${textColor}`} style={{ fontFamily: 'Plus Jakarta Sans, Inter, system-ui' }}>
            Sidebar Variants — 12 propostas
          </h1>
          <p className={`mt-2 text-sm ${mutedText}`}>
            12 propostas de design para o card lateral da avaliação, incluindo 4 variações na família Editorial Magazine
            (S3, S3a, S3b, S3c, S3d). Use os toggles para inspecionar em contextos diferentes.
          </p>

          {/* Toggles */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${mutedText}`}>Grid</span>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setGridMode('2-col')}
                  className={`px-3 py-1.5 text-xs font-semibold ${gridMode === '2-col' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  2 col
                </button>
                <button
                  onClick={() => setGridMode('4-col')}
                  className={`px-3 py-1.5 text-xs font-semibold ${gridMode === '4-col' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  4 col
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${mutedText}`}>Fundo</span>
              <div className="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setBgMode('light')}
                  className={`px-3 py-1.5 text-xs font-semibold ${bgMode === 'light' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setBgMode('muted')}
                  className={`px-3 py-1.5 text-xs font-semibold ${bgMode === 'muted' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Muted
                </button>
                <button
                  onClick={() => setBgMode('dark')}
                  className={`px-3 py-1.5 text-xs font-semibold ${bgMode === 'dark' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Dark
                </button>
              </div>
            </div>

            <a
              href="#/evaluation/grp-1?type=audit"
              className={`ml-auto text-xs font-semibold ${bgMode === 'dark' ? 'text-teal-300' : 'text-primary-600'} hover:underline`}
            >
              ← Voltar para avaliação
            </a>
          </div>
        </header>

        {/* Grid of variants */}
        <div className={gridClass}>
          {VARIANTS.map(({ id, label, notes }) => (
            <div key={id} className="flex flex-col items-center">
              {/* Variant header */}
              <div className="w-full max-w-[360px] mb-3 flex items-center justify-between">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>{id}</p>
                  <p className={`text-sm font-bold ${textColor}`} style={{ fontFamily: 'Plus Jakarta Sans, Inter, system-ui' }}>
                    {label}
                  </p>
                </div>
                <button
                  onClick={() => copyLink(id)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-colors ${
                    copied === id
                      ? 'bg-green-500 text-white border-green-500'
                      : bgMode === 'dark'
                        ? 'border-white/20 text-white/70 hover:bg-white/10'
                        : 'border-gray-200 text-gray-500 hover:bg-white'
                  }`}
                >
                  {copied === id ? '✓ copiado' : 'copiar link'}
                </button>
              </div>

              {/* The variant itself */}
              <EvalSidebarVariants
                variant={id}
                className="w-80 flex-shrink-0"
                {...mock}
              />

              {/* Notes */}
              <p className={`mt-3 text-[10px] text-center max-w-[320px] ${mutedText}`}>
                {notes}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className={`mt-16 pt-8 border-t ${bgMode === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-[10px] ${mutedText}`}>
            Fonte: <code className="font-mono">src/features/evaluation/components/eval-sidebar-variants.tsx</code> ·
            {' '}Mock: <code className="font-mono">createShowcaseMock()</code> nesta página ·
            {' '}Para testar com dados reais, use <code className="font-mono">?sidebar=S3</code> na URL da avaliação.
          </p>
        </footer>
      </div>
    </div>
  )
}
