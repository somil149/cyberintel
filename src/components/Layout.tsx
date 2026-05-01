import Head from 'next/head'
import Nav from './Nav'

interface Props {
  title: string
  children: React.ReactNode
}

export default function Layout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} — CyberIntel</title>
      </Head>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      <footer className="border-t border-cyber-border mt-12 py-6 text-center text-xs text-gray-600">
        CyberIntel · 2005–2025 · Data: NVD, CISA KEV, MITRE ATT&CK · For educational purposes
      </footer>
    </>
  )
}
