'use client'
export default function QrCodeImage({ qrToken, doorName }: { qrToken: string; doorName: string }) {
  const src = `/api/admin/doors/qr?token=${encodeURIComponent(qrToken)}`
  return (
    <a href={src} download={`qr-${doorName}.svg`} title="Last ned QR-kode"
      className="flex-shrink-0 hover:opacity-80 transition-opacity">
      <img src={src} alt={`QR ${doorName}`} className="h-20 w-20" />
    </a>
  )
}
