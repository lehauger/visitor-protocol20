import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Mangler token' }, { status: 400 })

  const url = `${process.env.NEXTAUTH_URL}/checkin/${token}`
  const svg = await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H', margin: 1 })
  return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
}
