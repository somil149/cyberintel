export interface Attack {
  id: string
  name: string
  year: number
  date: string
  type: string
  vector: string
  actor: string
  origin: string
  target_country: string
  target_industry: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  risk_score: number
  impact_score: number
  sophistication: string
  records_affected: number
  financial_impact_usd: number
  description: string
  root_cause: string
  mitre_techniques: string[]
  owasp_category: string
  nist_control: string
  lessons: string
  lat: number
  lng: number
}

export interface CVE {
  id: string
  description: string
  score: number
  severity: string
  published: string
  year: string
  attack_vector: string
  in_kev: boolean
  ransomware_use: string
  risk_score: number
  vendor: string
  product: string
}

export interface StoryEntry {
  year: number
  era: string
  title: string
  summary: string
  key_events: string[]
  paradigm_shift: string
  dominant_attack: string
  top_industry: string
  risk_level: number
  lesson: string
  defensive_focus: string
}

export interface Insights {
  severity_trend: Record<string, { total: number; critical: number; high: number; avg_score: number; kev_count: number }>
  attack_type_distribution: Record<string, number>
  industry_impact: Record<string, { incidents: number; avg_risk: number; total_records: number }>
  root_cause_distribution: Record<string, number>
  yearly_attacks: Record<string, number>
  financial_impact_by_year: Record<string, number>
  top_failure_patterns: Array<{ pattern: string; frequency: number; avg_impact: number }>
  time_to_exploit_trend: Record<string, number>
  predictions: Record<string, { estimated_attacks: number; estimated_cves: number; top_vector: string }>
  generated_at: string
  total_cves_analyzed: number
  mitre_technique_count: number
}
