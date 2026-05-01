import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  datasets: { label: string; data: number[]; color?: string }[]
  title?: string
  height?: number
  stacked?: boolean
}

const COLORS = ['#00d4ff', '#a855f7', '#f97316', '#22c55e', '#ef4444', '#eab308']

export default function BarChart({ labels, datasets, title, height = 280, stacked = false }: Props) {
  const data = {
    labels,
    datasets: datasets.map((d, i) => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.color || COLORS[i % COLORS.length] + '99',
      borderColor: d.color || COLORS[i % COLORS.length],
      borderWidth: 1,
      borderRadius: 3,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af', font: { size: 11 } } },
      title: title ? { display: true, text: title, color: '#e5e7eb', font: { size: 13 } } : undefined,
      tooltip: { backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1 },
    },
    scales: {
      x: { stacked, ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#1f2937' } },
      y: { stacked, ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#1f2937' } },
    },
  }

  return <div style={{ height }}><Bar data={data} options={options as any} /></div>
}
