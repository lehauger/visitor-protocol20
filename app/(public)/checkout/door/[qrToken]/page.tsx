import DoorCheckoutForm from './DoorCheckoutForm'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function DoorCheckoutPage({ params }: { params: Promise<{ qrToken: string }> }) {
  const { qrToken } = await params
  const door = await db.door.findUnique({ where: { qrToken }, include: { location: true } })
  if (!door) notFound()
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Utsjekk</h1>
      <p className="text-sm text-gray-500">{door.location.name} — {door.name}</p>
      <DoorCheckoutForm />
    </div>
  )
}
