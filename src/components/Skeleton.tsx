export function SkeletonCard({ height = 'h-32' }: { height?: string }) {
  return (
    <div className={`card ${height} animate-pulse`}>
      <div className="h-3 bg-cyber-border rounded w-1/3 mb-3" />
      <div className="h-6 bg-cyber-border rounded w-1/2 mb-2" />
      <div className="h-3 bg-cyber-border rounded w-2/3" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="card animate-pulse flex items-center gap-4">
      <div className="h-4 bg-cyber-border rounded flex-1" />
      <div className="h-4 bg-cyber-border rounded w-16" />
      <div className="h-4 bg-cyber-border rounded w-12" />
    </div>
  )
}

export function SkeletonChart({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`card ${height} animate-pulse flex flex-col gap-3`}>
      <div className="h-4 bg-cyber-border rounded w-1/3" />
      <div className="flex-1 bg-cyber-border/50 rounded" />
    </div>
  )
}
