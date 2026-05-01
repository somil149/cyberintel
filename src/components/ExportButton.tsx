import { exportToCSV } from '@/lib/export'

interface ExportButtonProps {
  data: any[]
  filename: string
  label?: string
}

export function ExportButton({ data, filename, label = 'Export CSV' }: ExportButtonProps) {
  return (
    <button
      onClick={() => exportToCSV(data, filename)}
      disabled={data.length === 0}
      className="px-3 py-1.5 rounded text-xs border border-cyber-border hover:border-green-500 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      📥 {label}
    </button>
  )
}
