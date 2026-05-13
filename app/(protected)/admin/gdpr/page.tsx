import { db } from '@/lib/db'
import GdprSearch from './GdprSearch'

export default async function GdprPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams
  const visits = email
    ? await db.visit.findMany({
        where: { visitorEmail: email },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">GDPR-panel</h1>
        <p className="text-sm text-gray-500">Innsyn, eksport og anonymisering av besøksdata.</p>
      </div>
      <GdprSearch initialEmail={email ?? ''} visits={visits} />
    </div>
  )
}
