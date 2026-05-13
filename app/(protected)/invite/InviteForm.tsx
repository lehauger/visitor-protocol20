'use client'
import { useState } from 'react'

export default function InviteForm({ employees, doors }: {
  employees: { id: string; name: string }[];
  doors: { id: string; name: string }[];
}) {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputCls = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorName: fd.get('visitorName'),
        visitorEmail: fd.get('visitorEmail'),
        visitorCompany: fd.get('visitorCompany') || null,
        doorId: fd.get('doorId'),
        hostEmployeeId: fd.get('hostEmployeeId'),
        visitDate: fd.get('visitDate'),
      }),
    })
    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div className="text-center py-4 space-y-2">
      <div className="text-3xl">&#10003;</div>
      <p className="text-green-700 font-medium">Invitasjon sendt!</p>
      <button onClick={() => setSuccess(false)} className="text-sm text-indigo-600 hover:underline">Send ny invitasjon</button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Navn <span className="text-red-500">*</span></label>
          <input name="visitorName" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-post <span className="text-red-500">*</span></label>
          <input name="visitorEmail" type="email" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
          <input name="visitorCompany" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dato for besøk <span className="text-red-500">*</span></label>
          <input name="visitDate" type="date" required className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vert <span className="text-red-500">*</span></label>
          <select name="hostEmployeeId" required className={inputCls}>
            <option value="">— Velg vert —</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inngang <span className="text-red-500">*</span></label>
          <select name="doorId" required className={inputCls}>
            <option value="">— Velg dør —</option>
            {doors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
        {loading ? 'Sender…' : 'Send invitasjon'}
      </button>
    </form>
  )
}
