import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'

const KILL_CHAIN = [
  { stage: 'Reconnaissance', desc: 'Gather information about target' },
  { stage: 'Weaponization', desc: 'Create malicious payload' },
  { stage: 'Delivery', desc: 'Transmit weapon to target' },
  { stage: 'Exploitation', desc: 'Trigger vulnerability' },
  { stage: 'Installation', desc: 'Install malware/backdoor' },
  { stage: 'Command & Control', desc: 'Establish C2 channel' },
  { stage: 'Actions on Objectives', desc: 'Achieve attacker goals' },
]

export default function AttackChain() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<Attack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttacks().then(data => {
      setAttacks(data)
      setLoading(false)
    })
  }, [])

  const mapToKillChain = (attack: Attack) => {
    const stages: Record<string, string[]> = {}
    
    // Map attack vector to kill chain stages
    if (attack.vector.includes('phishing') || attack.vector.includes('social')) {
      stages['Delivery'] = ['Spear phishing email']
    } else if (attack.vector.includes('USB')) {
      stages['Delivery'] = ['USB drive']
    } else if (attack.vector.includes('Network') || attack.vector.includes('RCE')) {
      stages['Delivery'] = ['Network exploitation']
    } else if (attack.vector.includes('Supply Chain') || attack.vector.includes('Software Update')) {
      stages['Delivery'] = ['Trojanized software update']
    }

    stages['Exploitation'] = [attack.vector]
    stages['Installation'] = [attack.type]
    stages['Actions on Objectives'] = [attack.root_cause]

    return stages
  }

  return (
    <Layout title="Attack Chain Visualizer">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">⛓️ Attack Chain Visualizer</h1>
        <p className="text-gray-400 text-sm">Cyber Kill Chain analysis of major incidents</p>
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

          {/* Kill Chain Visualization */}
          {selected ? (
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-4">
                Kill Chain: {selected.name} ({selected.year})
              </h2>
              <div className="space-y-4">
                {KILL_CHAIN.map((stage, idx) => {
                  const stageData = mapToKillChain(selected)[stage.stage]
                  const isActive = stageData && stageData.length > 0

                  return (
                    <div key={stage.stage} className="relative">
                      {idx < KILL_CHAIN.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-cyber-border" />
                      )}
                      <div className={`flex items-start gap-4 p-4 rounded border transition-all ${
                        isActive
                          ? 'border-cyber-accent bg-cyber-accent/5'
                          : 'border-cyber-border opacity-50'
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                          isActive ? 'bg-cyber-accent text-cyber-bg' : 'bg-cyber-border text-gray-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white mb-1">{stage.stage}</div>
                          <div className="text-xs text-gray-500 mb-2">{stage.desc}</div>
                          {isActive && (
                            <div className="flex flex-wrap gap-2">
                              {stageData.map((item, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded bg-cyber-accent/20 text-cyber-accent">
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Attack Details */}
              <div className="mt-6 p-4 rounded bg-cyber-bg border border-cyber-border">
                <h3 className="font-bold text-white mb-2">Attack Summary</h3>
                <p className="text-sm text-gray-400 mb-3">{selected.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Actor:</span>
                    <span className="text-white ml-2">{selected.actor}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sophistication:</span>
                    <span className="text-white ml-2">{selected.sophistication}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Target:</span>
                    <span className="text-white ml-2">{selected.target_industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Risk Score:</span>
                    <span className="text-cyber-accent ml-2 font-bold">{selected.risk_score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">⛓️</div>
              <h2 className="text-xl font-bold text-gray-400 mb-2">Select an incident</h2>
              <p className="text-gray-500 text-sm">Choose an incident above to visualize its attack chain</p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
