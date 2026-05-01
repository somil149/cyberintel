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

  const years = Object.keys(byYear).map(Number).sort()

  return (
    <Layout title="Attack Timeline">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Attack Timeline 2005–2025</h1>
        <p className="text-gray-400 text-sm">Major cybersecurity incidents across 20 years. Click any event to expand.</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7.5rem] md:left-1/2 top-0 bottom-0 w-px bg-cyber-border" />

        <div className="space-y-2">
          {years.map(year => (
            <div key={year}>
              {/* Year marker */}
              <div className="relative flex items-center mb-3 mt-6">
                <div className="w-28 md:w-1/2 text-right pr-6 md:pr-8">
                  <span className="text-cyber-accent font-bold text-lg">{year}</span>
                </div>
                <div className="absolute left-[7.5rem] md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyber-accent border-2 border-cyber-bg" />
              </div>

              {/* Events for this year */}
              {byYear[year].map((a, i) => {
                const isLeft = i % 2 === 0
                const isOpen = selected === a.id
                return (
                  <div key={a.id} className="relative flex items-start mb-2">
                    {/* Left side */}
                    <div className={`w-28 md:w-1/2 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pr-8 md:text-right hidden md:block'}`}>
                      {isLeft && (
                        <div
                          className={`inline-block text-left cursor-pointer border rounded-lg p-3 max-w-xs ${SEVERITY_COLOR[a.severity]} hover:border-opacity-80 transition-all`}
                          onClick={() => setSelected(isOpen ? null : a.id)}
                        >
                          <EventContent a={a} isOpen={isOpen} />
                        </div>
                      )}
                    </div>

                    {/* Dot */}
                    <div className="absolute left-[7.5rem] md:left-1/2 -translate-x-1/2 mt-3 w-2 h-2 rounded-full bg-gray-600 border border-gray-500" />

                    {/* Right side */}
                    <div className={`flex-1 pl-10 md:pl-8 ${isLeft ? 'md:hidden' : ''}`}>
                      {(!isLeft || window?.innerWidth < 768) && (
                        <div
                          className={`inline-block cursor-pointer border rounded-lg p-3 max-w-xs ${SEVERITY_COLOR[a.severity]} hover:border-opacity-80 transition-all`}
                          onClick={() => setSelected(isOpen ? null : a.id)}
                        >
                          <EventContent a={a} isOpen={isOpen} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function EventContent({ a, isOpen }: { a: Attack; isOpen: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <SeverityBadge severity={a.severity} />
        <span className="text-xs text-gray-500">{a.date}</span>
      </div>
      <div className="font-bold text-white text-sm">{a.name}</div>
      <div className="text-xs text-gray-400 mt-1">{a.type} · {a.target_industry}</div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
          <p className="text-gray-300">{a.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Risk:</span>
            <RiskMeter score={a.risk_score} size="sm" />
          </div>
          <div>
            <span className="text-yellow-500">⚠ Root Cause: </span>
            <span className="text-gray-300">{a.root_cause}</span>
          </div>
          {a.financial_impact_usd > 0 && (
            <div>
              <span className="text-orange-400">💰 Impact: </span>
              <span className="text-gray-300">{formatUSD(a.financial_impact_usd)}</span>
            </div>
          )}
          <div>
            <span className="text-cyber-accent">💡 </span>
            <span className="text-gray-300">{a.lessons}</span>
          </div>
        </div>
      )}
    </div>
  )
}
