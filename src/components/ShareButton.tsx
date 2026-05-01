import { useState } from 'react'

interface ShareButtonProps {
  title: string
  text?: string
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  const shareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedInUrl, '_blank')
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="px-3 py-1.5 rounded text-xs border border-cyber-border hover:border-cyber-accent text-gray-400 hover:text-cyber-accent transition-colors"
      >
        {copied ? '✓ Copied!' : '🔗 Copy Link'}
      </button>
      <button
        onClick={shareTwitter}
        className="px-3 py-1.5 rounded text-xs border border-cyber-border hover:border-blue-400 text-gray-400 hover:text-blue-400 transition-colors"
      >
        𝕏 Share
      </button>
      <button
        onClick={shareLinkedIn}
        className="px-3 py-1.5 rounded text-xs border border-cyber-border hover:border-blue-500 text-gray-400 hover:text-blue-500 transition-colors"
      >
        in Share
      </button>
    </div>
  )
}
