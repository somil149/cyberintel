import { useEffect, useState, useRef } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'

// MITRE ATT&CK Enterprise tactics in kill-chain order
const TACTICS = [
  { id: 'TA0001', name: 'Initial Access' },
  { id: 'TA0002', name: 'Execution' },
  { id: 'TA0003', name: 'Persistence' },
  { id: 'TA0004', name: 'Privilege Escalation' },
  { id: 'TA0005', name: 'Defense Evasion' },
  { id: 'TA0006', name: 'Credential Access' },
  { id: 'TA0007', name: 'Discovery' },
  { id: 'TA0008', name: 'Lateral Movement' },
  { id: 'TA0009', name: 'Collection' },
  { id: 'TA0010', name: 'Exfiltration' },
  { id: 'TA0040', name: 'Impact' },
]

// Technique → tactic mapping (subset of most-used techniques from our dataset)
const TECHNIQUE_TACTIC: Record<string, string> = {
  'T1566': 'Initial Access',   // Phishing
  'T1190': 'Initial Access',   // Exploit Public-Facing App
  'T1195': 'Initial Access',   // Supply Chain Compromise
  'T1078': 'Initial Access',   // Valid Accounts
  'T1059': 'Execution',        // Command & Scripting
  'T1059.007': 'Execution',    // JavaScript
  'T1203': 'Execution',        // Exploitation for Client Execution
  'T1543': 'Persistence',      // Create/Modify System Process
  'T1505': 'Persistence',      // Server Software Component
  'T1072': 'Persistence',      // Software Deployment Tools
  'T1548': 'Privilege Escalation',
  'T1621': 'Credential Access', // MFA Request Generation
  'T1110': 'Credential Access', // Brute Force
  'T1539': 'Credential Access', // Steal Web Session Cookie
  'T1552': 'Credential Access', // Unsecured Credentials
  'T1027': 'Defense Evasion',  // Obfuscated Files
  'T1082': 'Discovery',        // System Info Discovery
  'T1083': 'Discovery',        // File & Directory Discovery
  'T1210': 'Lateral Movement', // Exploitation of Remote Services
  'T1534': 'Lateral Movement', // Internal Spearphishing
  'T1005': 'Collection',       // Data from Local System
  'T1041': 'Exfiltration',     // Exfil Over C2 Channel
  'T1071': 'Exfiltration',     // App Layer Protocol
  'T1486': 'Impact',           // Data Encrypted for Impact
  'T1485': 'Impact',           // Data Destruction
  'T1490': 'Impact',           // Inhibit System Recovery
  'T1498': 'Impact',           // Network DoS
  'T1565': 'Impact',           // Data Manipulation
  'T1657': 'Impact',           // Financial Theft
  'T1583': 'Initial Access',
  'T1105': 'Execution',
  'T1195.001': 'Initial Access',
  'T1195.002': 'Initial Access',
}

const TECHNIQUE_NAME: Record<string, string> = {
  'T1566': 'Phishing', 'T1190': 'Exploit Public App', 'T1195': 'Supply Chain',
  'T1078': 'Valid Accounts', 'T1059': 'Command & Script', 'T1059.007': 'JavaScript',
  'T1203': 'Client Exploit', 'T1543': 'System Process', 'T1505': 'Server Component',
  'T1072': 'SW Deployment', 'T1621': 'MFA Fatigue', 'T1110': 'Brute Force',
  'T1539': 'Steal Cookie', 'T1552': 'Unsecured Creds', 'T1027': 'Obfuscation',
  'T1082': 'System Info', 'T1083': 'File Discovery', 'T1210': 'Remote Exploit',
  'T1534': 'Internal Phish', 'T1005': 'Local Data', 'T1041': 'Exfil C2',
  'T1071': 'App Protocol', 'T1486': 'Ransomware', 'T1485': 'Data Destroy',
  'T1490': 'No Recovery', 'T1498': 'Network DoS', 'T1565': 'Data Manip',
  'T1657': 'Financial Theft', 'T1583': 'Acquire Infra', 'T1105': 'Ingress Tool',
  'T1195.001': 'Compromise SW', 'T1195.002': 'Compromise HW',
}

