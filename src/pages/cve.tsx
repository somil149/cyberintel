import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import SeverityBadge from '@/components/SeverityBadge'
import RiskMeter from '@/components/RiskMeter'
import { BarChart } from '@/components/Charts'
import { LineChart } from '@/components/Charts'
import { loadCVEs, loadInsights } from '@/lib/data'
import type { CVE, Insights } from '@/types'

export default function CVEPage() {
  const [cves, setCVEs] = useState<CVE[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState<string>('')
  const [severityFilter, setSeverityFilter] = useState<string>('')
  const [kevOnly, setKevOnly] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadCVEs().then(setCVEs)
    loadInsights().then(setInsights)
  }, [])

  const filtered = useMemo(() => {
    let out = cves
    if (search) {
      const q = search.toLowerCase()
      out = out.filter(c => c.id.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.vendor?.toLowerCase().includes(q))
    }
    if (yearFilter) out = out.filter(c => c.year === yearFilter)
    if (severityFilter) out = out.filter(c => c.severity === severityFilter)
    if (kevOnly) out = out.filter(c => c.in_kev)
    return out.sort((a, b) => b.risk_score - a.risk_score)
  }, [cves, search, yearFilter, severityFilter, kevOnly])

  const years = useMemo(() => Array.from(new Set(cves.map(c => c.year))).sort().reverse(), [cves])

  // Chart data from insights
  const trendYears = insights ? Object.keys(insights.severity_trend).sort() : []
  const avgScores = trendYears.map(y => insights!.severity_trend[y].avg_score)
  const criticalCounts = trendYears.map(y => insights!.severity_trend[y].critical)

  return (
    <Layout title="CVE Intelligence">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">CVE Intelligence Module</h1>
        <p className="text-gray-400 text-sm">Top exploited vulnerabilities, CVSS trends, and exploit availability tracking.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Total CVEs</div>
          <div className="text-2xl font-bold text-cyber-accent">{cves.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 uppercase tracking-wider">In CISA KEV</div>
          <div className="text-2xl font-bold text-red-400">{cves.filter(c => c.in_kev).length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Critical Severity</div>
          <div className="text-2xl font-bold text-orange-400">{cves.filter(c => c.severity === 'CRITICAL').length}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Ransomware-Linked</div>
          <div className="text-2xl font-bold text-purple-400">{cves.filter(c => c.ransomware_use === 'Known').length}</div>
        </div>
      </div>

      {/* Charts */}
      {insights && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h2 className="section-title">📈 CVSS Score Trend (2005–2026)</h2>
            <LineChart
              labels={trendYears}
              datasets={[{ label: 'Avg CVSS', data: avgScores, color: '#00d4ff', fill: true }]}
              height={220}
            />
          </div>
          <div className="card">
            <h2 className="section-title">🔴 Critical CVEs per Year (2005�2026)</h2>
            <BarChart
              labels={trendYears}
              datasets={[{ label: 'Critical CVEs', data: criticalCounts, color: '#ef4444' }]}
              height={220}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search CVE ID, vendor, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-cyber-bg border border-cyber-border rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-accent"
          />
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
            className="bg-cyber-bg border border-cyber-border rounded px-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-cyber-accent">
            <option value="">All Severities</option>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={kevOnly} onChange={e => setKevOnly(e.target.checked)}
              className="accent-cyber-accent" />
            KEV Only
          </label>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Showing <span className="text-white font-bold">{filtered.length}</span> CVEs
        </div>
      </div>

      {/* CVE Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-bg text-gray-500 uppercase tracking-wider">
                <th className="text-left py-3 px-4">CVE ID</th>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-center py-3 px-4">CVSS</th>
                <th className="text-center py-3 px-4">Severity</th>
                <th className="text-center py-3 px-4">KEV</th>
                <th className="text-center py-3 px-4">Ransomware</th>
                <th className="text-center py-3 px-4">Risk</th>
                <th className="text-left py-3 px-4">Year</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <>
                  <tr
                    key={c.id}
                    className="border-b border-cyber-border/50 hover:bg-cyber-border/20 cursor-pointer"
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  >
                    <td className="py-2.5 px-4 font-mono text-cyber-accent">{c.id}</td>
                    <td className="py-2.5 px-4 text-gray-300">{c.vendor} {c.product}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={c.score >= 9 ? 'text-red-400 font-bold' : c.score >= 7 ? 'text-orange-400' : 'text-yellow-400'}>
                        {c.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center"><SeverityBadge severity={c.severity} /></td>
                    <td className="py-2.5 px-4 text-center">
                      {c.in_kev ? <span className="text-red-400">●</span> : <span className="text-gray-700">○</span>}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {c.ransomware_use === 'Known'
                        ? <span className="text-purple-400">●</span>
                        : <span className="text-gray-700">○</span>}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <RiskMeter score={c.risk_score} size="sm" />
                    </td>
                    <td className="py-2.5 px-4 text-gray-500">{c.year}</td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`${c.id}-detail`} className="bg-cyber-bg/50">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="text-gray-300 mb-2">{c.description}</div>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Published: {c.published}</span>
                          <span>Vector: {c.attack_vector}</span>
                          {c.in_kev && <span className="text-red-400">⚠ In CISA KEV — actively exploited</span>}
                          {c.ransomware_use === 'Known' && <span className="text-purple-400">⚠ Used in ransomware campaigns</span>}
                        </div>
                        <a
                          href={`https://nvd.nist.gov/vuln/detail/${c.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-cyber-accent hover:underline mt-1 inline-block"
                        >
                          View on NVD →
                        </a>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
