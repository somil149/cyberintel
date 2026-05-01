import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import AttackCard from '@/components/AttackCard'
import { BarChart, LineChart } from '@/components/Charts'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'

export default function Ransomware() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttacks().then(data => {
      const ransomware = data.filter(a => a.type === 'Ransomware' || a.type === 'Wiper/Ransomware')
      setAttacks(ransomware)
      setLoading(false)
    })
  }, [])

  const byYear = attacks.reduce((acc, a) => {
    acc[a.year] = (acc[a.year] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const byIndustry = attacks.reduce((acc, a) => {
    acc[a.target_industry] = (acc[a.target_industry] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const avgRansom = attacks.filter(a => a.financial_impact_usd > 0).reduce((sum, a) => sum + a.financial_impact_usd, 0) / attacks.filter(a => a.financial_impact_usd > 0).length

  const totalRecords = attacks.reduce((sum, a) => sum + a.records_affected, 0)

  return (
    <Layout title="Ransomware Tracker">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🔒 Ransomware Tracker</h1>
        <p className="text-gray-400 text-sm">Dedicated intelligence on ransomware attacks</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="text-xs text-gray-500 mb-1">Total Attacks</div>
              <div className="text-2xl font-bold text-red-400">{attacks.length}</div>
            </div>
            <div className="stat-card">
              <div className="text-xs text-gray-500 mb-1">Avg Ransom</div>
              <div className="text-2xl font-bold text-orange-400">${(avgRansom / 1e6).toFixed(1)}M</div>
            </div>
            <div className="stat-card">
              <div className="text-xs text-gray-500 mb-1">Records Exposed</div>
              <div className="text-2xl font-bold text-yellow-400">{(totalRecords / 1e6).toFixed(0)}M</div>
            </div>
            <div className="stat-card">
              <div className="text-xs text-gray-500 mb-1">Peak Year</div>
              <div className="text-2xl font-bold text-cyber-accent">{Object.entries(byYear).sort((a, b) => b[1] - a[1])[0]?.[0]}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h2 className="section-title">Attacks by Year</h2>
              <BarChart
                labels={Object.keys(byYear).sort()}
                datasets={[{ label: 'Attacks', data: Object.keys(byYear).sort().map(y => byYear[Number(y)]), color: '#ef4444' }]}
              />
            </div>
            <div className="card">
              <h2 className="section-title">Top Targeted Industries</h2>
              <div className="space-y-3">
                {Object.entries(byIndustry).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([industry, count]) => (
                  <div key={industry}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{industry}</span>
                      <span className="text-gray-500">{count} attacks</span>
                    </div>
                    <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${(count / attacks.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Incidents */}
          <div className="card">
            <h2 className="section-title mb-4">All Ransomware Incidents</h2>
            <div className="space-y-4">
              {attacks.map(attack => (
                <AttackCard key={attack.id} a={attack} />
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}
