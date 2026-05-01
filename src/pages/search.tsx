import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import SeverityBadge from '@/components/SeverityBadge'
import { loadAttacks, loadCVEs } from '@/lib/data'
import type { Attack, CVE } from '@/types'
import Link from 'next/link'

type Result =
  | { kind: 'incident'; item: Attack }
  | { kind: 'cve'; item: CVE }

export default function Search() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [cves, setCVEs] = useState<CVE[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'incidents' | 'cves' | 'actors'>('all')

  useEffect(() => {
    loadAttacks().then(setAttacks)
    loadCVEs().then(setCVEs)
  }, [])

  const results = useMemo((): Result[] => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const out: Result[] = []

    if (filter === 'all' || filter === 'incidents') {
      attacks.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.actor.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.target_industry.toLowerCase().includes(q) ||
        a.mitre_techniques.some(t => t.toLowerCase().includes(q)) ||
        String(a.year).includes(q)
      ).forEach(a => out.push({ kind: 'incident', item: a }))
    }

    if (filter === 'all' || filter === 'cves') {
      cves.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.vendor?.toLowerCase().includes(q) ||
        c.product?.toLowerCase().includes(q)
      ).forEach(c => out.push({ kind: 'cve', item: c }))
    }

    if (filter === 'all' || filter === 'actors') {
      const actorMatches = new Set<string>()
      attacks.filter(a => a.actor.toLowerCase().includes(q)).forEach(a => {
        if (!actorMatches.has(a.actor)) {
          actorMatches.add(a.actor)
          out.push({ kind: 'incident', item: a })
        }
      })
    }

    return out.slice(0, 50)
  }, [query, filter, attacks, cves])

  const counts = useMemo(() => ({
    incidents: results.filter(r => r.kind === 'incident').length,
    cves: results.filter(r => r.kind === 'cve').length,
  }), [results])

  return (
    <Layout title="Search">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Global Search</h1>
        <p className="text-gray-400 text-sm">Search across all incidents, CVEs, threat actors, and techniques.</p>
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
        <input
          autoFocus
          type="text"
          placeholder="Search incidents, CVEs, actors, techniques, industries..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-cyber-surface border border-cyber-border rounded-xl pl-12 pr-4 py-4 text-white text-base placeholder-gray-600 focus:outline-none focus:border-cyber-accent transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">✕</button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'incidents', 'cves', 'actors'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn text-xs capitalize ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
            {f}
          </button>
        ))}
        {query && results.length > 0 && (
          <span className="text-xs text-gray-500 self-center ml-2">
            {results.length} result{results.length > 1 ? 's' : ''}
            {counts.incidents > 0 && ` · ${counts.incidents} incidents`}
            {counts.cves > 0 && ` · ${counts.cves} CVEs`}
          </span>
        )}
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-gray-400 text-lg mb-2">Search the threat intelligence database</div>
          <div className="text-gray-600 text-sm">Try: "ransomware", "Log4Shell", "Lazarus", "T1566", "healthcare"</div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['WannaCry', 'Log4Shell', 'Lazarus Group', 'T1078', 'Supply Chain', 'Healthcare'].map(s => (
              <button key={s} onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-full border border-cyber-border text-gray-400 text-xs hover:border-cyber-accent hover:text-cyber-accent transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No results for "<span className="text-white">{query}</span>"
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((r, i) => {
            if (r.kind === 'incident') {
              const a = r.item
              return (
                <Link key={`inc-${i}`} href="/incidents"
                  className="card flex items-start gap-4 hover:border-gray-600 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="badge bg-blue-900/40 text-blue-400 border border-blue-800 text-[10px]">INCIDENT</span>
                      <span className="text-xs text-gray-500 font-mono">{a.date}</span>
                      <SeverityBadge severity={a.severity} />
                    </div>
                    <div className="font-bold text-white group-hover:text-cyber-accent transition-colors">{a.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.description}</div>
                    <div className="flex gap-3 mt-1 text-xs text-gray-600">
                      <span>{a.actor}</span>
                      <span>·</span>
                      <span>{a.target_industry}</span>
                      <span>·</span>
                      <span>{a.type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-cyber-accent font-bold font-mono">{a.risk_score}</div>
                    <div className="text-gray-600 text-[10px]">risk</div>
                  </div>
                </Link>
              )
            } else {
              const c = r.item
              return (
                <Link key={`cve-${i}`} href="/cve"
                  className="card flex items-start gap-4 hover:border-gray-600 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="badge bg-purple-900/40 text-purple-400 border border-purple-800 text-[10px]">CVE</span>
                      <span className="font-mono text-cyber-accent text-sm font-bold">{c.id}</span>
                      <SeverityBadge severity={c.severity} />
                      {c.in_kev && <span className="badge bg-red-900/40 text-red-400 border border-red-800 text-[10px]">KEV</span>}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-2">{c.description}</div>
                    <div className="flex gap-3 mt-1 text-xs text-gray-600">
                      <span>{c.vendor} {c.product}</span>
                      <span>·</span>
                      <span>CVSS {c.score}</span>
                      <span>·</span>
                      <span>{c.year}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-cyber-accent font-bold font-mono">{c.risk_score}</div>
                    <div className="text-gray-600 text-[10px]">risk</div>
                  </div>
                </Link>
              )
            }
          })}
        </div>
      )}
    </Layout>
  )
}
