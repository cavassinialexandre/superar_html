import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useUnitStore } from '@/stores/unit-store'
import { FactoryIcon, ArrowAdvanceIcon } from '@/assets/icons'
import type { UnitId } from '@/types'
import { units, areas, groupTypes, groups } from '@/mocks/data'
import { staggerContainer, staggerItem } from '@/design-system/animations'

const unitGradients: Record<UnitId, string> = {
  puma: 'linear-gradient(135deg, #103734 0%, #0C2B28 50%, #155F59 100%)',
  'monte-alegre': 'linear-gradient(135deg, #103734 0%, #0C2B28 50%, #155F59 100%)',
}

const unitDecorations: Record<UnitId, string> = {
  puma: '#00A650',
  'monte-alegre': '#00A650',
}

const unitKpis: Record<UnitId, { areas: number; groupTypes: number; groups: number }> = {
  puma: {
    areas: areas.filter(a => a.unitId === 'puma').length,
    groupTypes: groupTypes.filter(gt => gt.unitId === 'puma').length,
    groups: groups.filter(g => g.unitId === 'puma').length,
  },
  'monte-alegre': { areas: 0, groupTypes: 0, groups: 0 },
}

export function UnitSelectionPage() {
  const navigate = useNavigate()
  const { setUnit } = useUnitStore()

  const handleSelectUnit = (unitId: UnitId) => {
    setUnit(unitId)
    navigate({ to: '/dashboard' })
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FAFA 0%, #EDF2F2 100%)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(120, 140, 138, 0.45) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary-200 blur-3xl opacity-30" />
      <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-green-200 blur-3xl opacity-25" />
      <div className="absolute top-20 right-10 w-[350px] h-[350px] rounded-full bg-yellow-100 blur-3xl opacity-35" />
      <div className="absolute bottom-20 left-1/3 w-[300px] h-[300px] rounded-full bg-rose-100 blur-3xl opacity-20" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(241, 244, 244, 0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-800 flex items-center justify-center shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#DDDD03" opacity="0.9" />
              <path d="M2 17l10 5 10-5" stroke="#00A650" strokeWidth="1.5" />
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h1
            className="font-heading text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent pb-1 -mb-1"
            style={{ backgroundImage: 'linear-gradient(135deg, #103734 0%, #1E7A73 30%, #867F06 55%, #1E7A73 75%, #103734 100%)' }}
          >
            Superar Digital
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium tracking-widest uppercase">
            Gestão Kaizen/TPM 4.0
          </p>
        </motion.div>

        {/* Unit Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {units.map((unit) => (
            <motion.button
              key={unit.id}
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectUnit(unit.id)}
              className="group relative overflow-hidden rounded-2xl text-left cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ background: unitGradients[unit.id] }}
            >
              {/* Decorative orb */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 blur-2xl"
                style={{ background: unitDecorations[unit.id] }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-8 blur-xl"
                style={{ background: '#DDDD03' }}
              />

              <div className="relative p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <FactoryIcon size={24} className="text-white/90" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {unit.name}
                  </h2>
                </div>

                <div className="grid grid-cols-3 bg-white/10 backdrop-blur-sm rounded-xl py-3.5 mb-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white tabular-nums">{unitKpis[unit.id].areas}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider">Áreas</p>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <p className="text-lg font-bold text-white tabular-nums">{unitKpis[unit.id].groupTypes}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider">Tipos Grupos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white tabular-nums">{unitKpis[unit.id].groups}</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider">Grupos</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-white transition-colors">
                  <span className="text-sm font-semibold">Acessar unidade</span>
                  <ArrowAdvanceIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${unitDecorations[unit.id]}, #DDDD03)`,
                }}
              />
            </motion.button>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
