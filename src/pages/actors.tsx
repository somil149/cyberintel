import { useEffect, useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import SeverityBadge from '@/components/SeverityBadge'
import RiskMeter from '@/components/RiskMeter'
import { loadAttacks, formatUSD } from '@/lib/data'
import type { Attack } from '@/types'

const ACTOR_META: Record<string, { nation: string; type: string; aka: string; flag: string }> = {
  'Lazarus Group (DPRK)':   { nation: 'North Korea', type: 'Nation-State', aka: 'APT38, Hidden Cobra', flag: '🇰🇵' },
  'APT29 (Cozy Bear)':      { nation: 'Russia', type: 'Nation-State', aka: 'Cozy Bear, The Dukes', flag: '🇷🇺' },
  'APT28 (Russia)':         { nation: 'Russia', type: 'Nation-State', aka: 'Fancy Bear, Sofacy', flag: '🇷🇺' },
  'Sandworm (Russia)':      { nation: 'Russia', type: 'Nation-State', aka: 'Voodoo Bear, TeleBots', flag: '🇷🇺' },
  'APT1 (China)':           { nation: 'China', type: 'Nation-State', aka: 'Comment Crew, Unit 61398', flag: '🇨🇳' },
  'APT10 (China)':          { nation: 'China', type: 'Nation-State', aka: 'Stone Panda, MenuPass', flag: '🇨🇳' },
  'APT40 (China)':          { nation: 'China', type: 'Nation-State', aka: 'BRONZE MOHAWK, TEMP.Periscope', flag: '🇨🇳' },
  'HAFNIUM (China)':        { nation: 'China', type: 'Nation-State', aka: 'HAFNIUM', flag: '🇨🇳' },
  'Scattered Spider':       { nation: 'USA/UK', type: 'Criminal', aka: 'UNC3944, Muddled Libra', flag: '🌐' },
  'ShinyHunters':           { nation: 'Unknown', type: 'Criminal', aka: 'ShinyHunters', flag: '🌐' },
  'Lapsus$':                { nation: 'UK/Brazil', type: 'Criminal', aka: 'DEV-0537', flag: '🌐' },
  'REvil':                  { nation: 'Russia', type: 'RaaS', aka: 'Sodinokibi, GOLD SOUTHFIELD', flag: '🇷🇺' },
  'DarkSide':               { nation: 'Russia', type: 'RaaS', aka: 'DarkSide', flag: '🇷🇺' },
  'ALPHV/BlackCat':         { nation: 'Russia', type: 'RaaS', aka: 'BlackCat, Noberus', flag: '🇷🇺' },
  'Cl0p Ransomware':        { nation: 'Russia', type: 'RaaS', aka: 'TA505, FIN11', flag: '🇷🇺' },
  'Handala (Iran MOIS)':    { nation: 'Iran', type: 'Nation-State', aka: 'Handala', flag: '🇮🇷' },
  'Everest RaaS':           { nation: 'Unknown', type: 'RaaS', aka: 'Everest', flag: '🌐' },
  'TeamPCP / Shai-Hulud':   { nation: 'Unknown', type: 'Criminal', aka: 'TeamPCP', flag: '🌐' },
}

const TYPE_COLOR: Record<string, string> = {
  'Nation-State': 'text-red-400 bg-red-900/30 border-red-800',
  'Criminal': 'text-orange-400 bg-orange-900/30 border-orange-800',
  'RaaS': 'text-purple-400 bg-purple-900/30 border-purple-800',
}

export default function Actors() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => { loadAttacks().then(setAttacks) }, [])

  const actorGroups = useMemo(() => {
    const groups: Record<string, Attack[]> = {}
    for (const a of attacks) {
      const actor = a.actor
      if (!groups[actor]) groups[actor] = []
      groups[actor].push(a)
    }
    return Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
  }, [attacks])

  const filtered = useMemo(() => {
    if (filter === 'all') return actorGroups
    return actorGroups.filter(([actor]) => {
      const meta = ACTOR_META[actor]
      return meta?.type === filter
    })
  }, [actorGroups, filter])

  const types = ['all', 'Nation-State', 'Criminal', 'RaaS']

  return (
    <Layout title="Threat Actor Profiles">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Threat Actor Profiles</h1>
        <p className="text-gray-400 text-sm">
          {actorGroups.length} threat actors across {attacks.length} incidents. Click any actor for full profile.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`btn text-xs ${filter === t ? 'btn-primary' : 'btn-ghost'}`}>
            {t === 'all' ? 'All Actors' : t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-6">
        {/* Actor list */}
        <div className="space-y-2">
          {filtered.map(([actor, incidents]) => {
            const meta = ACTOR_META[actor]
            const avgRisk = Math.round(incidents.reduce((s, a) => s + a.risk_score, 0) / incidents.length)
            const isSelected = selected === actor
            return (
              <div
                key={actor}
                onClick={() => setSelected(isSelected ? null : actor)}
                className={`card cursor-pointer transition-all hover:border-gray-600 ${isSelected ? 'border-cyber-accent/60 bg-cyber-accent/5' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg">{meta?.flag || '🌐'}</span>
                      {meta && (
                        <span className={`badge border text-[10px] ${TYPE_COLOR[meta.type] || 'text-gray-400 bg-gray-800 border-gray-700'}`}>
                          {meta.type}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-sm truncate">{actor}</div>
                    {meta && <div className="text-xs text-gray-500 mt-0.5">{meta.nation}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-cyber-accent font-bold text-lg">{incidents.length}</div>
                    <div className="text-gray-600 text-[10px]">incidents</div>
                    <div className="text-xs text-gray-500 mt-1">avg risk {avgRisk}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actor detail */}
        <div>
          {selected ? (() => {
            const incidents = actorGroups.find(([a]) => a === selected)?.[1] || []
            const meta = ACTOR_META[selected]
            const avgRisk = Math.round(incidents.reduce((s, a) => s + a.risk_score, 0) / incidents.length)
            const totalRecords = incidents.reduce((s, a) => s + a.records_affected, 0)
            const totalFinancial = incidents.reduce((s, a) => s + a.financial_impact_usd, 0)
            const allTechniques = [...new Set(incidents.flatMap(a => a.mitre_techniques))]
            const industries = [...new Set(incidents.map(a => a.target_industry))]
            const years = [...new Set(incidents.map(a => a.year))].sort((a, b) => b - a)

            return (
              <div className="space-y-4">
                {/* Header */}
                <div className="card border-cyber-accent/30">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-3xl">{meta?.flag || '🌐'}</span>
                        {meta && (
                          <span className={`badge border ${TYPE_COLOR[meta.type] || ''}`}>{meta.type}</span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-white">{selected}</h2>
                      {meta && (
                        <div className="text-sm text-gray-400 mt-1">
                          {meta.nation} · Also known as: <span className="text-gray-300">{meta.aka}</span>
                        </div>
                      )}
                    </div>
                    <RiskMeter score={avgRisk} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Incidents', value: incidents.length, color: 'text-cyber-accent' },
                    { label: 'Avg Risk', value: avgRisk, color: avgRisk >= 90 ? 'text-red-400' : 'text-orange-400' },
                    { label: 'Records', value: totalRecords > 0 ? (totalRecords / 1e6).toFixed(0) + 'M' : 'N/A', color: 'text-red-400' },
                    { label: 'Financial', value: totalFinancial > 0 ? formatUSD(totalFinancial) : 'N/A', color: 'text-orange-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="stat-card">
                      <div className="text-gray-500 uppercase tracking-wider">{label}</div>
                      <div className={`text-xl font-bold ${color}`}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* TTPs */}
                <div className="card">
                  <h3 className="section-title text-sm">⚔️ MITRE ATT&CK Techniques</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {allTechniques.map(t => (
                      <a key={t} href={`https://attack.mitre.org/techniques/${t.replace('.', '/')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="badge bg-purple-900/40 text-purple-400 border border-purple-800 hover:bg-purple-800/40 text-xs">
                        {t}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Targeting */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card">
                    <h3 className="section-title text-sm">🏭 Targeted Industries</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {industries.map(i => (
                        <span key={i} className="badge bg-cyber-bg border border-cyber-border text-gray-300 text-xs">{i}</span>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="section-title text-sm">📅 Active Years</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {years.map(y => (
                        <span key={y} className="badge bg-cyber-bg border border-cyber-border text-cyber-accent text-xs font-mono">{y}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Linked incidents */}
                <div className="card">
                  <h3 className="section-title text-sm">📋 Linked Incidents</h3>
                  <div className="space-y-2">
                    {incidents.sort((a, b) => b.year - a.year).map(a => (
                      <div key={a.id} className="flex items-start gap-3 p-2 rounded bg-cyber-bg border border-cyber-border">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-xs text-gray-500 font-mono">{a.date}</span>
                            <SeverityBadge severity={a.severity} />
                          </div>
                          <div className="font-bold text-white text-sm">{a.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{a.target_industry} · {a.type}</div>
                        </div>
                        <RiskMeter score={a.risk_score} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })() : (
            <div className="card h-64 flex items-center justify-center text-gray-500">
              ← Select a threat actor to view their full profile
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
