export function V3Skeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 h-72 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="col-span-12 lg:col-span-4 h-72 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 h-96 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="col-span-12 lg:col-span-4 h-96 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
      <div className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
      <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
    </div>
  )
}
