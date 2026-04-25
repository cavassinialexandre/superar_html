export function V1Skeleton() {
  return (
    <div className="space-y-5">
      <div className="h-48 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
      <div className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-full h-20 rounded-xl bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
