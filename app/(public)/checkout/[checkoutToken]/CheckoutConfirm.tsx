'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutConfirm({ checkoutToken }: { checkoutToken: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    setLoading(true)
    await fetch(`/api/visits/checkout/${checkoutToken}`, { method: 'PATCH' })
    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="text-center py-4">
      <div className="text-3xl mb-2">✓</div>
      <p className="text-green-700 font-medium">Du er utsjekket. Ha en god dag!</p>
    </div>
  )

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {loading ? 'Sjekker ut…' : 'Bekreft utsjekk'}
    </button>
  )
}
