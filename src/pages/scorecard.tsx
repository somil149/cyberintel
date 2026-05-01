import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import { BarChart } from '@/components/Charts'
import { loadAttacks, loadInsights } from '@/lib/data'
import type { Attack, Insights } from '@/types'

const SECTOR_ICON: Record<string, string> = {
  Healthcare: '🏥', Finance: '🏦', Government: '🏛️', Technology: '💻',
  Retail: '🛒', Energy: '⚡', Education: '🎓', Manufacturing: '🏭',
  Hospitality: '🏨', Transportation: '✈️', Telecom: '📡', Entertainment: '🎬',
}

const SECTOR_TREND: Record<string, { direction: '↑' | '↓' | '→'; change: number }> = {
  Healthcare:    { direction: '↑', change: 12 },
  Finance:       { direction: '↑', change: 8 },
  Government:    { direction: '↑', change: 15 },
  Technology:    { direction: '↑', change: 6 },
  Retail:        { direction: '↑', change: 22 },
  Energy:        { direction: '→', change: 2 },
  Education:     { direction: '↑', change: 18 },
  Manufacturing: { direction: '↑', change: 9 },
  Hospitality:   { direction: '↑', change: 31 },
  Entertainment: { direction: '↓', change: 5 },
}

const SECTOR_RECOMMENDATIONS: Record<string, string[]> = {
  Healthcare: ['Enforce MFA on all EHR and clinical systems', 'Segment OT/medical devices from IT network', 'Implement offline backup for critical patient data'],
  Finance: ['Deploy SWIFT security controls and anomaly detection', 'Enforce FIDO2 MFA on all trading and banking systems', 'Continuous third-party vendor risk assessment'],
  Government: ['Zero-trust architecture for all remote access', 'Mandatory cybersecurity standards for critical infrastructure', 'Regular threat hunting and red team exercises'],
  Technology: ['SBOM for all software products and dependencies', 'Secure CI/CD pipeline with signed artifacts', 'Developer security training and secrets management'],
  Retail: ['PCI-DSS compliance with network segmentation', 'Rigorous third-party vendor access controls', 'Phishing-resistant MFA for all helpdesk staff'],
  Energy: ['Air-gap critical ICS/SCADA systems', 'OT-specific threat detection and monitoring', 'Supply chain security for industrial components'],
  Education: ['MFA on all student information systems', 'Data minimization — collect only necessary PII', 'Regular security awareness training for staff'],
  Manufacturing: ['OT/IT network segmentation', 'Patch management for industrial control systems', 'Supply chain integrity verification'],
  Hospitality: ['FIDO2 MFA for all identity providers', 'Rigorous helpdesk identity verification procedures', 'Guest data encryption at rest and in transit'],
  Entertainment: ['Code signing for all software releases', 'Insider threat program for IP protection', 'Secure content delivery and DRM systems'],
}

