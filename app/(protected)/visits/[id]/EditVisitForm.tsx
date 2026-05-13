'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Fields = { visitorName: string; visitorEmail: string; visitorPhone: string; visitorCompany: string }

export default function EditVisitForm({ visitId, visit }: { visitId: string; visit: Fields }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const inputCls = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch(`/api/visits/${visitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorName: fd.get('visitorName'),
        visitorEmail: fd.get('visitorEmail'),
        visitorPhone: fd.get('visitorPhone') || null,
        visitorCompany: fd.get('visitorCompany') || null,
      }),
    })
    setLoading(false)
    if (res.ok) { setMessage('Lagret.'); router.refresh() }
    else setMessage('Feil ved lagring.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {message && <p className="text-sm text-green-700">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Navn</label>
          <input name="visitorName" defaultValue={visit.visitorName} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">E-post</label>
          <input name="visitorEmail" type="email" defaultValue={visit.visitorEmail} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
          <input name="visitorPhone" defaultValue={visit.visitorPhone} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Firma</label>
          <input name="visitorCompany" defaultValue={visit.visitorCompany} className={inputCls} />
        </div>
      </div>
      <button type="submit" disabled={loading} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
        {loading ? 'Lagrer…' : 'Lagre endringer'}
      </button>
    </form>
  )
}
