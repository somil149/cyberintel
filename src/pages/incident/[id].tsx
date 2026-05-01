import { GetStaticPaths, GetStaticProps } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import Layout from '@/components/Layout'
import SeverityBadge from '@/components/SeverityBadge'
import RiskMeter from '@/components/RiskMeter'
import { ShareButton } from '@/components/ShareButton'
import { BookmarkButton } from '@/components/BookmarkButton'
import { formatUSD, formatNumber } from '@/lib/data'
import type { Attack } from '@/types'
import Link from 'next/link'

interface Props {
  incident: Attack
  relatedIncidents: Attack[]
}

export default function IncidentDetail({ incident, relatedIncidents }: Props) {
  return (
    <Layout title={incident.name}>
      {/* Header */}
      <div className="mb-6">
        <Link href="/incidents" className="text-xs text-cyber-accent hover:underline mb-3 inline-block">
          ← Back to Incidents
        </Link>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs text-gray-500 font-mono">{incident.date}</span>
              <SeverityBadge severity={incident.severity} />
              <span className="badge bg-gray-800 text-gray-400 border border-gray-700">{incident.type}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{incident.name}</h1>
            <p className="text-gray-400">{incident.description}</p>
          </div>
          <RiskMeter score={incident.risk_score} size="md" />
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <ShareButton title={incident.name} />
          <BookmarkButton id={incident.id} />
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {incident.records_affected > 0 && (
          <div className="card bg-red-900/10 border-red-900/40">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Records Exposed</div>
            <div className="text-3xl font-bold text-red-400 font-mono">{formatNumber(incident.records_affected)}</div>
          </div>
        )}
        {incident.financial_impact_usd > 0 && (
          <div className="card bg-orange-900/10 border-orange-900/40">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Financial Impact</div>
            <div className="text-3xl font-bold text-orange-400 font-mono">{formatUSD(incident.financial_impact_usd)}</div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Attack Details */}
        <div className="card">
          <h2 className="section-title">🎯 Attack Details</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Threat Actor', value: incident.actor },
              { label: 'Origin', value: incident.origin },
              { label: 'Target Country', value: incident.target_country },
              { label: 'Target Industry', value: incident.target_industry },
              { label: 'Attack Vector', value: incident.vector },
              { label: 'Sophistication', value: incident.sophistication },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-cyber-border pb-2">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scores */}
        <div className="card">
          <h2 className="section-title">📊 Risk Assessment</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Risk Score</span>
                <span className="text-cyber-accent font-bold">{incident.risk_score}/100</span>
              </div>
              <div className="h-2 bg-cyber-border rounded-full overflow-hidden">
                <div className="h-full bg-cyber-accent rounded-full transition-all" 
                  style={{ width: `${incident.risk_score}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Impact Score</span>
                <span className="text-red-400 font-bold">{incident.impact_score}/100</span>
              </div>
              <div className="h-2 bg-cyber-border rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all" 
                  style={{ width: `${incident.impact_score}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Root Cause */}
      <div className="card mb-6 bg-yellow-900/10 border-yellow-900/30">
        <h2 className="section-title text-yellow-500">⚠ Root Cause Analysis</h2>
        <p className="text-gray-300">{incident.root_cause}</p>
      </div>

      {/* Security Frameworks */}
      <div className="card mb-6">
        <h2 className="section-title">🛡️ Security Framework Mapping</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">MITRE ATT&CK Techniques</div>
            <div className="flex flex-wrap gap-2">
              {incident.mitre_techniques.map(t => (
                <a key={t} href={`https://attack.mitre.org/techniques/${t.replace('.', '/')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="badge bg-purple-900/40 text-purple-400 border border-purple-800 hover:bg-purple-800/40 transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">OWASP Category</div>
            <div className="badge bg-blue-900/40 text-blue-400 border border-blue-800">
              {incident.owasp_category}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">NIST Control</div>
            <div className="badge bg-green-900/40 text-green-400 border border-green-800">
              {incident.nist_control}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="card mb-6 bg-cyan-900/10 border-cyan-900/30">
        <h2 className="section-title text-cyber-accent">💡 Lessons Learned</h2>
        <p className="text-gray-300">{incident.lessons}</p>
      </div>

      {/* Related Incidents */}
      {relatedIncidents.length > 0 && (
        <div className="card">
          <h2 className="section-title">🔗 Related Incidents</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedIncidents.map(a => (
              <Link key={a.id} href={`/incident/${a.id}`}
                className="p-4 rounded-lg border border-cyber-border hover:border-cyber-accent/50 hover:bg-cyber-accent/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 font-mono">{a.date}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{a.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{a.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'attacks.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const attacks: Attack[] = JSON.parse(fileContents)
  const paths = attacks.map(a => ({ params: { id: a.id } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'attacks.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const attacks: Attack[] = JSON.parse(fileContents)
  const incident = attacks.find(a => a.id === params?.id)
  
  if (!incident) {
    return { notFound: true }
  }

  // Find related incidents (same industry or actor)
  const relatedIncidents = attacks
    .filter(a => 
      a.id !== incident.id && 
      (a.target_industry === incident.target_industry || a.actor === incident.actor)
    )
    .slice(0, 3)

  return {
    props: { incident, relatedIncidents }
  }
}
