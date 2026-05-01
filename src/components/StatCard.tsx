interface Props {
  label: string
  value: string | number
  sub?: string
  color?: string
  icon?: string
}

export default function StatCard({ label, value, sub, color = 'text-cyber-accent', icon }: Props) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  )
}
