import { useState } from 'react'
import type { Attack } from '@/types'
import SeverityBadge from './SeverityBadge'
import RiskMeter from './RiskMeter'
import { ShareButton } from './ShareButton'
import { BookmarkButton } from './BookmarkButton'
import { formatUSD, formatNumber } from '@/lib/data'

export default function AttackCard({ a }: { a: Attack }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs text-gray-500 font-mono">{a.date}</span>
            <SeverityBadge severity={a.severity} />
            <span className="badge bg-gray-800 text-gray-400 border border-gray-700">{a.type}</span>
          </div>
          <h3 className="font-bold text-white text-sm">{a.name}</h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <RiskMeter score={a.risk_score} size="sm" />
          <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-cyber-border space-y-3 text-xs">
          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-2">
            <ShareButton title={a.name} />
            <BookmarkButton id={a.id} size="sm" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Actor', value: a.actor },
              { label: 'Origin', value: a.origin },
              { label: 'Industry', value: a.target_industry },
              { label: 'Vector', value: a.vector },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-gray-600 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-gray-300">{value}</div>
              </div>
            ))}
          </div>

          {/* Impact */}
          {(a.records_affected > 0 || a.financial_impact_usd > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {a.records_affected > 0 && (
                <div className="bg-red-900/20 border border-red-900/40 rounded p-2">
                  <div className="text-gray-500 uppercase tracking-wider mb-0.5">Records Exposed</div>
                  <div className="text-red-400 font-bold">{formatNumber(a.records_affected)}</div>
                </div>
              )}
              {a.financial_impact_usd > 0 && (
                <div className="bg-orange-900/20 border border-orange-900/40 rounded p-2">
                  <div className="text-gray-500 uppercase tracking-wider mb-0.5">Financial Impact</div>
                  <div className="text-orange-400 font-bold">{formatUSD(a.financial_impact_usd)}</div>
                </div>
              )}
            </div>
          )}

          {/* Root cause */}
          <div className="bg-yellow-900/10 border border-yellow-900/30 rounded p-3">
            <div className="text-yellow-500 font-bold mb-1">⚠ Root Cause</div>
            <div className="text-gray-300">{a.root_cause}</div>
          </div>

          {/* Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <div className="text-gray-600 uppercase tracking-wider mb-1">MITRE ATT&CK</div>
              <div className="flex flex-wrap gap-1">
                {a.mitre_techniques.map(t => (
                  <a key={t} href={`https://attack.mitre.org/techniques/${t.replace('.', '/')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="badge bg-purple-900/40 text-purple-400 border border-purple-800 hover:bg-purple-800/40">
                    {t}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-600 uppercase tracking-wider mb-1">OWASP</div>
              <div className="text-gray-300">{a.owasp_category}</div>
            </div>
            <div>
              <div className="text-gray-600 uppercase tracking-wider mb-1">NIST Control</div>
              <div className="text-gray-300">{a.nist_control}</div>
            </div>
          </div>

          {/* Lesson */}
          <div className="bg-cyan-900/10 border border-cyan-900/30 rounded p-3">
            <div className="text-cyber-accent font-bold mb-1">💡 Lesson Learned</div>
            <div className="text-gray-300">{a.lessons}</div>
          </div>
        </div>
      )}
    </div>
  )
}
