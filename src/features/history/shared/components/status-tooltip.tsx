import type { ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { Evaluation } from '@/types'
import { resolveGoalPct } from '../utils/evaluation-adapter'

function getStatusLabel(ev: Evaluation): string {
  const goal = resolveGoalPct(ev) ?? 0
  if (ev.type === 'audit' && ev.advancedSequence === true) return 'Avançou de sequência'
  if (ev.score >= goal) return 'Acima da meta'
  return 'Abaixo da meta'
}

interface StatusTooltipProps {
  ev: Evaluation
  children: ReactNode
}

export function StatusTooltip({ ev, children }: StatusTooltipProps) {
  const label = getStatusLabel(ev)
  return (
    <RadixTooltip.Provider delayDuration={150} skipDelayDuration={300}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side="top"
            sideOffset={8}
            className="z-50 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
          >
            {label}
            <RadixTooltip.Arrow className="fill-gray-900" width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
