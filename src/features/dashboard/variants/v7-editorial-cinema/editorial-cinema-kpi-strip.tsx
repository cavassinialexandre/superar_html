import { motion } from 'framer-motion'
import { ec } from './editorial-cinema-tokens'

interface KPI {
  id: string
  label: string
  value: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

interface Props {
  kpis: KPI[]
}

export function EditorialCinemaKpiStrip({ kpis }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-3 py-7 border-b"
      style={{ borderColor: ec.surface.rule }}
    >
      {kpis.map((k, idx) => (
        <motion.div
          key={k.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.7 + idx * 0.06 }}
          className={`px-5 ${idx > 0 ? 'md:border-l' : ''}`}
          style={{ borderColor: ec.surface.rule }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="uppercase font-semibold"
              style={{
                fontFamily: ec.font.sans,
                fontSize: ec.scale.kicker,
                letterSpacing: ec.letter.kicker,
                color: ec.surface.inkMuted,
              }}
            >
              {k.label}
            </span>
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: 24,
                height: 24,
                background: 'rgba(16,55,52,0.06)',
                color: ec.accent.teal,
              }}
            >
              <k.Icon size={12} />
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className="leading-none tabular-nums"
              style={{
                fontFamily: ec.font.sans,
                fontWeight: 700,
                fontSize: ec.scale.bigNumber,
                color: ec.surface.ink,
                letterSpacing: '-0.025em',
              }}
            >
              {k.value}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.section>
  )
}
