import { db } from '@/lib/db'
import NewLocationForm from './NewLocationForm'
import NewDoorForm from './NewDoorForm'
import QrCodeImage from './QrCodeImage'

export default async function AdminDoorsPage() {
  const locations = await db.location.findMany({
    include: { doors: { orderBy: { name: 'asc' } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Lokasjoner og dører</h1>
        <p className="text-sm text-gray-500">Administrer innganger og last ned QR-koder.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Ny lokasjon</h2>
          <NewLocationForm />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Ny dør</h2>
          <NewDoorForm locations={locations.map(l => ({ id: l.id, name: l.name }))} />
        </div>
      </div>

      {locations.map(loc => (
        <div key={loc.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">{loc.name}</h2>
            {loc.address && <p className="text-xs text-gray-500">{loc.address}</p>}
          </div>
          <div className="divide-y divide-gray-100">
            {loc.doors.length === 0 && (
              <p className="px-5 py-4 text-sm text-gray-400">Ingen dører registrert.</p>
            )}
            {loc.doors.map(door => (
              <div key={door.id} className="flex items-center justify-between px-5 py-4 gap-4">
                <div>
                  <p className="font-medium text-gray-900">{door.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Innsjekk: /checkin/{door.qrToken}
                  </p>
                </div>
                <QrCodeImage qrToken={door.qrToken} doorName={door.name} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
