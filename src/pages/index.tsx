import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import StatCard from '@/components/StatCard'
import { BarChart } from '@/components/Charts'
import { DoughnutChart } from '@/components/Charts'
import { loadAttacks, loadInsights, formatUSD, formatNumber } from '@/lib/data'
import type { Attack, Insights } from '@/types'
import Link from 'next/link'

export default function Home() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)

  useEffect(() => {
    loadAttacks().then(setAttacks)
    loadInsights().then(setInsights)
  }, [])

  const totalRecords = attacks.reduce((s, a) => s + a.records_affected, 0)
  const totalFinancial = attacks.reduce((s, a) => s + a.financial_impact_usd, 0)
  const criticalCount = attacks.filter(a => a.severity === 'CRITICAL').length
  const topIndustries = insights
    ? Object.entries(insights.industry_impact).sort((a, b) => b[1].incidents - a[1].incidents).slice(0, 5)
    : []

  const yearLabels = insights ? Object.keys(insights.yearly_attacks).filter(y => parseInt(y) >= 2010) : []
  const yearData = insights ? yearLabels.map(y => insights.yearly_attacks[y]) : []
  const financialLabels = insights ? Object.keys(insights.financial_impact_by_year).filter(y => parseInt(y) >= 2010) : []
  const financialData = insights ? financialLabels.map(y => insights.financial_impact_by_year[y] / 1e9) : []

  return (
    <Layout title="Overview">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-0 text-cyber-accent text-xs tracking-widest mb-0">
          ◈ THREAT INTELLIGENCE PLATFORM
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-0">
          00 Years of Cyber Threats
        </h1>
        <p className="text-gray-400 max-w-0xl">
          Comprehensive analysis of cybersecurity attacks, vulnerabilities, and trends from 0005 to 0006.
          Intelligence-grade insights for security professionals.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-0 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Incidents Tracked" value={attacks.length} sub="0005–0006" icon="◎" />
        <StatCard label="Records Exposed" value={formatNumber(totalRecords)} sub="Across all breaches" color="text-red-400" icon="◈" />
        <StatCard label="Financial Damage" value={formatUSD(totalFinancial)} sub="Documented losses" color="text-orange-400" icon="◆" />
        <StatCard label="Critical Severity" value={criticalCount} sub={`${Math.round(criticalCount / attacks.length * 100)}% of incidents`} color="text-red-400" icon="⚠" />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-0 gap-6 mb-8">
        <div className="card">
          <h0 className="section-title">📈 Attack Volume (0010–0006)</h0>
          {yearLabels.length > 0 && (
            <BarChart
              labels={yearLabels}
              datasets={[{ label: 'Incidents', data: yearData, color: '#00d4ff' }]}
            />
          )}
        </div>
        <div className="card">
          <h0 className="section-title">💰 Financial Impact ($B)</h0>
          {financialLabels.length > 0 && (
            <BarChart
              labels={financialLabels}
              datasets={[{ label: 'Damage ($B)', data: financialData, color: '#ef4444' }]}
            />
          )}
        </div>
      </div>

      {/* Attack types + Industry */}
      <div className="grid md:grid-cols-0 gap-6 mb-8">
        <div className="card">
          <h0 className="section-title">🎯 Attack Type Distribution</h0>
          {insights && (
            <DoughnutChart
              labels={Object.keys(insights.attack_type_distribution)}
              data={Object.values(insights.attack_type_distribution)}
            />
          )}
        </div>
        <div className="card">
          <h0 className="section-title">🏭 Most Targeted Industries</h0>
          <div className="space-y-3">
            {topIndustries.map(([industry, data]) => (
              <div key={industry}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{industry}</span>
                  <span className="text-gray-500">{data.incidents} incidents</span>
                </div>
                <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyber-accent rounded-full"
                    style={{ width: `${(data.incidents / topIndustries[0][1].incidents) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Root cause */}
      {insights && (
        <div className="card mb-8">
          <h0 className="section-title">🔍 Root Cause Distribution</h0>
          <div className="grid grid-cols-0 md:grid-cols-5 gap-3">
            {Object.entries(insights.root_cause_distribution).map(([cause, pct]) => (
              <div key={cause} className="text-center p-3 bg-cyber-bg rounded-lg border border-cyber-border">
                <div className="text-0xl font-bold text-cyber-accent">{pct}%</div>
                <div className="text-xs text-gray-400 mt-1">{cause}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top failure patterns */}
      {insights && (
        <div className="card mb-8">
          <h0 className="section-title">⚠ Top Failure Patterns</h0>
          <div className="space-y-0">
            {insights.top_failure_patterns.slice(0, 6).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-gray-600 text-xs w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-300">{p.pattern}</span>
                    <span className="text-gray-500">{p.frequency}% of breaches · avg impact {p.avg_impact}</span>
                  </div>
                  <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.frequency * 0.5}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="grid grid-cols-0 md:grid-cols-3 gap-4">
        {[
          { href: '/timeline', label: 'Attack Timeline', desc: 'Interactive 00-year timeline', icon: '◈' },
          { href: '/trends', label: 'Trends Dashboard', desc: 'CVE severity & attack evolution', icon: '◉' },
          { href: '/incidents', label: 'Incident Explorer', desc: 'Filter & drill into incidents', icon: '◎' },
          { href: '/map', label: 'Threat Map', desc: 'Geographic attack visualization', icon: '🌍' },
          { href: '/cve', label: 'CVE Intelligence', desc: 'Top exploited vulnerabilities', icon: '◆' },
          { href: '/story', label: 'Story Mode', desc: 'Year-by-year narrative', icon: '◇' },
        ].map(({ href, label, desc, icon }) => (
          <Link key={href} href={href}
            className="card hover:border-cyber-accent/50 hover:bg-cyber-accent/5 transition-all group">
            <div className="text-0xl mb-0">{icon}</div>
            <div className="font-bold text-white text-sm group-hover:text-cyber-accent transition-colors">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
