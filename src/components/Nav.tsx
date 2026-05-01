import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const NAV = [
  { href: '/', label: 'Overview', icon: '⬡' },
  { href: '/timeline', label: 'Timeline', icon: '◈' },
  { href: '/trends', label: 'Trends', icon: '◉' },
  { href: '/incidents', label: 'Incidents', icon: '◎' },
  { href: '/map', label: 'Threat Map', icon: '◈' },
  { href: '/cve', label: 'CVE Intel', icon: '◆' },
  { href: '/mitre', label: 'ATT&CK', icon: '⬡' },
  { href: '/actors', label: 'Actors', icon: '◈' },
  { href: '/scorecard', label: 'Scorecard', icon: '◉' },
  { href: '/rca', label: 'Root Cause', icon: '⚙' },
  { href: '/story', label: 'Story Mode', icon: '◇' },
]

export default function Nav() {
  const { pathname } = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-cyber-bg/95 backdrop-blur border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 text-cyber-accent font-bold text-sm tracking-widest">
          <span className="text-lg">⬡</span> CYBERINTEL
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                pathname === href
                  ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-cyber-border bg-cyber-surface">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-cyber-border ${
                pathname === href ? 'text-cyber-accent' : 'text-gray-400'
              }`}
            >
              <span>{icon}</span> {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
