import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks } from '@/lib/data'
import { analyzeAttack, aggregateInsights, ROOT_CAUSE_RECOMMENDATIONS, type AttackInsight } from '@/lib/engine'
import type { Attack } from '@/types'
import SeverityBadge from '@/components/SeverityBadge'
import RiskMeter from '@/components/RiskMeter'
import { DoughnutChart } from '@/components/Charts'

export default function RCA() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<AttackInsight | null>(null)

  useEffect(() => { loadAttacks().then(setAttacks) }, [])

  const { topRootCauses, avgRiskByYear, highRiskYears, typeCounts } = useMemo(
    () => aggregateInsights(attacks),
    [attacks]
  )

  const insights = useMemo(() => attacks.map(analyzeAttack), [attacks])

  const rcGroups = useMemo(() => {
    const groups: Record<string, AttackInsight[]> = {}
    for (const i of insights) {
      ;(groups[i.rootCauseCategory] = groups[i.rootCauseCategory] || []).push(i)
    }
    return groups
  }, [insights])

  return (
    <Layout title="Root Cause Analysis">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Root Cause Analysis Engine</h1>
        <p className="text-gray-400 text-sm">
          Every incident mapped to failure categories, MITRE ATT&CK, OWASP, NIST controls, and defensive recommendations.
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="section-title">🔍 Root Cause Distribution</h2>
          {topRootCauses.length > 0 && (
            <DoughnutChart
              labels={topRootCauses.map(([k]) => k)}
              data={topRootCauses.map(([, v]) => v)}
              height={240}
            />
          )}
        </div>

        <div className="card">
          <h2 className="section-title">⚠ High-Risk Years</h2>
          <div className="space-y-2">
            {avgRiskByYear.map(({ year, avgRisk }) => (
              <div key={year} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-10">{year}</span>
                <div className="flex-1 h-2 bg-cyber-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${avgRisk}%`,
                      backgroundColor: avgRisk >= 90 ? '#ef4444' : avgRisk >= 75 ? '#f97316' : '#eab308',
                    }}
                  />
                </div>
                <span className={`text-xs font-bold w-8 text-right ${avgRisk >= 90 ? 'text-red-400' : avgRisk >= 75 ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {avgRisk}
                </span>
                {highRiskYears.includes(year) && (
                  <span className="text-xs text-red-400">⚠</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Root cause groups */}
      <div className="space-y-4 mb-6">
        {Object.entries(rcGroups).map(([category, items]) => (
          <div key={category} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">{category}</h3>
              <span className="badge bg-cyber-bg border border-cyber-border text-gray-400">
                {items.length} incident{items.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Incidents in this category */}
            <div className="flex flex-wrap gap-2 mb-4">
              {items.map(i => (
                <button
                  key={i.attack.id}
                  onClick={() => setSelected(selected?.attack.id === i.attack.id ? null : i)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    selected?.attack.id === i.attack.id
                      ? 'border-cyber-accent text-cyber-accent bg-cyber-accent/10'
                      : 'border-cyber-border text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {i.attack.name} ({i.attack.year})
                </button>
              ))}
            </div>

            {/* Recommendations for this category */}
            <div className="bg-cyber-bg rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Defensive Recommendations</div>
              <ul className="space-y-1">
                {ROOT_CAUSE_RECOMMENDATIONS[category as keyof typeof ROOT_CAUSE_RECOMMENDATIONS]?.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-cyber-accent mt-0.5 shrink-0">▸</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Selected incident deep-dive */}
      {selected && (
        <div className="card border-cyber-accent/30 sticky bottom-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">{selected.attack.date} · {selected.attack.type}</div>
              <h3 className="font-bold text-white text-lg">{selected.attack.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <SeverityBadge severity={selected.attack.severity} />
              <RiskMeter score={selected.computedRisk} />
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-gray-500 uppercase tracking-wider mb-2">MITRE ATT&CK Techniques</div>
              <ul className="space-y-1">
                {selected.mitreMappings.map((t, i) => (
                  <li key={i} className="text-purple-400">▸ {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-gray-500 uppercase tracking-wider mb-2">OWASP Category</div>
              <div className="text-orange-400">{selected.owaspMapping}</div>
              <div className="text-gray-500 uppercase tracking-wider mb-2 mt-3">NIST Controls</div>
              <ul className="space-y-1">
                {selected.nistControls.map((c, i) => (
                  <li key={i} className="text-cyan-400">▸ {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-gray-500 uppercase tracking-wider mb-2">Recommendations</div>
              <ul className="space-y-1">
                {selected.recommendations.slice(0, 3).map((r, i) => (
                  <li key={i} className="text-gray-300">▸ {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
