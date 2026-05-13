'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Feil e-post eller passord')
    } else {
      router.push('/dashboard')
    }
  }

  const inputCls = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Logg inn</h1>
        <p className="text-sm text-gray-500 mt-1">Besøksprotokoll — kun for ansatte</p>
      </div>
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passord</label>
          <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >{loading ? 'Logger inn…' : 'Logg inn'}</button>
      </form>
    </div>
  )
}
