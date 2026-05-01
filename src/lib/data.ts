import type { Attack, CVE, StoryEntry, Insights } from '@/types'

const base = process.env.NEXT_PUBLIC_BASE_PATH || ''

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

export const loadAttacks = () => fetchJSON<Attack[]>('/data/attacks.json')
export const loadCVEs = () => fetchJSON<CVE[]>('/data/cves.json')
export const loadStory = () => fetchJSON<StoryEntry[]>('/data/story.json')
export const loadInsights = () => fetchJSON<Insights>('/data/insights.json')

export const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
}

export const SEVERITY_BG: Record<string, string> = {
  CRITICAL: 'bg-red-900/40 text-red-400 border-red-800',
  HIGH: 'bg-orange-900/40 text-orange-400 border-orange-800',
  MEDIUM: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  LOW: 'bg-green-900/40 text-green-400 border-green-800',
}

export function formatNumber(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toString()
}

export function formatUSD(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n}`
}
