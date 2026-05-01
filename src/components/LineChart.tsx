'use client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  labels: string[]
  datasets: { label: string; data: number[]; color?: string; fill?: boolean }[]
  title?: string
  height?: number
}

const COLORS = ['#00d4ff', '#a855f7', '#f97316', '#22c55e', '#ef4444']

export default function LineChart({ labels, datasets, title, height = 280 }: Props) {
  const data = {
    labels,
    datasets: datasets.map((d, i) => {
      const c = d.color || COLORS[i % COLORS.length]
      return {
        label: d.label,
        data: d.data,
        borderColor: c,
        backgroundColor: d.fill ? c + '22' : 'transparent',
        fill: d.fill || false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      }
    }),
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
      x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#1f2937' } },
      y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: '#1f2937' } },
    },
  }

  return <div style={{ height }}><Line data={data} options={options as any} /></div>
}
