export function V4Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
      <div className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-16 rounded-t-2xl bg-gray-100 animate-pulse" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
