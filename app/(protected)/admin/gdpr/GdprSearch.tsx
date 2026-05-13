'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Visit = { id: string; visitorName: string; visitorEmail: string; createdAt: Date; checkedInAt: Date | null; isAnonymized: boolean }

export default function GdprSearch({ initialEmail, visits }: { initialEmail: string; visits: Visit[] }) {
  const router = useRouter()
  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const inputCls = 'rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/admin/gdpr?email=${encodeURIComponent(email)}`)
  }

  async function handleExport() {
    setLoading(true)
    const res = await fetch('/api/admin/gdpr/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `gdpr-${email}.json`; a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  async function handleAnonymize() {
    if (!confirm(`Anonymiser alle besøk for ${email}? Dette kan ikke angres.`)) return
    setLoading(true)
    const res = await fetch('/api/admin/gdpr/anonymize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (res.ok) { setMessage('Anonymisering fullført.'); router.refresh() }
    else setMessage('Feil ved anonymisering.')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="besokende@eksempel.no" className={`${inputCls} flex-1`} />
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Søk
        </button>
      </form>

      {message && <p className="text-sm text-green-700">{message}</p>}

      {visits.length > 0 && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{visits.length} besøk funnet for {initialEmail}</span>
              <div className="flex gap-2">
                <button onClick={handleExport} disabled={loading}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >Last ned JSON</button>
                <button onClick={handleAnonymize} disabled={loading}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >Anonymiser</button>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left">Navn</th>
                  <th className="px-5 py-3 text-left">Innsjekk</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {visits.map(v => (
                  <tr key={v.id}>
                    <td className="px-5 py-3 text-gray-900">{v.visitorName}</td>
                    <td className="px-5 py-3 text-gray-600">{v.checkedInAt ? new Date(v.checkedInAt).toLocaleString('nb-NO') : '—'}</td>
                    <td className="px-5 py-3">{v.isAnonymized ? <span className="text-orange-600 text-xs">Anonymisert</span> : <span className="text-green-700 text-xs">Aktiv</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {initialEmail && visits.length === 0 && (
        <p className="text-sm text-gray-500">Ingen besøk funnet for denne e-postadressen.</p>
      )}
    </div>
  )
}
