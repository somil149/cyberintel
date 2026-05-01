import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { LineChart } from '@/components/Charts'
import { BarChart } from '@/components/Charts'
import { DoughnutChart } from '@/components/Charts'
import { loadInsights } from '@/lib/data'
import type { Insights } from '@/types'

export default function Trends() {
  const [insights, setInsights] = useState<Insights | null>(null)

  useEffect(() => { loadInsights().then(setInsights) }, [])

  if (!insights) return <Layout title="Trends"><div className="text-gray-500 text-center py-20">Loading...</div></Layout>

  const years = Object.keys(insights.severity_trend).sort()
  const criticalData = years.map(y => insights.severity_trend[y].critical)
  const highData = years.map(y => insights.severity_trend[y].high)
  const totalData = years.map(y => insights.severity_trend[y].total)
  const avgScoreData = years.map(y => insights.severity_trend[y].avg_score)
  const kevData = years.map(y => insights.severity_trend[y].kev_count)

  const attackYears = Object.keys(insights.yearly_attacks).sort()
  const attackData = attackYears.map(y => insights.yearly_attacks[y])

  const tteYears = Object.keys(insights.time_to_exploit_trend).sort()
  const tteData = tteYears.map(y => insights.time_to_exploit_trend[y])

  const finYears = Object.keys(insights.financial_impact_by_year).sort()
  const finData = finYears.map(y => insights.financial_impact_by_year[y] / 1e9)

  return (
    <Layout title="Trends Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Trends Dashboard</h1>
        <p className="text-gray-400 text-sm">20-year evolution of cybersecurity threats, vulnerabilities, and financial impact.</p>
      </div>

      {/* CVE Severity Trend */}
      <div className="card mb-6">
        <h2 className="section-title">📊 CVE Volume by Severity (2005–2024)</h2>
        <BarChart
          labels={years}
          datasets={[
            { label: 'Critical', data: criticalData, color: '#ef4444' },
            { label: 'High', data: highData, color: '#f97316' },
          ]}
          stacked
          height={300}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Avg CVSS score trend */}
        <div className="card">
          <h2 className="section-title">📈 Average CVSS Score Trend</h2>
          <LineChart
            labels={years}
            datasets={[{ label: 'Avg CVSS Score', data: avgScoreData, color: '#00d4ff', fill: true }]}
            height={240}
          />
        </div>

        {/* KEV count trend */}
        <div className="card">
          <h2 className="section-title">🔴 Known Exploited Vulnerabilities (KEV)</h2>
          <BarChart
            labels={years}
            datasets={[{ label: 'KEV Count', data: kevData, color: '#a855f7' }]}
            height={240}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Attack volume */}
        <div className="card">
          <h2 className="section-title">⚡ Reported Incidents per Year</h2>
          <LineChart
            labels={attackYears}
            datasets={[{ label: 'Incidents', data: attackData, color: '#f97316', fill: true }]}
            height={240}
          />
        </div>

        {/* Time to exploit */}
        <div className="card">
          <h2 className="section-title">⏱ Time-to-Exploit Trend (days)</h2>
          <LineChart
            labels={tteYears}
            datasets={[{ label: 'Days to Exploit', data: tteData, color: '#ef4444', fill: true }]}
            height={240}
          />
          <p className="text-xs text-gray-500 mt-2">
            Average days from CVE disclosure to active exploitation. Dropped from 45 days (2015) to 1 day (2024).
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Financial impact */}
        <div className="card">
          <h2 className="section-title">💰 Global Financial Impact ($B/year)</h2>
          <BarChart
            labels={finYears}
            datasets={[{ label: 'Damage ($B)', data: finData, color: '#ef4444' }]}
            height={240}
          />
        </div>

        {/* Attack type distribution */}
        <div className="card">
          <h2 className="section-title">🎯 Attack Type Distribution</h2>
          <DoughnutChart
            labels={Object.keys(insights.attack_type_distribution)}
            data={Object.values(insights.attack_type_distribution)}
            height={240}
          />
        </div>
      </div>

      {/* Industry risk comparison */}
      <div className="card mb-6">
        <h2 className="section-title">🏭 Industry Risk Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cyber-border text-gray-500 uppercase tracking-wider">
                <th className="text-left py-2 pr-4">Industry</th>
                <th className="text-right py-2 px-4">Incidents</th>
                <th className="text-right py-2 px-4">Avg Risk</th>
                <th className="text-right py-2 px-4">Records Exposed</th>
                <th className="text-left py-2 pl-4">Risk Bar</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(insights.industry_impact)
                .sort((a, b) => b[1].avg_risk - a[1].avg_risk)
                .map(([industry, data]) => (
                  <tr key={industry} className="border-b border-cyber-border/50 hover:bg-cyber-border/20">
                    <td className="py-2 pr-4 text-gray-300 font-medium">{industry}</td>
                    <td className="text-right py-2 px-4 text-gray-400">{data.incidents}</td>
                    <td className="text-right py-2 px-4">
                      <span className={data.avg_risk >= 85 ? 'text-red-400' : data.avg_risk >= 75 ? 'text-orange-400' : 'text-yellow-400'}>
                        {data.avg_risk}
                      </span>
                    </td>
                    <td className="text-right py-2 px-4 text-gray-400">
                      {data.total_records > 0 ? (data.total_records / 1e6).toFixed(0) + 'M' : 'N/A'}
                    </td>
                    <td className="py-2 pl-4">
                      <div className="h-1.5 bg-cyber-border rounded-full w-32 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${data.avg_risk}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictions */}
      <div className="card">
        <h2 className="section-title">🔮 Trend Predictions (Statistical Model)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(insights.predictions).map(([year, pred]) => (
            <div key={year} className="bg-cyber-bg border border-cyber-border rounded-lg p-4">
              <div className="text-cyber-accent font-bold text-lg mb-2">{year}</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Incidents</span>
                  <span className="text-white font-bold">{pred.estimated_attacks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated CVEs</span>
                  <span className="text-white font-bold">{pred.estimated_cves.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Top Attack Vector</span>
                  <span className="text-orange-400 font-bold">{pred.top_vector}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          * Predictions based on linear regression of 2015–2024 trend data. For planning purposes only.
        </p>
      </div>
    </Layout>
  )
}
