import { SEVERITY_BG } from '@/lib/data'

export default function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`badge border ${SEVERITY_BG[severity] || SEVERITY_BG.LOW}`}>
      {severity}
    </span>
  )
}
