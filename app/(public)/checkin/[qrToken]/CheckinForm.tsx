'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Employee = { id: string; name: string; email: string }

export default function CheckinForm({ doorId, employees }: { doorId: string; employees: Employee[] }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doorId,
        visitorName: fd.get('visitorName'),
        visitorEmail: fd.get('visitorEmail'),
        visitorPhone: fd.get('visitorPhone') || null,
        visitorCompany: fd.get('visitorCompany') || null,
        hostEmployeeId: fd.get('hostEmployeeId'),
        termsAccepted: fd.get('termsAccepted') === 'on',
      }),
    })
    setLoading(false)
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Noe gikk galt')
      return
    }
    const data = await res.json()
    router.push(`/checkin/confirmation?name=${encodeURIComponent(data.visitorName)}`)
  }

  const inputCls = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Navn <span className="text-red-500">*</span></label>
        <input name="visitorName" required className={inputCls} placeholder="Ola Nordmann" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-post <span className="text-red-500">*</span></label>
        <input name="visitorEmail" type="email" required className={inputCls} placeholder="ola@eksempel.no" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobilnummer</label>
        <input name="visitorPhone" type="tel" className={inputCls} placeholder="+47 900 00 000" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
        <input name="visitorCompany" className={inputCls} placeholder="Firmanavn AS" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hvem skal du møte? <span className="text-red-500">*</span></label>
        <select name="hostEmployeeId" required className={inputCls}>
          <option value="">— Velg ansatt —</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-start gap-2">
        <input name="termsAccepted" type="checkbox" required className="mt-1" id="terms" />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Jeg godtar at mine opplysninger lagres i henhold til{' '}
          <a href="/terms" className="text-indigo-600 underline">personvernreglene</a>
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? 'Sjekker inn…' : 'Sjekk inn'}
      </button>
    </form>
  )
}