export default function Scorecard() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    loadAttacks().then(setAttacks)
    loadInsights().then(setInsights)
  }, [])

  const sectorData = useMemo(() => {
    const groups: Record<string, Attack[]> = {}
    for (const a of attacks) {
      // normalize multi-industry entries
      const industries = a.target_industry.split('/')
      for (const ind of industries) {
        const key = ind.trim()
        if (!groups[key]) groups[key] = []
        groups[key].push(a)
      }
    }

    return Object.entries(groups).map(([sector, incidents]) => {
      const avgRisk = Math.round(incidents.reduce((s, a) => s + a.risk_score, 0) / incidents.length)
      const criticalCount = incidents.filter(a => a.severity === 'CRITICAL').length
      const totalRecords = incidents.reduce((s, a) => s + a.records_affected, 0)
      const topAttackType = Object.entries(
        incidents.reduce<Record<string, number>>((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'
      const insightData = insights?.industry_impact[sector]
      return {
        sector,
        incidents: incidents.length,
        avgRisk,
        criticalCount,
        totalRecords,
        topAttackType,
        insightIncidents: insightData?.incidents || incidents.length,
        trend: SECTOR_TREND[sector] || { direction: '→' as const, change: 0 },
      }
    }).sort((a, b) => b.avgRisk - a.avgRisk)
  }, [attacks, insights])

  const getRiskLabel = (score: number) => {
    if (score >= 90) return { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-900/20 border-red-800' }
    if (score >= 75) return { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-800' }
    if (score >= 60) return { label: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800' }
    return { label: 'LOW', color: 'text-green-400', bg: 'bg-green-900/20 border-green-800' }
  }

  const selectedData = sectorData.find(s => s.sector === selected)
  const selectedIncidents = useMemo(() => {
    if (!selected) return []
    return attacks.filter(a => a.target_industry.includes(selected))
      .sort((a, b) => b.risk_score - a.risk_score)
  }, [attacks, selected])

  // Chart data
  const chartSectors = sectorData.slice(0, 8)

  return (
    <Layout title="Sector Risk Scorecard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Sector Risk Scorecard</h1>
        <p className="text-gray-400 text-sm">
          Per-industry risk scores based on incident history, severity, and attack frequency. Click a sector for details.
        </p>
      </div>

      {/* Bar chart overview */}
      {sectorData.length > 0 && (
        <div className="card mb-6">
          <h2 className="section-title">📊 Average Risk Score by Sector</h2>
          <BarChart
            labels={chartSectors.map(s => s.sector)}
            datasets={[{
              label: 'Avg Risk Score',
              data: chartSectors.map(s => s.avgRisk),
              color: '#ef4444',
            }]}
            height={240}
          />
        </div>
      )}

      {/* Scorecard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {sectorData.map(({ sector, incidents, avgRisk, criticalCount, topAttackType, trend }) => {
          const risk = getRiskLabel(avgRisk)
          const isSelected = selected === sector
          return (
            <div
              key={sector}
              onClick={() => setSelected(isSelected ? null : sector)}
              className={`card cursor-pointer transition-all hover:border-gray-600 ${isSelected ? 'border-cyber-accent/60' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SECTOR_ICON[sector] || '🏢'}</span>
                  <div>
                    <div className="font-bold text-white">{sector}</div>
                    <div className="text-xs text-gray-500">{incidents} incidents tracked</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${risk.color}`}>{avgRisk}</div>
                  <div className="text-xs text-gray-600">/100</div>
                </div>
              </div>

              {/* Risk bar */}
              <div className="h-2 bg-cyber-border rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${avgRisk}%`, backgroundColor: avgRisk >= 90 ? '#ef4444' : avgRisk >= 75 ? '#f97316' : '#eab308' }} />
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between text-xs">
                <span className={`badge border ${risk.bg} ${risk.color}`}>{risk.label}</span>
                <span className="text-gray-400">{criticalCount} critical</span>
                <span className="text-gray-400">Top: {topAttackType}</span>
                <span className={`font-bold ${trend.direction === '↑' ? 'text-red-400' : trend.direction === '↓' ? 'text-green-400' : 'text-gray-400'}`}>
                  {trend.direction}{trend.change}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sector detail */}
      {selected && selectedData && (
        <div className="card border-cyber-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{SECTOR_ICON[selected] || '🏢'}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{selected}</h2>
              <div className="text-sm text-gray-400">
                Risk Score: <span className={`font-bold ${getRiskLabel(selectedData.avgRisk).color}`}>{selectedData.avgRisk}/100</span>
                <span className={`ml-3 ${selectedData.trend.direction === '↑' ? 'text-red-400' : 'text-green-400'}`}>
                  {selectedData.trend.direction}{selectedData.trend.change}% YoY
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recommendations */}
            <div>
              <h3 className="text-sm font-bold text-cyber-accent mb-3">💡 Top Defensive Recommendations</h3>
              <ul className="space-y-2">
                {(SECTOR_RECOMMENDATIONS[selected] || ['Implement MFA', 'Regular security assessments', 'Incident response planning']).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-cyber-accent mt-0.5 shrink-0">▸</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top incidents */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">🔴 Highest-Risk Incidents</h3>
              <div className="space-y-2">
                {selectedIncidents.slice(0, 4).map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-mono w-10 shrink-0">{a.year}</span>
                    <span className="text-gray-300 flex-1 truncate">{a.name}</span>
                    <span className={`font-bold shrink-0 ${a.risk_score >= 90 ? 'text-red-400' : 'text-orange-400'}`}>{a.risk_score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
