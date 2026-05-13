export default function TermsPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h1 className="text-xl font-bold">Personvern og vilkår</h1>
      <p className="text-sm text-gray-600">
        Opplysningene du oppgir ved innsjekk (navn, e-post, telefon, firma) lagres i besøksloggen.
        Data slettes automatisk etter konfigurerbar periode (standard 90 dager).
        Du kan be om innsyn, retting eller sletting ved å kontakte resepsjonen.
      </p>
    </div>
  )
}
