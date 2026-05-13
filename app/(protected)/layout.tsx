import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NavLink from '@/components/NavLink'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-indigo-600 text-lg">
          Besøksprotokoll
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/visits">Besøkslogg</NavLink>
          <NavLink href="/register">Registrer</NavLink>
          <NavLink href="/invite">Inviter</NavLink>
          {session.user.role === 'ADMIN' && (
            <NavLink href="/admin/doors">Admin</NavLink>
          )}
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{session.user.name}</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-gray-500 hover:text-gray-700">Logg ut</button>
          </form>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
