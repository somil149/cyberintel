interface Props { score: number; size?: 'sm' | 'md' }

export default function RiskMeter({ score, size = 'md' }: Props) {
  const color = score >= 90 ? '#ef4444' : score >= 70 ? '#f97316' : score >= 50 ? '#eab308' : '#22c55e'
  const r = size === 'sm' ? 18 : 28
  const stroke = size === 'sm' ? 4 : 5
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <svg width={r * 2 + stroke * 2} height={r * 2 + stroke * 2}>
        <circle cx={r + stroke} cy={r + stroke} r={r} fill="none" stroke="#1f2937" strokeWidth={stroke} />
        <circle
          cx={r + stroke} cy={r + stroke} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${r + stroke} ${r + stroke})`}
        />
        <text x={r + stroke} y={r + stroke + (size === 'sm' ? 4 : 5)} textAnchor="middle"
          fill={color} fontSize={size === 'sm' ? 9 : 11} fontWeight="bold">
          {score}
        </text>
      </svg>
    </div>
  )
}
