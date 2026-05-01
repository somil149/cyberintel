import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { loadStory } from '@/lib/data'
import type { StoryEntry } from '@/types'

const ERA_COLORS: Record<string, string> = {
  'Early Web Threats': '#00d4ff',
  'ICS & Nation-State': '#f97316',
  'Mega Breaches': '#ef4444',
  'Ransomware Rise': '#a855f7',
  'Supply Chain Era': '#eab308',
  'AI & Scale': '#22c55e',
}

export default function Story() {
  const [entries, setEntries] = useState<StoryEntry[]>([])
  const [active, setActive] = useState<number>(0)

  useEffect(() => { loadStory().then(d => { setEntries(d); setActive(0) }) }, [])

  const entry = entries[active]

  return (
    <Layout title="Story Mode">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Story Mode: 20 Years of Cyber Evolution</h1>
        <p className="text-gray-400 text-sm">Year-by-year narrative of how cybersecurity threats evolved from 2005 to 2025.</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-gray-500 text-center py-20">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Year selector */}
          <div className="card p-2 h-fit md:sticky md:top-20">
            <div className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">Select Year</div>
            <div className="space-y-0.5 max-h-[70vh] overflow-y-auto">
              {[...entries].reverse().map((e, ri) => {
                const i = entries.length - 1 - ri
                const color = ERA_COLORS[e.era] || '#6b7280'
                return (
                  <button
                    key={e.year}
                    onClick={() => setActive(i)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-3 ${
                      active === i ? 'bg-cyber-border text-white' : 'text-gray-400 hover:text-white hover:bg-cyber-border/50'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-mono font-bold">{e.year}</span>
                    <span className="text-xs truncate opacity-70">{e.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Story content */}
          {entry && (
            <div className="space-y-4">
              {/* Header */}
              <div className="card" style={{ borderColor: ERA_COLORS[entry.era] + '40' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl font-bold text-white">{entry.year}</span>
                      <div>
                        <div className="text-xs px-2 py-0.5 rounded-full border text-xs font-medium"
                          style={{ color: ERA_COLORS[entry.era], borderColor: ERA_COLORS[entry.era] + '60', backgroundColor: ERA_COLORS[entry.era] + '15' }}>
                          {entry.era}
                        </div>
                        <div className="text-xl font-bold text-white mt-1">{entry.title}</div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{entry.summary}</p>
                  </div>
                  {/* Risk gauge */}
                  <div className="shrink-0 text-center">
                    <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                    <div className="text-3xl font-bold" style={{ color: entry.risk_level >= 90 ? '#ef4444' : entry.risk_level >= 75 ? '#f97316' : '#eab308' }}>
                      {entry.risk_level}
                    </div>
                    <div className="text-xs text-gray-600">/100</div>
                  </div>
                </div>
              </div>

              {/* Key events */}
              <div className="card">
                <h3 className="section-title">📅 Key Events</h3>
                <ul className="space-y-2">
                  {entry.key_events.map((ev, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-cyber-accent mt-0.5 shrink-0">▸</span>
                      <span className="text-gray-300">{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Paradigm shift */}
              <div className="card border-orange-900/40 bg-orange-900/5">
                <h3 className="section-title text-orange-400">⚡ Paradigm Shift</h3>
                <p className="text-gray-300 text-sm">{entry.paradigm_shift}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="stat-card">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Dominant Attack</div>
                  <div className="text-sm font-bold text-white mt-1">{entry.dominant_attack}</div>
                </div>
                <div className="stat-card">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Top Industry</div>
                  <div className="text-sm font-bold text-white mt-1">{entry.top_industry}</div>
                </div>
                <div className="stat-card">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Defensive Focus</div>
                  <div className="text-sm font-bold text-white mt-1">{entry.defensive_focus}</div>
                </div>
              </div>

              {/* Lesson */}
              <div className="card border-cyan-900/40 bg-cyan-900/5">
                <h3 className="section-title text-cyber-accent">💡 Key Lesson</h3>
                <p className="text-gray-300 text-sm">{entry.lesson}</p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setActive(Math.max(0, active - 1))}
                  disabled={active === 0}
                  className="btn-ghost disabled:opacity-30"
                >
                  ← {active > 0 ? entries[active - 1].year : ''}
                </button>
                <button
                  onClick={() => setActive(Math.min(entries.length - 1, active + 1))}
                  disabled={active === entries.length - 1}
                  className="btn-ghost disabled:opacity-30"
                >
                  {active < entries.length - 1 ? entries[active + 1].year : ''} →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
