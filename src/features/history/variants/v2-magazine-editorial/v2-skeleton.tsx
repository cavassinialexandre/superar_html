export function V2Skeleton() {
  return (
    <div className="rounded-3xl border border-[#E8DEC9] bg-[#FAF7F2] p-8 md:p-12 space-y-8">
      <div className="h-32 bg-[#E8DEC9] animate-pulse rounded" />
      <div className="h-px bg-[#D8C89A]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-[#E8DEC9] animate-pulse" />
        ))}
      </div>
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-[#E8DEC9]/60 animate-pulse rounded" />
        ))}
      </div>
    </div>
  )
}
