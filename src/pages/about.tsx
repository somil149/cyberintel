import Layout from '@/components/Layout'
import Image from 'next/image'

const EXPERIENCE = [
  {
    role: 'Senior Specialist Architect',
    company: 'NICE Interactive Solutions',
    location: 'Noida, India (Remote)',
    period: 'Aug 2024 – Mar 2026',
    highlights: [
      'Architected infrastructure, platform & application security across cloud environments aligned with Zero Trust, NIST, ISO 27001, CIS Controls, SOC 2',
      'Integrated AWS WAF mitigating OWASP Top 10 threats — reduced internet-facing attack exposure by 40%',
      'Embedded DevSecOps (SAST, DAST, SCA) across 100+ CI/CD pipelines for automated app security testing',
      'Led product & AI model vulnerability management — reduced critical/high vulnerabilities by 40%',
      'Integrated CSPM (Wiz, Orca) for automated cloud risk detection, compliance monitoring & reporting',
      'Enabled SOAR integration for automated incident response workflows and 24/7 SOC monitoring',
      'Led enterprise vulnerability management — cut critical/high vulnerabilities by 60% in one year',
    ],
  },
  {
    role: 'IT Infrastructure Architect',
    company: 'Pine Labs',
    location: 'Noida, India',
    period: 'Nov 2021 – Aug 2024',
    highlights: [
      'Architected high-availability infrastructure supporting 15K+ TPS during festive peaks',
      'Delivered containerized platform (EKS/AKS) for transaction processing, reconciliation & settlement',
      'Deployed F5 load balancers + WAF with API-based routing; sustained 3x festive load',
      'Implemented API Gateway (Kong) + Istio service mesh ensuring zero-trust security, mTLS across 500+ services',
      'Designed multi-region DR (RTO 2hrs) protecting $500M+ daily transaction volume',
      'Led PCI-DSS v4.0 Level 1, ISO 27001:2022, and SOC 2 Type II certification',
    ],
  },
  {
    role: 'Senior Network Advisor',
    company: 'NTT Data',
    location: 'Noida, India',
    period: 'May 2021 – Nov 2021',
    highlights: [
      'Led network + security transformation for global enterprise clients — 98%+ SLA across 200+ global sites',
      'Designed SD-WAN + SASE architecture replacing legacy MPLS; reduced latency 40%',
      'Architected Zero Trust Network Access (ZTNA) for remote workforce',
    ],
  },
  {
    role: 'Consultant / SME',
    company: 'HCL Technologies',
    location: 'Noida, India',
    period: 'Jan 2016 – May 2021',
    highlights: [
      'SME for leading trading client — LAN/WAN network and security infrastructure',
      'Migrated data centers from Nexus to ACI infrastructure',
      'Assisted with complex cloud migration strategies for applications, databases, storage & network',
    ],
  },
]

const PROJECTS = [
  { name: 'Enterprise WAF Deployment', desc: 'Architected F5 WAF + GLB for critical apps; mitigated OWASP Top 10, cut attack surface 45%, integrated SOC workflows' },
  { name: 'SIEM & Threat Detection', desc: 'Built Microsoft Sentinel with automated threat hunting + correlation rules; slashed MTTR 60%' },
  { name: 'DevSecOps Pipeline Security', desc: 'Embedded SAST/DAST/SCA across 200+ CI/CD pipelines; zero critical vulns in prod, 40% faster releases' },
  { name: 'Automated Patching & Vuln Mgmt', desc: 'AWS SSM + agentic AI workflows; patched 10K+ assets, eliminated 95% critical vulns within SLA, zero ransomware' },
  { name: 'Zero Trust Network (ZTNA/SASE)', desc: 'Deployed ZTNA + SASE hybrid-wide; blocked 12M unauthorized attempts, secured remote workforce' },
  { name: 'AI Security Orchestration', desc: 'AI-integrated remediation; automated 70% incident response, cut manual effort 80%' },
  { name: 'CSPM & Cloud Protection', desc: 'Wiz/Orca CSPM deployment; remediated 500+ misconfigs, 100% multi-cloud compliance' },
  { name: 'Mission-Critical DR', desc: 'RTO <1hr architecture with immutable backups; passed 3x audits, zero data loss' },
]

const SKILLS = [
  'Zero Trust Architecture', 'AWS / Azure Security', 'SIEM / SOAR', 'DevSecOps',
  'CNAPP (Wiz, Orca)', 'WAF / CDN / Perimeter Security', 'ZTNA / SASE', 'Kubernetes Security',
  'IAM (Entra ID, OAuth, SAML, SSO)', 'VAPT / Threat Modeling', 'NIST / ISO 27001 / PCI-DSS / SOC 2',
  'Terraform / CloudFormation', 'EDR / XDR', 'API Security', 'AI-driven Security Analytics',
]

const CERTS = [
  'Cisco CCNA, CCNP R&S, CCIE Written',
  'Juniper JNCIA, JNCIS',
  'Azure AZ-100, AZ-300, AZ-301',
  'F5 Certified (F5-101, F5-201)',
  'Palo Alto ACE Certified',
  'AWS Security Architect Workshop',
  'CISSP Workshop Attendee',
  'CCSP Workshop Attendee',
  'ITIL Foundation, SO, CSI',
  'Riverbed RCSA, RCSP',
]

