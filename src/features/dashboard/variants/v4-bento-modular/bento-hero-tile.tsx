import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DashboardIcon } from '@/assets/icons'
import { bento, bentoTileBase } from './bento-tokens'

interface Props {
  unitLabel: string
  totalGroups: number
  averageScore: number
}

export function BentoHeroTile({ unitLabel, totalGroups, averageScore }: Props) {
  const dateStr = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.25 } }}
      className="relative overflow-hidden p-6 md:p-7 group"
      style={{
        ...bentoTileBase,
        background: `linear-gradient(135deg, #FFFFFF 0%, ${bento.category.hero.soft} 130%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -top-16 -right-12 w-56 h-56 rounded-full opacity-30 blur-3xl"
        style={{ background: bento.category.hero.tint }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-12 w-48 h-48 rounded-full opacity-15 blur-3xl"
        style={{ background: bento.category.podium.tint }}
      />

      <div className="relative flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
              style={{
                background: bento.category.hero.tint,
                color: '#FFFFFF',
              }}
            >
              <DashboardIcon size={15} />
            </span>
            <div className="flex flex-col">
              <span
                className="font-semibold uppercase tracking-[0.14em]"
                style={{ fontFamily: bento.font.mono, fontSize: 9.5, color: bento.surface.textMuted }}
              >
                PORTAL EXECUTIVO
              </span>
              <span
                className="capitalize"
                style={{ fontFamily: bento.font.display, fontSize: 11.5, color: bento.surface.textMuted }}
              >
                {dateStr}
              </span>
            </div>
          </div>

          <h2
            className="font-bold leading-tight mb-1.5"
            style={{
              fontFamily: bento.font.display,
              fontSize: 'clamp(24px, 3vw, 32px)',
              color: bento.surface.text,
              letterSpacing: '-0.02em',
            }}
          >
            Olá! Bem-vindo de volta.
          </h2>
          <p
            className="max-w-md"
            style={{
              fontFamily: bento.font.display,
              fontSize: 13.5,
              color: bento.surface.textSoft,
              lineHeight: 1.5,
            }}
          >
            Estamos acompanhando <strong>{totalGroups} grupos ativos</strong> da unidade {unitLabel}.
            A média atual está em <strong>{averageScore}%</strong>.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div
              className="uppercase tracking-[0.14em]"
              style={{ fontFamily: bento.font.mono, fontSize: 9.5, color: bento.surface.textMuted }}
            >
              UNIDADE
            </div>
            <div
              className="font-semibold mt-0.5"
              style={{ fontFamily: bento.font.display, fontSize: 22, color: bento.surface.text }}
            >
              {unitLabel}
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-center w-[110px] h-[110px] rounded-full"
            style={{
              background: `conic-gradient(${bento.category.hero.tint} ${averageScore * 3.6}deg, ${bento.surface.rule} 0)`,
              padding: 6,
            }}
          >
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center"
              style={{ background: bento.surface.tile }}
            >
              <span
                className="font-bold leading-none tabular-nums"
                style={{
                  fontFamily: bento.font.display,
                  fontSize: 28,
                  color: bento.surface.text,
                  letterSpacing: '-0.02em',
                }}
              >
                {averageScore}
              </span>
              <span
                className="uppercase tracking-[0.16em] mt-0.5"
                style={{ fontFamily: bento.font.mono, fontSize: 8.5, color: bento.surface.textMuted }}
              >
                MÉDIA %
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
