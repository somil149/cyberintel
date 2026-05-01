/**
 * Risk Scoring, Root Cause Analysis, and Insights Engine
 * All logic runs client-side — no backend required.
 */
import type { Attack, CVE, Insights } from '@/types'

// ─── Risk Scoring ────────────────────────────────────────────────────────────

const INDUSTRY_CRITICALITY: Record<string, number> = {
  Energy: 1.3, Healthcare: 1.25, Finance: 1.2, Government: 1.15,
  Transportation: 1.1, Telecom: 1.1, Technology: 1.0, Retail: 0.9,
  Education: 0.85, Manufacturing: 0.95,
}

const SOPHISTICATION_MULTIPLIER: Record<string, number> = {
  'Nation-State': 1.2, 'Advanced': 1.1, 'Intermediate': 1.0, 'Low': 0.85,
  'Low-to-Advanced': 1.05,
}

/** Compute composite risk score (0–100) for an attack */
export function computeAttackRisk(a: Attack): number {
  const severityBase = { CRITICAL: 80, HIGH: 60, MEDIUM: 40, LOW: 20 }[a.severity] ?? 40
  const industryCrit = INDUSTRY_CRITICALITY[a.target_industry] ?? 1.0
  const sophMult = SOPHISTICATION_MULTIPLIER[a.sophistication] ?? 1.0
  const recordsBonus = a.records_affected > 1e8 ? 10 : a.records_affected > 1e6 ? 5 : 0
  const financialBonus = a.financial_impact_usd > 1e9 ? 10 : a.financial_impact_usd > 1e8 ? 5 : 0
  const raw = severityBase * industryCrit * sophMult + recordsBonus + financialBonus
  return Math.min(100, Math.round(raw))
}

/** Compute CVE risk score (0–100) */
export function computeCVERisk(cve: CVE): number {
  const cvssBase = (cve.score / 10) * 60
  const kevBonus = cve.in_kev ? 30 : 0
  const rwBonus = cve.ransomware_use === 'Known' ? 10 : 0
  return Math.min(100, Math.round(cvssBase + kevBonus + rwBonus))
}

// ─── Root Cause Analysis ─────────────────────────────────────────────────────

export type RootCauseCategory =
  | 'Unpatched System'
  | 'Credential Compromise'
  | 'Supply Chain'
  | 'Misconfiguration'
  | 'Social Engineering'
  | 'Zero-Day'
  | 'Insider Threat'
  | 'Physical Access'

const ROOT_CAUSE_PATTERNS: [RegExp, RootCauseCategory][] = [
  [/unpatched|patch|cve-|vulnerability|exploit/i, 'Unpatched System'],
  [/credential|password|mfa|vpn|phish|vish|social engineer/i, 'Credential Compromise'],
  [/supply chain|third.party|vendor|update|software/i, 'Supply Chain'],
  [/misconfigur|default|exposed|open port|s3 bucket/i, 'Misconfiguration'],
  [/social engineer|phish|vish|pretexting|helpdesk/i, 'Social Engineering'],
  [/zero.day|0.day|unknown vulnerability/i, 'Zero-Day'],
  [/insider|employee|contractor/i, 'Insider Threat'],
]

export function classifyRootCause(rootCause: string): RootCauseCategory {
  for (const [pattern, category] of ROOT_CAUSE_PATTERNS) {
    if (pattern.test(rootCause)) return category
  }
  return 'Misconfiguration'
}

export const ROOT_CAUSE_MITRE: Record<RootCauseCategory, string[]> = {
  'Unpatched System': ['T1190 (Exploit Public-Facing App)', 'T1210 (Exploitation of Remote Services)'],
  'Credential Compromise': ['T1078 (Valid Accounts)', 'T1110 (Brute Force)', 'T1539 (Steal Web Session Cookie)'],
  'Supply Chain': ['T1195 (Supply Chain Compromise)', 'T1072 (Software Deployment Tools)'],
  'Misconfiguration': ['T1190 (Exploit Public-Facing App)', 'T1083 (File and Directory Discovery)'],
  'Social Engineering': ['T1566 (Phishing)', 'T1621 (MFA Request Generation)'],
  'Zero-Day': ['T1190 (Exploit Public-Facing App)', 'T1203 (Exploitation for Client Execution)'],
  'Insider Threat': ['T1078 (Valid Accounts)', 'T1005 (Data from Local System)'],
  'Physical Access': ['T1200 (Hardware Additions)', 'T1091 (Replication Through Removable Media)'],
}

export const ROOT_CAUSE_OWASP: Record<RootCauseCategory, string> = {
  'Unpatched System': 'A06:2021 – Vulnerable and Outdated Components',
  'Credential Compromise': 'A07:2021 – Identification and Authentication Failures',
  'Supply Chain': 'A08:2021 – Software and Data Integrity Failures',
  'Misconfiguration': 'A05:2021 – Security Misconfiguration',
  'Social Engineering': 'A07:2021 – Identification and Authentication Failures',
  'Zero-Day': 'A06:2021 – Vulnerable and Outdated Components',
  'Insider Threat': 'A01:2021 – Broken Access Control',
  'Physical Access': 'A05:2021 – Security Misconfiguration',
}

