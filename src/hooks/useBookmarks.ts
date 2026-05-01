import { useState, useEffect } from 'react'

const STORAGE_KEY = 'cyberintel_bookmarks'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setBookmarks(JSON.parse(stored))
    }
  }, [])

  const addBookmark = (id: string) => {
    const updated = [...bookmarks, id]
    setBookmarks(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b !== id)
    setBookmarks(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const isBookmarked = (id: string) => bookmarks.includes(id)

  const toggleBookmark = (id: string) => {
    if (isBookmarked(id)) {
      removeBookmark(id)
    } else {
      addBookmark(id)
    }
  }

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark }
}
