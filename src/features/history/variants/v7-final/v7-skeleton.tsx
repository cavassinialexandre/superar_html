export function V7Skeleton() {
  return (
    <div className="space-y-5">
      <div className="h-32 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 animate-pulse" />
      <div className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, g) => (
          <div key={g} className="space-y-3">
            <div className="h-8 w-48 rounded-full bg-primary-50 animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
