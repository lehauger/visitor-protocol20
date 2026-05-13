import { db } from '@/lib/db'
import RegisterForm from './RegisterForm'

export default async function RegisterPage() {
  const employees = await db.employee.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  const doors = await db.door.findMany({ include: { location: true }, orderBy: { name: 'asc' } })

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registrer besøkende</h1>
        <p className="text-sm text-gray-500 mt-1">Registrer besøkende på vegne av dem (walk-in via resepsjon).</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <RegisterForm employees={employees} doors={doors.map(d => ({ id: d.id, name: `${d.location.name} — ${d.name}` }))} />
      </div>
    </div>
  )
}
