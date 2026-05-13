import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import CheckoutConfirm from './CheckoutConfirm'

export default async function CheckoutPage({ params }: { params: Promise<{ checkoutToken: string }> }) {
  const { checkoutToken } = await params
  const visit = await db.visit.findUnique({ where: { checkoutToken } })
  if (!visit) notFound()
  if (visit.checkedOutAt) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-3">
        <div className="text-3xl">✓</div>
        <h1 className="text-lg font-bold text-gray-900">Allerede utsjekket</h1>
        <p className="text-sm text-gray-500">{visit.visitorName} er registrert utsjekket.</p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Sjekk ut</h1>
      <p className="text-gray-600">Hei {visit.visitorName}, bekreft at du forlater bygget.</p>
      <CheckoutConfirm checkoutToken={checkoutToken} />
    </div>
  )
}
