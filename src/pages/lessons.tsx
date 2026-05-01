import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'
import Fuse from 'fuse.js'

interface Lesson {
  lesson: string
  incidents: Attack[]
  category: string
}

export default function Lessons() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [filtered, setFiltered] = useState<Lesson[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttacks().then(data => {
      setAttacks(data)
      
      // Extract unique lessons
      const lessonMap = new Map<string, Attack[]>()
      data.forEach(attack => {
        const existing = lessonMap.get(attack.lessons) || []
        lessonMap.set(attack.lessons, [...existing, attack])
      })

      const lessonsData = Array.from(lessonMap.entries()).map(([lesson, incidents]) => ({
        lesson,
        incidents,
        category: categorizeLesson(lesson)
      }))

      setLessons(lessonsData)
      setFiltered(lessonsData)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = lessons

    if (category !== 'all') {
      result = result.filter(l => l.category === category)
    }

    if (search) {
      const fuse = new Fuse(result, { keys: ['lesson'], threshold: 0.3 })
      result = fuse.search(search).map(r => r.item)
    }

    setFiltered(result)
  }, [search, category, lessons])

  const categories = ['all', 'Patch Management', 'Access Control', 'Network Security', 'Supply Chain', 'Detection', 'Other']

  return (
    <Layout title="Lessons Learned">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">📚 Lessons Learned Database</h1>
        <p className="text-gray-400 text-sm">Searchable security controls and best practices</p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search lessons..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 rounded bg-cyber-bg border border-cyber-border text-white placeholder-gray-500 focus:border-cyber-accent outline-none"
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-2 rounded bg-cyber-bg border border-cyber-border text-white focus:border-cyber-accent outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="text-sm text-gray-500 mb-4">
            {filtered.length} lesson{filtered.length !== 1 ? 's' : ''} found
          </div>

          <div className="space-y-4">
            {filtered.map((item, idx) => (
              <div key={idx} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-sm text-cyber-accent font-bold mb-1">{item.category}</div>
                    <div className="text-white">{item.lesson}</div>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {item.incidents.length} incident{item.incidents.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.incidents.map(incident => (
                    <span key={incident.id} className="text-xs px-2 py-1 rounded bg-cyber-bg border border-cyber-border text-gray-400">
                      {incident.name} ({incident.year})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-400 mb-2">No lessons found</h2>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

function categorizeLesson(lesson: string): string {
  const lower = lesson.toLowerCase()
  if (lower.includes('patch') || lower.includes('update') || lower.includes('vulnerability')) return 'Patch Management'
  if (lower.includes('mfa') || lower.includes('access') || lower.includes('authentication') || lower.includes('credential')) return 'Access Control'
  if (lower.includes('network') || lower.includes('segmentation') || lower.includes('firewall')) return 'Network Security'
  if (lower.includes('supply chain') || lower.includes('vendor') || lower.includes('third-party')) return 'Supply Chain'
  if (lower.includes('detection') || lower.includes('monitoring') || lower.includes('logging')) return 'Detection'
  return 'Other'
}
