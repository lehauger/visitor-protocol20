'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function VisitFilters() {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')
  const [from, setFrom] = useState(sp.get('from') ?? '')
  const [to, setTo] = useState(sp.get('to') ?? '')
  const [status, setStatus] = useState(sp.get('status') ?? 'all')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (status !== 'all') params.set('status', status)
    router.push(`/visits?${params.toString()}`)
  }

  const inputCls = 'rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Søk navn, e-post, firma, vert…" className={`${inputCls} flex-1 min-w-48`} />
      <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={inputCls} />
      <input type="date" value={to} onChange={e => setTo(e.target.value)} className={inputCls} />
      <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
        <option value="all">Alle</option>
        <option value="active">Inne nå</option>
        <option value="checkedout">Utsjekket</option>
      </select>
      <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Søk</button>
    </form>
  )
}