export default function About() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return (
    <Layout title="About">
      {/* Hero */}
      <div className="relative mb-10 py-8 px-6 rounded-xl overflow-hidden border border-cyber-border">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #00d4ff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg via-cyber-bg/80 to-transparent" />
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Photo */}
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyber-accent/50 shadow-lg shadow-cyber-accent/10">
              <img
                src={`${basePath}/somil.png`}
                alt="Somil Goyal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Bio */}
          <div>
            <div className="flex items-center gap-2 text-cyber-accent text-xs tracking-widest mb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
              SECURITY ARCHITECT · BUILDER
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Somil Goyal</h1>
            <p className="text-gray-400 text-sm mb-3">Senior Infrastructure, Platform & Application Security Architect · Noida, India</p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
              Senior Cloud, Infrastructure & Application Security Architect with 16+ years of experience designing,
              implementing, and integrating security across infrastructure, platforms, and data environments.
              Reduced enterprise risk exposure by 60%+, secured 200+ CI/CD pipelines, and led large-scale cloud
              and security transformation initiatives.
            </p>
            {/* Contact links */}
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="https://linkedin.com/in/somil-cybersecurity-architect" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-cyber-accent transition-colors text-xs">
                <span>🔗</span> LinkedIn
              </a>
              <a href="mailto:goyal.somil2011@gmail.com"
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-cyber-accent transition-colors text-xs">
                <span>✉️</span> goyal.somil2011@gmail.com
              </a>
              <a href="tel:+918010897851"
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-cyber-accent transition-colors text-xs">
                <span>📞</span> +91 80 1089 7851
              </a>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded border border-green-800 bg-green-900/20 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Immediate Joiner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About this project */}
      <div className="card mb-8 border-cyber-accent/20">
        <h2 className="section-title">⬡ About CyberIntel</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          CyberIntel is a free, open-source cybersecurity intelligence platform I built to demonstrate
          21 years of real-world attack trends, threat actor profiles, CVE intelligence, and MITRE ATT&CK
          analysis — all as a fully static site with no backend. It combines my expertise in threat modeling,
          security architecture, and data engineering to make professional-grade threat intelligence accessible to everyone.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Leaflet.js', 'D3.js', 'Python', 'GitHub Pages'].map(t => (
            <span key={t} className="badge bg-cyber-bg border border-cyber-border text-gray-300 text-xs">{t}</span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Skills */}
        <div className="card md:col-span-2">
          <h2 className="section-title">🛡️ Core Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(s => (
              <span key={s} className="badge bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 text-xs">{s}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {[
            { label: 'Years Experience', value: '16+', color: 'text-cyber-accent' },
            { label: 'Risk Exposure Reduced', value: '60%+', color: 'text-green-400' },
            { label: 'CI/CD Pipelines Secured', value: '200+', color: 'text-orange-400' },
            { label: 'Assets Patched', value: '10K+', color: 'text-purple-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
              <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="card mb-8">
        <h2 className="section-title">💼 Professional Experience</h2>
        <div className="space-y-6">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className={`relative pl-4 border-l-2 ${i === 0 ? 'border-cyber-accent' : 'border-cyber-border'}`}>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-bold text-white">{exp.role}</div>
                  <div className="text-sm text-cyber-accent">{exp.company}</div>
                  <div className="text-xs text-gray-500">{exp.location}</div>
                </div>
                <span className="badge bg-cyber-bg border border-cyber-border text-gray-400 text-xs shrink-0">{exp.period}</span>
              </div>
              <ul className="space-y-1">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-cyber-accent mt-0.5 shrink-0">▸</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key Projects */}
      <div className="card mb-8">
        <h2 className="section-title">🚀 Key Projects</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {PROJECTS.map(({ name, desc }) => (
            <div key={name} className="bg-cyber-bg border border-cyber-border rounded-lg p-3 hover:border-cyber-accent/40 transition-colors">
              <div className="font-bold text-white text-sm mb-1">{name}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Certs + Education */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title">🏆 Certifications</h2>
          <ul className="space-y-1.5">
            {CERTS.map(c => (
              <li key={c} className="flex items-center gap-2 text-xs text-gray-300">
                <span className="text-cyber-accent">▸</span>{c}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="section-title">🎓 Education</h2>
          <div className="mb-4">
            <div className="font-bold text-white">B.Tech — Electronics & Telecommunication Engineering</div>
            <div className="text-sm text-cyber-accent">Kalinga University (KIIT), Bhubaneswar</div>
            <div className="text-xs text-gray-500 mt-1">Graduated 2008 · GPA: 80%</div>
            <ul className="mt-2 space-y-1">
              {['2nd prize — State Level C Programming Competition', 'KIIT Scholarship recipient', 'Member of KIIT Alumni & Union Club'].map(a => (
                <li key={a} className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="text-cyber-accent">▸</span>{a}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-cyber-border">
            <h3 className="text-sm font-bold text-white mb-2">Connect</h3>
            <div className="space-y-2 text-xs">
              <a href="https://linkedin.com/in/somil-cybersecurity-architect" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyber-accent hover:underline">
                🔗 linkedin.com/in/somil-cybersecurity-architect
              </a>
              <a href="mailto:goyal.somil2011@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white">
                ✉️ goyal.somil2011@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
