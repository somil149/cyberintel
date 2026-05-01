'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  labels: string[]
  data: number[]
  title?: string
  height?: number
}

const COLORS = ['#00d4ff', '#a855f7', '#f97316', '#22c55e', '#ef4444', '#eab308', '#ec4899', '#14b8a6']

export default function DoughnutChart({ labels, data, title, height = 260 }: Props) {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: COLORS.map(c => c + 'cc'),
      borderColor: COLORS,
      borderWidth: 1,
      hoverOffset: 6,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#9ca3af', font: { size: 10 }, boxWidth: 12 } },
      title: title ? { display: true, text: title, color: '#e5e7eb', font: { size: 13 } } : undefined,
      tooltip: { backgroundColor: '#111827', borderColor: '#1f2937', borderWidth: 1 },
    },
    cutout: '65%',
  }

  return <div style={{ height }}><Doughnut data={chartData} options={options as any} /></div>
}
