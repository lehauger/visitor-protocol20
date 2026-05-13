import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import InviteCheckinForm from './InviteCheckinForm'

export default async function InviteCheckinPage({ params }: { params: Promise<{ inviteToken: string }> }) {
  const { inviteToken } = await params
  const visit = await db.visit.findUnique({
    where: { inviteToken },
    include: { host: { select: { name: true } }, door: { include: { location: true } } },
  })
  if (!visit) notFound()
  if (visit.checkedInAt) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
        <div className="text-3xl">&#10003;</div>
        <p className="text-gray-700">Du er allerede innsjekket.</p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h1 className="text-xl font-bold">Innsjekk — invitasjon</h1>
      <p className="text-sm text-gray-500">
        {visit.door.location.name} — {visit.door.name}<br/>
        Vert: {visit.host.name}
      </p>
      <InviteCheckinForm inviteToken={inviteToken} visit={{ visitorName: visit.visitorName, visitorEmail: visit.visitorEmail, visitorCompany: visit.visitorCompany ?? '' }} />
    </div>
  )
}
