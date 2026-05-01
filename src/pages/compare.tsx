import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'
import Link from 'next/link'

export default function Compare() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttacks().then(data => {
      setAttacks(data)
      setLoading(false)
    })
  }, [])

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else if (selected.length < 3) {
      setSelected([...selected, id])
    }
  }

  const selectedAttacks = attacks.filter(a => selected.includes(a.id))

  return (
    <Layout title="Compare Incidents">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Compare Incidents</h1>
        <p className="text-gray-400 text-sm">
          Select 2-3 incidents to compare side-by-side ({selected.length}/3 selected)
        </p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Selection Grid */}
          <div className="card mb-6">
            <h2 className="text-lg font-bold text-white mb-4">Select Incidents</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {attacks.map(attack => (
                <button
                  key={attack.id}
                  onClick={() => toggleSelect(attack.id)}
                  disabled={!selected.includes(attack.id) && selected.length >= 3}
                  className={`p-3 rounded border text-left text-sm transition-colors ${
                    selected.includes(attack.id)
                      ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent'
                      : 'border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold">{attack.name}</div>
                  <div className="text-xs text-gray-500">{attack.year}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedAttacks.length >= 2 && (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cyber-border">
                    <th className="text-left p-3 text-gray-500 font-bold">Attribute</th>
                    {selectedAttacks.map(attack => (
                      <th key={attack.id} className="text-left p-3">
                        <div className="font-bold text-cyber-accent">{attack.name}</div>
                        <div className="text-xs text-gray-500 font-normal">{attack.year}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Type</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">{a.type}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Vector</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">{a.vector}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Actor</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">{a.actor}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Origin</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">{a.origin}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Target Industry</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">{a.target_industry}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Severity</td>
                    {selectedAttacks.map(a => (
                      <td key={a.id} className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          a.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          a.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {a.severity}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Risk Score</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3 font-mono">{a.risk_score}/100</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Records Affected</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">{a.records_affected.toLocaleString()}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Financial Impact</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3">${(a.financial_impact_usd / 1e6).toFixed(1)}M</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">Root Cause</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3 text-xs">{a.root_cause}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">MITRE Techniques</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3 text-xs">{a.mitre_techniques.join(', ')}</td>)}
                  </tr>
                  <tr className="border-b border-cyber-border/50">
                    <td className="p-3 text-gray-400 font-medium">OWASP Category</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3 text-xs">{a.owasp_category}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-400 font-medium">Lessons Learned</td>
                    {selectedAttacks.map(a => <td key={a.id} className="p-3 text-xs">{a.lessons}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {selectedAttacks.length < 2 && (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">⚖️</div>
              <h2 className="text-xl font-bold text-gray-400 mb-2">Select at least 2 incidents</h2>
              <p className="text-gray-500 text-sm">Choose incidents from the grid above to compare</p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
