'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)
  return (
    <Link href={href} className={isActive ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>
      {children}
    </Link>
  )
}
