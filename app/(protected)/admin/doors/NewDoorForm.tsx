'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewDoorForm({ locations }: { locations: { id: string; name: string }[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const inputCls = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    await fetch('/api/admin/doors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationId: fd.get('locationId'), name: fd.get('name') }),
    })
    setLoading(false)
    router.refresh()
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select name="locationId" required className={inputCls}>
        <option value="">— Velg lokasjon —</option>
        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>
      <input name="name" required placeholder="Dørnavn (f.eks. Hovedinngang)" className={inputCls} />
      <button type="submit" disabled={loading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >{loading ? 'Lagrer…' : 'Legg til dør'}</button>
    </form>
  )
}
