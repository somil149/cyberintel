import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkButtonProps {
  id: string
  size?: 'sm' | 'md'
}

export function BookmarkButton({ id, size = 'md' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(id)

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  return (
    <button
      onClick={() => toggleBookmark(id)}
      className={`${sizeClasses} rounded border transition-colors ${
        bookmarked
          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
          : 'border-cyber-border text-gray-400 hover:border-yellow-500 hover:text-yellow-400'
      }`}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? '★' : '☆'} {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}
