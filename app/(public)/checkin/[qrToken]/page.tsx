import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import CheckinForm from './CheckinForm'

export default async function CheckinPage({ params }: { params: Promise<{ qrToken: string }> }) {
  const { qrToken } = await params
  const door = await db.door.findUnique({
    where: { qrToken },
    include: { location: true },
  })
  if (!door) notFound()

  const employees = await db.employee.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true },
  })

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Innsjekk</h1>
      <p className="text-sm text-gray-500 mb-6">{door.location.name} — {door.name}</p>
      <CheckinForm doorId={door.id} employees={employees} />
    </div>
  )
}
