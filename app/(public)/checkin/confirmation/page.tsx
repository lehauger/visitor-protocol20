import Link from 'next/link'

export default function ConfirmationPage({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-4">
      <div className="text-4xl">✓</div>
      <h1 className="text-xl font-bold text-gray-900">Innsjekk registrert</h1>
      <p className="text-gray-600">Du er registrert som besøkende. Sjekk e-posten din for utsjekk-lenke.</p>
    </div>
  )
}
