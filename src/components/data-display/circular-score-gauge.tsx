import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { getScoreColor } from '@/design-system/tokens'
import { cn } from '@/lib/cn'

interface CircularScoreGaugeProps {
  score: number
  meta?: number
  size?: 'sm' | 'md' | 'lg'
  showMeta?: boolean
  className?: string
}

const sizeConfig = {
  sm: { diameter: 56, stroke: 4, fontSize: 'text-sm', metaSize: 'text-[8px]', labelSize: 'text-[7px]' },
  md: { diameter: 100, stroke: 6, fontSize: 'text-2xl', metaSize: 'text-[10px]', labelSize: 'text-[9px]' },
  lg: { diameter: 160, stroke: 8, fontSize: 'text-4xl', metaSize: 'text-xs', labelSize: 'text-[10px]' },
}

export function CircularScoreGauge({ score, meta, size = 'md', showMeta = true, className }: CircularScoreGaugeProps) {
  const config = sizeConfig[size]
  const radius = (config.diameter - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const center = config.diameter / 2

  const springScore = useSpring(0, { stiffness: 60, damping: 20 })
  const dashOffset = useTransform(springScore, (v) => circumference * (1 - v / 100))

  useEffect(() => {
    springScore.set(Math.min(Math.max(score, 0), 100))
  }, [score, springScore])

  const scoreColor = getScoreColor(score)

  // Meta marker position on the arc
  const metaAngle = meta ? ((meta / 100) * 360 - 90) * (Math.PI / 180) : 0
  const metaX = meta ? center + radius * Math.cos(metaAngle) : 0
  const metaY = meta ? center + radius * Math.sin(metaAngle) : 0

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={config.diameter} height={config.diameter} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E4E8E8"
          strokeWidth={config.stroke}
        />
        {/* Score arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
        {/* Meta marker */}
        {showMeta && meta && meta > 0 && (
          <circle
            cx={metaX}
            cy={metaY}
            r={config.stroke * 0.8}
            fill="white"
            stroke="#A3ADAC"
            strokeWidth={1.5}
          />
        )}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-heading font-extrabold tabular-nums', config.fontSize)} style={{ color: scoreColor }}>
          {Math.round(score)}%
        </span>
        {showMeta && meta !== undefined && size !== 'sm' && (
          <span className={cn('text-gray-400 font-medium', config.metaSize)}>
            Meta: {meta}%
          </span>
        )}
      </div>
    </div>
  )
}
