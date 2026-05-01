import dynamic from 'next/dynamic'

export const BarChart = dynamic(() => import('./BarChart'), { ssr: false })
export const LineChart = dynamic(() => import('./LineChart'), { ssr: false })
export const DoughnutChart = dynamic(() => import('./DoughnutChart'), { ssr: false })
