'use client'
import { useState } from 'react'

export default function DoorCheckoutForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/visits/checkout-by-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)
    setMessage(res.ok ? `✓ ${data.visitorName} er nå utsjekket.` : (data.error ?? 'Fant ingen aktiv innsjekk.'))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <p className={`text-sm ${message.startsWith('✓') ? 'text-green-700' : 'text-red-600'}`}>{message}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Din e-postadresse</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="deg@eksempel.no"
        />
      </div>
      <button type="submit" disabled={loading}
        className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? 'Leter…' : 'Sjekk ut'}
      </button>
    </form>
  )
}
