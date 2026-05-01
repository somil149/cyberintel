import Layout from '@/components/Layout'
import Image from 'next/image'

export default function About() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return (
    <Layout title="About">
      {/* Hero */}
      <div className="relative mb-10 py-12 px-8 rounded-xl overflow-hidden border border-cyber-border">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #00d4ff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg via-cyber-bg/80 to-transparent" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyber-accent shrink-0">
            <Image
              src={`${basePath}/somil.png`}
              alt="Somil Goyal"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">Somil Goyal</h1>
            <p className="text-xl text-cyber-accent mb-4">Security Architect · Builder · Innovator</p>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
              16+ years architecting security at scale. Reduced enterprise risk by 60%+, secured 200+ CI/CD pipelines, 
              and led transformations across cloud, infrastructure, and application security.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <a href="https://linkedin.com/in/somil-cybersecurity-architect" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded border border-cyber-accent text-cyber-accent hover:bg-cyber-accent/10 transition-colors text-sm">
                🔗 LinkedIn
              </a>
              <a href="mailto:goyal.somil2011@gmail.com"
                className="px-4 py-2 rounded border border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-cyber-accent transition-colors text-sm">
                ✉️ Email
              </a>
              <a href="tel:+918010897851"
                className="px-4 py-2 rounded border border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-cyber-accent transition-colors text-sm">
                📞 Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* About CyberIntel */}
      <div className="card mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">⬡ About CyberIntel</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          CyberIntel is a free, open-source threat intelligence platform analyzing 21 years of real-world cyber attacks. 
          Built as a fully static site with no backend, it demonstrates how modern web technologies can deliver 
          professional-grade security intelligence accessible to everyone.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This platform combines threat modeling, security architecture, and data engineering to visualize attack trends, 
          threat actor profiles, CVE intelligence, and MITRE ATT&CK analysis — all deployable on GitHub Pages.
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {['Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Leaflet.js', 'D3.js', 'GitHub Pages'].map(tech => (
            <span key={tech} className="px-3 py-1 rounded bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-cyber-accent mb-1">16+</div>
          <div className="text-xs text-gray-500">Years Experience</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">60%</div>
          <div className="text-xs text-gray-500">Risk Reduction</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-orange-400 mb-1">200+</div>
          <div className="text-xs text-gray-500">Pipelines Secured</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">10K+</div>
          <div className="text-xs text-gray-500">Assets Protected</div>
        </div>
      </div>

      {/* Core Expertise */}
      <div className="card mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">🛡️ Core Expertise</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-cyber-accent font-bold mb-3">Cloud Security</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Zero Trust Architecture</li>
              <li>• AWS / Azure Security</li>
              <li>• CSPM / CNAPP (Wiz, Orca)</li>
              <li>• Multi-cloud Compliance</li>
            </ul>
          </div>
          <div>
            <h3 className="text-cyber-accent font-bold mb-3">Application Security</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• DevSecOps Integration</li>
              <li>• SAST / DAST / SCA</li>
              <li>• API Security</li>
              <li>• WAF / Perimeter Defense</li>
            </ul>
          </div>
          <div>
            <h3 className="text-cyber-accent font-bold mb-3">Security Operations</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• SIEM / SOAR</li>
              <li>• Threat Detection & Response</li>
              <li>• Vulnerability Management</li>
              <li>• Compliance (ISO, PCI, SOC 2)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Achievements */}
      <div className="card mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">🚀 Key Achievements</h2>
        <div className="space-y-4">
          {[
            { title: 'Enterprise WAF Deployment', impact: '45% attack surface reduction', desc: 'Architected F5 WAF protecting critical applications' },
            { title: 'DevSecOps Transformation', impact: 'Zero critical vulnerabilities in production', desc: 'Embedded security across 200+ CI/CD pipelines' },
            { title: 'Automated Vulnerability Management', impact: '95% critical vulnerabilities eliminated', desc: 'AI-driven patching for 10K+ assets' },
            { title: 'Zero Trust Implementation', impact: '12M unauthorized attempts blocked', desc: 'ZTNA/SASE deployment securing remote workforce' },
          ].map((achievement, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-accent/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-cyber-accent/20 flex items-center justify-center text-cyber-accent font-bold shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white">{achievement.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">{achievement.impact}</span>
                </div>
                <p className="text-sm text-gray-400">{achievement.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">🎓 Education</h2>
          <div className="text-gray-400">
            <div className="font-bold text-white">B.Tech — Electronics & Telecommunication</div>
            <div className="text-sm">Kalinga University (KIIT), Bhubaneswar</div>
            <div className="text-sm text-gray-500 mt-1">Graduated 2008 · GPA: 80%</div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">🏆 Certifications</h2>
          <div className="text-sm text-gray-400 space-y-1">
            <div>• Cisco CCNA, CCNP R&S, CCIE Written</div>
            <div>• Azure AZ-100, AZ-300, AZ-301</div>
            <div>• F5 Certified, Palo Alto ACE</div>
            <div>• CISSP & CCSP Workshop Attendee</div>
          </div>
        </div>
      </div>

      {/* Connect */}
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Let's Connect</h2>
        <p className="text-gray-400 mb-6">
          Open to discussing security architecture, threat intelligence, or collaboration opportunities.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="https://linkedin.com/in/somil-cybersecurity-architect" target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 rounded bg-cyber-accent text-cyber-bg font-bold hover:bg-cyber-accent/90 transition-colors">
            Connect on LinkedIn
          </a>
          <a href="mailto:goyal.somil2011@gmail.com"
            className="px-6 py-3 rounded border border-cyber-accent text-cyber-accent hover:bg-cyber-accent/10 transition-colors">
            Send Email
          </a>
        </div>
      </div>
    </Layout>
  )
}
