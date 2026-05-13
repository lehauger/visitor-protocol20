import { db } from '@/lib/db'
import InviteForm from './InviteForm'

export default async function InvitePage() {
  const employees = await db.employee.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  const doors = await db.door.findMany({ include: { location: true }, orderBy: { name: 'asc' } })

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inviter besøkende</h1>
        <p className="text-sm text-gray-500 mt-1">Send personlig QR-invitasjon til besøkende på forhånd.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <InviteForm employees={employees} doors={doors.map(d => ({ id: d.id, name: `${d.location.name} — ${d.name}` }))} />
      </div>
    </div>
  )
}
