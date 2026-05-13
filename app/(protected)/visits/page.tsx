import { db } from '@/lib/db'
import Link from 'next/link'
import VisitFilters from './VisitFilters'
import { Prisma } from '@prisma/client'

export default async function VisitsPage({ searchParams }: { searchParams: Promise<{ q?: string; from?: string; to?: string; status?: string }> }) {
  const params = await searchParams
  const where: Prisma.VisitWhereInput = {}

  if (params.q) {
    where.OR = [
      { visitorName: { contains: params.q } },
      { visitorEmail: { contains: params.q } },
      { visitorCompany: { contains: params.q } },
      { host: { name: { contains: params.q } } },
    ]
  }
  if (params.from) where.checkedInAt = { gte: new Date(params.from) }
  if (params.to) where.checkedInAt = { ...where.checkedInAt as object, lte: new Date(params.to + 'T23:59:59') }
  if (params.status === 'active') where.checkedOutAt = null
  if (params.status === 'checkedout') where.checkedOutAt = { not: null }

  const visits = await db.visit.findMany({
    where,
    include: { host: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Besøkslogg</h1>
      <VisitFilters />
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {visits.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Ingen besøk funnet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th className="px-5 py-3 text-left">Navn</th>
                <th className="px-5 py-3 text-left">Firma</th>
                <th className="px-5 py-3 text-left">Vert</th>
                <th className="px-5 py-3 text-left">Inn</th>
                <th className="px-5 py-3 text-left">Ut</th>
                <th className="px-5 py-3 text-left">Status</th>
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
                  <td className="px-5 py-3 text-gray-600">{v.checkedInAt ? new Date(v.checkedInAt).toLocaleString('nb-NO', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{v.checkedOutAt ? new Date(v.checkedOutAt).toLocaleString('nb-NO', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                  <td className="px-5 py-3">
                    {v.isAnonymized
                      ? <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs">Anonymisert</span>
                      : v.checkedOutAt
                        ? <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">Utsjekket</span>
                        : <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">Inne</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
