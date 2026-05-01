import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks, SEVERITY_COLOR, formatUSD } from '@/lib/data'
import type { Attack } from '@/types'
import dynamic from 'next/dynamic'

// Leaflet must be loaded client-side only
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => (
  <div className="h-[500px] bg-cyber-surface rounded-lg flex items-center justify-center text-gray-500">
    Loading map...
  </div>
)})

export default function MapPage() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selected, setSelected] = useState<Attack | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => { loadAttacks().then(setAttacks) }, [])

  const filtered = filter === 'all' ? attacks : attacks.filter(a => a.severity === filter)

  return (
    <Layout title="Threat Map">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-1">Global Threat Intelligence Map</h1>
        <p className="text-gray-400 text-sm">Geographic distribution of major cyberattacks 2005–2026. Click markers for details.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'CRITICAL', 'HIGH', 'MEDIUM'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn text-xs ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
        <span className="text-xs text-gray-500 self-center ml-2">{filtered.length} incidents</span>
      </div>

      {/* Map */}
      <div className="card p-0 overflow-hidden mb-4">
        <MapView attacks={filtered} onSelect={setSelected} />
      </div>

      {/* Selected incident detail */}
      {selected && (
        <div className="card border-cyber-accent/30">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-500 mb-1">{selected.date} · {selected.type}</div>
              <h3 className="font-bold text-white">{selected.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{selected.description}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white ml-4">✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
            {[
              { label: 'Actor', value: selected.actor },
              { label: 'Origin', value: selected.origin },
              { label: 'Target', value: selected.target_country },
              { label: 'Industry', value: selected.target_industry },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-gray-600 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-gray-300">{value}</div>
              </div>
            ))}
          </div>
          {selected.financial_impact_usd > 0 && (
            <div className="mt-3 text-xs">
              <span className="text-orange-400 font-bold">Financial Impact: </span>
              <span className="text-gray-300">{formatUSD(selected.financial_impact_usd)}</span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="card mt-4">
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(SEVERITY_COLOR).map(([sev, color]) => (
            <div key={sev} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-400">{sev}</span>
            </div>
          ))}
          <span className="text-gray-600 ml-auto">Circle size = risk score</span>
        </div>
      </div>
    </Layout>
  )
}
