import { db } from '@/lib/db'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import EditVisitForm from './EditVisitForm'

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const visit = await db.visit.findUnique({
    where: { id },
    include: {
      host: { select: { name: true, email: true } },
      door: { include: { location: true } },
      auditLog: { include: { changedBy: { select: { name: true } } }, orderBy: { changedAt: 'desc' } },
    },
  })
  if (!visit) notFound()

  const canEdit = session?.user.role === 'ADMIN' || session?.user.role === 'RECEPTIONIST'

  function fmt(d: Date | null) {
    return d ? new Date(d).toLocaleString('nb-NO', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {visit.visitorName}
            {visit.isModified && <span className="ml-2 text-sm text-orange-500 font-normal">● Redigert</span>}
          </h1>
          <p className="text-sm text-gray-500">{visit.door.location.name} — {visit.door.name}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
        {[
          ['E-post', visit.visitorEmail],
          ['Telefon', visit.visitorPhone],
          ['Firma', visit.visitorCompany],
          ['Vert', visit.host.name],
          ['Innsjekk', fmt(visit.checkedInAt)],
          ['Utsjekk', fmt(visit.checkedOutAt)],
          ['Vilkår godtatt', fmt(visit.termsAcceptedAt)],
        ].filter(([, v]) => v).map(([label, value]) => (
          <div key={String(label)} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      {canEdit && !visit.isAnonymized && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Rediger</h2>
          <EditVisitForm visitId={visit.id} visit={{
            visitorName: visit.visitorName,
            visitorEmail: visit.visitorEmail,
            visitorPhone: visit.visitorPhone ?? '',
            visitorCompany: visit.visitorCompany ?? '',
          }} />
        </div>
      )}

      {visit.auditLog.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Endringshistorikk</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-white text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th className="px-5 py-3 text-left">Felt</th>
                <th className="px-5 py-3 text-left">Tidligere verdi</th>
                <th className="px-5 py-3 text-left">Ny verdi</th>
                <th className="px-5 py-3 text-left">Endret av</th>
                <th className="px-5 py-3 text-left">Tidspunkt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visit.auditLog.map(log => (
                <tr key={log.id}>
                  <td className="px-5 py-3 font-medium">{log.fieldName}</td>
                  <td className="px-5 py-3 text-gray-500">{log.oldValue ?? '—'}</td>
                  <td className="px-5 py-3">{log.newValue ?? '—'}</td>
                  <td className="px-5 py-3 text-gray-600">{log.changedBy.name}</td>
                  <td className="px-5 py-3 text-gray-600">{fmt(log.changedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
