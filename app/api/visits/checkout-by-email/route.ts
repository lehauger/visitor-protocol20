import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Ugyldig e-post' }, { status: 400 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const visit = await db.visit.findFirst({
    where: {
      visitorEmail: parsed.data.email,
      checkedInAt: { gte: today },
      checkedOutAt: null,
    },
    orderBy: { checkedInAt: 'desc' },
  })

  if (!visit) return NextResponse.json({ error: 'Ingen aktiv innsjekk funnet for denne e-postadressen' }, { status: 404 })

  await db.visit.update({
    where: { id: visit.id },
    data: { checkedOutAt: new Date(), checkoutMethod: 'DOOR_QR' },
  })
  return NextResponse.json({ visitorName: visit.visitorName })
}
