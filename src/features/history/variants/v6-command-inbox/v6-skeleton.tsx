export function V6Skeleton() {
  return (
    <div className="space-y-3">
      <div className="h-14 rounded-xl bg-gray-950 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
        <div className="h-[600px] bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    </div>
  )
}
