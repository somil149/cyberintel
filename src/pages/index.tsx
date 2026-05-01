import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { BarChart, DoughnutChart } from '@/components/Charts'
import { SkeletonCard, SkeletonChart } from '@/components/Skeleton'
import { useCountUp } from '@/hooks/useCountUp'
import { loadAttacks, loadInsights, formatUSD, formatNumber } from '@/lib/data'
import type { Attack, Insights } from '@/types'
import Link from 'next/link'

function AnimatedStat({ label, value, formatted, sub, color = 'text-cyber-accent', icon }: {
  label: string; value: number; formatted: string; sub: string; color?: string; icon: string
}) {
  const count = useCountUp(value, 1400)
  // For large numbers, show formatted once animation completes
  const display = count >= value ? formatted : formatNumber(count)
  return (
    <div className="stat-card relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
        <span>{icon}</span>{label}
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{display}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  )
}

export default function Home() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadAttacks(), loadInsights()]).then(([a, i]) => {
      setAttacks(a); setInsights(i); setLoading(false)
    })
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
      <div className="relative mb-10 py-8 px-6 rounded-xl overflow-hidden border border-cyber-border">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, #00d4ff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg via-cyber-bg/80 to-transparent" />

        <div className="relative">
          <div className="flex items-center gap-2 text-cyber-accent text-xs tracking-widest mb-3 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
            LIVE THREAT INTELLIGENCE PLATFORM
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            21 Years of<br />
            <span className="text-cyber-accent">Cyber Threats</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
            Comprehensive analysis of cybersecurity attacks, vulnerabilities, and trends from 2005 to 2026.
            Intelligence-grade insights for security professionals.
          </p>
          {/* Freshness badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-800 bg-green-900/20 text-green-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Data current through May 2026 · {attacks.length} incidents · {insights?.total_cves_analyzed?.toLocaleString()} CVEs analyzed
          </div>
        </div>
      </div>

      {/* Key Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} height="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatedStat label="Incidents Tracked" value={attacks.length} formatted={String(attacks.length)} sub="2005–2026" icon="◎" />
          <AnimatedStat label="Records Exposed" value={totalRecords} formatted={formatNumber(totalRecords)} sub="Across all breaches" color="text-red-400" icon="◈" />
          <AnimatedStat label="Financial Damage" value={Math.round(totalFinancial / 1e9)} formatted={formatUSD(totalFinancial)} sub="Documented losses" color="text-orange-400" icon="◆" />
          <AnimatedStat label="Critical Severity" value={criticalCount} formatted={String(criticalCount)} sub={`${Math.round(criticalCount / attacks.length * 100)}% of incidents`} color="text-red-400" icon="⚠" />
        </div>
      )}

      {/* Charts row */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SkeletonChart /><SkeletonChart />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="section-title">📈 Attack Volume (2010–2026)</h2>
            {yearLabels.length > 0 && <BarChart labels={yearLabels} datasets={[{ label: 'Incidents', data: yearData, color: '#00d4ff' }]} />}
          </div>
          <div className="card">
            <h2 className="section-title">💰 Financial Impact ($B, 2010–2026)</h2>
            {financialLabels.length > 0 && <BarChart labels={financialLabels} datasets={[{ label: 'Damage ($B)', data: financialData, color: '#ef4444' }]} />}
          </div>
        </div>
      )}

      {/* Attack types + Industry */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SkeletonChart height="h-72" /><SkeletonChart height="h-72" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="section-title">🎯 Attack Type Distribution</h2>
            {insights && <DoughnutChart labels={Object.keys(insights.attack_type_distribution)} data={Object.values(insights.attack_type_distribution)} />}
          </div>
          <div className="card">
            <h2 className="section-title">🏭 Most Targeted Industries</h2>
            <div className="space-y-3">
              {topIndustries.map(([industry, data]) => (
                <div key={industry}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{industry}</span>
                    <span className="text-gray-500">{data.incidents} incidents</span>
                  </div>
                  <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                    <div className="h-full bg-cyber-accent rounded-full transition-all duration-700"
                      style={{ width: `${(data.incidents / topIndustries[0][1].incidents) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Root cause */}
      {!loading && insights && (
        <div className="card mb-8">
          <h2 className="section-title">🔍 Root Cause Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(insights.root_cause_distribution).map(([cause, pct]) => (
              <div key={cause} className="text-center p-3 bg-cyber-bg rounded-lg border border-cyber-border hover:border-cyber-accent/40 transition-colors">
                <div className="text-2xl font-bold text-cyber-accent font-mono">{pct}%</div>
                <div className="text-xs text-gray-400 mt-1">{cause}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top failure patterns */}
      {!loading && insights && (
        <div className="card mb-8">
          <h2 className="section-title">⚠ Top Failure Patterns</h2>
          <div className="space-y-2">
            {insights.top_failure_patterns.slice(0, 6).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-gray-600 text-xs w-4 font-mono">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-300">{p.pattern}</span>
                    <span className="text-gray-500">{p.frequency}% of breaches · avg impact {p.avg_impact}</span>
                  </div>
                  <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: `${p.frequency * 2.5}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { href: '/timeline', label: 'Attack Timeline', desc: 'Interactive 21-year timeline', icon: '◈' },
          { href: '/trends', label: 'Trends Dashboard', desc: 'CVE severity & attack evolution', icon: '◉' },
          { href: '/incidents', label: 'Incident Explorer', desc: 'Filter & drill into incidents', icon: '◎' },
          { href: '/mitre', label: 'ATT&CK Heatmap', desc: 'Technique frequency matrix', icon: '⬡' },
          { href: '/actors', label: 'Threat Actors', desc: 'Nation-state & criminal profiles', icon: '◈' },
          { href: '/scorecard', label: 'Sector Scorecard', desc: 'Industry risk comparison', icon: '◉' },
        ].map(({ href, label, desc, icon }) => (
          <Link key={href} href={href}
            className="card hover:border-cyber-accent/50 hover:bg-cyber-accent/5 transition-all group">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-bold text-white text-sm group-hover:text-cyber-accent transition-colors">{label}</div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
