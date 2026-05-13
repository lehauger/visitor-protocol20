'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InviteCheckinForm({ inviteToken, visit }: {
  inviteToken: string
  visit: { visitorName: string; visitorEmail: string; visitorCompany: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termsAccepted) return
    setLoading(true)
    await fetch(`/api/visits/invite/${inviteToken}/checkin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ termsAccepted }) })
    router.push(`/checkin/confirmation?name=${encodeURIComponent(visit.visitorName)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 space-y-1">
        <p><strong>Navn:</strong> {visit.visitorName}</p>
        <p><strong>E-post:</strong> {visit.visitorEmail}</p>
        {visit.visitorCompany && <p><strong>Firma:</strong> {visit.visitorCompany}</p>}
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" id="terms" required checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1" />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Jeg godtar <a href="/terms" className="text-indigo-600 underline">personvernreglene</a>
        </label>
      </div>
      <button type="submit" disabled={loading || !termsAccepted} className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
        {loading ? 'Sjekker inn…' : 'Bekreft innsjekk'}
      </button>
    </form>
  )
}
