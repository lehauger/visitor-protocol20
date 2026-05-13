import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendCheckinNotification, sendCheckoutLink } from '@/lib/email'

const schema = z.object({
  doorId: z.string(),
  visitorName: z.string().min(1),
  visitorEmail: z.string().email(),
  visitorPhone: z.string().nullable().optional(),
  visitorCompany: z.string().nullable().optional(),
  hostEmployeeId: z.string(),
  termsAccepted: z.boolean(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const data = parsed.data
  if (!data.termsAccepted) {
    return NextResponse.json({ error: 'Vilkår må godtas' }, { status: 400 })
  }

  const [door, host] = await Promise.all([
    db.door.findUnique({ where: { id: data.doorId } }),
    db.employee.findUnique({ where: { id: data.hostEmployeeId } }),
  ])
  if (!door || !host) return NextResponse.json({ error: 'Ugyldig dør eller vert' }, { status: 400 })

  const visit = await db.visit.create({
    data: {
      doorId: data.doorId,
      hostEmployeeId: data.hostEmployeeId,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone ?? null,
      visitorCompany: data.visitorCompany ?? null,
      termsAcceptedAt: new Date(),
      checkedInAt: new Date(),
    },
  })

  await Promise.all([
    sendCheckinNotification(host.email, host.name, visit.visitorName, visit.visitorCompany, visit.id),
    sendCheckoutLink(visit.visitorEmail, visit.visitorName, visit.checkoutToken),
  ])

  return NextResponse.json({ visitorName: visit.visitorName, checkoutToken: visit.checkoutToken }, { status: 201 })
}