export default function MitreHeatmap() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [hovered, setHovered] = useState<{ technique: string; count: number; incidents: string[] } | null>(null)

  useEffect(() => { loadAttacks().then(setAttacks) }, [])

  // Count technique frequency across all incidents
  const techCount: Record<string, { count: number; incidents: string[] }> = {}
  for (const a of attacks) {
    for (const t of a.mitre_techniques) {
      const base = t.split('.')[0]
      const key = TECHNIQUE_TACTIC[t] ? t : TECHNIQUE_TACTIC[base] ? base : null
      if (!key) continue
      if (!techCount[key]) techCount[key] = { count: 0, incidents: [] }
      techCount[key].count++
      techCount[key].incidents.push(a.name)
    }
  }

  const maxCount = Math.max(...Object.values(techCount).map(v => v.count), 1)

  const getColor = (count: number) => {
    if (count === 0) return '#1f2937'
    const intensity = count / maxCount
    if (intensity >= 0.8) return '#ef4444'
    if (intensity >= 0.6) return '#f97316'
    if (intensity >= 0.4) return '#eab308'
    if (intensity >= 0.2) return '#22c55e'
    return '#0891b2'
  }

  // Group techniques by tactic
  const tacticTechniques: Record<string, string[]> = {}
  for (const tactic of TACTICS) {
    tacticTechniques[tactic.name] = Object.keys(TECHNIQUE_TACTIC).filter(
      t => TECHNIQUE_TACTIC[t] === tactic.name
    )
  }

  return (
    <Layout title="MITRE ATT&CK Heatmap">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">MITRE ATT&CK Heatmap</h1>
        <p className="text-gray-400 text-sm">
          Technique frequency across {attacks.length} incidents. Darker = more incidents used this technique.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {[
          { label: '1 incident', color: '#0891b2' },
          { label: 'Low (20%+)', color: '#22c55e' },
          { label: 'Medium (40%+)', color: '#eab308' },
          { label: 'High (60%+)', color: '#f97316' },
          { label: 'Critical (80%+)', color: '#ef4444' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-4 rounded bg-cyber-border" />
          Not observed
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {TACTICS.map(tactic => {
            const techniques = tacticTechniques[tactic.name] || []
            return (
              <div key={tactic.id} className="mb-3">
                {/* Tactic header */}
                <div className="text-xs font-bold text-cyber-accent uppercase tracking-wider mb-1.5 px-1">
                  {tactic.name}
                </div>
                {/* Technique cells */}
                <div className="flex flex-wrap gap-1.5">
                  {techniques.map(tech => {
                    const data = techCount[tech]
                    const count = data?.count || 0
                    const color = getColor(count)
                    return (
                      <div
                        key={tech}
                        className="relative cursor-pointer rounded px-2 py-1.5 text-xs font-mono transition-all hover:scale-105 hover:z-10 border border-black/20"
                        style={{ backgroundColor: color, minWidth: 90 }}
                        onMouseEnter={() => setHovered(data ? { technique: tech, count, incidents: data.incidents } : null)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div className="font-bold text-white/90 text-[10px]">{tech}</div>
                        <div className="text-white/80 text-[10px] truncate max-w-[80px]">
                          {TECHNIQUE_NAME[tech] || tech}
                        </div>
                        {count > 0 && (
                          <div className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {count}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="fixed bottom-6 right-6 card border-cyber-accent/40 max-w-xs z-50">
          <div className="font-bold text-cyber-accent text-sm mb-1">{hovered.technique}</div>
          <div className="text-white font-bold">{TECHNIQUE_NAME[hovered.technique]}</div>
          <div className="text-gray-400 text-xs mt-1">{hovered.count} incident{hovered.count > 1 ? 's' : ''}</div>
          <div className="mt-2 space-y-0.5">
            {hovered.incidents.slice(0, 5).map((name, i) => (
              <div key={i} className="text-xs text-gray-300">▸ {name}</div>
            ))}
            {hovered.incidents.length > 5 && (
              <div className="text-xs text-gray-500">+{hovered.incidents.length - 5} more</div>
            )}
          </div>
        </div>
      )}

      {/* Top techniques table */}
      <div className="card mt-8">
        <h2 className="section-title">🔝 Most Used Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(techCount)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10)
            .map(([tech, data]) => (
              <div key={tech} className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyber-accent w-24 shrink-0">{tech}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-300">{TECHNIQUE_NAME[tech] || tech}</span>
                    <span className="text-gray-500">{data.count} incidents</span>
                  </div>
                  <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(data.count / maxCount) * 100}%`, backgroundColor: getColor(data.count) }} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  )
}
