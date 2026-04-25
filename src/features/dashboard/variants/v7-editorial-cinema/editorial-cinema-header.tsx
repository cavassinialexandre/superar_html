import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ec } from './editorial-cinema-tokens'

interface Props {
  unitLabel: string
  totalGroups: number
  averageScore: number
  groupTypesCount: number
}

export function EditorialCinemaHeader({ unitLabel, totalGroups, groupTypesCount }: Props) {
  const dateLong = format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })
  const issue = format(new Date(), 'MM.yyyy')

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6 px-1 py-7 border-b"
      style={{ borderColor: ec.surface.rule }}
    >
      <div className="md:col-span-8">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex items-center gap-3 mb-3 flex-wrap"
        >
          <span
            className="font-bold uppercase"
            style={{
              fontFamily: ec.font.sans,
              fontSize: ec.scale.kicker,
              letterSpacing: ec.letter.kicker,
              color: ec.accent.teal,
            }}
          >
            EXECUTIVE BRIEFING
          </span>
          <span className="w-px h-3" style={{ background: ec.surface.rule }} />
          <span
            className="font-medium uppercase"
            style={{
              fontFamily: ec.font.sans,
              fontSize: ec.scale.kicker,
              letterSpacing: ec.letter.kicker,
              color: ec.surface.inkMuted,
            }}
          >
            {dateLong}
          </span>
          <span className="w-px h-3" style={{ background: ec.surface.rule }} />
          <span
            className="font-medium uppercase"
            style={{
              fontFamily: ec.font.sans,
              fontSize: ec.scale.kicker,
              letterSpacing: ec.letter.kicker,
              color: ec.surface.inkMuted,
            }}
          >
            UNIDADE {unitLabel}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-bold leading-[1.05] mb-2"
          style={{
            fontFamily: ec.font.sans,
            fontSize: ec.scale.h1,
            color: ec.surface.ink,
            letterSpacing: ec.letter.display,
          }}
        >
          Portal{' '}
          <span style={{ fontFamily: ec.font.serif, fontStyle: 'italic', fontWeight: 400 }}>
            Executivo
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="max-w-xl"
          style={{
            fontFamily: ec.font.body,
            fontSize: ec.scale.bodyLg,
            color: ec.surface.inkSoft,
            lineHeight: 1.55,
          }}
        >
          Panorama gerencial da implementação Kaizen/TPM 4.0. Acompanhe os{' '}
          <strong style={{ color: ec.surface.ink }}>{groupTypesCount} tipos de grupos</strong>{' '}
          distribuídos em{' '}
          <strong style={{ color: ec.surface.ink }}>{totalGroups} equipes ativas</strong>.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.22 }}
        className="md:col-span-4 flex items-center justify-end"
      >
        <div className="text-right">
          <div
            className="uppercase mb-1"
            style={{
              fontFamily: ec.font.sans,
              fontSize: '9.5px',
              letterSpacing: ec.letter.kicker,
              color: ec.surface.inkSubtle,
            }}
          >
            EDIÇÃO
          </div>
          <div
            style={{
              fontFamily: ec.font.serif,
              fontSize: '22px',
              fontWeight: 600,
              color: ec.surface.ink,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            № {issue}
          </div>
          <div
            className="mt-1 uppercase"
            style={{
              fontFamily: ec.font.sans,
              fontSize: '9.5px',
              letterSpacing: ec.letter.kicker,
              color: ec.surface.inkMuted,
            }}
          >
            ABR · 2026
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}
