interface DashboardTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
  suffix?: string
}

export function DashboardTooltip({ active, payload, label, suffix = '' }: DashboardTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 min-w-[140px]">
      {label && <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-gray-500 flex-1">{p.name}</span>
            <span className="text-sm font-bold text-gray-800 tabular-nums">
              {p.value}{suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
