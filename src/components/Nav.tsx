import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'

const GROUPS = [
  {
    label: 'Explore',
    items: [
      { href: '/', label: 'Overview', desc: 'Global stats & key metrics' },
      { href: '/timeline', label: 'Timeline', desc: '21-year attack history' },
      { href: '/story', label: 'Story Mode', desc: 'Year-by-year narrative' },
      { href: '/bookmarks', label: 'Bookmarks', desc: 'Your saved incidents' },
    ],
  },
  {
    label: 'Analyze',
    items: [
      { href: '/trends', label: 'Trends', desc: 'CVE severity & attack evolution' },
      { href: '/cve', label: 'CVE Intel', desc: 'Top exploited vulnerabilities' },
      { href: '/mitre', label: 'ATT&CK Heatmap', desc: 'Technique frequency matrix' },
      { href: '/rca', label: 'Root Cause', desc: 'Failure pattern analysis' },
      { href: '/compare', label: 'Compare', desc: 'Side-by-side comparison' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/incidents', label: 'Incidents', desc: 'Filter & drill into incidents' },
      { href: '/actors', label: 'Threat Actors', desc: 'Nation-state & criminal profiles' },
      { href: '/ransomware', label: 'Ransomware', desc: 'Dedicated ransomware tracker' },
      { href: '/scorecard', label: 'Sector Scorecard', desc: 'Industry risk comparison' },
      { href: '/map', label: 'Threat Map', desc: 'Geographic attack visualization' },
      { href: '/attack-chain', label: 'Attack Chain', desc: 'Kill chain visualizer' },
      { href: '/relationships', label: 'Relationships', desc: 'Incident connections' },
      { href: '/lessons', label: 'Lessons', desc: 'Security controls database' },
    ],
  },
]

function Dropdown({ group, pathname }: { group: typeof GROUPS[0]; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = group.items.some(i => i.href === pathname)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
          isActive
            ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {group.label}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-cyber-surface border border-cyber-border rounded-lg shadow-xl shadow-black/50 z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-cyber-border">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{group.label}</span>
          </div>
          {group.items.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex flex-col px-3 py-2.5 hover:bg-cyber-border/50 transition-colors border-b border-cyber-border/50 last:border-0 ${
                pathname === href ? 'bg-cyber-accent/10' : ''
              }`}
            >
              <span className={`text-sm font-medium ${pathname === href ? 'text-cyber-accent' : 'text-white'}`}>
                {label}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5">{desc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  const { pathname } = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-cyber-bg/95 backdrop-blur border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-cyber-accent font-bold text-sm tracking-widest shrink-0">
          <span className="text-lg">⬡</span> CYBERINTEL
        </Link>

        {/* Desktop dropdowns */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/about"
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              pathname === '/about'
                ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30'
                : 'text-gray-400 hover:text-white'
            }`}>
            About
          </Link>
          {GROUPS.map(g => <Dropdown key={g.label} group={g} pathname={pathname} />)}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link href="/search"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs transition-colors ${
              pathname === '/search'
                ? 'border-cyber-accent text-cyber-accent bg-cyber-accent/10'
                : 'border-cyber-border text-gray-400 hover:border-cyber-accent hover:text-cyber-accent'
            }`}>
            <span>🔍</span>
            <span className="hidden sm:inline">Search</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu — grouped */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cyber-border bg-cyber-surface max-h-[80vh] overflow-y-auto">
          <Link href="/about" onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-4 py-3 border-b border-cyber-border ${
              pathname === '/about' ? 'text-cyber-accent bg-cyber-accent/5' : 'text-gray-300'
            }`}>
            <span className="text-sm font-medium">About</span>
          </Link>
          {GROUPS.map(g => (
            <div key={g.label}>
              <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold bg-cyber-bg/50">
                {g.label}
              </div>
              {g.items.map(({ href, label, desc }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 border-b border-cyber-border/50 ${
                    pathname === href ? 'text-cyber-accent bg-cyber-accent/5' : 'text-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-gray-600">{desc}</span>
                </Link>
              ))}
            </div>
          ))}
          <Link href="/search" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-gray-300 border-t border-cyber-border">
            <span>🔍</span> <span className="text-sm font-medium">Search</span>
          </Link>
        </div>
      )}
    </nav>
  )
}
