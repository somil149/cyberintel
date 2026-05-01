import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import SeverityBadge from '@/components/SeverityBadge'
import RiskMeter from '@/components/RiskMeter'
import { loadAttacks, formatUSD } from '@/lib/data'
import type { Attack } from '@/types'

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'border-red-500 bg-red-900/10',
  HIGH: 'border-orange-500 bg-orange-900/10',
  MEDIUM: 'border-yellow-500 bg-yellow-900/10',
  LOW: 'border-green-500 bg-green-900/10',
}

export default function Timeline() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => { loadAttacks().then(d => setAttacks(d.sort((a, b) => a.year - b.year))) }, [])

  const byYear = attacks.reduce<Record<number, Attack[]>>((acc, a) => {
    ;(acc[a.year] = acc[a.year] || []).push(a)
    return acc
  }, {})

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <Layout title="Attack Timeline">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Attack Timeline 2005–2026</h1>
        <p className="text-gray-400 text-sm">Major cybersecurity incidents across 21 years. Click any event to expand.</p>
      </div>

      {attacks.length === 0 && (
        <div className="text-gray-500 text-center py-20">Loading timeline...</div>
      )}

      <div className="relative">
        {/* Vertical spine */}
        <div className="absolute left-16 md:left-24 top-0 bottom-0 w-px bg-cyber-border" />

        <div className="space-y-1">
          {years.map(year => (
            <div key={year}>
              {/* Year marker */}
              <div className="relative flex items-center mt-8 mb-3">
                <div className="w-16 md:w-24 text-right pr-4">
                  <span className="text-cyber-accent font-bold">{year}</span>
                </div>
                <div className="absolute left-16 md:left-24 -translate-x-1/2 w-3 h-3 rounded-full bg-cyber-accent border-2 border-cyber-bg z-10" />
              </div>

              {/* Events */}
              <div className="space-y-2 pl-20 md:pl-28">
                {byYear[year].map(a => {
                  const isOpen = selected === a.id
                  return (
                    <div
                      key={a.id}
                      className={`relative cursor-pointer border rounded-lg p-3 max-w-2xl transition-all ${SEVERITY_COLOR[a.severity]}`}
                      onClick={() => setSelected(isOpen ? null : a.id)}
                    >
                      {/* Connector dot */}
                      <div className="absolute -left-[1.05rem] top-4 w-2 h-2 rounded-full bg-gray-600 border border-gray-500" />

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <SeverityBadge severity={a.severity} />
                            <span className="text-xs text-gray-500">{a.date}</span>
                            <span className="text-xs text-gray-600">{a.type}</span>
                          </div>
                          <div className="font-bold text-white text-sm">{a.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{a.target_industry} · {a.actor}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <RiskMeter score={a.risk_score} size="sm" />
                          <span className="text-gray-600 text-xs">{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                          <p className="text-gray-300">{a.description}</p>
                          <div className="bg-yellow-900/20 border border-yellow-900/30 rounded p-2">
                            <span className="text-yellow-400 font-bold">⚠ Root Cause: </span>
                            <span className="text-gray-300">{a.root_cause}</span>
                          </div>
                          {a.financial_impact_usd > 0 && (
                            <div><span className="text-orange-400">💰 Impact: </span><span className="text-gray-300">{formatUSD(a.financial_impact_usd)}</span></div>
                          )}
                          <div className="bg-cyan-900/10 border border-cyan-900/30 rounded p-2">
                            <span className="text-cyber-accent font-bold">💡 Lesson: </span>
                            <span className="text-gray-300">{a.lessons}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {a.mitre_techniques.map(t => (
                              <span key={t} className="badge bg-purple-900/40 text-purple-400 border border-purple-800">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
