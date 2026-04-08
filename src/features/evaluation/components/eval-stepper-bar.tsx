/**
 * Horizontal stepper bar with glassmorphism card, connected step circles,
 * animated connecting lines, and staggered entrance animations.
 * Part of Variant E: "Stepper Wizard + Accordion".
 */

import { motion } from 'framer-motion'
import { stepperStagger, stepperCircleEntrance, stepperLineDraw } from '@/design-system/animations'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SectionInfo {
  title: string
  color: string
  colorDark: string
  answeredCount: number
  totalCount: number
  status: 'complete' | 'partial' | 'empty'
}

interface EvalStepperBarProps {
  sections: SectionInfo[]
  onStepClick: (index: number) => void
}

// ---------------------------------------------------------------------------
// Inline check icon (14px white)
// ---------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find the index of the first section that is not complete. */
function findFirstIncompleteIndex(sections: SectionInfo[]): number {
  const idx = sections.findIndex((s) => s.status !== 'complete')
  return idx === -1 ? -1 : idx
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvalStepperBar({ sections, onStepClick }: EvalStepperBarProps) {
  const firstIncomplete = findFirstIncompleteIndex(sections)

  return (
    <div
      className="rounded-2xl p-5 border border-white/60"
      style={{
        background: 'rgba(255,255,255,0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 32px rgba(30,122,115,0.08)',
      }}
    >
      <motion.div
        className="flex items-start justify-between"
        variants={stepperStagger}
        initial="initial"
        animate="animate"
      >
        {sections.map((section, index) => {
          const isComplete = section.status === 'complete'
          const isPartial = section.status === 'partial'
          const isFirstIncomplete = index === firstIncomplete
          const progress =
            section.totalCount > 0
              ? (section.answeredCount / section.totalCount) * 100
              : 0

          return (
            <motion.div
              key={index}
              variants={stepperCircleEntrance}
              className="flex items-start flex-1"
            >
              {/* Step circle + label column */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-105 focus:outline-none"
                  style={
                    isComplete
                      ? {
                          background: '#22c55e',
                          color: '#fff',
                          boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                        }
                      : isPartial
                        ? {
                            background: '#fff',
                            borderWidth: '2.5px',
                            borderStyle: 'solid',
                            borderColor: section.color,
                            color: section.color,
                          }
                        : {
                            background: '#f3f4f6',
                            color: '#9ca3af',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderColor: '#e5e7eb',
                          }
                  }
                >
                  {isComplete ? (
                    <CheckIcon />
                  ) : (
                    <span className="text-sm font-semibold tabular-nums">
                      {index + 1}
                    </span>
                  )}

                  {/* Pulsing ring for first incomplete */}
                  {isFirstIncomplete && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: `${section.color}66`,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </button>

                {/* Label */}
                <span className="text-[11px] font-medium text-gray-500 text-center mt-2 max-w-[80px] truncate">
                  {section.title}
                </span>

                {/* Counter */}
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {section.answeredCount}/{section.totalCount}
                </span>
              </div>

              {/* Connecting line (not after last) */}
              {index < sections.length - 1 && (
                <motion.div
                  variants={stepperLineDraw}
                  className="flex-1 h-0.5 mt-5 mx-2 bg-gray-200 rounded-full overflow-hidden relative"
                  style={{ originX: 0 }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{
                      background: `linear-gradient(90deg, ${section.color}, ${sections[index + 1].color})`,
                      borderRadius: 'inherit',
                    }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
