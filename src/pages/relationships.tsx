import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'

export default function Relationships() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<Attack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttacks().then(data => {
      setAttacks(data)
      setLoading(false)
    })
  }, [])

  const findRelated = (attack: Attack) => {
    return {
      sameActor: attacks.filter(a => a.id !== attack.id && a.actor === attack.actor),
      sameVector: attacks.filter(a => a.id !== attack.id && a.vector === attack.vector),
      sameIndustry: attacks.filter(a => a.id !== attack.id && a.target_industry === attack.target_industry),
      sameTechniques: attacks.filter(a => 
        a.id !== attack.id && 
        a.mitre_techniques.some(t => attack.mitre_techniques.includes(t))
      ),
    }
  }

  return (
    <Layout title="Incident Relationships">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🕸️ Incident Relationship Graph</h1>
        <p className="text-gray-400 text-sm">Discover connections between cyber attacks</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Incident Selector */}
          <div className="card mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Select Incident</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {attacks.map(attack => (
                <button
                  key={attack.id}
                  onClick={() => setSelected(attack)}
                  className={`p-3 rounded border text-left text-sm transition-colors ${
                    selected?.id === attack.id
                      ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent'
                      : 'border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-white'
                  }`}
                >
                  <div className="font-bold">{attack.name}</div>
                  <div className="text-xs text-gray-500">{attack.year}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Relationships */}
          {selected ? (
            <>
              {/* Center Node */}
              <div className="card mb-6 bg-cyber-accent/10 border-cyber-accent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-cyber-accent">{selected.name}</h2>
                    <p className="text-sm text-gray-400 mt-1">{selected.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Risk Score</div>
                    <div className="text-2xl font-bold text-cyber-accent">{selected.risk_score}</div>
                  </div>
                </div>
              </div>

              {/* Related Incidents */}
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(findRelated(selected)).map(([type, related]) => {
                  const labels = {
                    sameActor: '👤 Same Threat Actor',
                    sameVector: '🎯 Same Attack Vector',
                    sameIndustry: '🏭 Same Target Industry',
                    sameTechniques: '⚙️ Shared MITRE Techniques',
                  }

                  return (
                    <div key={type} className="card">
                      <h3 className="font-bold text-white mb-3">{labels[type as keyof typeof labels]}</h3>
                      {related.length === 0 ? (
                        <div className="text-sm text-gray-500">No related incidents found</div>
                      ) : (
                        <div className="space-y-2">
                          {related.slice(0, 5).map(attack => (
                            <button
                              key={attack.id}
                              onClick={() => setSelected(attack)}
                              className="w-full p-3 rounded border border-cyber-border hover:border-cyber-accent text-left transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-white text-sm">{attack.name}</div>
                                  <div className="text-xs text-gray-500">{attack.year} · {attack.actor}</div>
                                </div>
                                <div className="text-xs text-cyber-accent font-mono">{attack.risk_score}</div>
                              </div>
                            </button>
                          ))}
                          {related.length > 5 && (
                            <div className="text-xs text-gray-500 text-center pt-2">
                              +{related.length - 5} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">🕸️</div>
              <h2 className="text-xl font-bold text-gray-400 mb-2">Select an incident</h2>
              <p className="text-gray-500 text-sm">Choose an incident above to explore its relationships</p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
