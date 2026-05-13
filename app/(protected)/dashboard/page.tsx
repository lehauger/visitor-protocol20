import { db } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const visits = await db.visit.findMany({
    where: { checkedInAt: { gte: todayStart } },
    include: { host: { select: { name: true } } },
    orderBy: { checkedInAt: 'desc' },
  })

  const insideNow = visits.filter(v => v.checkedInAt && !v.checkedOutAt)
  const checkedOutToday = visits.filter(v => v.checkedOutAt)

  function formatTime(date: Date | null) {
    if (!date) return '—'
    return new Date(date).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('nb-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Inne nå" value={insideNow.length} color="indigo" />
        <StatCard label="Utsjekket i dag" value={checkedOutToday.length} color="green" />
        <StatCard label="Totalt i dag" value={visits.length} color="gray" />
      </div>

      {insideNow.length > 0 && (
        <Section title="Inne nå">
          <VisitTable visits={insideNow} formatTime={formatTime} showCheckout />
        </Section>
      )}

      {checkedOutToday.length > 0 && (
        <Section title="Utsjekket i dag">
          <VisitTable visits={checkedOutToday} formatTime={formatTime} />
        </Section>
      )}

      {visits.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
          Ingen besøk registrert i dag.
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'indigo' | 'green' | 'gray' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-50 text-gray-700',
  }
  return (
    <div className={`rounded-xl p-5 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 font-medium">{label}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      {children}
    </div>
  )
}

type VisitRow = {
  id: string
  visitorName: string
  visitorEmail: string
  visitorCompany: string | null
  checkedInAt: Date | null
  checkedOutAt: Date | null
  isModified: boolean
  host: { name: string } | null
}

function VisitTable({ visits, formatTime, showCheckout }: { visits: VisitRow[]; formatTime: (d: Date | null) => string; showCheckout?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-white text-xs font-semibold uppercase text-gray-400">
          <tr>
            <th className="px-5 py-3 text-left">Navn</th>
            <th className="px-5 py-3 text-left">Firma</th>
            <th className="px-5 py-3 text-left">Vert</th>
            <th className="px-5 py-3 text-left">Inn</th>
            {!showCheckout && <th className="px-5 py-3 text-left">Ut</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white text-sm">
          {visits.map(v => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="px-5 py-3">
                <Link href={`/visits/${v.id}`} className="font-medium text-indigo-600 hover:underline">
                  {v.visitorName}
                  {v.isModified && <span className="ml-1.5 text-xs text-orange-500" title="Redigert">●</span>}
                </Link>
              </td>
              <td className="px-5 py-3 text-gray-600">{v.visitorCompany ?? '—'}</td>
              <td className="px-5 py-3 text-gray-600">{v.host?.name ?? '—'}</td>
              <td className="px-5 py-3 text-gray-600">{formatTime(v.checkedInAt)}</td>
              {!showCheckout && <td className="px-5 py-3 text-gray-600">{formatTime(v.checkedOutAt)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
