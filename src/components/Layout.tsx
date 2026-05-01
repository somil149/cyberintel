import Head from 'next/head'
import Nav from './Nav'

interface Props {
  title: string
  description?: string
  children: React.ReactNode
}

export default function Layout({ title, description, children }: Props) {
  const defaultDescription = 'Comprehensive threat intelligence platform analyzing 21 years of cyber attacks, vulnerabilities, and security trends (2005-2026).'
  const desc = description || defaultDescription
  const fullTitle = `${title} — CyberIntel`
  const siteUrl = 'https://somil149.github.io/cyberintel'
  
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content="CyberIntel" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={desc} />
        
        {/* Additional */}
        <meta name="keywords" content="cybersecurity, threat intelligence, cyber attacks, CVE, MITRE ATT&CK, ransomware, security analysis" />
        <meta name="author" content="Somil Goyal" />
      </Head>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      <footer className="border-t border-cyber-border mt-12 py-6 text-center text-xs text-gray-600">
        CyberIntel · 2005–2026 · Data: NVD, CISA KEV, MITRE ATT&CK · For educational purposes
      </footer>
    </>
  )
}
