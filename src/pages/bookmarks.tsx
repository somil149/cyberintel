import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import AttackCard from '@/components/AttackCard'
import { useBookmarks } from '@/hooks/useBookmarks'
import { loadAttacks } from '@/lib/data'
import type { Attack } from '@/types'

export default function Bookmarks() {
  const { bookmarks } = useBookmarks()
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttacks().then(data => {
      const bookmarkedAttacks = data.filter(a => bookmarks.includes(a.id))
      setAttacks(bookmarkedAttacks)
      setLoading(false)
    })
  }, [bookmarks])

  return (
    <Layout title="Bookmarks">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Bookmarked Incidents</h1>
        <p className="text-gray-400 text-sm">
          {bookmarks.length} incident{bookmarks.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : attacks.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">☆</div>
          <h2 className="text-xl font-bold text-gray-400 mb-2">No bookmarks yet</h2>
          <p className="text-gray-500 text-sm">
            Browse incidents and click the bookmark button to save them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attacks.map(attack => (
            <AttackCard key={attack.id} a={attack} />
          ))}
        </div>
      )}
    </Layout>
  )
}