export const ROOT_CAUSE_NIST: Record<RootCauseCategory, string[]> = {
  'Unpatched System': ['SI-2 (Flaw Remediation)', 'RA-5 (Vulnerability Monitoring)'],
  'Credential Compromise': ['IA-2 (Identification and Authentication)', 'IA-5 (Authenticator Management)'],
  'Supply Chain': ['SA-12 (Supply Chain Protection)', 'SR-3 (Supply Chain Controls)'],
  'Misconfiguration': ['CM-6 (Configuration Settings)', 'CM-7 (Least Functionality)'],
  'Social Engineering': ['AT-2 (Literacy Training)', 'IA-2 (MFA)'],
  'Zero-Day': ['SI-3 (Malicious Code Protection)', 'SI-7 (Software Integrity)'],
  'Insider Threat': ['AC-6 (Least Privilege)', 'PS-7 (External Personnel Security)'],
  'Physical Access': ['PE-3 (Physical Access Control)', 'MP-7 (Media Use)'],
}

export const ROOT_CAUSE_RECOMMENDATIONS: Record<RootCauseCategory, string[]> = {
  'Unpatched System': [
    'Implement automated patch management with SLA-based deadlines',
    'Maintain a complete asset inventory with vulnerability tracking',
    'Subscribe to vendor security advisories and CISA KEV alerts',
    'Prioritize patching based on CVSS score + KEV status',
  ],
  'Credential Compromise': [
    'Enforce phishing-resistant MFA (FIDO2/WebAuthn) on all remote access',
    'Implement privileged access workstations (PAWs) for admin accounts',
    'Deploy credential monitoring and dark web alerting',
    'Enforce password manager usage and eliminate password reuse',
  ],
  'Supply Chain': [
    'Implement software bill of materials (SBOM) for all dependencies',
    'Require vendor security assessments and contractual security standards',
    'Verify software signatures and checksums before deployment',
    'Apply zero-trust principles to all third-party integrations',
  ],
  'Misconfiguration': [
    'Implement infrastructure-as-code with security scanning in CI/CD',
    'Deploy cloud security posture management (CSPM) tools',
    'Conduct regular configuration audits against CIS benchmarks',
    'Eliminate default credentials and unnecessary exposed services',
  ],
  'Social Engineering': [
    'Deploy phishing-resistant MFA (FIDO2) — not SMS or TOTP',
    'Implement rigorous helpdesk identity verification procedures',
    'Conduct regular phishing simulations and security awareness training',
    'Establish out-of-band verification for sensitive requests',
  ],
  'Zero-Day': [
    'Implement defense-in-depth to limit blast radius of zero-days',
    'Deploy EDR/XDR with behavioral detection capabilities',
    'Apply network segmentation to contain lateral movement',
    'Participate in threat intelligence sharing programs',
  ],
  'Insider Threat': [
    'Implement least-privilege access with regular access reviews',
    'Deploy user and entity behavior analytics (UEBA)',
    'Establish data loss prevention (DLP) controls',
    'Implement multi-party authorization for sensitive operations',
  ],
  'Physical Access': [
    'Implement strict physical access controls with logging',
    'Disable USB ports and removable media on sensitive systems',
    'Deploy endpoint detection for removable media',
    'Conduct regular physical security audits',
  ],
}

// ─── Insights Engine ─────────────────────────────────────────────────────────

export interface AttackInsight {
  attack: Attack
  rootCauseCategory: RootCauseCategory
  mitreMappings: string[]
  owaspMapping: string
  nistControls: string[]
  recommendations: string[]
  computedRisk: number
}

export function analyzeAttack(a: Attack): AttackInsight {
  const rootCauseCategory = classifyRootCause(a.root_cause)
  return {
    attack: a,
    rootCauseCategory,
    mitreMappings: ROOT_CAUSE_MITRE[rootCauseCategory],
    owaspMapping: ROOT_CAUSE_OWASP[rootCauseCategory],
    nistControls: ROOT_CAUSE_NIST[rootCauseCategory],
    recommendations: ROOT_CAUSE_RECOMMENDATIONS[rootCauseCategory],
    computedRisk: computeAttackRisk(a),
  }
}

/** Aggregate insights across all attacks */
export function aggregateInsights(attacks: Attack[]) {
  const rootCauseCounts: Record<string, number> = {}
  const typeCounts: Record<string, number> = {}
  const industryCounts: Record<string, number> = {}
  const yearRisks: Record<number, number[]> = {}

  for (const a of attacks) {
    const rc = classifyRootCause(a.root_cause)
    rootCauseCounts[rc] = (rootCauseCounts[rc] || 0) + 1
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1
    industryCounts[a.target_industry] = (industryCounts[a.target_industry] || 0) + 1
    ;(yearRisks[a.year] = yearRisks[a.year] || []).push(a.risk_score)
  }

  const topRootCauses = Object.entries(rootCauseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const avgRiskByYear = Object.entries(yearRisks)
    .map(([year, scores]) => ({
      year: Number(year),
      avgRisk: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
    }))
    .sort((a, b) => a.year - b.year)

  const highRiskYears = avgRiskByYear.filter(y => y.avgRisk >= 85).map(y => y.year)

  return { topRootCauses, avgRiskByYear, highRiskYears, typeCounts, industryCounts }
}

/** Simple linear regression for trend prediction */
export function linearRegression(data: number[]): { slope: number; predict: (x: number) => number } {
  const n = data.length
  const xs = Array.from({ length: n }, (_, i) => i)
  const xMean = xs.reduce((s, x) => s + x, 0) / n
  const yMean = data.reduce((s, y) => s + y, 0) / n
  const slope = xs.reduce((s, x, i) => s + (x - xMean) * (data[i] - yMean), 0) /
    xs.reduce((s, x) => s + (x - xMean) ** 2, 0)
  const intercept = yMean - slope * xMean
  return { slope, predict: (x: number) => slope * x + intercept }
}
