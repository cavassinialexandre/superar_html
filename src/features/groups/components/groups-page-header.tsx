import { motion } from 'framer-motion'

interface GroupsPageHeaderProps {
  searchType: string
  total: number
  typesCount: number
  membersCount: number
  isGeralView: boolean
}

interface TypeAccent {
  kicker: string
  title: string
  midOrbClass: string
  description: string
}

const TYPE_ACCENT: Record<string, TypeAccent> = {
  'type-1': {
    kicker: 'GRUPOS OPERACIONAIS',
    title: 'Grupos Operacionais',
    midOrbClass: 'bg-amber-300/15',
    description: 'Equipes Kaizen/TPM da operação — auditorias, follow-ups e evolução por sequência.',
  },
  'type-2': {
    kicker: 'GRUPOS ADMINISTRATIVOS',
    title: 'Grupos Administrativos',
    midOrbClass: 'bg-sky-300/15',
    description: 'Times administrativos da unidade com checklist próprio e metas dedicadas.',
  },
  'type-3': {
    kicker: 'GRUPOS 5S',
    title: 'Grupos 5S',
    midOrbClass: 'bg-emerald-300/18',
    description: 'Equipes 5S em ciclo de organização, padronização e disciplina contínua.',
  },
}

const DEFAULT_GERAL: TypeAccent = {
  kicker: 'GESTÃO DE GRUPOS',
  title: 'Todos os Grupos',
  midOrbClass: 'bg-primary-300/15',
  description: 'Visão geral de todos os grupos organizados por área da unidade.',
}

const DEFAULT_FALLBACK: TypeAccent = {
  kicker: 'GESTÃO DE GRUPOS',
  title: 'Grupos',
  midOrbClass: 'bg-primary-300/15',
  description: 'Visualize e gerencie todos os grupos Kaizen/TPM da unidade.',
}

function pickAccent(searchType: string, isGeralView: boolean): TypeAccent {
  if (searchType && TYPE_ACCENT[searchType]) return TYPE_ACCENT[searchType]
  return isGeralView ? DEFAULT_GERAL : DEFAULT_FALLBACK
}

export function GroupsPageHeader({
  searchType,
  total,
  typesCount,
  membersCount,
  isGeralView,
}: GroupsPageHeaderProps) {
  const accent = pickAccent(searchType, isGeralView)

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl shadow-sm p-6 md:p-8 text-white"
      style={{ background: 'linear-gradient(135deg, #0C2B28 0%, #103734 45%, #155F59 100%)' }}
    >
      {/* Layer 1 — Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Layers 2-4 — Ambient orbs */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-300/15 blur-3xl pointer-events-none" />
      <div className={`absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-48 rounded-full ${accent.midOrbClass} blur-3xl pointer-events-none`} />

      {/* Layer 5 — Watermark SVG: layered orbital rings com nodes */}
      <div
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 280 280"
          fill="none"
          className="text-white/[0.09]"
        >
          <defs>
            <radialGradient id="groups-watermark-fade" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="70%" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="groups-watermark-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer ring (dashed) */}
          <circle cx="140" cy="140" r="128" stroke="url(#groups-watermark-fade)" strokeWidth="1" strokeDasharray="2 7" />
          {/* Mid ring (solid) */}
          <circle cx="140" cy="140" r="98" stroke="url(#groups-watermark-fade)" strokeWidth="1.2" />
          {/* Inner ring (thin) */}
          <circle cx="140" cy="140" r="72" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          {/* Tiny central ring */}
          <circle cx="140" cy="140" r="20" stroke="currentColor" strokeWidth="1.2" />

          {/* Hub glow */}
          <circle cx="140" cy="140" r="22" fill="url(#groups-watermark-glow)" />
          {/* Hub center */}
          <circle cx="140" cy="140" r="5" fill="currentColor" />

          {/* Radial connectors hub→nodes */}
          <line x1="140" y1="140" x2="140" y2="12" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          <line x1="140" y1="140" x2="212" y2="82" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          <line x1="140" y1="140" x2="212" y2="198" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          <line x1="140" y1="140" x2="140" y2="268" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          <line x1="140" y1="140" x2="68" y2="82" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />

          {/* Node 1 — top (12h) */}
          <circle cx="140" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="140" cy="12" r="5" fill="currentColor" opacity="0.7" />
          {/* Node 2 — NE (~2h) */}
          <circle cx="212" cy="82" r="8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="212" cy="82" r="5" fill="currentColor" opacity="0.7" />
          {/* Node 3 — SE (~5h) */}
          <circle cx="212" cy="198" r="8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="212" cy="198" r="5" fill="currentColor" opacity="0.7" />
          {/* Node 4 — bottom (6h) */}
          <circle cx="140" cy="268" r="8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="140" cy="268" r="5" fill="currentColor" opacity="0.7" />
          {/* Node 5 — NW (~10h) */}
          <circle cx="68" cy="82" r="8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="68" cy="82" r="5" fill="currentColor" opacity="0.7" />

          {/* Decorative particles */}
          <circle cx="48" cy="208" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="252" cy="42" r="1.6" fill="currentColor" opacity="0.6" />
          <circle cx="32" cy="148" r="1.4" fill="currentColor" opacity="0.55" />
          <circle cx="260" cy="148" r="2.2" fill="currentColor" opacity="0.85" />
          <circle cx="92" cy="252" r="1.5" fill="currentColor" opacity="0.6" />
          <circle cx="200" cy="268" r="1.8" fill="currentColor" opacity="0.65" />
        </svg>
      </div>

      {/* Layer 6 — Conteúdo */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="min-w-0">
          {/* Kicker */}
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-200 font-semibold">
            {accent.kicker}
          </p>

          {/* Título */}
          <h1 className="mt-2 font-heading text-2xl md:text-3xl font-black tracking-tight text-white">
            {accent.title}
          </h1>

          {/* Descrição */}
          <p className="mt-1.5 text-sm text-primary-100/80 max-w-xl leading-relaxed">
            {accent.description}
          </p>
        </div>

        {/* KPIs */}
        <div className="flex items-center gap-6 flex-wrap shrink-0">
          <HeaderStat label="Total" value={total.toString()} />
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <HeaderStat label="Tipos" value={typesCount.toString()} />
          <div className="w-px h-10 bg-white/20 hidden md:block" />
          <HeaderStat label="Membros" value={membersCount.toString()} />
        </div>
      </div>
    </motion.div>
  )
}

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary-300 font-semibold">{label}</p>
      <p className="mt-0.5 text-2xl font-black tabular-nums text-white">{value}</p>
    </div>
  )
}
