import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import AttackCard from '@/components/AttackCard'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'

const YEARS = Array.from({ length: 21 }, (_, i) => 2025 - i)
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export default function Incidents() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [search, setSearch] = useState('')
  const [year, setYear] = useState<number | null>(null)
  const [severity, setSeverity] = useState<string | null>(null)
  const [industry, setIndustry] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)
  const [sort, setSort] = useState<'date' | 'risk' | 'impact'>('date')

  useEffect(() => { loadAttacks().then(setAttacks) }, [])

  const industries = useMemo(() => Array.from(new Set(attacks.map(a => a.target_industry))).sort(), [attacks])
  const types = useMemo(() => Array.from(new Set(attacks.map(a => a.type))).sort(), [attacks])

  const filtered = useMemo(() => {
    let out = attacks
    if (search) {
      const q = search.toLowerCase()
      out = out.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.actor.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      )
    }
    if (year) out = out.filter(a => a.year === year)
    if (severity) out = out.filter(a => a.severity === severity)
    if (industry) out = out.filter(a => a.target_industry === industry)
    if (type) out = out.filter(a => a.type === type)

    return out.sort((a, b) => {
      if (sort === 'risk') return b.risk_score - a.risk_score
      if (sort === 'impact') return b.impact_score - a.impact_score
      return b.date.localeCompare(a.date)
    })
  }, [attacks, search, year, severity, industry, type, sort])

  const clearFilters = () => {
    setSearch(''); setYear(null); setSeverity(null); setIndustry(null); setType(null)
  }

  const hasFilters = search || year || severity || industry || type

  return (
    <Layout title="Incident Explorer">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Incident Explorer</h1>
        <p className="text-gray-400 text-sm">Filter and drill into 30 major cybersecurity incidents with full root cause analysis.</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search incidents, actors, techniques..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-cyber-bg border border-cyber-border rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-accent"
          />
          <select value={sort} onChange={e => setSort(e.target.value as any)}
            className="bg-cyber-bg border border-cyber-border rounded px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="date">Sort: Date</option>
            <option value="risk">Sort: Risk Score</option>
            <option value="impact">Sort: Impact Score</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Year */}
          <select value={year || ''} onChange={e => setYear(e.target.value ? Number(e.target.value) : null)}
            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Severity */}
          <select value={severity || ''} onChange={e => setSeverity(e.target.value || null)}
            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="">All Severities</option>
            {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Industry */}
          <select value={industry || ''} onChange={e => setIndustry(e.target.value || null)}
            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="">All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          {/* Type */}
          <select value={type || ''} onChange={e => setType(e.target.value || null)}
            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost text-xs">✕ Clear</button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Showing <span className="text-white font-bold">{filtered.length}</span> of {attacks.length} incidents
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No incidents match your filters.</div>
        ) : (
          filtered.map(a => <AttackCard key={a.id} a={a} />)
        )}
      </div>
    </Layout>
  )
}
