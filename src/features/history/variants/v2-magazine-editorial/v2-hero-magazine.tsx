import { motion } from 'framer-motion'

export function V2HeroMagazine() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-[#FAF7F2] border border-[#E8DEC9] p-10 md:p-14"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Decorative gold lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="v2gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B8860B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <line x1="0" y1="100" x2="800" y2="100" stroke="url(#v2gold)" strokeWidth="0.5" />
        <line x1="0" y1="300" x2="800" y2="300" stroke="url(#v2gold)" strokeWidth="0.5" />
      </svg>

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 20%, #000 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      <div className="relative max-w-3xl">
        <motion.p
          className="text-[11px] font-semibold tracking-[0.35em] text-[#B8860B] uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          O Histórico
        </motion.p>

        <motion.h1
          className="mt-4 text-5xl md:text-7xl font-bold text-[#0A0A0A] tracking-tight leading-[0.95]"
          style={{ fontFamily: 'Fraunces, "Playfair Display", Georgia, serif' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          As decisões, <em className="italic text-[#B8860B]">em ordem.</em>
        </motion.h1>

        {/* Gold thin rule */}
        <motion.div
          className="h-[1.5px] my-7 bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-transparent"
          style={{ width: 120 }}
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        />

        <motion.p
          className="text-base md:text-lg text-[#3A3A3A] max-w-2xl leading-relaxed"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Cada avaliação é uma matéria. Leia auditorias e follow-ups como uma revista editorial —
          o contexto completo, a voz do aplicador, o veredicto da sequência.
        </motion.p>
      </div>
    </motion.div>
  )
}
