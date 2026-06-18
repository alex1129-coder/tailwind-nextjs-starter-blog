'use client'

import { useState } from 'react'

export default function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="text-sm text-[#1A4D3A]">已訂閱，感謝！</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">訂閱最新文章，直送信箱。</p>
      <input
        type="email"
        placeholder="your@email.com"
        disabled
        className="w-full cursor-not-allowed rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 placeholder-gray-300"
      />
      <button
        disabled
        className="w-full cursor-not-allowed rounded bg-gray-300 px-3 py-2 text-sm font-medium text-gray-500"
      >
        準備中...
      </button>
    </div>
  )
}
